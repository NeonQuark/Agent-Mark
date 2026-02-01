
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Received request body:', JSON.stringify(body));

        const prompt = body.prompt;
        console.log('Extracted prompt:', prompt);

        if (!prompt) {
            console.error('No prompt provided!');
            return new Response('Prompt is required', { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = `You are an expert social media strategist.

Your goal: Transform the user's input into a high-engagement Twitter/X thread.

Structure:
1. HOOK: The first tweet must be engaging and stop the scroll.
2. BODY: Break concepts into punchy, readable tweets.
3. CLOSING: Summarize and ask a question.

Tone: Concise, professional yet conversational. NO hashtags in sentences.
Format: "1/ ...", "2/ ...".

IMPORTANT: Create a UNIQUE thread based on THIS specific input. Do not use generic templates.`;

        const fullPrompt = `${systemPrompt}\n\nUser input: ${prompt}\n\nTimestamp: ${Date.now()}`;
        console.log('Sending to Gemini, prompt length:', fullPrompt.length);

        const result = await model.generateContentStream(fullPrompt);

        // Create a ReadableStream from the Gemini stream (same pattern as generate-campaign)
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let chunkCount = 0;
                for await (const chunk of result.stream) {
                    const text = chunk.text();
                    chunkCount++;
                    console.log(`Chunk ${chunkCount}:`, text.substring(0, 50));
                    controller.enqueue(encoder.encode(text));
                }
                console.log(`Total chunks sent: ${chunkCount}`);
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error: any) {
        console.error('Error in repurpose:', error);
        return new Response(JSON.stringify({ error: error.message || 'Unknown server error' }), { status: 500 });
    }
}
