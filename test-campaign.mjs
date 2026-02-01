
async function testCampaign() {
    console.log('Testing /api/generate-campaign...');
    try {
        const res = await fetch('http://localhost:3000/api/generate-campaign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea: 'A drone delivery service for pizza' }),
        });

        console.log(`Status: ${res.status} ${res.statusText}`);

        // In streamObject, the response is a stream of chunks.
        // We just want to see if it starts and contains some data.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        let text = '';
        while (!done) {
            const { value, done: isDone } = await reader.read();
            done = isDone;
            if (value) {
                text += decoder.decode(value, { stream: true });
                // Just print first 200 chars to verify it's not error
                if (text.length > 200) break;
            }
        }

        console.log('Partial Response:', text);

    } catch (e) {
        console.error('Fetch error:', e.message);
    }
}
testCampaign();
