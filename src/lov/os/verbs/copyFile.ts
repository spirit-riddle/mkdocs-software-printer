// verbs/copyFile.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Copies a file from the source path to the destination path.
 *
 * @param source - The path to the source file.
 * @param destination - The path to the destination file.
 * @returns A promise that resolves when the file has been copied.
 *
 * @example
 * ```typescript
 * // Use the copyFile method
 * os.copyFile('path/to/source.txt', 'path/to/destination.txt')
 *   .then(() => {
 *     console.log('File copied successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error copying file:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function copyFile(d: Dependencies) {
  return async function (source: string, destination: string): Promise<void> {
    await d.fs.promises.copyFile(source, destination);
  };
}
