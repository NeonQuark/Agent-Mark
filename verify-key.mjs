
import fs from 'fs';
import path from 'path';

async function verify() {
    // 1. Read API Key
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
        console.error('❌ No API Key found in .env.local');
        return;
    }

    console.log('🔑 API Key found:', apiKey.substring(0, 5) + '...');

    // 2. Direct REST Call to List Models
    console.log('📡 Fetching available models list from Google API...');
    console.log('   URL: https://generativelanguage.googleapis.com/v1beta/models');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.log('❌ API Error:', JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log('✅ Success! Found models:');
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`   - ${m.name.replace('models/', '')} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });

            // Try the first valid gemini model found
            const validModel = data.models.find(m => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'));
            if (validModel) {
                console.log(`\n✨ Recommendation: Use model "${validModel.name.replace('models/', '')}"`);
            } else {
                console.log('\n⚠️ No Gemini models with generateContent support found.');
            }

        } else {
            console.log('⚠️ Unexpected response:', data);
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
}

verify();
