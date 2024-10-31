// lnov/virtualFolder/verbs/processAiCommand.ts

import { Dependencies } from '../../../utils/types/dependencies';
import { ProjectPlan, Folder } from '../types/projectPlan';

/**
 * Processes a block of AI commands and updates the project plan accordingly.
 *
 * @param d - The dependencies required by the function.
 * @returns A function that processes the command block.
 *
 * @category VirtualFolder
 */
export default function processAiCommand(d: Dependencies) {
  return function (commandBlock: string, projectPlan: ProjectPlan): string | null {
    console.log('\nProcessing AI Command Block:\n');
    console.log(commandBlock); // Display the entire command block received from AI

    const lines = commandBlock.split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line === '') {
        i++;
        continue; // Skip empty lines
      }
      const parts = line.split(' ');
      const command = parts[0];
      const args = parts.slice(1);

      console.log(`\nExecuting Command: ${command} ${args.join(' ')}`); // Log the command being executed

      switch (command) {
        case 'ADD_FOLDER':
          addFolder(args[0], projectPlan);
          i++;
          break;
        case 'ADD_FILE':
          i = addOrUpdateFile(args[0], lines, i + 1, projectPlan, false);
          break;
        case 'UPDATE_FILE':
          i = addOrUpdateFile(args[0], lines, i + 1, projectPlan, true);
          break;
        case 'DELETE_FOLDER':
          deleteFolder(args[0], projectPlan);
          i++;
          break;
        case 'DELETE_FILE':
          deleteFile(args[0], projectPlan);
          i++;
          break;
        case 'EXIT':
          console.log('AI requested to exit.');
          return 'EXIT';
        default:
          console.warn(`Unknown command: ${command}`);
          i++;
      }
    }
    return null;
  };
}

/**
 * Adds a folder to the project plan.
 *
 * @param path - The path of the folder to add.
 * @param projectPlan - The current project plan.
 */
function addFolder(path: string, projectPlan: ProjectPlan): void {
  console.log(`Adding folder: ${path}`);
  const parts = path.split('/');
  let currentFolder = projectPlan.root;

  for (const part of parts) {
    let subFolder = currentFolder.subFolders.find(f => f.name === part);
    if (!subFolder) {
      subFolder = {
        name: part,
        subFolders: [],
        files: [],
      };
      currentFolder.subFolders.push(subFolder);
    }
    currentFolder = subFolder;
  }
}

/**
 * Adds or updates a file in the project plan.
 *
 * @param path - The path of the file.
 * @param lines - The lines from the command block.
 * @param startIndex - The index to start reading file content.
 * @param projectPlan - The current project plan.
 * @param isUpdate - Whether the operation is an update.
 * @returns The index after processing.
 */
function addOrUpdateFile(
  path: string,
  lines: string[],
  startIndex: number,
  projectPlan: ProjectPlan,
  isUpdate: boolean
): number {
  const action = isUpdate ? 'Updating' : 'Adding';
  console.log(`${action} file: ${path}`);

  const parts = path.split('/');
  const fileName = parts.pop();
  if (!fileName) return startIndex;

  let currentFolder = projectPlan.root;
  for (const part of parts) {
    let subFolder = currentFolder.subFolders.find(f => f.name === part);
    if (!subFolder) {
      subFolder = {
        name: part,
        subFolders: [],
        files: [],
      };
      currentFolder.subFolders.push(subFolder);
    }
    currentFolder = subFolder;
  }

  // Read the file content from lines
  let contentLines: string[] = [];
  let i = startIndex;
  while (
    i < lines.length &&
    !lines[i].trim().match(/^(ADD_FOLDER|ADD_FILE|UPDATE_FILE|DELETE_FOLDER|DELETE_FILE|EXIT)/)
  ) {
    contentLines.push(lines[i]);
    i++;
  }
  const content = removeDividerLine(contentLines.join('\n'));

  if (isUpdate) {
    const file = currentFolder.files.find(file => file.name === fileName);
    if (file) {
      file.content = content;
      console.log(`Updated content of file: ${path}`);
    } else {
      console.warn(`File ${fileName} does not exist in path ${path}. Creating new file.`);
      currentFolder.files.push({
        name: fileName,
        content: content,
      });
    }
  } else {
    // ADD_FILE
    if (!currentFolder.files.find(file => file.name === fileName)) {
      currentFolder.files.push({
        name: fileName,
        content: content,
      });
      console.log(`Added new file: ${path}`);
    } else {
      console.warn(`File ${fileName} already exists in path ${path}.`);
    }
  }
  return i;
}

/**
 * Deletes a folder from the project plan.
 *
 * @param path - The path of the folder to delete.
 * @param projectPlan - The current project plan.
 */
function deleteFolder(path: string, projectPlan: ProjectPlan): void {
  console.log(`Deleting folder: ${path}`);
  const parts = path.split('/');
  const folderName = parts.pop();
  if (!folderName) return;

  let currentFolder = projectPlan.root;
  for (const part of parts) {
    let subFolder = currentFolder.subFolders.find(f => f.name === part);
    if (!subFolder) {
      console.warn(`Folder ${part} does not exist in path ${path}`);
      return;
    }
    currentFolder = subFolder;
  }

  const index = currentFolder.subFolders.findIndex(f => f.name === folderName);
  if (index !== -1) {
    currentFolder.subFolders.splice(index, 1);
    console.log(`Deleted folder: ${folderName}`);
  } else {
    console.warn(`Folder ${folderName} does not exist in path ${path}`);
  }
}

/**
 * Deletes a file from the project plan.
 *
 * @param path - The path of the file to delete.
 * @param projectPlan - The current project plan.
 */
function deleteFile(path: string, projectPlan: ProjectPlan): void {
  console.log(`Deleting file: ${path}`);
  const parts = path.split('/');
  const fileName = parts.pop();
  if (!fileName) return;

  let currentFolder = projectPlan.root;
  for (const part of parts) {
    let subFolder = currentFolder.subFolders.find(f => f.name === part);
    if (!subFolder) {
      console.warn(`Folder ${part} does not exist in path ${path}`);
      return;
    }
    currentFolder = subFolder;
  }

  const index = currentFolder.files.findIndex(file => file.name === fileName);
  if (index !== -1) {
    currentFolder.files.splice(index, 1);
    console.log(`Deleted file: ${fileName}`);
  } else {
    console.warn(`File ${fileName} does not exist in path ${path}`);
  }
}

/**
 * Removes a divider line from the file content if present.
 *
 * @param fileContent - The content of the file.
 * @returns The cleaned file content.
 */
function removeDividerLine(fileContent: string): string {
  const dividerPattern = /^\/\/ Content of the file starts here\s*$/m;
  return fileContent.replace(dividerPattern, '');
}
