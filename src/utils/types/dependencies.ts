// src/app/types/dependencies.ts

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

/**
 * **Dependencies Interface**
 *
 * Defines the structure of the dependencies object used throughout the application, including modules like `fs`, `path`, and `yaml`.
 *
 * @interface Dependencies
 *
 * @property {typeof fs} fs - Node.js file system module.
 * @property {typeof path} path - Node.js path module.
 * @property {typeof yaml} yaml - YAML parsing library.
 *
 * @category Utilities
 */
export interface Dependencies {
  fs: typeof fs;
  path: typeof path;
  yaml: typeof yaml;
  // Add other dependencies as needed
}
