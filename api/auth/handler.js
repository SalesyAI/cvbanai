import { auth } from '../../lib/auth.js';

export const config = {
    api: {
        bodyParser: false // BetterAuth handles body parsing itself
    }
};

// Helper to collect raw body from stream
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req, res) {
    // Set CORS headers
    const origin = req.headers.origin || req.headers.referer || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Build the full URL
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const url = new URL(req.url, `${protocol}://${host}`);

        // Convert Node.js headers to Headers object
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach(v => headers.append(key, v));
                } else {
                    headers.set(key, value);
                }
            }
        }

        // Get raw body for POST/PUT/PATCH requests
        let body = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            const rawBody = await getRawBody(req);
            if (rawBody.length > 0) {
                body = rawBody;
            }
        }

        // Create Web Request
        const webRequest = new Request(url.toString(), {
            method: req.method,
            headers: headers,
            body: body
        });

        // Call BetterAuth handler
        const response = await auth.handler(webRequest);

        // Copy response headers to Node.js response
        response.headers.forEach((value, key) => {
            // Skip some headers that Node.js handles differently
            if (key.toLowerCase() !== 'content-encoding' &&
                key.toLowerCase() !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        // Get response body
        const responseBody = await response.text();

        // Send response
        return res.status(response.status).send(responseBody);

    } catch (error) {
        console.error('Auth handler error:', error.message, error.stack);
        return res.status(500).json({
            error: 'Authentication service error',
            message: error.message
        });
    }
}
