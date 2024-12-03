# AI Debugger Command Line Instructions

Use these commands to modify code files, focusing on connecting project files and resolving dependencies. Each prompt should contain only **one command per file**. Commands for multiple files can be included, allowing updates across many files simultaneously. However, **only the first command for each file will be applied**; any subsequent commands for the same file in the same prompt will be ignored.

### Important Rules

- **Only Import Modifications**: This debugging process focuses solely on ensuring files are interconnected correctly. In programming languages, this means only modifying import or include statements to connect project files. Ignore any commands that involve content other than import or dependency-related adjustments.
- **One Command per File**: Only the first command per file is accepted in each prompt, with any additional commands for that file ignored to avoid conflicts.

### Commands

- **Replace Lines**
  - `SELECT_FILE <file_path> REPLACE_LINES <start_line_number> <end_line_number>`
  - Replaces lines within the specified range with new content provided after the command.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt REPLACE_LINES 10 12
    // Replacement content for lines 10-12
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
    // New import statement or connection for line 5
    ```

- **Add Content Below a Line**
  - `SELECT_FILE <file_path> ADD_BELOW <line_number>`
  - Adds new content below the specified line.
  - Example:
    ```tool_code
    SELECT_FILE path/to/file.txt ADD_BELOW 5
    // New import statement or connection below line 5
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

### Multi-file Commands

To apply commands to multiple files, use separate `tool_code` blocks with **one command per file**. If multiple commands are given for the same file within one prompt, only the first command will be processed, and subsequent commands for that file will be ignored.

Example:
```tool_code
SELECT_FILE path/to/file1.txt REPLACE_LINES 10 12
// New import for lines 10-12 in file1
```

```tool_code
SELECT_FILE path/to/file2.txt DELETE_LINE 15
```

```tool_code
SELECT_FILE path/to/file3.txt ADD_ABOVE 5
// New import added above line 5 in file3
```

---

### Additional Notes

This command-line interface is designed to focus strictly on establishing inter-file connections and dependencies through import statements. Ensure that only import-related commands are issued, with other types of modifications ignored.

If additional changes are needed for a file beyond the first command, submit them in a separate prompt to maintain a structured debugging process. This method promotes consistency and ensures functional connectivity across all files, with multiple files updated in each prompt as needed.