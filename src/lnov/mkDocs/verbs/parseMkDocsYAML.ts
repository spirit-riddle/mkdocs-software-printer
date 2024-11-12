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
 * **Parse MkDocs YAML Configuration**
 *
 * Parses a MkDocs YAML configuration file and returns its content as a JavaScript object.
 *
 * @param filePath - The path to the MkDocs YAML file.
 * @returns A promise that resolves to the parsed MkDocs configuration object.
 *
 * @throws Will throw an error if the file cannot be read or parsed.
 *
 * @example
 * ```typescript
 * const config = await mkDocs.parseMkDocsYAML('path/to/mkdocs.yml');
 * console.log('Site Name:', config.site_name);
 * ```
 *
 * @see {@link MkDocsConfig}
 * @category MkDocs Verbs
 */
export default function parseMkDocsYAML(d: Dependencies) {
  return async function (filePath: string): Promise<MkDocsConfig> {
    const fileContent = await d.fs.promises.readFile(filePath, 'utf8');
    const config = d.yaml.parse(fileContent) as MkDocsConfig;
    return config;
  };
}
