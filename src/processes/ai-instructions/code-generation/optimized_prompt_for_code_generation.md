
# Optimized Prompt for Code Generation

## Overview

This document provides a strict guideline for generating code using a prompt that minimizes entropy and encourages reliable, focused outputs. The goal is to avoid unnecessary complexity and ensure clear, structured generation of code files.

## Key Rules for Code Generation

### 1. **File Path in Fenced Code Blocks**
- Each fenced code block **must** begin with the **full file path** where the generated code will be saved.
- After specifying the path, include the code content.
  
**Example:**
\`\`\`src/index.ts
// Code content for src/index.ts goes here
\`\`\`

### 2. **Code Only**
- The model should only generate **code** and avoid additional commentary or explanations in the response.
- All comments in the output should be strictly relevant to the code (i.e., internal code comments).
- Any instructions, documentation, or explanations **must not** appear alongside the code blocks.

### 3. **Separate Documentation in Markdown**
- Any necessary explanation, instructions, or additional context must be placed in a separate Markdown file located at **`README.md`**.
- Avoid placing extra context within code blocks or anywhere else in the response.

### 4. **Fenced Code Blocks Only**
- The response **must** consist entirely of fenced code blocks, each starting with the file path and followed by the code content.
- No extra text should appear outside the fenced code blocks.

**Example Structure:**
\`\`\`<file path>
   // Generated code content for the file
\`\`\`

### 5. **No Ambiguity or Overcomplication**
- Focus only on the essential details for generating the required code. Ensure prompts are short, specific, and leave no room for ambiguity.
- Use simple, declarative instructions for each required code file.

## Example Prompt for Code Generation

Here is an example format to guide the language model:

\`\`\`src/index.ts
// Entry point for the application
\`\`\`

\`\`\`tsconfig.json
// TypeScript configuration file
\`\`\`

Any additional context or documentation should be placed in:

\`\`\`README.md
# AI-Generated Project Documentation

This file provides context, usage instructions, or explanations for the generated project files.
\`\`\`

## Reducing Entropy with Clear Prompts
By following these rules, we minimize the range of possible model outputs, guiding it to produce consistent, predictable code files.

- **Avoid Overcomplication**: Keep prompts clean and to the point, focusing on specific details that help generate the desired code output.
- **Consistency Across Outputs**: Structured, simple prompts reduce ambiguity and ensure each file follows the specified pattern.

## Conclusion
This approach enforces structured and minimalistic prompts to reduce entropy in the model’s output. Clear paths, well-defined formats, and the separation of code and documentation improve the predictability and efficiency of the generated code.
