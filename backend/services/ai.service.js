import { GoogleGenAI } from "@google/genai";
import systemInstruction from "../config/systemInstruction.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateResult = async ({
  prompt,
  projectName,
  fileTree,
}) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
${systemInstruction}

Current Project:
${projectName}

Current Workspace:
${JSON.stringify(fileTree, null, 2)}

User:
${prompt}
`,
  });

  try {
    const cleaned = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Response Parse Error:", error);
    console.log("Raw AI Response:", response.text);

    return {
      text: response.text,
      fileTree: {},
      buildCommand: null,
      startCommand: null,
    };
  }
};