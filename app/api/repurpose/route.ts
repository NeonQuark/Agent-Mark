
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        const result = await streamText({
            model: google('models/gemini-1.5-pro'),
            system: `You are a world-class social media ghostwriter and strategist known for going viral.
      
      Your goal: Transform the user's input (article, idea, or text) into a high-engagement Twitter/X thread.
      
      Structure:
      1. HOOK: The first tweet must be a scroll-stopper. Use a controversial statement, a surprising statistic, or a strong promise. NO generic openings like "Here's a thread about...".
      2. BODY: Break concepts into punchy, readable tweets. 1 idea per tweet. Use whitespace effectively.
      3. CLOSING: Summarize the key takeaway and ask a question to drive engagement.
      
      Tone:
      - Concise but impactful.
      - Authority-driven yet conversational.
      - Use arrows (→) or bullet points for lists.
      - No hashtags in the middle of sentences.
      
      Format:
      Return the response as a clear sequence of tweets, each separated by "---" so the frontend can split them easily if needed, or just standard numbering "1/" "2/". Let's use "1/", "2/" format.
      `,
            prompt: prompt,
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error('Error in repurpose:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500 });
    }
}
