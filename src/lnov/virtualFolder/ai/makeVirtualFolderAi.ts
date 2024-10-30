// lnov/virtualFolder/ai/makeVirtualFolderAi.ts

import { Dependencies } from '../../../utils/types/dependencies';
import getResponseFromAi from './verbs/getResponseFromAi';

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
     * Sends a prompt to the AI and returns the response.
     *
     * @see {@link getResponseFromAi}
     */
    getResponseFromAi: getResponseFromAi(d),
  };
}
