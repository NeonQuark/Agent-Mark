// Test with different models to find one with available quota
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function testAllModels() {
    console.log('Testing multiple Gemini models to find one with quota...\n');

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
        console.log('❌ No API key found');
        return;
    }

    console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
        'gemini-pro',
    ];

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of models) {
        console.log(`Testing: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say hello in 3 words.');
            const text = result.response.text();
            console.log(`✅ ${modelName}: "${text.trim()}"\n`);
            console.log(`\n🎉 ${modelName} WORKS! Updating your app to use this model.`);
            return modelName;
        } catch (error) {
            if (error.message.includes('429')) {
                console.log(`❌ ${modelName}: Rate limited\n`);
            } else if (error.message.includes('404')) {
                console.log(`❌ ${modelName}: Not found\n`);
            } else {
                console.log(`❌ ${modelName}: ${error.message.substring(0, 50)}...\n`);
            }
        }
    }

    console.log('\n⚠️ All models are rate-limited. You need to wait or enable billing.');
    return null;
}

testAllModels();
