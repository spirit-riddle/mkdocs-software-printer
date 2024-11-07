import { Dependencies } from '../../../utils/types/dependencies';
import { ProjectPlan, Folder, File } from '../types/projectPlan';

export default function processDebuggingAiCommand(d: Dependencies) {
  return function (
    commandBlock: string,
    projectPlan: ProjectPlan
  ): { updatedFiles: string[], exit: boolean } {
    console.log('\nProcessing Debugging AI Command Block:\n');
    console.log(commandBlock);

    flattenProjectRoot(projectPlan);

    const lines = commandBlock.split('\n');
    let i = 0;
    const updatedFiles: Set<string> = new Set();
    const modifiedFiles: Set<string> = new Set(); // Track files already modified in this block
    let exitCommand = false;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (line === '') {
        i++;
        continue;
      }

      const [command, filePath, operation, ...args] = line.split(' ');

      if (command === 'EXIT') {
        console.log('AI requested to exit.');
        exitCommand = true;
        break;
      }

      // Use this function before processing commands
      const normalizedFilePath = normalizePath(filePath);

      // Check if the file has already been modified in this block
      if (command === 'SELECT_FILE' && normalizedFilePath && operation) {
        if (modifiedFiles.has(normalizedFilePath)) {
          console.warn(`Ignoring additional command for ${normalizedFilePath} as it has already been modified.`);
          i++;
          continue;
        }

        const lineNumberArgs = args.map(arg => parseInt(arg, 10));
        const result = handleFileOperation(normalizedFilePath, operation, lineNumberArgs, lines, i + 1, projectPlan, updatedFiles);
        if (result.success) {
          i = result.nextIndex;
          modifiedFiles.add(normalizedFilePath); // Mark file as modified
        } else {
          console.warn(`Error processing command: ${line}`);
          i++;
        }
      } else {
        console.warn(`Unknown or malformed command: ${line}`);
        i++;
      }
    }

    return { updatedFiles: Array.from(updatedFiles), exit: exitCommand };
  };
}


/**
 * Flattens nested project-root folders within the project plan by merging their contents.
 */
function flattenProjectRoot(projectPlan: ProjectPlan) {
  const root = projectPlan.root;
  const flattenedFiles = new Set<string>();

  function recursivelyFlatten(folder: Folder) {
    const nestedRoots = folder.subFolders.filter((sub): sub is Folder => sub.name === 'project-root');

    for (const nestedRoot of nestedRoots) {
      for (const file of nestedRoot.files) {
        if (!flattenedFiles.has(file.name)) {
          root.files.push(file);
          flattenedFiles.add(file.name);
        }
      }
      root.subFolders.push(...nestedRoot.subFolders);

      folder.subFolders = folder.subFolders.filter((sub) => sub !== nestedRoot);
      recursivelyFlatten(nestedRoot);
    }
  }

  recursivelyFlatten(root);
}

function handleFileOperation(
  filePath: string,
  operation: string,
  lineNumbers: number[],
  lines: string[],
  startIndex: number,
  projectPlan: ProjectPlan,
  updatedFiles: Set<string>
): { success: boolean, nextIndex: number } {
  const file = findFileInProjectPlan(filePath, projectPlan);

  if (!file) {
    console.warn(`File ${filePath} not found in project plan.`);
    return { success: false, nextIndex: startIndex };
  }

  let contentLines: string[] = [];
  let i = startIndex;
  while (
    i < lines.length &&
    !lines[i].trim().match(/^(SELECT_FILE|EXIT)/i)
  ) {
    contentLines.push(lines[i].trim());
    i++;
  }
  const content = contentLines.join('\n');

  const operationSuccess = applyOperationToFile(file, operation, lineNumbers, content);
  if (operationSuccess) updatedFiles.add(filePath);

  return { success: operationSuccess, nextIndex: i };
}

function applyOperationToFile(
  file: File,
  operation: string,
  lineNumbers: number[],
  content: string
): boolean {
  try {
    if (operation.toUpperCase() === 'REPLACE_LINES' && lineNumbers.length === 2) {
      replaceLinesInFile(file, lineNumbers[0], lineNumbers[1], content.trim());
    } else if (operation.toUpperCase() === 'ADD_ABOVE' && lineNumbers.length === 1) {
      addLineAboveInFile(file, lineNumbers[0], content.trim());
    } else if (operation.toUpperCase() === 'ADD_BELOW' && lineNumbers.length === 1) {
      addLineBelowInFile(file, lineNumbers[0], content.trim());
    } else if (operation.toUpperCase() === 'DELETE_LINE' && lineNumbers.length === 1) {
      deleteLineInFile(file, lineNumbers[0]);
    } else if (operation.toUpperCase() === 'DELETE_LINES' && lineNumbers.length === 2) {
      deleteLinesInFile(file, lineNumbers[0], lineNumbers[1]);
    } else {
      console.warn(`Unrecognized operation or incorrect line number arguments: ${operation}`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`Error applying operation: ${(error as Error).message}`);
    return false;
  }
}

function findFileInProjectPlan(filePath: string, projectPlan: ProjectPlan): File | null {
  const parts = filePath.split('/');
  let currentFolder = projectPlan.root;

  if (parts[0] === 'project-root') {
    parts.shift();
  }

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const subFolder = currentFolder.subFolders.find(f => f.name === part);
    if (!subFolder) {
      console.warn(`Subfolder ${part} not found in path ${filePath}`);
      return null;
    }
    currentFolder = subFolder;
  }

  const fileName = parts[parts.length - 1];
  const file = currentFolder.files.find(f => f.name === fileName);

  if (!file) {
    console.warn(`File ${fileName} not found in path ${filePath}`);
  }

  return file || null;
}

function replaceLinesInFile(file: File, startLine: number, endLine: number, content: string) {
  const lines = file.content.split('\n');
  if (startLine > 0 && endLine <= lines.length && startLine <= endLine) {
    lines.splice(startLine - 1, endLine - startLine + 1, ...content.split('\n'));
    file.content = lines.join('\n').trim();
    console.log(`Replaced lines ${startLine}-${endLine} in file ${file.name}`);
  } else {
    console.warn(`Invalid line range: ${startLine}-${endLine} in file ${file.name}`);
  }
}

function addLineAboveInFile(file: File, lineNumber: number, content: string) {
  const lines = file.content.split('\n');
  if (lineNumber >= 1 && lineNumber <= lines.length + 1) {
    lines.splice(lineNumber - 1, 0, content);
    file.content = lines.join('\n').trim();
    console.log(`Added content above line ${lineNumber} in file ${file.name}`);
  } else {
    console.warn(`Invalid line number ${lineNumber} for adding content above in file ${file.name}`);
  }
}

function addLineBelowInFile(file: File, lineNumber: number, content: string) {
  const lines = file.content.split('\n');
  if (lineNumber >= 0 && lineNumber <= lines.length) {
    lines.splice(lineNumber, 0, content);
    file.content = lines.join('\n').trim();
    console.log(`Added content below line ${lineNumber} in file ${file.name}`);
  } else {
    console.warn(`Invalid line number ${lineNumber} for adding content below in file ${file.name}`);
  }
}

function deleteLineInFile(file: File, lineNumber: number) {
  const lines = file.content.split('\n');
  if (lineNumber >= 1 && lineNumber <= lines.length) {
    lines.splice(lineNumber - 1, 1);
    file.content = lines.join('\n').trim();
    console.log(`Deleted line ${lineNumber} in file ${file.name}`);
  } else {
    console.warn(`Invalid line number ${lineNumber} for deletion in file ${file.name}`);
  }
}

function deleteLinesInFile(file: File, startLine: number, endLine: number) {
  const lines = file.content.split('\n');
  if (startLine > 0 && endLine <= lines.length && startLine <= endLine) {
    lines.splice(startLine - 1, endLine - startLine + 1);
    file.content = lines.join('\n').trim();
    console.log(`Deleted lines ${startLine}-${endLine} in file ${file.name}`);
  } else {
    console.warn(`Invalid line range: ${startLine}-${endLine} in file ${file.name}`);
  }
}

function normalizePath(filePath: string): string {
  // Ensure path does not have duplicate `project-root` folders
  return filePath.replace(/^project-root(\/project-root)+/, 'project-root');
}


