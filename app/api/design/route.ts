
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response('Prompt is required', { status: 400 });
        }

        console.log('🚀 [API] Design request received. Prompt length:', prompt?.length);

        const result = await streamText({
            model: google('models/gemini-2.5-flash-lite'),
            system: `You are an expert Frontend Developer and UI/UX Designer.
      
Your goal: Generate specific tailored React + Tailwind CSS code based on the user's request.
      
Rules:
- Return ONLY the code for the component.
- Use 'lucide-react' for icons.
- Use standard Tailwind utility classes.
- Ensure the design is modern, clean, and responsive.
- Do not include 'import React' if not needed (Next.js/React 19).
- If multiple files are needed, stick to one file or provide the main logical component.
- The component should be exported as default.
- Do not wrap in markdown code blocks. Return raw code directly.
`,
            prompt: `Design a React component for: ${prompt}`,
        });

        // Use text stream response for useCompletion hook
        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('Error in design:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate design' }), { status: 500 });
    }
}
