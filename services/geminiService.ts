
import { GoogleGenAI } from "@google/genai";
import { ExchangeRate } from "../types";

export const fetchLatestBCVRate = async (): Promise<ExchangeRate> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const prompt = "What is the official exchange rate for USD to VES (Bolivares) according to the Central Bank of Venezuela (BCV) website (bcv.org.ve) today? Please provide only the numerical rate and the date of publication. Format your response as a valid JSON with keys: 'rate' (number), 'date' (string), 'source_url' (string).";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    // Extract grounding URLs if available
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceUrl = result.source_url || (groundingSources[0] as any)?.web?.uri || "https://www.bcv.org.ve/";

    return {
      rate: result.rate || 0,
      date: result.date || new Date().toLocaleDateString(),
      source: "Banco Central de Venezuela",
      sourceUrl: sourceUrl
    };
  } catch (error) {
    console.error("Error fetching rate via Gemini:", error);
    // Fallback or re-throw
    throw error;
  }
};
