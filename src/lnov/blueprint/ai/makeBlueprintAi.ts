// lnov/blueprint/ai/makeBlueprintAi.ts

import { Dependencies } from '../../../utils/types/dependencies';
import getResponseFromAi from './verbs/getResponseFromAi';

/**
 * Factory function that creates the blueprint AI utility object for interacting with the AI client.
 *
 * @param d - The dependencies required by the blueprint AI verbs.
 * @returns An object containing all the blueprint AI verb functions.
 *
 * @category BlueprintAI
 */
export default function makeBlueprintAi(d: Dependencies) {
  return {
    /**
     * Sends a prompt to the AI and returns the response.
     *
     * @see {@link getResponseFromAi}
     */
    getResponseFromAi: getResponseFromAi(d),
  };
}
