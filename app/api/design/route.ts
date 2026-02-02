
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🚀 [API] Design request received:', prompt?.substring(0, 50));

    const result = await generateObject({
      model: google('models/gemini-2.5-flash-lite'),
      schema: z.object({
        homePage: z.string().describe("Complete React component for the Home/Landing page with inline styles"),
        productPage: z.string().describe("Complete React component for a Sample Product page with inline styles"),
        cartPage: z.string().describe("Complete React component for the Checkout/Cart page with inline styles"),
        backendRecommendations: z.array(z.object({
          name: z.string().describe("Name of the backend tech (e.g. Supabase, Firebase, Shopify, Next.js API)"),
          reason: z.string().describe("Why this fits the specific project idea"),
          pros: z.array(z.string()).describe("List of 3 pros"),
          difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe("Implementation difficulty level")
        })).describe("Top 3 backend recommendations for this specific e-commerce idea")
      }),
      system: `You are an expert e-commerce frontend developer. Create 3 React components for a website.

EACH PAGE should be a complete, self-contained React functional component using INLINE STYLES.

FORMAT for each page:
function PageName() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #09090b, #18181b)', color: 'white', fontFamily: 'system-ui' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #27272a' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>BrandName</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a style={{ color: '#a1a1aa', cursor: 'pointer' }}>Home</a>
          <a style={{ color: '#a1a1aa', cursor: 'pointer' }}>Products</a>
          <a style={{ color: '#a1a1aa', cursor: 'pointer' }}>Cart 🛒</a>
        </div>
      </nav>
      {/* Page Content */}
    </div>
  );
}

REQUIREMENTS:
1. HOME PAGE: Hero section with headline + CTA, Featured products grid (3-4 items), Why choose us section
2. PRODUCT PAGE: Product image placeholder (colored div), Title, Price, Description, Add to Cart button, Related products
3. CART PAGE: List of cart items, Quantity controls, Order summary, Checkout button

USE INLINE STYLES - style={{...}} syntax
USE EMOJIS for icons: 🛒 🛍️ ⭐ ❤️ 📦 ✨ 🔥 💎
USE GRADIENTS: linear-gradient(to right, #3b82f6, #8b5cf6)
DARK THEME: background #09090b, cards #27272a, text white/#a1a1aa

CRITICAL IMAGE RULE:
Use 'https://placehold.co/600x400/27272a/FFF?text=Product' for images.
Example: <img src="https://placehold.co/400x300/27272a/FFF?text=Sneaker+1" alt="Sneaker" style={{width: '100%', borderRadius: '12px'}} />
NEVER use "Sneaker 1" as src. ALWAYS use the full URL.

Make each page visually STUNNING with modern design.`,
      prompt: `Create an e-commerce website for: ${prompt}`,
    });

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in design:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate design' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
