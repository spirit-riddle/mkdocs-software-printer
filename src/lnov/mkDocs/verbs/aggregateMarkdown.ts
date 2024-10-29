// verbs/aggregateMarkdown.ts

import { Dependencies } from '../../../utils/types/dependencies';
import { MkDocsConfig } from './parseMkDocsYAML';
import * as path from 'path';

/**
 * Aggregates markdown content based on the MkDocs configuration.
 *
 * @param config - The MkDocs configuration object.
 * @param baseDir - The base directory where the markdown files are located.
 * @returns A promise that resolves to the aggregated markdown content as a string.
 *
 * @example
 * ```typescript
 * // Use the aggregateMarkdown method
 * mkDocs.aggregateMarkdown(config, '/path/to/project')
 *   .then((content) => {
 *     console.log('Aggregated markdown content:', content);
 *   })
 *   .catch((error) => {
 *     console.error('Error aggregating markdown:', error);
 *   });
 * ```
 *
 * @category MkDocs
 */
export default function aggregateMarkdown(d: Dependencies) {
  return async function (config: MkDocsConfig, baseDir: string): Promise<string> {
    let aggregatedContent = '';

    if (config.nav) {
      for (const navItem of config.nav) {
        for (const key in navItem) {
          const fileOrFiles = navItem[key];
          if (typeof fileOrFiles === 'string') {
            const content = await readMarkdownFile(d, baseDir, fileOrFiles);
            aggregatedContent += content + '\n';
          } else if (Array.isArray(fileOrFiles)) {
            for (const file of fileOrFiles) {
              const content = await readMarkdownFile(d, baseDir, file);
              aggregatedContent += content + '\n';
            }
          }
        }
      }
    }

    return aggregatedContent;
  };
}

/**
 * Reads a markdown file and returns its content.
 *
 * @param d - Dependencies
 * @param baseDir - Base directory of the MkDocs project
 * @param relativeFilePath - Relative path to the markdown file
 * @returns Content of the markdown file
 */
async function readMarkdownFile(d: Dependencies, baseDir: string, relativeFilePath: string): Promise<string> {
  const absolutePath = path.resolve(baseDir, relativeFilePath);
  return await d.fs.promises.readFile(absolutePath, 'utf8');
}
