// src/app/types/dependencies.ts

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import GroqClient from 'groq-sdk'; // For blueprintAi

export interface Dependencies {
  fs: typeof fs;
  path: typeof path;
  yaml: typeof yaml;
  // blueprintAiClient: GroqClient;
  // Add other dependencies as needed
}
