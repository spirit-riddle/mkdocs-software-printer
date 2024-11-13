// lnov/blueprint/verbs/writeToDrive.ts

import { Dependencies } from '../../../utils/types/dependencies';
import { ProjectPlan, Folder } from '../types/projectPlan';

// Helper function to create a timestamp in the format YYYYMMDD_HHMMSS
function createTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

export default function writeToDrive(d: Dependencies) {
  return async function (inMemoryPlan: ProjectPlan, outputDir: string): Promise<void> {
    const timestampedFolder = `${createTimestamp()}`;
    const fullOutputPath = d.path.join(outputDir, timestampedFolder);

    await writeFolder(d, inMemoryPlan.root, fullOutputPath);
  };
}

async function writeFolder(d: Dependencies, folder: Folder, parentPath: string) {
  const folderPath = d.path.join(parentPath, folder.name);
  await d.fs.promises.mkdir(folderPath, { recursive: true });

  // Write files
  for (const file of folder.files) {
    const filePath = d.path.join(folderPath, file.name);
    await d.fs.promises.writeFile(filePath, file.content || '', 'utf8');
  }

  // Recursively write subfolders
  for (const subFolder of folder.subFolders) {
    await writeFolder(d, subFolder, folderPath);
  }
}
