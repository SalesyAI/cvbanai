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
        // Dynamic import to prevent top-level crashes if env vars are missing
        const { auth } = await import('../../lib/auth.js');

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

        // Handle Body
        let body = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            // Vercel/Express automatically parses JSON if content-type is json
            if (req.body) {
                body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
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

        // Copy response headers
        response.headers.forEach((value, key) => {
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
        console.error('Auth handler error:', error);

        // Return detailed error for debugging (remove in prod if needed, but useful now)
        return res.status(500).json({
            error: 'Authentication Function Error',
            message: error.message,
            stack: error.stack,
            envCheck: {
                hasDB: !!process.env.DATABASE_URL,
                hasAuthSecret: !!process.env.BETTER_AUTH_SECRET
            }
        });
    }
}
