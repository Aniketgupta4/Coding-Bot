import Chat from "../models/Chat.js";
import { askGemini } from "../services/gemini.service.js";

export const renderChat = async (req, res) => {
    // History fetch from DB
    const history = await Chat.find({ user: req.session.userId }).sort({ updatedAt: -1 });
    res.render("chat", { history });
};

export const getChatById = async (req, res) => {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.user.toString() !== req.session.userId) return res.status(403).json({ error: "Unauthorized" });
    res.json(chat);
};

export const newChat = async (req, res) => {
    const chat = await Chat.create({ user: req.session.userId, messages: [] });
    res.json({ chatId: chat._id });
};

export const sendMessage = async (req, res) => {
    const { message, chatId } = req.body;
    let chat = await Chat.findById(chatId);

    if (chat.messages.length === 0) {
        chat.title = message.substring(0, 30); 
    }

    chat.messages.push({ role: "user", text: message });
    const reply = await askGemini(message);
    chat.messages.push({ role: "assistant", text: reply });
    
    await chat.save();
    res.json({ reply });
};

export const deleteChat = async (req, res) => {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};

export const renameChat = async (req, res) => {
    await Chat.findByIdAndUpdate(req.params.id, { title: req.body.title });
    res.json({ success: true });
};