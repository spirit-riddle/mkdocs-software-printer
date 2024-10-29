// ai/verbs/generateFolderStructure.ts

import { Dependencies } from '../../../../utils/types/dependencies';
import extractAllMarkdownBlocks from './extractAllMarkdownBlocks';
import generatePlan, { Folder, ProjectPlan } from './generatePlan';
import getResponseFromAi from './getResponseFromAi';

/**
 * Generates the folder structure for the project as a list.
 *
 * @returns A promise that resolves to the final project plan.
 *
 * @example
 * ```typescript
 * const plan = await blueprintAi.generateFolderStructure();
 * console.log('Generated Folder Structure:', plan);
 * ```
 *
 * @category BlueprintAI
 */
export default function generateFolderStructure(d: Dependencies) {
  return async function (): Promise<ProjectPlan> {
    const getResponseFromAiFunction = getResponseFromAi(d);
    const generatePlanFunction = generatePlan(d);
    const extractAllMarkdownBlocksFunction = extractAllMarkdownBlocks(d)

    // Initial prompt to BlueprintAI to generate folder paths
    let prompt = "Generate a basic folder structure with filenames for a project. Please don't add helper text, this is going into a parser, nothing intelligent will read it.";


    let completePlan: ProjectPlan = {
      root: {
        blueprint: [],
        name: "",
        subFolders: [],
      }
    };

    // while (!completePlan) {
    //   const response = await getResponseFromAiFunction(prompt);

    //   // Assuming the response contains the folder paths as a list in markdown code block (e.g., ` ``` \n <list> \n ``` `)
    //   const folderPathsFromAi = await extractAllMarkdownBlocksFunction(response);

    //   // Generate an updated plan using the AI-provided folder paths
    //   completePlan = await generatePlanFunction(folderPathsFromAi.map(f => f.content).join('').split("\\n"));

    //   // Continue refining if the AI needs more context
    //   if (!isPlanComplete(completePlan)) {
    //     prompt = "Refine the folder structure by adding additional necessary folders or adjusting the hierarchy.";
    //   } else {
    //     break;
    //   }
    // }

    return completePlan;
  };
}

/**
 * Checks if the generated project plan is complete.
 *
 * @param plan - The generated project plan.
 * @returns `true` if the plan is complete, otherwise `false`.
 */
function isPlanComplete(plan: ProjectPlan): boolean {
  // Placeholder logic to determine if the plan is complete
  // You can add more sophisticated checks based on your needs
  return plan.root.subFolders.length > 0;
}
