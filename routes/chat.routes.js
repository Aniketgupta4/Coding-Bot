import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { renderChat, newChat, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/chat", isAuth, renderChat);
router.post("/chat/new", isAuth, newChat);
router.post("/chat/send", isAuth, sendMessage);

export default router;
