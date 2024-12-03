// src/lnov/virtualFolder/verbs/extractPlanningAiCommands.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Extracts AI_COMMANDS blocks from the AI's response for the Planning AI.
 *
 * @param d - The dependencies required by the function.
 * @returns A function that extracts AI_COMMANDS blocks.
 *
 * @category VirtualFolder
 */
export default function extractPlanningAiCommands(d: Dependencies) {
  return function (aiResponse: string): string[] {
    const commandBlocks: string[] = [];
    const regex = /```AI_COMMANDS\n([\s\S]*?)\n```/g;
    let match;
    while ((match = regex.exec(aiResponse)) !== null) {
      commandBlocks.push(match[1].trim());
    }
    return commandBlocks;
  };
}
