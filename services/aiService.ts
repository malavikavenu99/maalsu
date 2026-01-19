
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  generateMotivation: async (teamName: string, score: number) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a high-energy IEEE event host. Give a short, witty, and highly motivating one-sentence pep talk to a team called "${teamName}" who currently has ${score} points. Keep it professional but exciting.`,
        config: {
          temperature: 0.8,
          maxOutputTokens: 100,
        }
      });
      return response.text || "Keep pushing forward, team! You're doing great!";
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return "The true IEEE spirit is perseverance. Keep solving!";
    }
  }
};
