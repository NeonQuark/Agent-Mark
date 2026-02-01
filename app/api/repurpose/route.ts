
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

IMPORTANT: Create a UNIQUE thread based on the specific input provided.`,
            prompt: prompt,
        });

        // Manual streaming - compatible with all SDK versions
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk));
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error: any) {
        console.error('Error in repurpose:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate thread' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
