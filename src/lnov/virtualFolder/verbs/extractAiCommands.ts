// lnov/blueprint/verbs/extractAiCommands.ts

import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Extracts AI_COMMANDS blocks from the AI's response.
 *
 * @param aiResponse - The response from the AI.
 * @returns An array of command strings.
 *
 * @example
 * ```typescript
 * const aiCommands = blueprint.extractAiCommands(aiResponse);
 * ```
 *
 * @category Blueprint
 */
export default function extractAiCommands(d: Dependencies) {
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
