// processes/generateVirtualFolderFromMkDocs/index.ts

import { makeDependencies } from '../utils/makeDependencies';
import makeMkDocs from '../lov/mkDocs/makeMkDocs';
import makeVirtualFolder from '../lov/virtualFolder/makeVirtualFolder';
import makeVirtualFolderAi from '../lov/virtualFolderAI/makeVirtualFolderAi';
import { Folder, ProjectPlan, File } from '../lov/virtualFolder/types/projectPlan';
import { Dependencies } from '../utils/types/dependencies';
import makeOs from '../lov/os/makeOs';
import readline from 'readline';
import talkTrack from "@maverick-spirit/talk-track";

const totalPromptsAllowed = 25;

/**
 * **Generate Virtual Folder from MkDocs**
 *
 * Orchestrates the process of generating a virtual folder structure from MkDocs documentation by interacting with AI models for planning, compression, and debugging tasks.
 *
 * **Process Overview:**
 * 1. **Find MkDocs Files:** Searches for `mkdocs.yml` files in the specified input directory.
 * 2. **Read Markdown Content:** Extracts markdown content based on the navigation configuration.
 * 3. **Interact with Planning AI:** Uses the Planning AI to create an initial project plan.
 * 4. **File Compression AI:** Merges files with the same name across the project structure.
 * 5. **Experimental Debugger AI (Optional):** Interacts with the Debugger AI to refine the code.
 * 6. **Write to Disk:** Outputs the final project structure to the specified output directory.
 *
 * @example
 * ```shell
 * npm start -- --input ./docs --output ./output --experimental-debugger
 * ```
 *
 * @category Processes
 */
async function generateVirtualFolderFromMkDocs() {
  const args = process.argv.slice(2);
  let inputDir = '';
  let outputDir = '';
  let experimentalDebuggerEnabled = false;

  // Parse command line arguments
  args.forEach((arg, index) => {
    if (arg === '--input' && args[index + 1]) {
      inputDir = args[index + 1];
    }
    if (arg === '--output' && args[index + 1]) {
      outputDir = args[index + 1];
    }
    if (arg === '--experimental-debugger') {
      experimentalDebuggerEnabled = true;
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
    let prompt = `
You are building a software project in ${language}.
Please load the following software project description. Next prompt you will be able to answer the problem.
${combinedMarkdown}
`;

    // debugging conversation
    talkTrack.log({
      role: 'Application', // or 'AI'
      message: prompt
    });

    // Use the Planning AI to generate the project plan
    let aiResponse = await virtualFolderAi.getResponseFromPlanningAi(prompt);

    // debugging conversation
    talkTrack.log({
      role: 'Planning-AI', // or 'AI'
      message: aiResponse
    });

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
      'lov',
      'virtualFolderAI',
      'instructions',
      'AIPlanningCommandline.md'
    );
    const aiCommandsInstructions = await os.readFile(aiCommandsPath);

    // Initialize prompt count
    let promptsRemaining = totalPromptsAllowed;

    // Prepare the initial prompt with the AI Command Line Instructions
    const initialPrompt = aiCommandsInstructions.replace(
      '**100 out of 100 prompts remaining**',
      `**${promptsRemaining} out of ${totalPromptsAllowed} prompts remaining**`
    );

    // debugging conversation
    talkTrack.log({
      role: 'Application', // or 'AI'
      message: initialPrompt
    });

    // Send the initial prompt to the Planning AI
    aiResponse = await virtualFolderAi.getResponseFromPlanningAi(initialPrompt);

    // debugging conversation
    talkTrack.log({
      role: 'Planning-AI', // or 'AI'
      message: aiResponse
    });

    promptsRemaining--;

    prompt = 'Please use these Commands to build the project from the loaded documentation. You are taking the lead now, remember to add multiple commands per prompt to speed things up. Go ahead and build this project please.'

    // debugging conversation
    talkTrack.log({
      role: 'Application', // or 'AI'
      message: prompt
    });

    aiResponse = await virtualFolderAi.getResponseFromPlanningAi(prompt)

    // debugging conversation
    talkTrack.log({
      role: 'Planning-AI', // or 'AI'
      message: aiResponse
    });


    promptsRemaining--;

    // Planning AI command loop

    // Planning AI command loop
    let aiCompleted = false;
    while (!aiCompleted && promptsRemaining > 0) {
      try {
        await delay(3000);

        // Process AI commands from the response
        const aiCommands = virtualFolder.extractPlanningAiCommands(aiResponse);

        if (aiCommands.length === 0) {
          // ... [Your existing code for handling no commands]
        }

        // Process each command using processPlanningAiCommand
        for (const commandBlock of aiCommands) {
          const result = virtualFolder.processPlanningAiCommand(commandBlock, projectPlan);
          if (result === 'EXIT') {
            aiCompleted = true;
            break;
          }
        }

        promptsRemaining--;

        // Prepare the updated prompt for the AI
        const updatedPrompt = `
You have ${promptsRemaining} out of ${totalPromptsAllowed} prompts remaining.

Current Project Structure (limited view):
${getProjectStructure(projectPlan)}

Please provide your next commands.
`;


        // debugging conversation
        talkTrack.log({
          role: 'Application', // or 'AI'
          message: updatedPrompt
        });

        aiResponse = await virtualFolderAi.getResponseFromPlanningAi(updatedPrompt);

        // debugging conversation
        talkTrack.log({
          role: 'Planning-AI', // or 'AI'
          message: aiResponse
        });

      } catch (error: any) {
        console.error('Error during Planning AI interaction:', error);
        break;
      }
    }


    // Step 4: After Planning AI session ends, invoke the File Compression AI
    // Find files with the same name in the project plan
    promptsRemaining = totalPromptsAllowed;
    const filesByName = collectFilesByName(projectPlan.root);

    // For each group of files with the same name, ask the File Compression AI to combine them
    for (const [fileName, fileList] of Object.entries(filesByName)) {
      if (fileList.length > 1) {
        // Prepare the prompt for File Compression AI
        let compressionPrompt = `These ${fileList.length} files are supposed to be one file, merge all the code together into one file, I want to see code:\n`;
        for (const fileInfo of fileList) {
          compressionPrompt += `\`\`\`${fileInfo.path}\n${fileInfo.file.content}\n\`\`\`\n`;
        }

        // debugging conversation
        talkTrack.log({
          role: 'Application', // or 'AI'
          message: compressionPrompt
        });

        // Call the File Compression AI to combine the files
        const combinedContent = await virtualFolderAi.getResponseFromFileCompressionAi(compressionPrompt);

        // debugging conversation
        talkTrack.log({
          role: 'FileCompression-AI', // or 'AI'
          message: aiResponse
        });

        // Replace the multiple files with the combined file in the project plan
        replaceFilesWithCombined(projectPlan.root, fileName, combinedContent);
      }
    }

    // Step 5: Conditional Debugger AI
    if (experimentalDebuggerEnabled) {
      console.log('Experimental Debugger enabled. Loading Debugger...');
      promptsRemaining = totalPromptsAllowed;

      const debuggerAiCommandsPath = d.path.join(
        __dirname,
        '..',
        'lov',
        'virtualFolderAI',
        'instructions',
        'AIDebuggerCommandline.md'
      );
      const debuggerAiCommandsInstructions = await os.readFile(debuggerAiCommandsPath);

      let debuggingPrompt = `
You are now debugging the following project. Here is the current code:

${getFullProjectCode(projectPlan.root)}

Please use the following command line to make changes to the code to fix any issues:

${debuggerAiCommandsInstructions}

You have ${promptsRemaining} out of ${totalPromptsAllowed} prompts remaining.

Please begin debugging now.
`;

      talkTrack.log({
        role: 'Application', // or 'AI'
        message: debuggingPrompt
      });

      let aiResponse = await virtualFolderAi.getResponseFromDebuggerAi(debuggingPrompt);

      // Debugger AI command loop
      let aiCompleted = false;

      console.log('Debugger Loaded Successfully');
      console.log('Debugging');

      while (!aiCompleted && promptsRemaining > 0) {
        try {
          await delay(3000);

          // Process AI commands from the response
          const aiCommands = virtualFolder.extractDebuggerAiCommands(aiResponse);

          if (aiCommands.length > 0) {
            let modifiedFiles: string[] = [];

            for (const commandBlock of aiCommands) {
              const result = virtualFolder.processDebuggingAiCommand(commandBlock, projectPlan);
              if (result.exit) {
                aiCompleted = true;
                break;
              }
              modifiedFiles.push(...result.updatedFiles);

              if (result.updatedFiles.length > 0) {
                console.log('Updated files:', result.updatedFiles);
              }
            }

            promptsRemaining--;

            debuggingPrompt = `
You have ${promptsRemaining} out of ${totalPromptsAllowed} prompts remaining.

Current Code (Modified Files Only):

${getModifiedFilesCode(projectPlan.root, modifiedFiles)}

Please provide your next commands.
`;

            talkTrack.log({
              role: 'Application',
              message: debuggingPrompt
            });

            aiResponse = await virtualFolderAi.getResponseFromDebuggerAi(debuggingPrompt);
          }

        } catch (error) {
          console.error('Error during Debugging AI interaction:', error);
          break;
        }
      }
      console.log('Debugging Completed');


      // Step 6: Write the updated project plan to disk
      await virtualFolder.writeToDrive(projectPlan, outputDir);
      console.log('Virtual folder written to disk at', outputDir);
    }

    
    // Step 6: Write the updated project plan to disk
    await virtualFolder.writeToDrive(projectPlan, outputDir);
    console.log('Virtual folder written to disk at', outputDir);

  } catch (error) {
    console.error('Error generating virtual folder:', error);
  } finally {
    console.log('Debugging Completed');
  }
}



export default generateVirtualFolderFromMkDocs;

/**
 * Helper function to get the project structure without virtual folder content.
 *
 * @param projectPlan - The current project plan.
 * @returns A string representing the project structure.
 */
/**
 * Helper function to get the full project structure, adhering to the `ProjectPlan` interface.
 *
 * @param projectPlan - The current project plan.
 * @returns A JSON string representing the project structure.
 */
function getProjectStructure(projectPlan: ProjectPlan): string {
  function traverse(folder: Folder): any {
    return {
      name: folder.name,
      files: folder.files.map(file => ({ name: file.name })),
      subFolders: folder.subFolders.map(subFolder => traverse(subFolder))
    };
  }

  const structure = traverse(projectPlan.root);
  return JSON.stringify(structure, null, 2);
}


/**
 * Helper function to get the full project code with line numbers.
 *
 * @param folder - The root folder.
 * @param currentPath - Tracks the path as we traverse (used recursively).
 * @returns A string containing all code files in the project, with line numbers.
 */
function getFullProjectCode(folder: Folder, currentPath: string = ''): string {
  let code = '';

  function cleanCodeContent(content: string, fileName: string): string {
    // Only clean content if it's not a Markdown file
    if (!fileName.endsWith('.md')) {
      // Remove ` ```typescript ` from the start and trailing ` ``` ` from the end
      return content.replace(/^```typescript\s*|\s*```$/g, '').trim();
    }
    return content;
  }

  function normalizePath(path: string): string {
    // Normalize the path by replacing multiple instances of "project-root/"
    return path.replace(/\/project-root\/project-root\//g, '/project-root/');
  }

  for (const file of folder.files) {
    let filePath = `${currentPath}/${folder.name}/${file.name}`.replace(/\/+/g, '/');
    filePath = normalizePath(filePath); // Normalize path if needed
    const cleanedContent = cleanCodeContent(file.content, file.name);
    const numberedLines = cleanedContent
      .split('\n')
      .map((line, index) => `${index + 1}: ${line}`)
      .join('\n');

    code += `\n\n## ${filePath}\n\n\`\`\`\n${numberedLines}\n\`\`\`\n`;
  }

  for (const subFolder of folder.subFolders) {
    code += getFullProjectCode(subFolder, `${currentPath}/${folder.name}`);
  }

  return code;
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

function getModifiedFilesCode(folder: Folder, modifiedFiles: string[], currentPath = ''): string {
  let code = '';
  const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name;

  // Iterate over each file in the folder
  for (const file of folder.files) {
    const filePath = `${folderPath}/${file.name}`;

    // Check if the constructed file path is in the modified files list
    if (modifiedFiles.includes(filePath)) {
      const lines = file.content.split('\n');
      const numberedLines = lines.map((line, index) => `${index + 1}: ${line}`).join('\n');
      code += `\n\n## ${filePath}\n\n\`\`\`\n${numberedLines}\n\`\`\`\n`;
    }
  }

  // Recursively process subfolders, passing down the accumulated path
  for (const subFolder of folder.subFolders) {
    code += getModifiedFilesCode(subFolder, modifiedFiles, folderPath);
  }

  return code;
}







/**
 * Delays the execution for the specified number of milliseconds.
 *
 * @param ms - Milliseconds to wait.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
