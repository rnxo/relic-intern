import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if(!apiKey) throw new Error("ai api key is not found");

export const genAI = new GoogleGenAI({apiKey});