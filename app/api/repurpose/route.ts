
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        const result = await streamText({
            model: google('models/gemini-1.5-pro'),
            system: `You are an expert social media strategist.
      
      Your goal: Transform the user's input into a high-engagement Twitter/X thread.
      
      Structure:
      1. HOOK: The first tweet must be engaging and stop the scroll.
      2. BODY: Break concepts into punchy, readable tweets.
      3. CLOSING: Summarize and ask a question.
      
      Tone: Concise, professional yet conversational. NO hashtags in sentences.
      Format: "1/ ...", "2/ ...".
      `,
            prompt: prompt,
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('Error in repurpose:', error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown server error' }), { status: 500 });
    }
}
