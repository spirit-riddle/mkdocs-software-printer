# Usage

Code Compendium is used via the command line. It processes code and documentation files in the specified input directory and generates aggregated Markdown files in the output directory.

## Command-Line Arguments

- --input <path>: Specifies the input directory to scan for code files and documentation.
  - **Default**: ./src
- --output <path>: Specifies the output directory where the combined Markdown files will be saved.
  - **Default**: ./compendium-output
- --word-limit <number>: Sets the maximum word count per output Markdown file.
  - **Default**: 3000
- --extensions <list>: Comma-separated list of file extensions to include (e.g., .ts,.js,.md).
  - **Default**: .ts,.js,.md
- --exclude <list>: Comma-separated list of directories or files to exclude from scanning.
  - **Default**: node_modules,.git,.env

## Examples

**Running with default settings (excludes node_modules, .git, and .env by default):**

```bash
node codeCompendium.js
```


**Specifying input and output directories:**

```bash
node codeCompendium.js --input ./project --output ./output
```


**Custom word limit and extensions:**

```bash
node codeCompendium.js --word-limit 5000 --extensions .ts,.js,.py
```


**Including additional exclusions:**

```bash
node codeCompendium.js --exclude dist,build,temp
```


**Overriding default exclusions (if you want to include node_modules):**

```bash
node codeCompendium.js --exclude .git,.env
```
