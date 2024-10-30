// src/app/makeDependencies.ts

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { Dependencies } from './types/dependencies';
// import GroqClient from 'groq-sdk'; // For blueprintAi
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates an object containing all external dependencies required by the application.
 *
 * @returns An object with all dependencies.
 *
 * @category App
 */
export function makeDependencies(): Dependencies {
  return {
    fs,
    path,
    yaml,
    // Initialize other dependencies as needed
  };
}
