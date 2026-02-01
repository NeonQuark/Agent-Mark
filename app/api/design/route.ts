
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        // Switch to 'gemini-pro' (stable) to avoid 404 errors
        const result = await streamText({
            model: google('models/gemini-pro'),
            system: `You are an expert Frontend Developer and UI/UX Designer.
      
      Your goal: specific tailored React + Tailwind CSS code based on the user's request.
      
      Rules:
      - Return ONLY the code for the component.
      - Use 'lucide-react' for icons.
      - Use standard Tailwind utility classes.
      - Ensure the design is modern, clean, and responsive.
      - Do not include 'import React' if not needed (Next.js/React 19).
      - If multiple files are needed, strict to one file or provide the main logical component.
      - The component should be exported as default.
      - Do not wrap in markdown code blocks like \`\`\`tsx ... \`\`\`. Return raw text of the code if possible, or if you must, use strictly one block.
      `,
            prompt: `Design a React component for: ${prompt}`,
        });

        // Manual streaming (Nuclear Option)
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk));
                    }
                    controller.close();
                } catch (err) {
                    console.error('Stream processing error:', err);
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
        console.error('Error in design:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate design' }), { status: 500 });
    }
}
