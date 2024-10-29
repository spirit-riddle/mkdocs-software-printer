import { Dependencies } from '../../../../utils/types/dependencies';

/**
 * Represents a Markdown block extracted from AI response.
 */
export interface MarkdownBlock {
  title: string;
  content: string;
}

/**
 * Extracts all markdown blocks from an AI response.
 *
 * @param aiResponse - The AI response containing code blocks.
 * @returns A promise that resolves to an array of MarkdownBlock objects.
 *
 * @example
 * ```typescript
 * const markdownBlocks = await blueprintAi.extractAllMarkdownBlocks(aiResponse);
 * console.log('Extracted Markdown Blocks:', markdownBlocks);
 * ```
 *
 * @category BlueprintAi
 */
export default function extractAllMarkdownBlocks(d: Dependencies) {
  return async function (aiResponse: string): Promise<MarkdownBlock[]> {
    const lines = aiResponse.split('\n');
    const markdownBlocks: MarkdownBlock[] = [];

    let currentTitle = '';
    let currentContent: string[] = [];
    let insideCodeBlock = false;

    // Iterate through each line of content
    for (const line of lines) {
      // Detect the start of a code block and extract the filename
      if (line.startsWith('```') && !insideCodeBlock) {
        currentTitle = line.replace('```', '').trim();
        currentContent = [];
        insideCodeBlock = true;
      }
      // Detect the end of a code block
      else if (line.startsWith('```') && insideCodeBlock) {
        if (currentTitle) {
          markdownBlocks.push({ title: currentTitle, content: currentContent.join('\n') });
        }
        insideCodeBlock = false;
      }
      // Accumulate lines for the current file content
      else if (insideCodeBlock) {
        currentContent.push(line);
      }
    }

    return markdownBlocks;
  };
}
