// lnov/mkDocs/verbs/findMkDocsFiles.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * **Find MkDocs Configuration Files**
 *
 * Recursively searches for MkDocs YAML configuration files (`mkdocs.yml` or `mkdocs.yaml`) starting from the specified directory.
 *
 * @param directoryPath - The path to the directory to search.
 * @returns A promise that resolves to an array of file paths to MkDocs YAML files.
 *
 * @throws Will throw an error if the directory cannot be read.
 *
 * @example
 * ```typescript
 * const files = await mkDocs.findMkDocsFiles('path/to/project');
 * console.log('Found MkDocs files:', files);
 * ```
 *
 * @see {@link makeMkDocs}
 * @category MkDocs Verbs
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
