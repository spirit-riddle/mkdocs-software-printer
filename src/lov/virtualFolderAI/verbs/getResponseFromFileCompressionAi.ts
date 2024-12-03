// lnov/virtualFolder/ai/verbs/getResponseFromFileCompressionAi.ts

import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { Dependencies } from '../../../utils/types/dependencies';

/**
 * Sends a prompt to the AI model and retrieves the response for file compression.
 * This version does not retain history, so each prompt is stateless.
 *
 * @param prompt - The prompt to send to the AI.
 * @returns A promise that resolves to the AI's response as a string.
 *
 * @example
 * ```typescript
 * const response = await virtualFolderAi.getResponseFromFileCompressionAi('Compress this file');
 * console.log('AI Response:', response);
 * ```
 *
 * @category VirtualFolderAI
 */
export default function getResponseFromFileCompressionAi(d: Dependencies) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  return async function (prompt: string): Promise<string> {
    // Start a new chat session for each prompt to ensure no history is retained
    const chatSession = model.startChat({ generationConfig });

    if (!chatSession) {
      throw new Error("Failed to create chat session");
    }

    const result: GenerateContentResult = await chatSession.sendMessage(prompt);
    const generatedText = result.response.text();

    return generatedText;
  };
}
