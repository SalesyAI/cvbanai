import { generateFullResume } from '../lib/ai/generateFullResume.js';
import { requireAuth } from '../lib/auth-utils.js';

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per user (more restrictive for full generation)

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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // ========== AUTHENTICATION (BetterAuth) ==========
        const user = await requireAuth(req, res);
        if (!user) return; // Response already sent by requireAuth

        // ========== RATE LIMITING ==========
        if (!checkRateLimit(user.id)) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please wait a minute before generating another resume.',
                retryAfter: 60
            });
        }

        // ========== VALIDATION ==========
        const { quickInput } = req.body;

        if (!quickInput) {
            return res.status(400).json({ error: 'Missing quickInput in request body' });
        }

        // Validate required fields
        const requiredFields = ['fullName', 'email', 'targetJobTitle', 'experienceLevel'];
        const missingFields = requiredFields.filter(field => !quickInput[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate education
        if (!quickInput.education || Object.keys(quickInput.education).length === 0) {
            return res.status(400).json({
                error: `At least one education level is required`
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'AI service not configured' });
        }

        // ========== AI PROCESSING ==========
        console.log(`[Generate Resume] Processing for user ${user.id}: ${quickInput.fullName} - ${quickInput.targetJobTitle}`);

        const resumeData = await generateFullResume(quickInput, process.env.GEMINI_API_KEY);

        console.log(`[Generate Resume] Success for user ${user.id}`);

        return res.status(200).json({
            success: true,
            resumeData
        });

    } catch (error) {
        console.error('[Generate Resume] Error:', error.message);
        return res.status(500).json({ error: `Resume generation failed: ${error.message}` });
    }
}
