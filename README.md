# MkDocs Software Printer - README

## Overview

The MkDocs Software Printer is a tool designed to transform your Markdown documentation into a fully structured software project. By leveraging MkDocs and advanced AI integration, it automates the generation of folder structures, blueprint files, and contextual documentation based on your existing MkDocs configuration. This system allows you to convert your technical documentation into a complete, modular software project with minimal manual effort.

**Website**: [spirit-riddle.com](https://spirit-riddle.com)  
**Documentation**:  
- [MkDocs Software Printer User Guide](https://spirit-riddle.github.io/mkdocs-software-printer/)
- [MkDocs System Documentation](https://spirit-riddle.github.io/mkdocs-software-printer/system)

> **Note**: This project is actively in development, and updates will be made regularly. Stay tuned for new features and improvements.

## Installation

To install the MkDocs Software Printer, make sure you have Node.js and npm installed on your system.

1. Clone the repository:
   ```sh
   git clone https://github.com/1001flextape/mkdocs-software-printer.git
   cd mkdocs-software-printer
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up your environment variables:

   - First, obtain an API key from [Google AI Studio](https://aistudio.google.com).
   - Copy the example environment file:
     ```sh
     cp .env.example .env
     ```
   - In the `.env` file, update the `GEMINI_API_KEY` variable with your Google AI token:
     ```env
     GEMINI_API_KEY=your_ai_api_key_here
     ```

## Usage

To generate a software project from your MkDocs documentation, use the following command:

```sh
npm start -- --input <input-directory> --output <output-directory>
```

- **`<input-directory>`**: The directory containing your MkDocs project.
- **`<output-directory>`**: The directory where you want the generated project to be saved.

### Example

```sh
npm start -- --input ./mkdocs-project --output ./generated-project
```

The script will prompt you to specify the programming language for the project. Once selected, the AI will start generating the project structure and files iteratively.

### Input Directory Example with Multiple Projects

You can structure your input directory to contain `multiple MkDocs projects`, each with a separate mkdocs.yml configuration. 

Example:

```
/input-directory
├── project1/
│   ├── docs/
│   └── mkdocs.yml
├── project2/
│   ├── docs/
│   └── mkdocs.yml
```

## Generating Documentation

To generate and serve the documentation locally, use the following command:

```sh
npm run docs
```

This command runs both TypeDoc (for API documentation) and MkDocs (for user documentation) simultaneously. It includes:

- **TypeDoc**: Generates API documentation based on TypeScript code in the project. You can also run this individually with:
  ```sh
  npm run typedoc
  ```

- **MkDocs**: Serves the MkDocs documentation locally, accessible at `http://127.0.0.1:8000`. You can also run this individually with:
  ```sh
  npm run mkdocs
  ```

The output will be located in the `docs/system` directory for TypeDoc and served locally for MkDocs.

## Experimental Debugger

The MkDocs Software Printer includes an **experimental debugging feature** that is disabled by default. This feature allows for enhanced debugging and tracking of modifications but is currently in an experimental phase.

### Enabling the Experimental Debugger

To activate the debugger, use the `--experimental-debugger` flag in the command line:

```sh
npm start -- --input <input-directory> --output <output-directory> --experimental-debugger
```

- When enabled, this flag loads the debugging module, allowing for enhanced command processing and code modification tracking.
- The debugger logs each modification in detail, providing insight into each step the AI takes during the generation and troubleshooting of the project.

### Important Notes

- The **experimental debugger** only loads when the `--experimental-debugger` flag is present. If omitted, the debugger remains inactive, keeping the tool’s performance optimized for non-debugging tasks.
- Please note that this feature may change in future releases as we refine its capabilities.

## Contributing

Contributions are welcome! If you have suggestions for new features, improvements, or bug fixes, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

