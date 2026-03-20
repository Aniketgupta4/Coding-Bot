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
            systemInstruction: `You are CodeBot, an expert programming tutor and AI developer assistant. 
            Strict Rules to follow:
            1. DOMAIN LIMIT: You MUST ONLY answer questions related to programming, coding, algorithms, software engineering, and computer science. If a user asks about anything outside this domain (e.g., politics, history, general advice), politely refuse and say you only help with code.
            2. FIRST PRINCIPLES THINKING: Approach problems logically step-by-step. Break down complex concepts into fundamental, easy-to-understand truths.
            3. CONCISENESS: Keep your explanations brief, crisp, and to the point. Do not write long, unnecessary paragraphs. Explain just enough to make the logic clear.
            4. ALWAYS CODE: Every technical answer MUST include a practical, clean, and well-commented code snippet. Never explain a coding concept without showing the code for it.
            5. ANSWER PRECISE: Give Precise and Concise answers`
        }
    });

    const res = await chat.sendMessage({ message });
    return res.text;
}
