# Usage

Learn how to use MkDocs Software Printer.

## **Basic Usage**

Run the application using:

```shell
npm start -- --input <input_directory> --output <output_directory>
```

- `<input_directory>`: Directory with your MkDocs documentation.
- `<output_directory>`: Directory where the generated code will be saved.

## **Command-Line Options**

- `--input`: Specifies the input directory.
- `--output`: Specifies the output directory.
- `--experimental-debugger`: Enables the experimental Debugger AI.

## **Examples**

### **Generate Without Debugger**

```shell
npm start -- --input ./docs --output ./output
```

### **Generate With Debugger**

```shell
npm start -- --input ./docs --output ./output --experimental-debugger
```

[Previous: Configuration](04_configuration.md) | [Next: Workflow Overview](06_workflow_overview.md)

















