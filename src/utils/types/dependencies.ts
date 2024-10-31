// src/app/types/dependencies.ts

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export interface Dependencies {
  fs: typeof fs;
  path: typeof path;
  yaml: typeof yaml;
  // Add other dependencies as needed
}
