// Test gemini-2.5-flash-lite which might have separate quota
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function testLiteModel() {
    console.log('Testing gemini-2.5-flash-lite...\n');

    let apiKey = '';
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
    if (match) apiKey = match[1].trim();

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = [
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3-flash-preview',
    ];

    for (const modelName of modelsToTry) {
        console.log(`Testing: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say "API works" in 2 words.');
            const text = result.response.text();
            console.log(`\n✅ ${modelName} WORKS!`);
            console.log(`Response: "${text.trim()}"`);
            return modelName;
        } catch (error) {
            if (error.message.includes('429')) {
                console.log(`❌ Rate limited`);
            } else {
                console.log(`❌ ${error.message.substring(0, 80)}`);
            }
        }
    }
    console.log('\n⚠️ All models rate-limited.');
}

testLiteModel();
