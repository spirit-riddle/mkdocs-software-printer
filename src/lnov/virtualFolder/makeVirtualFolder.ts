// src/lnov/virtualFolder/makeVirtualFolder.ts

import { Dependencies } from '../../utils/types/dependencies';
import writeToDrive from './verbs/writeToDrive';
import extractPlanningAiCommands from './verbs/extractPlanningAiCommands';
import extractDebuggerAiCommands from './verbs/extractDebuggerAiCommands';
import processPlanningAiCommand from './verbs/processPlanningAiCommand';
import processDebuggingAiCommand from './verbs/processDebuggingAiCommand';

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
     * @see {@link extractPlanningAiCommands}
     */
    extractPlanningAiCommands: extractPlanningAiCommands(d),

    /**
     * Extracts TOOL_CODE blocks from the AI's response.
     *
     * @see {@link extractDebuggerAiCommands}
     */
    extractDebuggerAiCommands: extractDebuggerAiCommands(d),

    /**
     * Processes commands from the Planning AI.
     *
     * @see {@link processPlanningAiCommand}
     */
    processPlanningAiCommand: processPlanningAiCommand(d),

    /**
     * Processes commands from the Debugging AI.
     *
     * @see {@link processDebuggingAiCommand}
     */
    processDebuggingAiCommand: processDebuggingAiCommand(d),
  };
}
