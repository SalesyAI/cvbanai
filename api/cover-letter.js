import { createClient } from '@supabase/supabase-js';
import { generateCoverLetter } from '../lib/ai/generateCoverLetter.js';

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5; // Lower limit for cover letters as they are more intensive

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const supabase = createClient(
            process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        if (!checkRateLimit(user.id)) {
            return res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute.' });
        }

        const { resumeData, jobDescription } = req.body;

        if (!resumeData) {
            return res.status(400).json({ error: 'Missing resumeData' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'AI service not configured' });
        }

        console.log(`[CoverLetter] Generating for user ${user.id}`);
        const result = await generateCoverLetter(resumeData, jobDescription, process.env.GEMINI_API_KEY);
        console.log(`[CoverLetter] Success for user ${user.id}`);

        return res.status(200).json(result);

    } catch (error) {
        console.error('[CoverLetter] Error:', error.message);
        return res.status(500).json({ error: `Cover letter generation failed: ${error.message}` });
    }
}
