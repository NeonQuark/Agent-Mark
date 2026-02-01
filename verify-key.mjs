
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function verifyEnvKey() {
    console.log('🔍 Reading API Key from .env.local...');
    let apiKey = '';
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
            if (match) apiKey = match[1].trim();
        }
    } catch (e) {
        console.error('Error reading .env.local:', e.message);
    }

    if (!apiKey || apiKey.includes('PASTE_YOUR')) {
        console.error('❌ NO KEY FOUND in .env.local. Please paste your key there first.');
        return;
    }

    console.log('🔑 Key found (length ' + apiKey.length + ')');
    const modelName = 'gemini-flash-latest';

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Ping');
        console.log('✅ KEY IS VALID! Model: ' + modelName);
        console.log('📜 Output:', result.response.text());

    } catch (error) {
        console.error('❌ FAILED:', error.message);
    }
}

verifyEnvKey();
