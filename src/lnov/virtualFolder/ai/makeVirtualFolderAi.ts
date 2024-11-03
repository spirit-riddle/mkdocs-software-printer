// lnov/virtualFolder/ai/makeVirtualFolderAi.ts

import { Dependencies } from '../../../utils/types/dependencies';
import getResponseFromFileCompressionAi from './verbs/getResponseFromFileCompressionAi';
import getResponseFromPlanningAi from './verbs/getResponseFromPlanningAi';
import getResponseFromDebuggerAi from './verbs/getResponseFromDebuggerAi';

/**
 * Factory function that creates the virtual folder AI utility object for interacting with the AI client.
 *
 * @param d - The dependencies required by the virtual folder AI verbs.
 * @returns An object containing all the virtual folder AI verb functions.
 *
 * @category VirtualFolderAI
 */
export default function makeVirtualFolderAi(d: Dependencies) {
  return {
    /**
     * Sends a prompt to the AI and returns the response for file compression.
     * This function does not retain session history, ensuring stateless prompts.
     *
     * @see {@link getResponseFromFileCompressionAi}
     */
    getResponseFromFileCompressionAi: getResponseFromFileCompressionAi(d),

    /**
     * Sends a prompt to the AI and returns the response for planning.
     * This function can retain session history based on the `resetHistory` parameter.
     *
     * @see {@link getResponseFromPlanningAi}
     */
    getResponseFromPlanningAi: getResponseFromPlanningAi(d),

    /**
     * Sends a prompt to the AI and returns the response for debugging.
     * This function can retain session history based on the `resetHistory` parameter.
     *
     * @see {@link getResponseFromDebuggerAi}
     */
    getResponseFromDebuggerAi: getResponseFromDebuggerAi(d),
  };
}
