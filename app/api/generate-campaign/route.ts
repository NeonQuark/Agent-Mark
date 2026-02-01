
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
                landingPageCode: z.string().describe("A complete React functional component for a landing page. MUST use Tailwind CSS inline classes like: bg-zinc-950, text-white, p-8, flex, etc. Include a hero section, features section, and CTA. Export as 'function LandingPage()'. NO TypeScript types. NO external images - use colored divs or emoji for visuals."),
                tweets: z.array(z.string()).describe("Exactly 5 viral promotional tweets. Include relevant emojis. No hashtags."),
                marketingAngle: z.string().describe("A one-sentence marketing strategy explanation."),
            }),
            system: `You are an expert React frontend developer. Generate a BEAUTIFUL landing page component.

CRITICAL REQUIREMENTS:
1. Use ONLY Tailwind CSS classes (bg-zinc-950, text-white, p-8, mx-auto, flex, grid, etc.)
2. Create a complete functional component: function LandingPage() { return (...) }
3. Dark theme: bg-zinc-950, bg-zinc-900 for cards, text-white, text-zinc-400 for secondary text
4. Add proper layout: max-w-6xl mx-auto, padding, responsive classes
5. Include: Hero section with headline + CTA button, Features grid, Call-to-action section, Footer
6. Make buttons styled: bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium
7. NO TypeScript, NO external images, NO imports (icons will be provided as globals)
8. Use gradient text for headlines: bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent

The page should look STUNNING and professional.`,
            prompt: `Create a premium landing page for: ${idea}`,
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
