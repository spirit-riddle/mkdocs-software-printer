// lnov/mkDocs/makeMkDocs.ts

import { Dependencies } from '../../utils/types/dependencies';
import findMkDocsFiles from './verbs/findMkDocsFiles';
import parseMkDocsYAML from './verbs/parseMkDocsYAML';
import readMarkdownFromNav from './verbs/readMarkdownFromNav';

/**
 * Factory function that creates a MkDocs utility object for working with MkDocs projects.
 *
 * This object offers a collection of methods for interacting with MkDocs project files, such as finding MkDocs YAML files,
 * parsing them, and aggregating markdown content. Each method corresponds to a verb function that performs a specific operation.
 *
 * **Available Methods:**
 *
 * - **findMkDocsFiles(directoryPath): Promise<string[]>**
 *   - Finds MkDocs YAML configuration files in a directory recursively.
 * - **parseMkDocsYAML(filePath): Promise<MkDocsConfig>**
 *   - Parses a MkDocs YAML configuration file.
 * - **readMarkdownFromNav(nav, mkdocsDir): Promise<string>**
 *   - Reads markdown content based on the navigation section in the MkDocs configuration.
 *
 * @param d - The dependencies required by the MkDocs verbs.
 * @returns An object containing all the MkDocs verb functions.
 *
 * @example
 * ```typescript
 * // Initialize the MkDocs utility
 * const mkDocs = makeMkDocs(dependencies);
 *
 * // Find MkDocs configuration files
 * mkDocs.findMkDocsFiles('path/to/project')
 *   .then((files) => {
 *     console.log('Found MkDocs files:', files);
 *   })
 *   .catch((error) => {
 *     console.error('Error finding MkDocs files:', error);
 *   });
 *
 * // Parse a MkDocs YAML file
 * mkDocs.parseMkDocsYAML('path/to/mkdocs.yml')
 *   .then((config) => {
 *     console.log('Parsed MkDocs config:', config);
 *   })
 *   .catch((error) => {
 *     console.error('Error parsing MkDocs YAML:', error);
 *   });
 * ```
 *
 * @category MkDocs
 */
export default function makeMkDocs(d: Dependencies) {
  return {
    /**
     * Finds MkDocs YAML configuration files in a directory recursively.
     *
     * @see {@link findMkDocsFiles}
     */
    findMkDocsFiles: findMkDocsFiles(d),

    /**
     * Parses a MkDocs YAML configuration file.
     *
     * @see {@link parseMkDocsYAML}
     */
    parseMkDocsYAML: parseMkDocsYAML(d),

    /**
     * Reads markdown content based on the navigation section in the MkDocs configuration.
     *
     * @see {@link readMarkdownFromNav}
     */
    readMarkdownFromNav: readMarkdownFromNav(d),
  };
}
