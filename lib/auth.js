import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { Resend } from 'resend';

// Check required environment variables
const requiredEnvVars = ['DATABASE_URL', 'BETTER_AUTH_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
    console.error(`[BetterAuth] Missing required environment variables: ${missingVars.join(', ')}`);
}

// Initialize Resend (optional - emails will fail gracefully if not configured)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

// Production URL
const siteUrl = process.env.BETTER_AUTH_URL || 'https://cvbanai.vercel.app';

// Database pool (only create if DATABASE_URL exists)
let pool = null;
if (process.env.DATABASE_URL) {
    // Strip sslmode from URL (it conflicts with rejectUnauthorized: false in some envs)
    let connectionString = process.env.DATABASE_URL;
    if (connectionString.includes('?sslmode=') || connectionString.includes('&sslmode=')) {
        connectionString = connectionString.replace(/([?&])sslmode=[^&]+/, '$1').replace(/[?&]$/, '');
        // If we replaced ?sslmode=... and it was the only param, we might have a trailing ? or nothing.
        // Cleaner approach: just remove the param.
        const url = new URL(process.env.DATABASE_URL);
        url.searchParams.delete('sslmode');
        connectionString = url.toString();
    }

    pool = new Pool({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });
}

// Helper to send email (safely handles missing Resend)
async function sendEmail(options) {
    if (!resend) {
        console.warn('[BetterAuth] Email not sent - RESEND_API_KEY not configured');
        console.warn('[BetterAuth] Would have sent to:', options.to);
        return;
    }
    try {
        await resend.emails.send(options);
    } catch (error) {
        console.error('[BetterAuth] Email send error:', error.message);
    }
}

export const auth = betterAuth({
    // Use Supabase PostgreSQL database
    database: pool,

    // Base URL for auth endpoints
    baseURL: siteUrl,

    // Secret for signing tokens
    secret: process.env.BETTER_AUTH_SECRET,

    // Email and Password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to false for now to test basic signup
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                from: 'CVBanai <onboarding@resend.dev>',
                to: user.email,
                subject: 'Reset your CVBanai password',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #14b8a6;">Reset Your Password</h2>
                        <p>Hi ${user.name || 'there'},</p>
                        <p>Click the button below to reset your password:</p>
                        <a href="${url}" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
                        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                        <p style="color: #999; font-size: 12px;">— The CVBanai Team</p>
                    </div>
                `
            });
        }
    },

    // Email verification configuration
    emailVerification: {
        sendOnSignUp: !!resend, // Only send if Resend is configured
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                from: 'CVBanai <onboarding@resend.dev>',
                to: user.email,
                subject: 'Verify your CVBanai account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #14b8a6;">Welcome to CVBanai! 🎉</h2>
                        <p>Hi ${user.name || 'there'},</p>
                        <p>Thanks for signing up! Please verify your email address to get started:</p>
                        <a href="${url}" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email Address</a>
                        <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
                        <p style="color: #999; font-size: 12px;">— The CVBanai Team</p>
                    </div>
                `
            });
        }
    },

    // Social login providers (only add Google if credentials are configured)
    socialProviders: (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ? {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }
    } : {},

    // Enable account linking (allows Google login for existing email accounts)
    accountLinking: {
        enabled: true,
        trustedProviders: ['google']
    },

    // Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Update session every 24 hours
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5 // 5 minutes cache
        }
    },

    // User data configuration
    user: {
        additionalFields: {
            fullName: {
                type: 'string',
                required: false
            }
        }
    },

    // Trusted origins for CORS
    trustedOrigins: [
        'https://cvbanai.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ]
});
