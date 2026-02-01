
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { idea, vibe } = body;

        if (!idea) {
            return new Response('Idea is required', { status: 400 });
        }

        const systemPrompt = `
      Act as a world-class marketing strategist.
      Create a launch campaign for the following project:
      
      Project Idea: "${idea}"
      Vibe/Tone: "${vibe}"
      
      Output exactly 3 sections in markdown format:
      1. **Headline & Value Prop**: A catchy H1 and subheader.
      2. **Social Media Plan**: 3 tweet ideas and 1 LinkedIn post concept.
      3. **Landing Page Structure**: 5 key sections to include.
      
      Do not include any conversational filler. Just the output.
    `;

        // Updated to available model in 2026
        const result = await streamText({
            model: google('models/gemini-2.5-flash'),
            messages: [{ role: 'user', content: systemPrompt }],
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk));
                    }
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
        console.error('Error in generate-campaign:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate campaign' }), { status: 500 });
    }
}
