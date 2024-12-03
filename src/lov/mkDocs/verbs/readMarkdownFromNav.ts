// lnov/mkDocs/verbs/readMarkdownFromNav.ts

import { Dependencies } from '../../../utils/types/dependencies';
import * as path from 'path';

/**
 * **Read Markdown from Navigation**
 *
 * Reads and concatenates markdown content based on the navigation section (`nav`) in the MkDocs configuration.
 *
 * @param nav - The navigation section from the MkDocs configuration.
 * @param mkdocsDir - The directory where the MkDocs project is located.
 * @returns A promise that resolves to the combined markdown content as a string.
 *
 * @throws Will throw an error if any markdown file in the navigation cannot be read.
 *
 * @example
 * ```typescript
 * const markdown = await mkDocs.readMarkdownFromNav(config.nav, 'path/to/mkdocs/docs');
 * console.log('Combined Markdown:', markdown);
 * ```
 *
 * @see {@link parseMkDocsYAML}
 * @category MkDocs Verbs
 */
export default function readMarkdownFromNav(d: Dependencies) {
  return async function (nav: any, mkdocsDir: string): Promise<string> {
    let combinedMarkdown = '';

    for (const item of nav) {
      for (const key in item) {
        const value = item[key];
        if (typeof value === 'string') {
          const filePath = path.join(mkdocsDir, value);
          const content = await d.fs.promises.readFile(filePath, 'utf8');
          combinedMarkdown += `\n\n# ${key}\n\n${content}`;
        } else if (Array.isArray(value)) {
          for (const subItem of value) {
            combinedMarkdown += await readMarkdownFromNav(d)([subItem], mkdocsDir);
          }
        }
      }
    }

    return combinedMarkdown;
  };
}
