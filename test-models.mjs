import { config } from 'dotenv';
config({ path: '.env.local' });

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const models = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite',
];

async function testModels() {
    console.log('Testing all available models...\n');

    for (const m of models) {
        try {
            const result = await generateText({
                model: google('models/' + m),
                prompt: 'Say OK',
                maxTokens: 5
            });
            console.log(`✅ ${m}: WORKS!`);
            return m;
        } catch (e) {
            const msg = e.message || '';
            if (msg.includes('429') || msg.includes('quota')) {
                console.log(`❌ ${m}: Rate limited`);
            } else if (msg.includes('404') || msg.includes('not found')) {
                console.log(`❌ ${m}: Not found`);
            } else {
                console.log(`❌ ${m}: ${msg.slice(0, 60)}`);
            }
        }
    }
    console.log('\n⚠️ All rate limited! Wait 1 minute.');
    return null;
}

testModels();
