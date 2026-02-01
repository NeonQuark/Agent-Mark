
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // useCompletion sends { prompt: "..." } by default
        const prompt = body.prompt || body.content || body;

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        console.log('🚀 [API] Repurpose request received. Prompt:', typeof prompt === 'string' ? prompt.substring(0, 50) : 'object');

        const result = await streamText({
            model: google('models/gemini-2.5-flash'),
            system: `You are an expert social media strategist.

Your goal: Transform the user's input into a high-engagement Twitter/X thread.

Structure:
1. HOOK: The first tweet must be engaging and stop the scroll.
2. BODY: Break concepts into punchy, readable tweets.
3. CLOSING: Summarize and ask a question.

Tone: Concise, professional yet conversational. NO hashtags in sentences.
Format: "1/ ...", "2/ ...".

IMPORTANT: Create a UNIQUE thread based on the specific input provided.`,
            prompt: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
        });

        // Use text stream response for useCompletion hook
        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('Error in repurpose:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate thread' }), { status: 500 });
    }
}
