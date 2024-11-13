// lnov/virtualFolder/ai/verbs/getResponseFromPlanningAi.ts

import { GoogleGenerativeAI, ChatSession, GenerateContentResult } from '@google/generative-ai';
import { Dependencies } from '../../../../utils/types/dependencies';

/**
 * Sends a prompt to the AI model and retrieves the response for planning tasks.
 * Allows for session history retention based on the `resetHistory` parameter.
 *
 * @param prompt - The prompt to send to the AI.
 * @param resetHistory - Whether to reset the chat history.
 * @returns A promise that resolves to the AI's response as a string.
 *
 * @example
 * ```typescript
 * const response = await virtualFolderAi.getResponseFromPlanningAi('Plan my tasks');
 * console.log('AI Response:', response);
 * ```
 *
 * @category VirtualFolderAI
 */
export default function getResponseFromPlanningAi(d: Dependencies) {
  let chatSession: ChatSession | undefined;

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

  return async function (prompt: string, resetHistory = false): Promise<string> {
    if (resetHistory) {
      chatSession = undefined;
    } else if (!chatSession) {
      chatSession = model.startChat({ generationConfig });
    }

    if (!chatSession) {
      throw new Error("Failed to create chat session");
    }

    const result: GenerateContentResult = await chatSession.sendMessage(prompt);
    const generatedText = result.response.text();

    return generatedText;
  };
}
