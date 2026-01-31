
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

        // Fallback for Demo if Quota Exceeded
        const mockResponse = `
# 🚀 Launch: The Future of Productivity

## 1. Headline & Value Prop
**Headline:** Reclaim Your Time. Master Your Flow.
**Subheader:** The all-in-one workspace that adapts to your brain, not the other way around. Stop fighting your tools and start building your legacy.

## 2. Social Media Plan
**Twitter Thread:**
1/5 Feeling overwhelmed? You're not alone. The modern stack is broken. 🛑
2/5 We built a tool that thinks like you do. Fluid, fast, and distraction-free. 🧠
3/5 "It's like an extension of my mind." - Early Beta User 💭
4/5 Join the revolution. Sign up for early access today. 👇
5/5 [Link] #Productivity #FutureOfWork

**LinkedIn Post:**
Work shouldn't feel like a battle against your inbox.
Introducing [Project Name], the intelligent workspace designed for deep work.
We are rethinking how teams collaborate, removing the noise, and amplifying the signal.
Join us on this journey. Link in comments. 👇

## 3. Landing Page Structure
1. **Hero Section**: High-impact visual of the dashboard with a "Get Started" CTA.
2. **The Problem**: Show the chaos of current tools (too many tabs, notifications).
3. **The Solution**: Feature breakdown (Focus Mode, AI Assistant, Seamless Sync).
4. **Social Proof**: Testimonials from high-performing founders.
5. **Final CTA**: "Join the exclusive waitlist" with an email capture form.
`;

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const chunks = mockResponse.split(/(?=[ #\n])/); // Split by reasonable chunks
                for (const chunk of chunks) {
                    controller.enqueue(encoder.encode(chunk));
                    await new Promise(r => setTimeout(r, 20)); // Fast typing
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
