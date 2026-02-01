
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function testFinal() {
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
        console.log('Using provided key...');
        apiKey = 'AIzaSyCxYgvCiyy7ovDugxrT9hh55Cm5TiSodhw'; // Using the key user provided to be sure
    }

    console.log('🚀 Testing confirmed model: gemini-2.5-flash');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent('Write a 5 word poem about coding.');
        console.log('✅ GENERATION SUCCESS!');
        console.log('📜 Output:', result.response.text());

    } catch (error) {
        console.error('❌ FAILED:', error.message);
    }
}

testFinal();
