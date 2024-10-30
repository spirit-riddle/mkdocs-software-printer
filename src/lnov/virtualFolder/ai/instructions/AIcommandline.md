**100 out of 100 prompts remaining**

# **AI_COMMANDS for Virtual Project Management**

This command-line interface enables you to manage the virtual project's structure step-by-step. Each command must be placed within `AI_COMMANDS` blocks, and multi-command operations can be executed by separating each command into its own block.

### Prompt Tracking

You have a limit of 100 prompts. With each interaction, you'll receive an update on how many prompts remain, like this:

> **You have 48 out of 100 prompts remaining.**

Use these efficiently to complete the project structure before reaching the limit.

### Command Reference

1. **ADD_FOLDER `<path>`**
   - Create a new folder at the specified path.
   - **Example**:
     ```AI_COMMANDS
     ADD_FOLDER project-root/section/subfolder
     ```

2. **ADD_FILE `<path>`**
   - Add a new file at the specified path with content.
   - The content of the file should be placed on the lines following the command.
   - **Example**:
     ```AI_COMMANDS
     ADD_FILE project-root/section/subfolder/file.ext
     // Content of the file starts here
     Line 1 of file content
     Line 2 of file content
     ```
   
3. **UPDATE_FILE `<path>`**
   - Update the specified file with new content.
   - The content of the file should be placed on the lines following the command.
   - **Example**:
     ```AI_COMMANDS
     UPDATE_FILE project-root/section/subfolder/file.ext
     // New content of the file starts here
     Line 1 of new content
     Line 2 of new content
     ```

4. **DELETE_FOLDER `<path>`**
   - Delete the specified folder and its contents.
   - **Example**:
     ```AI_COMMANDS
     DELETE_FOLDER project-root/section/subfolder
     ```

5. **DELETE_FILE `<path>`**
   - Delete the specified file.
   - **Example**:
     ```AI_COMMANDS
     DELETE_FILE project-root/section/subfolder/file.ext
     ```

6. **EXIT**
   - End your session when the project structure is fully complete.
   - **Example**:
     ```AI_COMMANDS
     EXIT
     ```

### Multi-command Usage

When you need to execute multiple commands, use a separate `AI_COMMANDS` block for each:

```AI_COMMANDS
ADD_FOLDER project-root/section/subfolder
```

```AI_COMMANDS
ADD_FILE project-root/section/subfolder/file.ext
// Content of the file starts here
Line 1 of file content
Line 2 of file content

```

Use these commands efficiently to build and refine the virtual project structure within the prompt limit.