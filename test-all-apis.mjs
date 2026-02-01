// Comprehensive API Test Script
// Tests all 4 main APIs: repurpose, design, generate-campaign, seo

const BASE_URL = 'http://localhost:3000';

async function testAPI(name, endpoint, body) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing: ${name}`);
    console.log(`Endpoint: ${endpoint}`);
    console.log('='.repeat(50));

    try {
        const start = Date.now();
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const elapsed = Date.now() - start;
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Time: ${elapsed}ms`);

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ ERROR: ${errorText.substring(0, 200)}`);
            return false;
        }

        // Read the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
        }

        console.log(`Response length: ${fullText.length} chars`);
        console.log(`Preview: ${fullText.substring(0, 150)}...`);
        console.log(`✅ SUCCESS`);
        return true;

    } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
        return false;
    }
}

async function runAllTests() {
    console.log('\n🚀 COMPREHENSIVE API TEST SUITE');
    console.log('Testing all 4 main APIs...\n');

    const results = [];

    // Test 1: Repurpose
    results.push(await testAPI(
        'REPURPOSE (Thread Generator)',
        '/api/repurpose',
        { prompt: 'Test article about 3D printing technology and its benefits.' }
    ));

    // Test 2: Design
    results.push(await testAPI(
        'WEB DESIGNER',
        '/api/design',
        { prompt: 'A modern hero section with gradient background' }
    ));

    // Test 3: Generate Campaign
    results.push(await testAPI(
        'LAUNCHPAD (Campaign Generator)',
        '/api/generate-campaign',
        { idea: 'A 3D printing business for custom phone cases' }
    ));

    // Test 4: SEO
    results.push(await testAPI(
        'SEO BRIEF',
        '/api/seo',
        { topic: 'Best 3D printers for beginners 2026' }
    ));

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('FINAL RESULTS');
    console.log('='.repeat(50));
    console.log(`Repurpose: ${results[0] ? '✅' : '❌'}`);
    console.log(`Web Designer: ${results[1] ? '✅' : '❌'}`);
    console.log(`Launchpad: ${results[2] ? '✅' : '❌'}`);
    console.log(`SEO Brief: ${results[3] ? '✅' : '❌'}`);

    const passed = results.filter(r => r).length;
    console.log(`\nTotal: ${passed}/4 APIs working`);

    if (passed === 4) {
        console.log('\n🎉 ALL APIS WORKING!\n');
    } else {
        console.log('\n⚠️ Some APIs need fixing.\n');
    }
}

runAllTests();
