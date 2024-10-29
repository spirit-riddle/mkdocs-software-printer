// processes/generateBlueprintFromMkDocs/index.ts

import { makeDependencies } from '../../utils/makeDependencies';
import makeMkDocs from '../../lnov/mkDocs/makeMkDocs';
import makeBlueprint from '../../lnov/blueprint/makeBlueprint';
import makeBlueprintAi from '../../lnov/blueprint/ai/makeBlueprintAi';
import { Folder, ProjectPlan } from '../../lnov/blueprint/types/projectPlan';
import { Dependencies } from '../../utils/types/dependencies';
import makeOs from '../../lnov/os/makeOs';
import readline from 'readline';

async function generateBlueprintFromMkDocs() {
  const args = process.argv.slice(2);
  let inputDir = '';
  let outputDir = '';

  args.forEach((arg, index) => {
    if (arg === '--input' && args[index + 1]) {
      inputDir = args[index + 1];
    }
    if (arg === '--output' && args[index + 1]) {
      outputDir = args[index + 1];
    }
  });

  if (!inputDir || !outputDir) {
    console.error('Usage: npm start -- --input <input directory> --output <output directory>');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const language = await new Promise<string>((resolve) => {
    rl.question('Please specify the programming language for the project (e.g., TypeScript, JavaScript, Python): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  const d: Dependencies = makeDependencies();
  const mkDocs = makeMkDocs(d);
  const blueprint = makeBlueprint(d);
  const blueprintAi = makeBlueprintAi(d);
  const os = makeOs(d);

  try {
    // Step 1: Find mkdocs.yml files
    const mkdocsFiles = await mkDocs.findMkDocsFiles(inputDir);
    if (mkdocsFiles.length === 0) {
      console.error('No mkdocs.yml files found.');
      return;
    }

    // Step 2: Read markdown content from mkdocs nav
    let combinedMarkdown = '';
    for (const mkdocsFile of mkdocsFiles) {
      const mkdocsDir = d.path.dirname(mkdocsFile);
      const mkdocsYAMLContent = await os.readFile(mkdocsFile);
      const parsedYAML = d.yaml.parse(mkdocsYAMLContent);

      const nav = parsedYAML['nav'];
      if (nav) {
        combinedMarkdown += await mkDocs.readMarkdownFromNav(nav, d.path.join(mkdocsDir, "docs"));
      } else {
        console.error(`No 'nav' section found in: ${mkdocsFile}`);
      }
    }

    // Step 3: Load the introduction
    const prompt = `
You are building a software project in ${language}.
Please load the following software project description. Next prompt you will be able to answer the problem.
${combinedMarkdown}
`;
    const introResponse = await blueprintAi.getResponseFromAi(prompt);
    console.log('Intro response:', introResponse);

    // Step 4: Initialize the project plan
    const projectPlan: ProjectPlan = {
      root: {
        name: 'project-root',
        subFolders: [],
        files: [],
      },
    };

    // Step 5: Load the AI Command Line Instructions once
    const aiCommandsPath = d.path.join(__dirname, '..', 'ai-instructions', 'blueprint-generation', 'AIcommandline.md');
    const aiCommandsInstructions = await os.readFile(aiCommandsPath);

    // Initialize prompt count
    let promptsRemaining = 25;

    // Prepare the initial prompt with the AI Command Line Instructions
    const initialPrompt = aiCommandsInstructions
      .replace('${projectState}', getProjectStructure(projectPlan))
      .replace('**100 out of 100 prompts remaining**', `**${promptsRemaining} out of 100 prompts remaining**`);

    // Send the initial prompt to the AI
    let aiResponse = await blueprintAi.getResponseFromAi(initialPrompt);
    promptsRemaining--;


    aiResponse = await blueprintAi.getResponseFromAi("Please use these Commands to build the project from the loaded documentation. You are taking the lead now, remember to add multiple commands per prompt to speed things up. Go ahead and build this project please.")

    // Initialize the AI command line loop
    let aiCompleted = false;
    while (!aiCompleted && promptsRemaining > 0) {
      try {

        await delay(3000)

        // Process AI commands from the response
        const aiCommands = blueprint.extractAiCommands(aiResponse);

        if (aiCommands.length === 0) {
          // If no commands are found, check if the AI has any questions
          const aiQuestions = extractAiQuestions(aiResponse);
          if (aiQuestions.length > 0) {
            // Respond to AI's questions with appropriate commands or messages
            const commandResponse = await respondToAiQuestions(aiQuestions, projectPlan);
            // Send the command response back to the AI
            aiResponse = await blueprintAi.getResponseFromAi(commandResponse);
            promptsRemaining--;
            continue;
          } else {
            console.log('No AI_COMMANDS found and no questions detected. Exiting...');
            break;
          }
        }

        // Process each command
        for (const commandBlock of aiCommands) {
          const result = blueprint.processAiCommand(commandBlock, projectPlan);
          if (result === 'EXIT') {
            aiCompleted = true;
            break;
          }
        }

        // Decrement prompts remaining
        promptsRemaining--;

        // Prepare the updated prompt for the AI
        const updatedPrompt = `
      You have ${promptsRemaining} out of 100 prompts remaining.
      
      Current Project Structure (limited view):
      ${getProjectStructure(projectPlan)}
      
      Please provide your next commands.
      `;

        // Send the updated prompt to the AI
        aiResponse = await blueprintAi.getResponseFromAi(updatedPrompt);
      } catch (error: any) {
        // Check if the error is a rate limit error
        if (error.status === 413 && error.error?.error?.code === 'rate_limit_exceeded') {
          const retryAfter = parseInt(error.headers['retry-after'] || '60', 10);
          console.warn(`Rate limit exceeded. Waiting for ${retryAfter} seconds before retrying...`);
          await delay(retryAfter * 1000);
          continue; // Retry the loop after waiting
        } else {
          // For other errors, rethrow
          throw error;
        }
      }
    }

    // Step 6: Write the updated project plan to disk
    await blueprint.writeToDrive(projectPlan, outputDir);
    console.log('Blueprint written to disk at', outputDir);
  } catch (error) {
    console.error('Error generating blueprint:', error);
  }
}

export default generateBlueprintFromMkDocs;

/**
 * Helper function to get the project structure without blueprint/context content.
 *
 * @param projectPlan - The current project plan.
 * @returns A string representing the project structure.
 */
function getProjectStructure(projectPlan: ProjectPlan, depthLimit = 2): string {
  function traverse(folder: Folder, depth: number): any {
    if (depth >= depthLimit) {
      return { name: folder.name, subFolders: '...', files: '...' };
    }
    return {
      name: folder.name,
      subFolders: folder.subFolders.map((subFolder) => traverse(subFolder, depth + 1)),
      files: folder.files.map((file) => file.name),
    };
  }

  const structure = traverse(projectPlan.root, 0);
  return JSON.stringify(structure, null, 2);
}


/**
 * Helper function to extract questions from the AI's response.
 *
 * @param aiResponse - The AI's response.
 * @returns An array of questions found in the response.
 */
function extractAiQuestions(aiResponse: string): string[] {
  // Simple implementation: Extract lines ending with a question mark
  const questions: string[] = [];
  const lines = aiResponse.split('\n');
  for (const line of lines) {
    if (line.trim().endsWith('?')) {
      questions.push(line.trim());
    }
  }
  return questions;
}

/**
 * Helper function to respond to AI's questions.
 *
 * @param questions - An array of questions from the AI.
 * @param projectPlan - The current project plan.
 * @returns A string containing the AI_COMMANDS to respond.
 */
async function respondToAiQuestions(questions: string[], projectPlan: ProjectPlan): Promise<string> {
  // For simplicity, we'll assume we can respond with an appropriate command
  // In practice, you might need to implement logic to generate commands based on the questions
  let response = '';

  for (const question of questions) {
    console.log(`AI asked: ${question}`);
    // Here you can implement logic to generate appropriate commands
    // For now, we'll respond with a placeholder
    response += `I cannot answer that question directly, but please proceed with your commands.\n`;
  }

  // Wrap the response in AI_COMMANDS block if needed
  return response;
}

/**
 * Delays the execution for the specified number of milliseconds.
 *
 * @param ms - Milliseconds to wait.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
