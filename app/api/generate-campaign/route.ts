
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
                landingPageCode: z.string().describe("A complete React functional component using inline styles for a stunning landing page. Use style={{...}} syntax for styling."),
                tweets: z.array(z.string()).describe("Exactly 5 viral promotional tweets with emojis. No hashtags."),
                marketingAngle: z.string().describe("A one-sentence marketing strategy."),
            }),
            system: `You are a React developer creating a STUNNING landing page.

OUTPUT FORMAT - Generate a React component like this:
function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #09090b, #18181b)', color: 'white', fontFamily: 'system-ui' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Amazing Headline
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Subtitle text here
        </p>
        <button style={{ padding: '16px 32px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}>
          Get Started →
        </button>
      </section>
      
      {/* Features Grid */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#27272a', padding: '32px', borderRadius: '16px', border: '1px solid #3f3f46' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Feature Title</h3>
            <p style={{ color: '#a1a1aa' }}>Feature description</p>
          </div>
        </div>
      </section>
    </div>
  );
}

REQUIREMENTS:
1. Use inline styles with style={{...}} syntax (NOT className)
2. Use gradients for backgrounds: linear-gradient(to bottom, #09090b, #18181b)
3. Use grid for layouts: display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
4. Use emoji for icons: 🚀 ✨ ⚡ 💡 🎯 ⭐ 🔥 💎 🌟 ✅
5. Create: Hero with gradient headline, Features grid (3-4 cards), CTA section, Footer
6. Make it VISUALLY STUNNING with gradients and modern styling`,
            prompt: `Create a beautiful landing page for: ${idea}`,
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
