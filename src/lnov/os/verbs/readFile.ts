// lnov/os/verbs/readFile.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * **Read File Content**
 *
 * Reads the content of a file at the specified path and returns it as a string.
 *
 * @param filePath - The path to the file.
 * @returns A promise that resolves to the file's content as a string.
 *
 * @throws Will throw an error if the file cannot be read.
 *
 * @example
 * ```typescript
 * const content = await os.readFile('path/to/file.txt');
 * console.log('File content:', content);
 * ```
 *
 * @see {@link writeFile}
 * @category OS Verbs
 */
export default function readFile(d: Dependencies) {
  return async function (filePath: string): Promise<string> {
    return await d.fs.promises.readFile(filePath, 'utf8');
  };
}
