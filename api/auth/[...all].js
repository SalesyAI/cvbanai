import { auth } from '../../lib/auth.js';

export const config = {
    api: {
        bodyParser: false // BetterAuth handles its own body parsing
    }
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Convert Node.js request to Web Request
        const url = new URL(req.url, `https://${req.headers.host}`);

        const webRequest = new Request(url, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD'
                ? JSON.stringify(req.body)
                : undefined
        });

        // Handle with BetterAuth
        const response = await auth.handler(webRequest);

        // Convert Web Response to Node.js response
        const responseBody = await response.text();

        // Copy headers from response
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        return res.status(response.status).send(responseBody);
    } catch (error) {
        console.error('Auth handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
