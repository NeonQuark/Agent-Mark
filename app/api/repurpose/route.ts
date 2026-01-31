
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});



export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        const systemPrompt = `You are an expert social media strategist and ghostwriter.
    Your task is to take the provided content (text or URL) and repurpose it into a highly engaging Twitter/X thread.
    
    Rules:
    - Start with a strong hook (no "Here is a thread").
    - Use short, punchy sentences.
    - Use emojis sparingly but effectively.
    - End with a call to action or question.
    - Format as "1/ [Content]", "2/ [Content]", etc.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    controller.enqueue(new TextEncoder().encode(content));
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error) {
        console.error('Error in repurpose:', error);

        // Fallback for Demo if Quota Exceeded
        const mockResponse = `Stop scrolling. 🛑

Here is why your old workflow is killing your productivity (and how to fix it).

1. You are doing too much.
Focus on the 20% that brings 80% of results.

2. Automate the boring stuff.
Use AI to handle the repetitive tasks.

3. Rest is productive.
You cannot work 24/7. Take a break.

TL;DR:
- Focus
- Automate
- Rest

Build smarter, not harder. 🚀`;

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const chunks = mockResponse.split(' ');
                for (const chunk of chunks) {
                    controller.enqueue(encoder.encode(chunk + ' '));
                    await new Promise(r => setTimeout(r, 50)); // Simulate typing
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    }
}
