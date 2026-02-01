
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const idea = body.idea || body.description || body.prompt;

        if (!idea) {
            return new Response('Business description is required', { status: 400 });
        }

        console.log('🚀 [API] Campaign Generation for:', idea.substring(0, 50));

        const result = await streamObject({
            model: google('models/gemini-2.5-flash-lite'),
            schema: z.object({
                landingPageCode: z.string().describe("Complete, single-file React component code for a high-conversion landing page. Use Tailwind CSS. Use lucide-react icons. Do NOT use external images, use placeholders or divs. Interactive elements (buttons) should look clickable."),
                tweets: z.array(z.string()).describe("List of 5 viral tweets promoting this business. Include emojis but NO hashtags."),
                marketingAngle: z.string().describe("A short 1-sentence explanation of the marketing strategy used."),
            }),
            system: `You are an expert full-stack developer and growth marketer.
            Your task is to take a business idea and generate BOTH:
            1. A stunning, dark-themed, "techy" landing page (React + Tailwind).
            2. A series of punchy launch tweets.

            The design should be premium, using dark backgrounds (zinc-950), glowing accents, and crisp typography.
            Pass the code as a simple string in 'landingPageCode'.`,
            prompt: `Create a launch package for: ${idea}`,
        });

        // For useObject hook, we need to return the partialObjectStream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const partialObject of result.partialObjectStream) {
                        // Send each partial object as JSON
                        const data = JSON.stringify(partialObject);
                        controller.enqueue(encoder.encode(data + '\n'));
                    }
                    controller.close();
                } catch (err) {
                    console.error('Stream error:', err);
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
