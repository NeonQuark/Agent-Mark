
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
        return new Response(error instanceof Error ? error.message : 'Unknown error', { status: 500 });
    }
}
