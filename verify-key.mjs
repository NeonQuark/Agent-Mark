
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function testSafeModel() {
    let apiKey = '';
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
            if (match) apiKey = match[1].trim();
        }
    } catch (e) { }

    if (!apiKey) {
        console.log('Using hardcoded key for test...');
        apiKey = 'AIzaSyCxYgvCiyy7ovDugxrT9hh55Cm5TiSodhw';
    }

    const modelName = 'gemini-flash-latest'; // Safer alias
    console.log(`🚀 Testing safer model alias: ${modelName}`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Say "Stable" if you hear me.');
        console.log('✅ SUCCESS!');
        console.log('📜 Output:', result.response.text());

    } catch (error) {
        console.error('❌ FAILED:', error.message);
    }
}

testSafeModel();
