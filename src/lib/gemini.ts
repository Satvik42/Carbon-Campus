import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export interface GeminiHistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function askGemini(prompt: string, history: GeminiHistoryMessage[] = []) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const maxRetries = 3;
  let delay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: `You are the Carbon Compass Decision Assistant, a leading climate-tech specialist and friendly expert.
Your job is to analyze the environmental impact of user decisions, scenarios, and questions.

Format guidelines:
1. You MUST always output a single, valid JSON object.
2. Never prefix or suffix the JSON with any text or markdown ticks.
3. Be encouraging and scientific. Maintain the tone of a professional, modern climate tech product.
4. Keep explanations concise (2-4 sentences max). Translate complex science into real-world insights.
5. In 'recommendations', provide 2-3 clear, actionable next steps.

JSON schema to strictly follow:
{
  "scenario": "Brief title of the decision",
  "impactLevel": "low" | "medium" | "high",
  "estimatedCO2Saved": "Estimate with units (e.g. '15kg CO2/week' or '450kg CO2/year')",
  "confidence": "high" | "medium" | "low",
  "explanation": "A concise, engaging scientific explanation of the carbon impact.",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              scenario: { type: 'string' },
              impactLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
              estimatedCO2Saved: { type: 'string' },
              confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
              explanation: { type: 'string' },
              recommendations: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['scenario', 'impactLevel', 'estimatedCO2Saved', 'confidence', 'explanation', 'recommendations']
          }
        }
      });

      if (!response.text) {
        throw new Error('Received empty response from Gemini model');
      }

      return response.text;
    } catch (error: any) {
      const isUnavailable = error?.status === 'UNAVAILABLE' || error?.message?.includes('503') || error?.message?.includes('high demand') || error?.message?.includes('UNAVAILABLE');
      const isRateLimited = error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      
      if ((isUnavailable || isRateLimited) && attempt < maxRetries) {
        console.warn(`Gemini API call failed (attempt ${attempt}/${maxRetries}) with error: ${error?.message || error}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw error;
    }
  }
  throw new Error('Failed to generate content after retries.');
}
export default askGemini;
