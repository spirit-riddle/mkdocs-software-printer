
# Additional Information

## Module Details

### **Entry Point (index.ts)**

This is the main entry point of the application. It imports the necessary modules and starts the compendium generation process.

typescript
import generateCompendium from './processes/generateCompendium';

generateCompendium();



### **CLI Argument Parser (utils/cliArguments.ts)**

Handles parsing of command-line arguments, provides default values if necessary, and handles exclusions.

```typescript
import minimist from 'minimist';

export function cliArguments_parse() {
  const args = minimist(process.argv.slice(2));
  return {
    input: args.input || './src',
    output: args.output || './compendium-output',
    wordLimit: parseInt(args['word-limit'], 10) || 3000,
    extensions: args.extensions ? args.extensions.split(',') : ['.ts', '.js', '.md'],
    exclude: args.exclude ? args.exclude.split(',') : ['node_modules', '.git', '.env'],
  };
}
```


### **OS Utilities (lnov/os/makeOs.ts)**

Provides file system operations and handles exclusions.

```typescript
export default function makeOs(d: Dependencies) {
  return {
    readFile: readFile(d),
    writeFile: writeFile(d),
    mkdir: mkdir(d),
    readdir: readdir(d), // Updated to support exclusions
    // Other utilities...
  };
}
```


**Updated readdir Function (lnov/os/verbs/readdir.ts):**

```typescript
export default function readdir(d: Dependencies) {
  return async function (directoryPath: string, excludePatterns: string[]): Promise<Dirent[]> {
    const entries = await d.fs.promises.readdir(directoryPath, { withFileTypes: true });
    return entries.filter(entry => !excludePatterns.includes(entry.name));
  };
}
```


### **Code Files Processor (processes/codeFilesProcessor.ts)**

Processes code files, respecting exclusions.

```typescript
import { makeOs } from '../lnov/os/makeOs';
import { countWords } from '../utils/countWords';

export async function codeFilesProcessor(args) {
  const os = makeOs(dependencies);
  const files = await codeFiles_find(args.input, args.extensions, args.exclude);
  // Rest of the processing...
}
```


**Updated codeFiles_find Function:**

```typescript
export async function codeFiles_find(inputDir: string, extensions: string[], exclude: string[]): Promise<string[]> {
  // Logic to recursively find files, excluding specified directories
}
```


---

## Example Workflow

1. **Run the Tool**

   

```bash
   node codeCompendium.js --input ./my-project --output ./compendium-output --word-limit 5000 --extensions .ts,.md --exclude dist,build
```


2. **Processing Begins**

   - The tool parses the command-line arguments, including exclusions.
   - Initializes logging and dependencies.

3. **Code Files Processing**

   - Searches for code files (e.g., .ts files) in the input directory, excluding dist and build directories.
   - Reads the content of each file.
   - Aggregates content into Markdown files, respecting the 5,000-word limit.

4. **Documentation Files Processing**

   - If MkDocs configuration is found, processes documentation accordingly.
   - Otherwise, processes .md files in the input directory, respecting exclusions.
   - Aggregates content into Markdown files, respecting the 5,000-word limit.

5. **Output Generation**

   - Writes the aggregated Markdown files to the specified output directory.
   - Logs the completion of the process.

---

## Frequently Asked Questions

**Q1: How do I exclude directories like node_modules from processing?**

**A:** By default, node_modules, .git, and .env files are excluded. You can specify additional directories to exclude using the --exclude argument.

**Q2: Can I include a directory that's excluded by default?**

**A:** Yes, you can override the default exclusions by explicitly specifying the directories you want to exclude using the --exclude argument.

**Example:**

```bash
node codeCompendium.js --exclude .git,.env
```


This command will include node_modules in the scanning process.

**Q3: How does the tool handle symbolic links?**

**A:** The tool follows symbolic links by default. If you want to prevent this, you can modify the file traversal logic to ignore symbolic links.

---

## Contact Information

For support or inquiries, please contact:

- **GitHub**: [https://github.com/spirit-riddle/code-compendium](https://github.com/spirit-riddle/code-compendium)

---

Thank you for using **Code Compendium**. We hope
 this tool enhances your productivity and streamlines your workflow.

---
