// lnov/os/verbs/readFile.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Reads the content of a file.
 *
 * @param filePath - The path to the file.
 * @returns A promise that resolves to the file's content as a string.
 *
 * @example
 * ```typescript
 * // Use the readFile method
 * os.readFile('path/to/file.txt')
 *   .then((content) => {
 *     console.log('File content:', content);
 *   })
 *   .catch((error) => {
 *     console.error('Error reading file:', error);
 *   });
 * ```
 *
 * @category OS
 */
export default function readFile(d: Dependencies) {
  return async function (filePath: string): Promise<string> {
    return await d.fs.promises.readFile(filePath, 'utf8');
  };
}
