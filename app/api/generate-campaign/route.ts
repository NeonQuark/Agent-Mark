
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});



export async function POST(req: Request) {
    try {
        const { idea, vibe } = await req.json();

        if (!idea) {
            return new Response('Idea is required', { status: 400 });
        }

        const prompt = `
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

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        // Create a ReadableStream from the OpenAI stream
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
        console.error('Error in generate-campaign:', error);
        return new Response('Error generating campaign', { status: 500 });
    }
}
