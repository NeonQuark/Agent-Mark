
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return new Response('Topic is required', { status: 400 });
        }

        console.log('🚀 [API] SEO Brief request for:', topic);

        const result = await streamObject({
            model: google('models/gemini-2.0-flash'),
            schema: z.object({
                targetKeyword: z.string().describe("The primary keyword to target"),
                secondaryKeywords: z.array(z.string()).describe("List of 5-7 secondary/related keywords"),
                searchIntent: z.string().describe("The search intent: informational, transactional, navigational, or commercial"),
                suggestedWordCount: z.number().describe("Recommended word count based on topic complexity"),
                metaTitle: z.string().describe("SEO-optimized meta title under 60 characters"),
                metaDescription: z.string().describe("Compelling meta description under 160 characters"),
                outline: z.array(z.object({
                    heading: z.string(),
                    type: z.enum(["h1", "h2", "h3"]),
                    notes: z.string().optional(),
                })).describe("Content outline with headings and optional notes"),
                peopleAlsoAsk: z.array(z.string()).describe("5 'People Also Ask' style questions to answer in the content"),
                competitorInsights: z.string().describe("Brief advice on how to outrank competitors for this topic"),
            }),
            system: `You are an expert SEO strategist and content planner.
            
Your task is to generate a comprehensive SEO content brief that will help a writer create content that ranks #1 on Google.

Be specific, actionable, and data-driven in your recommendations.
The outline should be detailed enough to guide a writer but flexible enough for creativity.
Focus on user intent and providing genuine value to readers.`,
            prompt: `Create a complete SEO brief for content about: "${topic}"`,
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('Error in SEO brief:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate SEO brief' }), { status: 500 });
    }
}
