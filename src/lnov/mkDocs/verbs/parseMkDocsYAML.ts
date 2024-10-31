// lnov/mkDocs/verbs/parseMkDocsYAML.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Represents the structure of the MkDocs configuration.
 * Adjust the interface according to your actual configuration structure.
 */
export interface MkDocsConfig {
  site_name: string;
  nav?: Array<{ [key: string]: string | string[] }>;
  // Add other configuration properties as needed
}

/**
 * Parses a MkDocs YAML configuration file.
 *
 * @param filePath - The path to the MkDocs YAML file.
 * @returns A promise that resolves to the parsed MkDocs configuration object.
 *
 * @example
 * ```typescript
 * // Use the parseMkDocsYAML method
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
export default function parseMkDocsYAML(d: Dependencies) {
  return async function (filePath: string): Promise<MkDocsConfig> {
    const fileContent = await d.fs.promises.readFile(filePath, 'utf8');
    const config = d.yaml.parse(fileContent) as MkDocsConfig;
    return config;
  };
}
