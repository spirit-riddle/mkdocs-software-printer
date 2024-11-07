// src/lnov/virtualFolder/verbs/extractDebuggerAiCommands.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Extracts TOOL_CODE blocks from the AI's response for the Debugging AI.
 *
 * @param d - The dependencies required by the function.
 * @returns A function that extracts TOOL_CODE blocks.
 *
 * @category VirtualFolder
 */
export default function extractDebuggerAiCommands(d: Dependencies) {
    return function (aiResponse: string): string[] {
      const commandBlocks: string[] = [];
      const fileCommandMap = new Map<string, string>(); // Map to store first command for each file
  
      // Regex to match tool_code blocks
      const regex = /```tool_code\s*\n([\s\S]*?)\n```/g;
      let match;
  
      while ((match = regex.exec(aiResponse)) !== null) {
        const commandBlock = match[1].trim();
        const [firstLine] = commandBlock.split('\n');
        const filePathMatch = firstLine.match(/SELECT_FILE\s+(\S+)/);
  
        if (filePathMatch) {
          const filePath = filePathMatch[1];
  
          // Only add the first command for each file path
          if (!fileCommandMap.has(filePath)) {
            fileCommandMap.set(filePath, commandBlock);
          }
        }
      }
  
      // Collect only the first command block for each unique file path
      commandBlocks.push(...fileCommandMap.values());
      return commandBlocks;
    };
  }
  