// verbs/readdir.ts

import { Dependencies } from '../../../utils/types/dependencies';
import { Dirent } from 'fs';

/**
 * Reads the contents of the specified directory.
 *
 * @param directoryPath - The path to the directory.
 * @returns A promise that resolves to an array of directory entries (`Dirent[]`).
 *
 * @example
 * ```typescript
 * // Use the readdir method
 * os.readdir('path/to/directory')
 *   .then((entries) => {
 *     entries.forEach((entry) => {
 *       console.log('Entry:', entry.name);
 *     });
 *   })
 *   .catch((error) => {
 *     console.error('Error reading directory:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function readdir(d: Dependencies) {
  return async function (directoryPath: string): Promise<Dirent[]> {
    return await d.fs.promises.readdir(directoryPath, { withFileTypes: true });
  };
}
