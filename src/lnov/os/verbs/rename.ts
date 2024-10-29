// verbs/rename.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Renames or moves a file or directory from `oldPath` to `newPath`.
 *
 * @param oldPath - The current path of the file or directory.
 * @param newPath - The new path for the file or directory.
 * @returns A promise that resolves when the operation is complete.
 *
 * @example
 * ```typescript
 * // Use the rename method
 * os.rename('path/to/oldName.txt', 'path/to/newName.txt')
 *   .then(() => {
 *     console.log('File renamed successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error renaming file:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function rename(d: Dependencies) {
  return async function (oldPath: string, newPath: string): Promise<void> {
    await d.fs.promises.rename(oldPath, newPath);
  };
}
