// lnov/blueprint/makeBlueprint.ts

import { Dependencies } from '../../utils/types/dependencies';
import writeToDrive from './verbs/writeToDrive';
import extractAiCommands from './verbs/extractAiCommands';
import processAiCommand from './verbs/processAiCommand';

/**
 * Factory function that creates a Blueprint utility object providing functions for generating and managing blueprints.
 *
 * @param d - The dependencies required by the Blueprint verbs.
 * @returns An object containing all the Blueprint verb functions.
 *
 * @category Blueprint
 */
export default function makeBlueprint(d: Dependencies) {
  return {
    /**
     * Transfers the in-memory project structure to the drive.
     *
     * @see {@link writeToDrive}
     */
    writeToDrive: writeToDrive(d),

    /**
     * Extracts AI_COMMANDS blocks from the AI's response.
     *
     * @see {@link extractAiCommands}
     */
    extractAiCommands: extractAiCommands(d),

    /**
     * Processes a single AI_COMMANDS block.
     *
     * @see {@link processAiCommand}
     */
    processAiCommand: processAiCommand(d),
  };
}
