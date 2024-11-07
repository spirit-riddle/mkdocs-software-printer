# AI Debugger Command Line Instructions

Use the following commands to modify code:

- `SELECT_FILE <file_path> REPLACE_LINES <start_line_number> <end_line_number>`
  - Replace specific lines in a file with new content provided after the command.
- `SELECT_FILE <file_path> DELETE_LINE <line_number>`
  - Delete a specific line in the selected file.
- `SELECT_FILE <file_path> ADD_ABOVE <line_number>`
  - Add content above a specified line in the file, with the content provided after the command.
- `SELECT_FILE <file_path> ADD_BELOW <line_number>`
  - Add content below a specified line in the file, with the content provided after the command.
- `LOOK_AT_FILE <file_path>`
  - Display the content of the specified file.
- `EXIT`
  - End the debugging session.

Wrap your commands in `tool_code` blocks. Example:

```tool_code
SELECT_FILE path/to/file.txt REPLACE_LINES 10 12
// Replacement content goes here
```

```tool_code
SELECT_FILE path/to/file.txt DELETE_LINE 15
```

### Multi-command Usage

For multiple commands, use separate `tool_code` blocks:

```tool_code
SELECT_FILE path/to/file.txt REPLACE_LINES 20 22
// New content for lines 20-22
```

```tool_code
SELECT_FILE path/to/file.txt DELETE_LINE 25
```

```tool_code
SELECT_FILE path/to/anotherfile.txt ADD_ABOVE 5
// New content to add above line 5
```

```tool_code
LOOK_AT_FILE path/to/file.txt
```

Use these commands to modify, add, or view specific parts of the code during your debugging session.
