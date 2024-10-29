// verbs/fileExists.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Checks whether a file exists at the specified path.
 *
 * @param filePath - The path to the file.
 * @returns A promise that resolves to `true` if the file exists, `false` otherwise.
 *
 * @example
 * ```typescript
 * // Use the fileExists method
 * os.fileExists('path/to/file.txt')
 *   .then((exists) => {
 *     console.log('File exists:', exists);
 *   })
 *   .catch((error) => {
 *     console.error('Error checking file existence:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function fileExists(d: Dependencies) {
  return async function (filePath: string): Promise<boolean> {
    try {
      await d.fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  };
}
