import { Dependencies } from '../../../../utils/types/dependencies';
import extractAllMarkdownBlocks from './extractAllMarkdownBlocks';

export interface ProjectPlan {
  root: Folder;
}

export interface Folder {
  name: string;
  subFolders: Folder[];
  blueprint: BlueprintFile[];
}

export interface BlueprintFile {
  name: string;
  content: string;
}
/**
 * Generates an in-memory project plan based on the AI response in JSON format.
 *
 * @param d - The dependencies required for generating the plan.
 * @returns A promise that resolves to the generated project plan.
 *
 * @example
 * ```typescript
 * const projectPlan = await blueprintAI.generatePlan();
 * console.log('Generated project plan:', projectPlan);
 * ```
 *
 * @category BlueprintAI
 */
export default function generatePlan(d: Dependencies) {
  return async function (): Promise<ProjectPlan> {

    const extractAllMarkdownBlocksFunction = extractAllMarkdownBlocks(d)
    // Send the prompt to the AI
    const prompt = `
First step: Please generate the project structure in the following JSON format... Please do not create any code yet. This is a multi phase plan we are going through.

\`\`\`json
{
  "root": {
    "name": "project-root",
    "subFolders": [
      {
        "name": "src",
        "subFolders": [
          {
            "name": "utils",
            "subFolders": [],
            "blueprint": []
          },
          {
            "name": "components",
            "subFolders": [],
            "blueprint": [
              {
                "name": "Logger.ts",
                "content": "// Logger implementation here",
                "description": "A simple logging utility for the application"
              }
            ]
          }
        ],
        "blueprint": []
      }
    ],
    "blueprint": [
      {
        "name": "README.md",
        "content": "# Project Documentation",
        "description": "A readme file for project documentation"
      }
    ]
  }
}
\`\`\`

`;
    const response = await d.blueprintAiClient.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
    });

    // Parse the JSON response from the AI
    const responseContent = await extractAllMarkdownBlocksFunction(response.choices[0].message?.content ?? '');
    const projectPlan: ProjectPlan = JSON.parse(responseContent[0].content);

    return projectPlan;
  };
}
