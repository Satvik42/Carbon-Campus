import { NextResponse } from 'next/server';
import { z } from 'zod';
import { askGemini, GeminiHistoryMessage } from '../../../lib/gemini';

export const maxDuration = 60;

// Input validation schema using Zod
const requestBodySchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1)
    })
  ).optional()
});

/**
 * Sanitizes input text to reduce risk of XSS or malformed inputs.
 */
function sanitizeMessage(text: string): string {
  // Strip HTML elements
  return text.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Validate request payload
    const parseResult = requestBodySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { message, history = [] } = parseResult.data;
    const sanitizedMessage = sanitizeMessage(message);

    // Map chat history to Gemini role format ('assistant' -> 'model')
    const geminiHistory: GeminiHistoryMessage[] = history.map((chat) => ({
      role: chat.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: chat.content }]
    }));

    // Check for API key presence
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured on the server.' },
        { status: 500 }
      );
    }

    // Call Gemini assistant
    const rawResponse = await askGemini(sanitizedMessage, geminiHistory);
    
    // Parse response to guarantee it matches expected JSON schema
    try {
      const parsedData = JSON.parse(rawResponse);
      return NextResponse.json(parsedData, { status: 200 });
    } catch (parseErr) {
      console.error('Failed to parse Gemini output as JSON:', rawResponse, parseErr);
      return NextResponse.json(
        {
          scenario: 'Uncertain Decision',
          impactLevel: 'low',
          estimatedCO2Saved: 'Unknown',
          confidence: 'low',
          explanation: 'The assistant response could not be parsed successfully.',
          recommendations: ['Please try rephrasing your decision or asking again.']
        },
        { status: 200 } // Return fallback mock matching the schema rather than failing the UI
      );
    }
  } catch (error: any) {
    console.error('API Error in Carbon Assistant Route:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
