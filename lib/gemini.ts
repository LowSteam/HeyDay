import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY environment variable is required. Get a free key at https://aistudio.google.com");
  }
  return new GoogleGenerativeAI(key);
}

export function getChatModel() {
  return getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
}

export function getEmbeddingModel() {
  return getGenAI().getGenerativeModel({ model: "gemini-embedding-001" });
}

