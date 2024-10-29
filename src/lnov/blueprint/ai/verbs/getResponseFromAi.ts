import { GoogleGenerativeAI, ChatSession, GenerateContentResult } from '@google/generative-ai';
import { Dependencies } from '../../../../utils/types/dependencies';

export default function getResponseFromAi(d: Dependencies) {
  let chatSession: ChatSession | undefined;

  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Replace with the appropriate model
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
      chatSession = undefined; // Reset chat history
    } else if (!chatSession) {
      chatSession = model.startChat({ generationConfig }); // Initialize chat session
    }

    if (!chatSession) {
      throw new Error("Failed to create chat session");
    }

    const result: GenerateContentResult = await chatSession.sendMessage(prompt);
    const generatedText = result.response.text();

    return generatedText;
  };
}