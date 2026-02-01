
async function test() {
    console.log('Testing /api/repurpose...');
    try {
        const res = await fetch('http://localhost:3000/api/repurpose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'This is a test article content.' }),
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log('Response Body:', text.substring(0, 200) + '...');
    } catch (e) {
        console.error('Fetch error:', e.message);
    }
}
test();
