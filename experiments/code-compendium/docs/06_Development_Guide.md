
# Development Guide

## Project Structure

```
code-compendium/
├── index.ts
├── lnov/
│   ├── logger/
│   │   └── makeLogger.ts
│   ├── os/
│   │   ├── makeOs.ts
│   │   └── verbs/
│   │       ├── readFile.ts
│   │       ├── writeFile.ts
│   │       ├── mkdir.ts
│   │       └── readdir.ts
│   └── mkDocs/
│       ├── makeMkDocs.ts
│       └── verbs/
│           ├── findMkDocsFiles.ts
│           ├── parseMkDocsYAML.ts
│           └── readMarkdownFromNav.ts
├── processes/
│   ├── generateCompendium.ts
│   ├── codeFilesProcessor.ts
│   └── docFilesProcessor.ts
├── utils/
│   ├── cliArguments.ts
│   ├── makeDependencies.ts
│   ├── countWords.ts
│   └── types/
│       └── dependencies.ts
├── package.json
├── tsconfig.json
└── README.md
```


## Building the Project

### **1. Install Dependencies**

Ensure you have installed all necessary dependencies:

```bash
npm install
```


### **2. Compile TypeScript Code**

Compile the TypeScript code into JavaScript:

```bash
tsc
```


This will generate JavaScript files in the dist directory as specified in your tsconfig.json.

### **3. Run the Tool**

Navigate to the dist directory and execute the tool:

```bash
node codeCompendium.js --input ../your-project --output ../compendium-output
```


Adjust the --input and --output paths according to your project structure.

