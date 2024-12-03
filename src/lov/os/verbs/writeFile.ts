// verbs/writeFile.ts

import { Dependencies } from '../../../utils/types/dependencies';
import * as path from 'path';

/**
 * Writes content to the specified file, creating directories if they do not exist.
 *
 * @param filePath - The path to the file.
 * @param content - The content to write to the file.
 * @returns A promise that resolves when the file has been written.
 *
 * @example
 * ```typescript
 * // Use the writeFile method
 * os.writeFile('path/to/file.txt', 'Hello, World!')
 *   .then(() => {
 *     console.log('File written successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error writing file:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function writeFile(d: Dependencies) {
  return async function (filePath: string, content: string): Promise<void> {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await d.fs.promises.mkdir(dir, { recursive: true });

    await d.fs.promises.writeFile(filePath, content, 'utf8');
  };
}
