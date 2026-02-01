// Direct Gemini API test - bypasses streaming to verify key works
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function testGeminiDirectly() {
    console.log('Testing Gemini API directly (no streaming)...\n');

    // Read API key from .env.local
    let apiKey = '';
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
            if (match) {
                apiKey = match[1].trim();
            }
        }
    } catch (e) {
        console.error('Error reading .env.local:', e);
    }

    if (!apiKey) {
        console.log('❌ No API key found in .env.local');
        return;
    }

    console.log(`API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        console.log('\nCalling Gemini 2.0 Flash...');
        const result = await model.generateContent('Say "Hello, the API is working!" in exactly 5 words.');
        const text = result.response.text();

        console.log(`\n✅ SUCCESS! Response: "${text}"`);
        console.log('\nYour API key is VALID and working.');

    } catch (error) {
        console.log(`\n❌ FAILED: ${error.message}`);

        if (error.message.includes('leaked')) {
            console.log('\n⚠️ YOUR API KEY HAS BEEN REVOKED!');
            console.log('You need to create a NEW API key at:');
            console.log('https://aistudio.google.com/app/apikey');
        }
    }
}

testGeminiDirectly();
