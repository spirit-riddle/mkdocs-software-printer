// processes/generateVirtualFolderFromMkDocs/index.ts

import { makeDependencies } from '../utils/makeDependencies';
import makeMkDocs from '../lnov/mkDocs/makeMkDocs';
import makeVirtualFolder from '../lnov/virtualFolder/makeVirtualFolder';
import makeVirtualFolderAi from '../lnov/virtualFolder/ai/makeVirtualFolderAi';
import { Folder, ProjectPlan, File } from '../lnov/virtualFolder/types/projectPlan';
import { Dependencies } from '../utils/types/dependencies';
import makeOs from '../lnov/os/makeOs';
import readline from 'readline';

async function generateVirtualFolderFromMkDocs() {
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
    output: process.stdout,
  });

  const language = await new Promise<string>((resolve) => {
    rl.question(
      'Please specify the programming language for the project (e.g., TypeScript, JavaScript, Python): ',
      (answer) => {
        rl.close();
        resolve(answer.trim());
      }
    );
  });

  const d: Dependencies = makeDependencies();
  const mkDocs = makeMkDocs(d);
  const virtualFolder = makeVirtualFolder(d);
  const virtualFolderAi = makeVirtualFolderAi(d);
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
      const parsedYAML = await mkDocs.parseMkDocsYAML(mkdocsFile);

      const nav = parsedYAML['nav'];
      if (nav) {
        combinedMarkdown += await mkDocs.readMarkdownFromNav(nav, d.path.join(mkdocsDir, 'docs'));
      } else {
        console.error(`No 'nav' section found in: ${mkdocsFile}`);
      }
    }

    // Step 3: Load the introduction to the Planning AI
    const prompt = `
You are building a software project in ${language}.
Please load the following software project description. Next prompt you will be able to answer the problem.
${combinedMarkdown}
`;

    // Use the Planning AI to generate the project plan
    let aiResponse = await virtualFolderAi.getResponseFromPlanningAi(prompt);

    // Initialize the project plan
    const projectPlan: ProjectPlan = {
      root: {
        name: 'project-root',
        subFolders: [],
        files: [],
      },
    };

    // Load the AI Command Line Instructions
    const aiCommandsPath = d.path.join(
      __dirname,
      '..',
      'lnov',
      'virtualFolder',
      'ai',
      'instructions',
      'AIcommandline.md'
    );
    const aiCommandsInstructions = await os.readFile(aiCommandsPath);

    // Initialize prompt count
    let promptsRemaining = 25;

    // Prepare the initial prompt with the AI Command Line Instructions
    const initialPrompt = aiCommandsInstructions.replace(
      '**100 out of 100 prompts remaining**',
      `**${promptsRemaining} out of 100 prompts remaining**`
    );

    // Send the initial prompt to the Planning AI
    aiResponse = await virtualFolderAi.getResponseFromPlanningAi(initialPrompt);
    promptsRemaining--;

    aiResponse = await virtualFolderAi.getResponseFromPlanningAi(
      'Please use these Commands to build the project from the loaded documentation. You are taking the lead now, remember to add multiple commands per prompt to speed things up. Go ahead and build this project please.'
    );
    promptsRemaining--;

    // Planning AI command loop
    let aiCompleted = false;
    while (!aiCompleted && promptsRemaining > 0) {
      try {
        await delay(3000);

        // Process AI commands from the response
        const aiCommands = virtualFolder.extractAiCommands(aiResponse);

        if (aiCommands.length === 0) {
          // If no commands are found, check if the AI has any questions
          const aiQuestions = extractAiQuestions(aiResponse);
          if (aiQuestions.length > 0) {
            // Respond to AI's questions
            const commandResponse = await respondToAiQuestions(aiQuestions);
            aiResponse = await virtualFolderAi.getResponseFromPlanningAi(commandResponse);
            promptsRemaining--;
            continue;
          } else {
            console.log('No AI_COMMANDS found and no questions detected. Exiting...');
            break;
          }
        }

        // Process each command
        for (const commandBlock of aiCommands) {
          const result = virtualFolder.processAiCommand(commandBlock, projectPlan);
          if (result === 'EXIT') {
            aiCompleted = true;
            break;
          }
        }

        promptsRemaining--;

        // Prepare the updated prompt for the AI
        const updatedPrompt = `
You have ${promptsRemaining} out of 100 prompts remaining.

Current Project Structure (limited view):
${getProjectStructure(projectPlan)}

Please provide your next commands.
`;

        aiResponse = await virtualFolderAi.getResponseFromPlanningAi(updatedPrompt);
      } catch (error: any) {
        console.error('Error during Planning AI interaction:', error);
        break;
      }
    }

    // Step 4: After Planning AI session ends, invoke the File Compression AI
    // Find files with the same name in the project plan
    const filesByName = collectFilesByName(projectPlan.root);

    // For each group of files with the same name, ask the File Compression AI to combine them
    for (const [fileName, fileList] of Object.entries(filesByName)) {
      if (fileList.length > 1) {
        // Prepare the prompt for File Compression AI
        let compressionPrompt = `These ${fileList.length} files are supposed to be one file:\n`;
        for (const fileInfo of fileList) {
          compressionPrompt += `\`\`\`${fileInfo.path}\n${fileInfo.file.content}\n\`\`\`\n`;
        }

        // Call the File Compression AI to combine the files
        const combinedContent = await virtualFolderAi.getResponseFromFileCompressionAi(compressionPrompt);

        // Replace the multiple files with the combined file in the project plan
        replaceFilesWithCombined(projectPlan.root, fileName, combinedContent);
      }
    }

    // Step 5: Write the updated project plan to disk
    await virtualFolder.writeToDrive(projectPlan, outputDir);
    console.log('Virtual folder written to disk at', outputDir);
  } catch (error) {
    console.error('Error generating virtual folder:', error);
  }
}

export default generateVirtualFolderFromMkDocs;

/**
 * Helper function to get the project structure without virtual folder content.
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
 * Collects files by their names across the project plan.
 *
 * @param folder - The root folder to start collecting from.
 * @returns An object mapping file names to arrays of files with that name.
 */
function collectFilesByName(folder: Folder, currentPath = ''): { [fileName: string]: { file: File; path: string }[] } {
  let filesByName: { [fileName: string]: { file: File; path: string }[] } = {};

  const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name;

  for (const file of folder.files) {
    if (!filesByName[file.name]) {
      filesByName[file.name] = [];
    }
    filesByName[file.name].push({ file, path: `${folderPath}/${file.name}` });
  }

  for (const subFolder of folder.subFolders) {
    const subFilesByName = collectFilesByName(subFolder, folderPath);
    for (const [fileName, fileList] of Object.entries(subFilesByName)) {
      if (!filesByName[fileName]) {
        filesByName[fileName] = [];
      }
      filesByName[fileName].push(...fileList);
    }
  }

  return filesByName;
}

/**
 * Replaces multiple files with the combined file content in the project plan.
 *
 * @param folder - The folder to process.
 * @param fileName - The name of the files to replace.
 * @param combinedContent - The combined content from the File Compression AI.
 */
function replaceFilesWithCombined(folder: Folder, fileName: string, combinedContent: string) {
  // Remove files with the given name in this folder
  const hasFile = folder.files.some((file) => file.name === fileName);
  folder.files = folder.files.filter((file) => file.name !== fileName);

  // Add the combined file if any files were removed
  if (hasFile) {
    folder.files.push({ name: fileName, content: combinedContent });
  }

  // Recursively process subfolders
  for (const subFolder of folder.subFolders) {
    replaceFilesWithCombined(subFolder, fileName, combinedContent);
  }
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
 * @returns A string containing the response to the AI.
 */
async function respondToAiQuestions(questions: string[]): Promise<string> {
  // Implement logic to generate appropriate responses to the AI's questions
  let response = '';

  for (const question of questions) {
    console.log(`AI asked: ${question}`);
    // For simplicity, we'll instruct the AI to proceed
    response += `I cannot answer that question directly, but please proceed with your commands.\n`;
  }

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
