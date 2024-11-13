
# Architecture

## Overview

Code Compendium is designed with a modular architecture to promote clarity and ease of maintenance. It leverages reusable modules to keep projects aligned and reduce duplication. The tool follows the **LNOV** (Library Namespace Object Verb) naming convention for its modules and functions.

## Modules and Functions

### **1. Entry Point**

- **File**: index.ts
- **Function**: generateCompendium()
- **Description**: The main function that orchestrates the execution flow.

### **2. Command-Line Argument Parser**

- **File**: utils/cliArguments.ts
- **Function**: cliArguments_parse()
- **Description**: Parses command-line arguments and returns an object containing the parameters.

### **3. Logger**

- **File**: lnov/logger/makeLogger.ts
- **Function**: makeLogger()
- **Description**: Provides logging methods (info, warn, error) for consistent logging.

### **4. OS Utilities**

- **File**: lnov/os/makeOs.ts
- **Functions**:
  - os_readFile(): Reads the content of a file.
  - os_writeFile(): Writes content to a file.
  - os_mkdir(): Creates directories.
  - os_readdir(): Reads directory contents, with support for exclusion patterns.
- **Description**: Abstracts common file system operations and handles exclusions.

### **5. MkDocs Processing**

- **File**: lnov/mkDocs/makeMkDocs.ts
- **Functions**:
  - mkDocs_findMkDocsFiles(): Finds MkDocs YAML files.
  - mkDocs_parseMkDocsYAML(): Parses MkDocs YAML configuration.
  - mkDocs_readMarkdownFromNav(): Reads markdown content based on MkDocs navigation.
- **Description**: Handles MkDocs documentation aggregation.

### **6. Code Files Processing**

- **File**: processes/codeFilesProcessor.ts
- **Functions**:
  - codeFiles_find(): Searches for code files matching specified extensions, excluding specified directories.
  - codeFiles_read(): Reads the content of code files.
  - codeContent_aggregate(): Aggregates code content into Markdown files.
- **Description**: Processes code files based on specified extensions and exclusions.

### **7. Documentation Files Processing**

- **File**: processes/docFilesProcessor.ts
- **Functions**:
  - docFiles_find(): Identifies documentation files to process, respecting exclusions.
  - docFiles_read(): Reads the content of documentation files.
  - docContent_aggregate(): Aggregates documentation content into Markdown files.
- **Description**: Processes documentation files, including MkDocs content.

### **8. Utilities**

- **File**: utils/makeDependencies.ts
- **Function**: makeDependencies()
- **Description**: Creates and injects external dependencies for modularity.

- **File**: utils/countWords.ts
- **Function**: countWords()
- **Description**: Counts the number of words in a given text.


