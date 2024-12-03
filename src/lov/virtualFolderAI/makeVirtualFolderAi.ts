// src/lnov/virtualFolder/ai/makeVirtualFolderAi.ts

import { Dependencies } from '../../utils/types/dependencies';
import getResponseFromPlanningAi from './verbs/getResponseFromPlanningAi';
import getResponseFromFileCompressionAi from './verbs/getResponseFromFileCompressionAi';
import getResponseFromDebuggerAi from './verbs/getResponseFromDebuggerAi';

/**
 * Factory function that creates a VirtualFolderAi utility object providing functions for AI interactions.
 * Each function maintains a separate conversation context.
 *
 * @param d - The dependencies required by the VirtualFolderAi verbs.
 * @returns An object containing all the VirtualFolderAi verb functions.
 *
 * @category VirtualFolderAi
 */
export default function makeVirtualFolderAi(d: Dependencies) {
  return {
    /**
     * Gets a response from the Planning AI.
     *
     * @see {@link getResponseFromPlanningAi}
     */
    getResponseFromPlanningAi: getResponseFromPlanningAi(d),

    /**
     * Gets a response from the File Compression AI.
     *
     * @see {@link getResponseFromFileCompressionAi}
     */
    getResponseFromFileCompressionAi: getResponseFromFileCompressionAi(d),

    /**
     * Gets a response from the Debugging AI.
     *
     * @see {@link getResponseFromDebuggerAi}
     */
    getResponseFromDebuggerAi: getResponseFromDebuggerAi(d),
  };
}
