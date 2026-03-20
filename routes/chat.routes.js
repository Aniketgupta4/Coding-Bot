import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { renderChat, newChat, sendMessage, getChatById, deleteChat, renameChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/chat", isAuth, renderChat);
router.get("/chat/history/:id", isAuth, getChatById);
router.post("/chat/new", isAuth, newChat);
router.post("/chat/send", isAuth, sendMessage);
router.delete("/chat/:id", isAuth, deleteChat);
router.patch("/chat/rename/:id", isAuth, renameChat);

export default router;