import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInteriorImage = async (base64Image: string, mimeType: string = "image/jpeg"): Promise<AnalysisResult> => {
  try {
    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const model = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this interior design image. 
            1. Identify the specific Design Style (e.g., Scandinavian, Industrial, Mid-Century Modern, etc.).
            2. Provide a brief, engaging description of the style elements present in the room (max 2 sentences).
            3. Generate a 'Shopping List' of 5-8 items that are either visible in the photo or would perfectly complement this specific style. Include estimated prices in USD.
            
            Return the result in strictly structured JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            designStyle: {
              type: Type.STRING,
              description: "The primary interior design style identified.",
            },
            description: {
              type: Type.STRING,
              description: "A short description of the room's style and atmosphere.",
            },
            shoppingList: {
              type: Type.ARRAY,
              description: "A list of recommended furniture and decor items.",
              items: {
                type: Type.OBJECT,
                properties: {
                  itemName: { type: Type.STRING },
                  category: { type: Type.STRING, description: "e.g., Furniture, Lighting, Decor, Textiles" },
                  recommendation: { type: Type.STRING, description: "Specific material or color recommendation (e.g., 'Oak Wood', 'Matte Black Metal')" },
                  estimatedPrice: { type: Type.STRING, description: "Estimated price range (e.g., '$150 - $300')" },
                },
                required: ["itemName", "category", "recommendation", "estimatedPrice"],
              },
            },
          },
          required: ["designStyle", "description", "shoppingList"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};
