import { createClient } from '@supabase/supabase-js';
import { refineResume } from '../lib/ai/refineResume.js';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per user

function checkRateLimit(userId) {
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (!userLimit || now - userLimit.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(userId, { windowStart: now, count: 1 });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT_MAX) {
        return false;
    }

    userLimit.count++;
    return true;
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // ========== AUTHENTICATION ==========
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token with Supabase
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        // ========== RATE LIMITING ==========
        if (!checkRateLimit(user.id)) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please wait a minute before trying again.',
                retryAfter: 60
            });
        }

        // ========== VALIDATION ==========
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ error: 'Missing resumeData in request body' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'AI service not configured' });
        }

        // ========== AI PROCESSING ==========
        console.log(`[Refine] Processing for user ${user.id}: ${resumeData.fullName}`);

        const refinedData = await refineResume(resumeData, process.env.GEMINI_API_KEY);

        console.log(`[Refine] Success for user ${user.id}`);

        return res.status(200).json({ refinedData });

    } catch (error) {
        console.error('[Refine] Error:', error.message);
        return res.status(500).json({ error: `AI refinement failed: ${error.message}` });
    }
}
