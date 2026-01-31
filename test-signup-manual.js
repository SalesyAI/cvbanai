
// import { authClient } from './lib/auth-client.js'; // Removed

// Since we are running in Node, we need to polyfill fetch or use the API directly.
// Easier to just use fetch to hit the backend directly.

async function testSignup() {
    console.log('Testing signup for komibic852@lawicon.com...');

    try {
        const response = await fetch('http://localhost:3001/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173' // Mocking frontend origin
            },
            body: JSON.stringify({
                email: 'komibic852+retry1@lawicon.com',
                password: 'password123',
                name: 'Komibic Tester'
            })
        });

        const data = await response.json();

        console.log('Status Code:', response.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

        if (data.user && data.user.emailVerified === false) {
            console.log('✅ SUCCESS: User created and emailVerified is FALSE.');
        } else if (response.status === 403 || data.message?.includes('verify')) {
            console.log('✅ SUCCESS: Server enforced verification (403 or message).');
        } else {
            console.log('❓ UNKNOWN RESULT: Check logs.');
        }

    } catch (err) {
        console.error('Request Failed:', err);
    }
}

testSignup();
