
import { GoogleGenAI } from "@google/genai";
import { ExchangeRate, GroundingSource } from "../types";

export const fetchLatestRates = async (): Promise<ExchangeRate> => {
  // Intentamos obtener la clave de forma segura sin romper el hilo de ejecución
  let apiKey: string | undefined;
  
  try {
    // 1. Intentamos acceso directo (inyectado por builders como Vite/Esbuild)
    apiKey = process.env.API_KEY;
    
    // 2. Si no existe, buscamos en el objeto global (posible shim de la plataforma)
    if (!apiKey && typeof window !== 'undefined') {
      apiKey = (window as any).process?.env?.API_KEY || (window as any).API_KEY;
    }
  } catch (e) {
    console.warn("No se pudo acceder al objeto process.");
  }

  if (!apiKey) {
    throw new Error(
      "ERROR: API_KEY no encontrada en el navegador.\n\n" +
      "Si estás en Vercel:\n" +
      "1. Verifica que añadiste 'API_KEY' en Environment Variables.\n" +
      "2. ¡IMPORTANTE! Debes ir a 'Deployments' y hacer un 'Redeploy' manual para que los cambios surtan efecto."
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const prompt = `
      Act as a Venezuelan Financial Analyst. Find the MOST RECENT exchange rates for TODAY.
      
      SEARCH TASKS:
      1. Official USD/VES rate from Banco Central de Venezuela (BCV).
      2. Average price for USDT/VES on Binance P2P Venezuela.

      Return ONLY a JSON object:
      {
        "bcv_rate": number,
        "binance_rate": number,
        "date": "string iso date",
        "bcv_source": "https://www.bcv.org.ve/"
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
    
    // Extracción de Grounding (Obligatorio)
    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "Fuente oficial",
            uri: chunk.web.uri
          });
        }
      });
    }

    const data: ExchangeRate = {
      rate: result.bcv_rate,
      parallelRate: result.binance_rate,
      date: result.date || new Date().toISOString(),
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
    throw new Error(error?.message || "Error al conectar con la IA de Google.");
  }
};
