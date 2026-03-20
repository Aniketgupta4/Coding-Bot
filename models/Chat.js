import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Conversation" },
    messages: [
        {
            role: { type: String, enum: ["user", "assistant"] },
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);