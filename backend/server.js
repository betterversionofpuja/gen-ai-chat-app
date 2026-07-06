import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import app from "./app.js";
import projectModel from "./models/project.model.js";
import userModel from "./models/user.model.js";
import Message from "./models/message.model.js";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query?.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid project ID"));
    }

    const project = await projectModel.findById(projectId);

    if (!project) {
      return next(new Error("Project not found"));
    }

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user document since the JWT only contains the email
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.project = project;
    socket.user = user;

    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.join(socket.project._id.toString());

  socket.on("project-message", async (data) => {
    const message = await Message.create({
      project: socket.project._id,
      sender: socket.user._id,
      email: socket.user.email,
      message: data.message,
    });

    io.to(socket.project._id.toString()).emit("project-message", {
      ...message.toObject(),
      timestamp: message.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});