import { GoogleGenAI } from "@google/genai";
import systemInstruction from "../config/systemInstruction.js";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Extracts the first complete JSON object from a response.
 * Handles nested braces and braces inside strings safely.
 */
function extractBalancedJson(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;

      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

export const generateResult = async ({
  prompt,
  projectName,
  contextFiles = [],
}) => {
  const workspaceContext = `
Current Project:
${projectName}

The following files were retrieved using semantic search because they are the most relevant to the user's request.

Treat these files as the primary source of truth.

If the answer exists in these files:
- Base your answer on them.
- Preserve the existing architecture.
- Modify only the necessary files.

Relevant Files:

${contextFiles
  .map(
    (file) => `
====================================
File: ${file.path}

${file.content}
`
  )
  .join("\n")}
`;

  let response;

  try {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `
${systemInstruction}

${workspaceContext}

User:
${prompt}
`,
      });

      break;
    } catch (error) {
      
      if (
        (error.status === 429 ||
          error.status === 500 ||
          error.status === 503) &&
        attempt < 3
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
        );
        continue;
      }

      throw error;
    }
  }
} catch (error) {
    console.error("Gemini API Error:", error);

    if (error.status === 429) {
      return {
        text: `⚠️ Zenith has temporarily reached its AI usage limit.

Please try again later or use another Gemini API key.`,
        fileTree: {},
        buildCommand: null,
        startCommand: null,
      };
    }

    return {
      text: `⚠️ Zenith couldn't connect to the AI service.

Please try again in a few moments.`,
      fileTree: {},
      buildCommand: null,
      startCommand: null,
    };
  }

  const rawText = (response.text || "").trim();
  const finishReason = response.candidates?.[0]?.finishReason;

  // Conversation Mode
  if (!rawText.startsWith("{") && !rawText.startsWith("```")) {
    return {
      text: rawText,
      fileTree: {},
      buildCommand: null,
      startCommand: null,
    };
  }

  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonString = extractBalancedJson(cleaned);

  if (!jsonString) {
    console.error(
      "AI Response Parse Error: No balanced JSON found. Finish reason:",
      finishReason
    );

    console.log("Raw AI Response:", rawText);

    return {
      text:
        finishReason === "MAX_TOKENS"
          ? "The requested change is too large to generate in a single response. Try breaking it into smaller steps."
          : "I generated a response, but it wasn't in a format I could apply to your project. Please try again.",
      fileTree: {},
      buildCommand: null,
      startCommand: null,
    };
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Response Parse Error:", error);
    console.log("Raw AI Response:", rawText);

    return {
      text:
        "I generated a response, but it contained malformed JSON. Please try again.",
      fileTree: {},
      buildCommand: null,
      startCommand: null,
    };
  }
};