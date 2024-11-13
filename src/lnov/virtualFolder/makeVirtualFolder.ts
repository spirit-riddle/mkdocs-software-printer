// src/lnov/virtualFolder/makeVirtualFolder.ts

import { Dependencies } from '../../utils/types/dependencies';
import writeToDrive from './verbs/writeToDrive';
import extractPlanningAiCommands from './verbs/extractPlanningAiCommands';
import extractDebuggerAiCommands from './verbs/extractDebuggerAiCommands';
import processPlanningAiCommand from './verbs/processPlanningAiCommand';
import processDebuggingAiCommand from './verbs/processDebuggingAiCommand';

/**
 * **Virtual Folder AI Factory**
 *
 * Creates a utility object for AI interactions related to virtual folder operations. Each method maintains a separate conversation context with the AI model.
 *
 * **Available Methods:**
 *
 * - {@link getResponseFromPlanningAi}: Interacts with the AI for planning tasks.
 * - {@link getResponseFromFileCompressionAi}: Interacts with the AI for file compression tasks.
 * - {@link getResponseFromDebuggerAi}: Interacts with the AI for debugging tasks.
 *
 * @param d - The dependencies required by the VirtualFolderAi verbs.
 * @returns An object containing all the AI verb functions.
 *
 * @see {@link Dependencies}
 * @category VirtualFolder AI
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
