//Import necessary modules
import { cliArguments_parse } from '../utils/cliArguments';
import { makeLogger } from '../lnov/logger';
import { makeOs } from '../lnov/os';
import { makeMkDocs } from '../lnov/mkDocs';
import { codeFilesProcessor } from './codeFilesProcessor';
import { docFilesProcessor } from './docFilesProcessor';

//Implementation of generateCompendium function.  Handle errors, use async/await