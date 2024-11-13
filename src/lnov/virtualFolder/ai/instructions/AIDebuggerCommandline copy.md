# AI Debugger Command Line Instructions

Use these commands to modify code files, focusing on connecting all project files, resolving missing dependencies, and fixing syntax issues. Each prompt should contain only one command per file; the first command per file will take precedence.

### Commands

- **Replace Lines**
  - `SELECT_FILE <file_path> REPLACE_LINES <start_line_number> <end_line_number>`
  - Replaces lines within the specified range with new content provided after the command.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt REPLACE_LINES 10 12
    // Replacement content here
    ```

- **Delete a Single Line**
  - `SELECT_FILE <file_path> DELETE_LINE <line_number>`
  - Deletes a specific line in the selected file.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt DELETE_LINE 15
    ```

- **Delete a Range of Lines**
  - `SELECT_FILE <file_path> DELETE_LINES <start_line_number> <end_line_number>`
  - Deletes lines in the specified range within the file.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt DELETE_LINES 10 12
    ```

- **Add Content Above a Line**
  - `SELECT_FILE <file_path> ADD_ABOVE <line_number>`
  - Adds new content above the specified line.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt ADD_ABOVE 5
    // New content to add above line 5
    ```

- **Add Content Below a Line**
  - `SELECT_FILE <file_path> ADD_BELOW <line_number>`
  - Adds new content below the specified line.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt ADD_BELOW 5
    // New content to add below line 5
    ```

- **Ensure File Interconnections**
  - `ENSURE_CONNECTION <source_file> TO <target_file>`
  - Adds references or imports to ensure `source_file` is properly connected with `target_file`. This command is language-agnostic but can be used to fix missing imports, module references, or dependency statements.
  - Example:
    ```tool_code
    ENSURE_CONNECTION path/to/source_file.txt TO path/to/target_file.txt
    // Code to connect these files here
    ```

- **View File Content**
  - `LOOK_AT_FILE <file_path>`
  - Displays the content of the specified file.
  - Example:
    ```tool_code
    LOOK_AT_FILE path/to/file.txt
    ```

- **Exit Debugging Session**
  - `EXIT`
  - Ends the debugging session.

### Multi-command Usage

For multiple commands, use separate `tool_code` blocks. Only one edit command per file is allowed in each prompt, but multiple files can be addressed.

Example:
```tool_code
SELECT_FILE path/to/file.txt REPLACE_LINES 20 22
// New content for lines 20-22
```

```tool_code
ENSURE_CONNECTION path/to/source_file.txt TO path/to/target_file.txt
// Code to connect these files here
```

```tool_code
LOOK_AT_FILE path/to/file.txt
```

---

Use these commands to guide the AI in modifying code to create or repair file connections, resolve missing dependencies, and correct syntax. Focus on creating a fully functional and interconnected project.