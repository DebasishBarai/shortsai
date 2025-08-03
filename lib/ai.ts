import { GoogleGenAI } from "@google/genai"

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateContent({ prompt }: { prompt: string }) {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        }
      }
    })

    return response.text
  } catch (err) {
    return err
  }
}
