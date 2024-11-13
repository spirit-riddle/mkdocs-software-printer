// src/app/makeDependencies.ts

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { Dependencies } from './types/dependencies';
// import GroqClient from 'groq-sdk'; // For blueprintAi
import dotenv from 'dotenv';

dotenv.config();

/**
 * **Dependencies Factory**
 *
 * Aggregates and provides all external dependencies required by the application in a single object. This promotes better testability and decoupling.
 *
 * @returns An object containing all dependencies.
 *
 * @see {@link Dependencies}
 * @category Utilities
 */
export function makeDependencies(): Dependencies {
  return {
    fs,
    path,
    yaml,
    // Initialize other dependencies as needed
  };
}
