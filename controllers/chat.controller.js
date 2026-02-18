import Chat from "../models/Chat.js";
import { askGemini } from "../services/gemini.service.js";

export const renderChat = async (req, res) => {
    const chats = await Chat.find({ user: req.session.userId });
    res.render("chat", { chats });
};

export const newChat = async (req, res) => {
    const chat = await Chat.create({
        user: req.session.userId,
        messages: []
    });
    res.json({ chatId: chat._id });
};

export const sendMessage = async (req, res) => {
    const { message, chatId } = req.body;

    const chat = await Chat.findById(chatId);

    chat.messages.push({ role: "user", text: message });

    const reply = await askGemini(message);

    chat.messages.push({ role: "assistant", text: reply });
    await chat.save();

    res.json({ reply });
};
