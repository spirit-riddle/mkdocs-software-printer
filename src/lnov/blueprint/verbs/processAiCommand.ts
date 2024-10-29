
import { Dependencies } from '../../../utils/types/dependencies';
import { ProjectPlan, Folder, File } from '../types/projectPlan';

export default function processAiCommand(d: Dependencies) {
  return function (commandBlock: string, projectPlan: ProjectPlan): string | null {
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
 * Command handler functions
 */

function addFolder(path: string, projectPlan: ProjectPlan): void {
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

function addOrUpdateFile(path: string, lines: string[], startIndex: number, projectPlan: ProjectPlan, isUpdate: boolean): number {
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
  while (i < lines.length && !lines[i].trim().match(/^(ADD_FOLDER|ADD_FILE|UPDATE_FILE|DELETE_FOLDER|DELETE_FILE|EXIT)/)) {
    contentLines.push(lines[i]);
    i++;
  }
  const content = contentLines.join('\n');

  if (isUpdate) {
    const file = currentFolder.files.find(file => file.name === fileName);
    if (file) {
      file.content = content;
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
    } else {
      console.warn(`File ${fileName} already exists in path ${path}.`);
    }
  }
  return i;
}

function deleteFolder(path: string, projectPlan: ProjectPlan): void {
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
  } else {
    console.warn(`Folder ${folderName} does not exist in path ${path}`);
  }
}

function deleteFile(path: string, projectPlan: ProjectPlan): void {
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
  } else {
    console.warn(`File ${fileName} does not exist in path ${path}`);
  }
}