// lnov/os/makeOs.ts

import { Dependencies } from '../../utils/types/dependencies';
import readFile from './verbs/readFile';
import writeFile from './verbs/writeFile';
import fileExists from './verbs/fileExists';
import mkdir from './verbs/mkdir';
import readdir from './verbs/readdir';
import copyFile from './verbs/copyFile';
import rename from './verbs/rename';
import deleteFile from './verbs/deleteFile';

/**
 * **OS Utility Factory**
 *
 * Provides an interface for common file system operations, abstracting direct interactions with Node.js `fs` module.
 *
 * **Available Methods:**
 *
 * - {@link readFile}
 * - {@link writeFile}
 * - {@link fileExists}
 * - {@link mkdir}
 * - {@link readdir}
 * - {@link copyFile}
 * - {@link rename}
 * - {@link deleteFile}
 *
 * @param d - The dependencies required by the OS verbs.
 * @returns An object containing all the OS verb functions.
 *
 * @example
 * ```typescript
 * const os = makeOs(dependencies);
 * const content = await os.readFile('path/to/file.txt');
 * console.log('File content:', content);
 * ```
 *
 * @see {@link Dependencies}
 * @category OS
 */
export default function makeOs(d: Dependencies) {
  return {
    /**
     * Reads the contents of a file.
     *
     * @see {@link readFile}
     */
    readFile: readFile(d),

    /**
     * Writes content to a file.
     *
     * @see {@link writeFile}
     */
    writeFile: writeFile(d),

    /**
     * Checks if a file exists at a given path.
     *
     * @see {@link fileExists}
     */
    fileExists: fileExists(d),

    /**
     * Creates a directory.
     *
     * @see {@link mkdir}
     */
    mkdir: mkdir(d),

    /**
     * Reads the contents of a directory.
     *
     * @see {@link readdir}
     */
    readdir: readdir(d),

    /**
     * Copies a file from one location to another.
     *
     * @see {@link copyFile}
     */
    copyFile: copyFile(d),

    /**
     * Renames or moves a file or directory.
     *
     * @see {@link rename}
     */
    rename: rename(d),

    /**
     * Deletes a file.
     *
     * @see {@link deleteFile}
     */
    deleteFile: deleteFile(d),
  };
}
