// makeOs.ts

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
 * Factory function that creates an OS utility object providing file system operations.
 *
 * This object offers a collection of methods for interacting with the file system, abstracting common tasks such as reading and writing files, managing directories, and handling file operations. Each method corresponds to a verb function that performs a specific operation.
 *
 * **Available Methods:**
 *
 * - {@link readFile | **readFile(filePath): Promise\<string\>**} - Reads the contents of a file.
 * - {@link writeFile | **writeFile(filePath, content): Promise\<void\>**} - Writes content to a file.
 * - {@link fileExists | **fileExists(filePath): Promise\<boolean\>**} - Checks if a file exists at a given path.
 * - {@link mkdir | **mkdir(directoryPath): Promise\<void\>**} - Creates a directory.
 * - {@link readdir | **readdir(directoryPath): Promise\<Dirent[]\>**} - Reads the contents of a directory.
 * - {@link copyFile | **copyFile(source, destination): Promise\<void\>**} - Copies a file from one location to another.
 * - {@link rename | **rename(oldPath, newPath): Promise\<void\>**} - Renames or moves a file or directory.
 * - {@link deleteFile | **deleteFile(filePath): Promise\<void\>**} - Deletes a file.
 *
 * @param d - The dependencies required by the OS verbs.
 * @returns An object containing all the OS verb functions.
 *
 * @example
 * ```typescript
 * // Initialize the OS utility
 * const os = makeOs(dependencies);
 *
 * // Use the readFile method
 * os.readFile('path/to/file.txt')
 *   .then((content) => {
 *     console.log('File content:', content);
 *   })
 *   .catch((error) => {
 *     console.error('Error reading file:', error);
 *   });
 *
 * // Check if a file exists
 * os.fileExists('path/to/file.txt')
 *   .then((exists) => {
 *     console.log('File exists:', exists);
 *   });
 *
 * // Create a directory
 * os.mkdir('path/to/new/directory')
 *   .then(() => {
 *     console.log('Directory created');
 *   });
 * ```
 *
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
