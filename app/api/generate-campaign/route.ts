
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Allow 'idea' or 'prompt' or 'description'
        const idea = body.idea || body.description || body.prompt;

        if (!idea) {
            return new Response('Business description is required', { status: 400 });
        }

        console.log('🚀 [API] Campaign Generation for:', idea.substring(0, 50));

        // Use streamObject for structured output (Code + Tweets)
        // Using "gemini-2.5-flash" as verified working (with new key)
        const result = await streamObject({
            model: google('models/gemini-2.5-flash'),
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

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('Error in generate-campaign:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate campaign' }), { status: 500 });
    }
}
