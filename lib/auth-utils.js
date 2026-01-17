import { auth } from './auth.js';

/**
 * Get the authenticated user from a request using BetterAuth
 * @param {Request} req - The incoming request
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
export async function getAuthUser(req) {
    try {
        // Get session from cookies/headers
        const session = await auth.api.getSession({
            headers: new Headers(req.headers)
        });

        if (!session || !session.user) {
            return { user: null, error: 'Invalid or expired session' };
        }

        return { user: session.user, error: null };
    } catch (error) {
        console.error('[Auth] Session validation error:', error.message);
        return { user: null, error: 'Authentication failed' };
    }
}

/**
 * Middleware-style auth check for API routes
 * Returns early with 401 if not authenticated
 */
export async function requireAuth(req, res) {
    const { user, error } = await getAuthUser(req);

    if (error || !user) {
        res.status(401).json({ error: error || 'Unauthorized' });
        return null;
    }

    return user;
}
