
import { GoogleGenAI } from "@google/genai";
import { ExchangeRate } from "../types";

export const fetchLatestRates = async (): Promise<ExchangeRate> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const prompt = `
      Act as a Venezuelan Financial Analyst. Provide the MOST RECENT exchange rates for TODAY.
      
      SEARCH TASKS:
      1. Find the official USD/VES rate from Banco Central de Venezuela (BCV).
      2. Find the current average SELL price for USDT/VES on the Binance P2P market (Venezuela). 
         Note: The user reports the rate is currently around 655 VES/USDT. Verify this value.

      Format the response strictly as valid JSON (no markdown blocks, no extra text):
      {
        "bcv_rate": number,
        "binance_rate": number,
        "date": "string with current time",
        "bcv_source": "string url",
        "parallel_source": "string name (e.g., Binance P2P / Monitor Dolar)"
      }
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    // Limpieza de la respuesta para asegurar que solo procesamos el JSON
    const textResponse = response.text || '';
    const jsonString = textResponse.replace(/```json|```/g, '').trim();
    const result = JSON.parse(jsonString);
    
    if (!result.bcv_rate || !result.binance_rate) {
      throw new Error("La IA no pudo encontrar datos completos.");
    }

    const data: ExchangeRate = {
      rate: result.bcv_rate,
      parallelRate: result.binance_rate,
      date: result.date || new Date().toLocaleString('es-VE'),
      source: "BCV",
      parallelSource: result.parallel_source || "Binance P2P",
      sourceUrl: result.bcv_source || "https://www.bcv.org.ve/"
    };

    localStorage.setItem('last_known_rates', JSON.stringify(data));
    return data;

  } catch (error: any) {
    console.error("Error en geminiService:", error);
    const cached = localStorage.getItem('last_known_rates');
    if (cached) {
      console.warn("Retornando datos de caché debido a error.");
      return JSON.parse(cached);
    }
    throw new Error(error?.message || "Error al conectar con el servicio de tasas.");
  }
};
