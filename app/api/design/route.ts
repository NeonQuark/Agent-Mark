
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
      - Actually, let's output raw code so the user can copy it directly or we might render it.
      
      But to be safe, wrap it in a standard markdown block \`\`\`tsx ... \`\`\` so we can parse it if we want to show it nicely.
      `,
            prompt: `Design a React component for: ${prompt}`,
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error('Error in design:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate design' }), { status: 500 });
    }
}
