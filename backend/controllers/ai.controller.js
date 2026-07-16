import { generateResult } from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const {
      prompt,
      projectName = "",
      contextFiles = [],
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const result = await generateResult({
      prompt,
      projectName,
      contextFiles,
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};