import { Dependencies } from '../../../utils/types/dependencies';
import { ProjectPlan, Folder, File } from '../types/projectPlan';


export default function processDebuggingAiCommand(d: Dependencies) {
  return function (
    commandBlock: string,
    projectPlan: ProjectPlan
  ): { updatedFiles: string[], exit: boolean } {
    console.log('\nProcessing Debugging AI Command Block:\n');
    console.log(commandBlock);

    // Flatten nested roots to ensure only one project-root exists
    flattenProjectRoot(projectPlan);

    const lines = commandBlock.split('\n');
    let i = 0;
    const updatedFiles: Set<string> = new Set();
    let exitCommand = false;

    while (i < lines.length) {
      const line = lines[i].trim();
      if (line === '') {
        i++;
        continue;
      }

      const [command, filePath, operation, ...args] = line.split(' ');

      // Handle 'EXIT' command
      if (command === 'EXIT') {
        console.log('AI requested to exit.');
        exitCommand = true;
        break;
      }

      if (command === 'SELECT_FILE' && filePath && operation) {
        const lineNumberArgs = args.map(arg => parseInt(arg, 10));
        const result = handleFileOperation(filePath, operation, lineNumberArgs, lines, i + 1, projectPlan, updatedFiles);
        if (result.success) {
          i = result.nextIndex;
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
  const flattenedFiles = new Set<string>(); // Track files to prevent duplicates
  
  function recursivelyFlatten(folder: Folder) {
    // Find all `project-root` subfolders and their contents
    const nestedRoots = folder.subFolders.filter((sub): sub is Folder => sub.name === 'project-root');
    
    for (const nestedRoot of nestedRoots) {
      // Merge files and subfolders into the root folder, avoiding duplicates
      for (const file of nestedRoot.files) {
        if (!flattenedFiles.has(file.name)) {
          root.files.push(file);
          flattenedFiles.add(file.name);
        }
      }
      root.subFolders.push(...nestedRoot.subFolders);

      // Remove this nested `project-root` from subFolders of its parent
      folder.subFolders = folder.subFolders.filter((sub) => sub !== nestedRoot);

      // Recursively check for further `project-root` folders in the current nested root
      recursivelyFlatten(nestedRoot);
    }
  }

  recursivelyFlatten(root);

  // Log final structure for debugging
  // console.log("Final Flattened Project Plan Structure:", JSON.stringify(projectPlan, null, 2));
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

/**
 * Searches for a file within the project plan.
 * Ensures the project root is flattened to avoid nested 'project-root' folders.
 */
function findFileInProjectPlan(filePath: string, projectPlan: ProjectPlan): File | null {
  const parts = filePath.split('/');
  let currentFolder = projectPlan.root;

  // Ensure we only look for "project-root" at the start of the path
  if (parts[0] === 'project-root') {
    parts.shift(); // Remove the initial "project-root" from the path
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



// The file editing functions remain unchanged.

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
