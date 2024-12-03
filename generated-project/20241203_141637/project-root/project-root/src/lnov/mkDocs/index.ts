```typescript
// project-root/project-root/src/index.ts
//Import necessary modules from previous steps.
import * as logger from './lnov/logger/index';
import * as os from './lnov/os/index';
import * as mkDocs from './lnov/mkDocs/index';
import * as yargs from 'yargs'; // You'll need to install yargs: npm install yargs

//Implementation of OS utilities (readFile, writeFile, readdir, mkdir). Include robust error handling and async/await.  Consider using fs-extra
//Implementation of logger, including error handling
//Implementation for MkDocs processing (find files, parse YAML, aggregate Markdown).  Include error handling.


//Implement the main entry point function.  Call generateCompendium with parsed CLI arguments and handle errors
async function main() {
  try {
    const argv = yargs(process.argv.slice(2))
      .option('inputDir', {
        alias: 'i',
        description: 'Input directory containing MkDocs project',
        type: 'string',
        demandOption: true,
      })
      .option('outputDir', {
        alias: 'o',
        description: 'Output directory for the compendium',
        type: 'string',
        demandOption: true,
      })
      .help()
      .alias('help', 'h').argv;


    const inputDir = argv.inputDir;
    const outputDir = argv.outputDir;

    logger.log('Starting compendium generation...');
    logger.log(`Input directory: ${inputDir}`);
    logger.log(`Output directory: ${outputDir}`);


    //Example usage of os functions. Replace with your actual implementation.
    await os.mkdir(outputDir, { recursive: true });

    const files = await os.readdir(inputDir);
    
    const compendiumData = await mkDocs.processMkDocs(inputDir, files);

    await os.writeFile(`${outputDir}/compendium.json`, JSON.stringify(compendiumData, null, 2));

    logger.log('Compendium generated successfully!');


  } catch (error) {
    logger.error('Error generating compendium:', error);
    process.exit(1);
  }
}


main();



//Stub implementations for lnov modules - REPLACE THESE WITH YOUR ACTUAL IMPLEMENTATIONS

// src/lnov/logger/index.ts
namespace logger {
  export function log(message: string): void {
    console.log(message);
  }
  export function error(message: string | Error, error?: Error): void {
    console.error(message, error);
  }
}


// src/lnov/os/index.ts
namespace os {
    import fs from 'fs/promises'; //Use fs/promises for async file operations
    import {mkdirSync} from 'fs'
    export async function readFile(path: string): Promise<string> {
      try {
        return await fs.readFile(path, 'utf-8');
      } catch (error) {
        throw new Error(`Error reading file ${path}: ${error}`);
      }
    }

    export async function writeFile(path: string, content: string): Promise<void> {
      try {
        await fs.writeFile(path, content);
      } catch (error) {
        throw new Error(`Error writing file ${path}: ${error}`);
      }
    }

    export async function readdir(path: string): Promise<string[]> {
      try {
        return await fs.readdir(path);
      } catch (error) {
        throw new Error(`Error reading directory ${path}: ${error}`);
      }
    }

    export async function mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
        try {
            await fs.mkdir(path, options)
        } catch (error: any) {
            if (error.code !== 'EEXIST'){
                throw new Error(`Error creating directory ${path}: ${error}`)
            }
        }
    }
}


// src/lnov/mkDocs/index.ts
namespace mkDocs {
    import {readFile} from './os/index'
  export async function processMkDocs(inputDir: string, files: string[]): Promise<any> { // Replace 'any' with the actual data structure
    let compendiumData = {}; //Replace with your actual compendium data structure

    for (const file of files) {
        const filePath = `${inputDir}/${file}`;
        // Add your logic here to read and process markdown files
        // example - just read and include contents for now:
        const fileContent = await readFile(filePath);
        compendiumData[file] = fileContent;
    }
    return compendiumData;
  }
}
```