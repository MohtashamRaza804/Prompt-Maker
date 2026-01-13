import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    mainPrompt: {
      type: Type.STRING,
      description: "A comprehensive, high-quality prompt describing the image for recreation.",
    },
    negativePrompt: {
      type: Type.STRING,
      description: "A list of negative terms to avoid unwanted artifacts (e.g., blurry, low quality, distorted).",
    },
    variations: {
      type: Type.OBJECT,
      properties: {
        minimal: { type: Type.STRING, description: "A short, concise version of the prompt." },
        balanced: { type: Type.STRING, description: "A balanced amount of detail." },
        detailed: { type: Type.STRING, description: "Extremely detailed description of every element." },
        cinematic: { type: Type.STRING, description: "Focused on lighting, camera angles, and atmosphere." },
        artistic: { type: Type.STRING, description: "Focused on style, medium, and artistic techniques." },
      },
      required: ["minimal", "balanced", "detailed", "cinematic", "artistic"],
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of relevant style tags, subjects, and keywords.",
    },
    attributes: {
      type: Type.OBJECT,
      properties: {
        lighting: { type: Type.NUMBER, description: "Score 0-100 for lighting intensity/importance." },
        complexity: { type: Type.NUMBER, description: "Score 0-100 for visual complexity." },
        vibrancy: { type: Type.NUMBER, description: "Score 0-100 for color vibrancy." },
        realism: { type: Type.NUMBER, description: "Score 0-100 for photorealism level." },
        artistic: { type: Type.NUMBER, description: "Score 0-100 for artistic stylization." },
      },
      required: ["lighting", "complexity", "vibrancy", "realism", "artistic"],
    },
    modelAdvice: {
      type: Type.OBJECT,
      properties: {
        sdxl: { type: Type.STRING, description: "Prompt formatted specifically for Stable Diffusion XL with recommended settings." },
        midjourney: { type: Type.STRING, description: "Prompt formatted for Midjourney including --ar (aspect ratio) and style parameters." },
        gemini: { type: Type.STRING, description: "A natural language descriptive prompt optimized for Gemini generation." },
      },
      required: ["sdxl", "midjourney", "gemini"],
    },
  },
  required: ["mainPrompt", "negativePrompt", "variations", "tags", "attributes", "modelAdvice"],
};

export const generatePromptFromImage = async (base64Image: string, mimeType: string): Promise<PromptResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this image and generate a highly detailed prompt reproduction suite. 
            Act as an expert photographer and prompt engineer. 
            Identify the subject, medium, style, lighting, color palette, and composition.
            Provide specific formatting for SDXL and Midjourney (calculate the aspect ratio from the image if possible).`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are Prompt Maker, an advanced AI that reverse-engineers images into text prompts.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");

    const result = JSON.parse(text) as PromptResult;
    return { ...result, timestamp: Date.now() };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
