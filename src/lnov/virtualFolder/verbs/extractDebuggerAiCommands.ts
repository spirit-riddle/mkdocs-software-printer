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

    // Handle code blocks possibly wrapped in <pre> tags
    const regex = /<pre>\s*```tool_code\s*\n([\s\S]*?)\n```\s*<\/pre>/g;
    let match;
    while ((match = regex.exec(aiResponse)) !== null) {
      commandBlocks.push(match[1].trim());
    }

    // Also handle code blocks without <pre> tags
    const regexWithoutPre = /```tool_code\s*\n([\s\S]*?)\n```/g;
    while ((match = regexWithoutPre.exec(aiResponse)) !== null) {
      commandBlocks.push(match[1].trim());
    }

    return commandBlocks;
  };
}
