import dotenv from "dotenv";
dotenv.config(); 

import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not found in environment variables");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function askGemini(message) {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: `
            You are a programming tutor.
            Only answer coding related questions.
            Answer concisely using first principles.
            `
        }
    });

    const res = await chat.sendMessage({ message });
    return res.text;
}
