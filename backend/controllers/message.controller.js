import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const messages = await Message.find({ project: projectId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};