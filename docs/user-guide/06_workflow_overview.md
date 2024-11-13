# Workflow Overview

Understand the main steps of the application.

## **1. MkDocs File Discovery**

- Searches for `mkdocs.yml` in the input directory.
- Parses MkDocs configurations.

## **2. Markdown Content Aggregation**

- Reads markdown files based on the `nav` section.
- Combines content into a single markdown string.

## **3. AI Planning Phase**

- Interacts with the **Planning AI**.
- Generates an initial project plan.

## **4. AI File Compression**

- Uses the **File Compression AI**.
- Merges files with identical names.

## **5. Optional Debugging Phase**

- Enabled with `--experimental-debugger`.
- Refines code using the **Debugger AI**.

## **6. Output Generation**

- Writes the project to the output directory.
- Organizes files and folders as per the plan.

[Previous: Usage](05_usage.md) | [Next: Advanced Features](07_advanced_features.md)








