
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const idea = body.idea || body.description || body.prompt;

        if (!idea) {
            return new Response(JSON.stringify({ error: 'Business description is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('🚀 [API] Campaign Generation for:', idea.substring(0, 50));

        // Use generateObject instead of streamObject for complete response
        const result = await generateObject({
            model: google('models/gemini-3-flash-preview'),
            schema: z.object({
                landingPageCode: z.string().describe("Complete React component code for a landing page. Use Tailwind CSS. Do NOT use external images."),
                tweets: z.array(z.string()).describe("List of 5 viral tweets promoting this business. Include emojis."),
                marketingAngle: z.string().describe("A short marketing strategy explanation."),
            }),
            system: `You are an expert frontend developer and growth marketer.
            Create a stunning dark-themed landing page (React + Tailwind) and promotional tweets.
            Use dark backgrounds (zinc-950), glowing accents, and modern typography.`,
            prompt: `Create a launch package for: ${idea}`,
        });

        // Return complete JSON response
        return new Response(JSON.stringify(result.object), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Error in generate-campaign:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate campaign' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
