// lnov/mkDocs/makeMkDocs.ts

import { Dependencies } from '../../utils/types/dependencies';
import findMkDocsFiles from './verbs/findMkDocsFiles';
import parseMkDocsYAML from './verbs/parseMkDocsYAML';
import readMarkdownFromNav from './verbs/readMarkdownFromNav';

/**
 * **MkDocs Utility Factory**
 *
 * Creates a utility object for interacting with MkDocs projects, providing methods to find, parse, and read MkDocs documentation files.
 *
 * **Available Methods:**
 *
 * - {@link findMkDocsFiles}: Finds MkDocs YAML configuration files in a directory recursively.
 * - {@link parseMkDocsYAML}: Parses a MkDocs YAML configuration file.
 * - {@link readMarkdownFromNav}: Reads markdown content based on the navigation section in the MkDocs configuration.
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
 * const files = await mkDocs.findMkDocsFiles('path/to/project');
 * console.log('Found MkDocs files:', files);
 *
 * // Parse a MkDocs YAML file
 * const config = await mkDocs.parseMkDocsYAML('path/to/mkdocs.yml');
 * console.log('Parsed MkDocs config:', config);
 * ```
 *
 * @see {@link Dependencies}
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
