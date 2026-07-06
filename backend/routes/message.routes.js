import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:projectId", authUser, getMessages);

export default router;