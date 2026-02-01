// List available models to diagnose the issue
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function listModels() {
    console.log('Listing available models for your API key...\n');

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

    console.log(`API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log(`Key length: ${apiKey.length} chars\n`);

    // Make a direct API call to list models
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.log(`❌ Error: ${data.error.message}`);
            return;
        }

        console.log('Available models:');
        for (const model of data.models || []) {
            if (model.name.includes('gemini')) {
                console.log(`  - ${model.name}`);
            }
        }
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
    }
}

listModels();
