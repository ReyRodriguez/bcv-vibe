
import { GoogleGenAI } from "@google/genai";
import { ExchangeRate, GroundingSource } from "../types";

export const fetchLatestRates = async (): Promise<ExchangeRate> => {
  // Según las guías del SDK, debemos usar process.env.API_KEY directamente.
  // Es vital realizar un "Redeploy" en Vercel tras añadir la variable.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY no detectada. Por favor: 1. Verifica que la variable se llame API_KEY en Vercel. 2. Haz un 'Redeploy' manual del proyecto.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const prompt = `
      Act as a Venezuelan Financial Analyst. Provide the MOST RECENT exchange rates for TODAY.
      
      SEARCH TASKS:
      1. Find the official USD/VES rate from Banco Central de Venezuela (BCV).
      2. Find the current average price for USDT/VES on the Binance P2P market in Venezuela.

      Format the response strictly as valid JSON:
      {
        "bcv_rate": number,
        "binance_rate": number,
        "date": "string current time",
        "bcv_source": "string url"
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

    const textResponse = response.text || '';
    const jsonString = textResponse.replace(/```json|```/g, '').trim();
    const result = JSON.parse(jsonString);
    
    // Extracción obligatoria de Grounding Chunks para cumplir con las políticas de Google Search
    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "Fuente de verificación",
            uri: chunk.web.uri
          });
        }
      });
    }

    const data: ExchangeRate = {
      rate: result.bcv_rate,
      parallelRate: result.binance_rate,
      date: result.date || new Date().toLocaleString('es-VE'),
      source: "BCV",
      parallelSource: "Binance P2P",
      sourceUrl: result.bcv_source || "https://www.bcv.org.ve/",
      groundingSources: groundingSources.length > 0 ? groundingSources : undefined
    };

    localStorage.setItem('last_known_rates', JSON.stringify(data));
    return data;

  } catch (error: any) {
    console.error("Error en geminiService:", error);
    const cached = localStorage.getItem('last_known_rates');
    if (cached) return JSON.parse(cached);
    throw new Error(error?.message || "Error al conectar con la IA. Revisa tu cuota de API o conexión.");
  }
};
