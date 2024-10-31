// lnov/mkDocs/verbs/findMkDocsFiles.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Finds MkDocs YAML configuration files (`mkdocs.yml` or `mkdocs.yaml`) in a given directory recursively.
 *
 * @param directoryPath - The path to the directory to search.
 * @returns A promise that resolves to an array of file paths to MkDocs YAML files.
 *
 * @example
 * ```typescript
 * // Use the findMkDocsFiles method
 * mkDocs.findMkDocsFiles('path/to/project')
 *   .then((files) => {
 *     console.log('Found MkDocs files:', files);
 *   })
 *   .catch((error) => {
 *     console.error('Error finding MkDocs files:', error);
 *   });
 * ```
 *
 * @category MkDocs
 */
export default function findMkDocsFiles(d: Dependencies) {
  return async function (directoryPath: string): Promise<string[]> {
    const mkDocsFiles: string[] = [];

    const entries = await d.fs.promises.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = d.path.join(directoryPath, entry.name);
      if (entry.isFile() && (entry.name === 'mkdocs.yml' || entry.name === 'mkdocs.yaml')) {
        mkDocsFiles.push(fullPath);
      } else if (entry.isDirectory()) {
        const subFiles = await findMkDocsFiles(d)(fullPath);
        mkDocsFiles.push(...subFiles);
      }
    }

    return mkDocsFiles;
  };
}
