
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        console.log('🚀 [API] Repurpose request received. Prompt length:', prompt?.length);
        console.log('Using model: models/gemini-2.5-flash');

        // Updated to available model in 2026
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
            prompt: prompt,
        });

        console.log('StreamText initialized successfully');

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                console.log('Starting stream iteration');
                try {
                    let chunkCount = 0;
                    for await (const chunk of result.textStream) {
                        chunkCount++;
                        controller.enqueue(encoder.encode(chunk));
                    }
                    console.log('Stream finished. Total chunks:', chunkCount);
                    controller.close();
                } catch (err) {
                    console.error('Stream processing error:', err);
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
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate thread' }), { status: 500 });
    }
}
