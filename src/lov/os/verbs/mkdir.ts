// verbs/mkdir.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Creates a directory at the specified path. If the directory already exists, does nothing.
 *
 * @param directoryPath - The path to the directory to create.
 * @returns A promise that resolves when the directory has been created.
 *
 * @example
 * ```typescript
 * // Use the mkdir method
 * os.mkdir('path/to/new/directory')
 *   .then(() => {
 *     console.log('Directory created successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error creating directory:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function mkdir(d: Dependencies) {
  return async function (directoryPath: string): Promise<void> {
    await d.fs.promises.mkdir(directoryPath, { recursive: true });
  };
}
