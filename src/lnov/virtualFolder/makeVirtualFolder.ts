// lnov/virtualFolder/makeVirtualFolder.ts

import { Dependencies } from '../../utils/types/dependencies';
import writeToDrive from './verbs/writeToDrive';
import extractAiCommands from './verbs/extractAiCommands';
import processAiCommand from './verbs/processAiCommand';

/**
 * Factory function that creates a VirtualFolder utility object providing functions for generating and managing virtual folders.
 *
 * @param d - The dependencies required by the VirtualFolder verbs.
 * @returns An object containing all the VirtualFolder verb functions.
 *
 * @category VirtualFolder
 */
export default function makeVirtualFolder(d: Dependencies) {
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
