// verbs/deleteFile.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Deletes a file at the specified path.
 *
 * @param filePath - The path to the file to be deleted.
 * @returns A promise that resolves when the file has been deleted.
 *
 * @example
 * ```typescript
 * // Use the deleteFile method
 * os.deleteFile('path/to/file.txt')
 *   .then(() => {
 *     console.log('File deleted successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error deleting file:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function deleteFile(d: Dependencies) {
  return async function (filePath: string): Promise<void> {
    await d.fs.promises.unlink(filePath);
  };
}
