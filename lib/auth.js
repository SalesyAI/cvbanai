import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { Resend } from 'resend';

// Initialize Resend for email sending
const resend = new Resend(process.env.RESEND_API_KEY);

// Production URL
const siteUrl = process.env.BETTER_AUTH_URL || 'https://cvbanai.vercel.app';

export const auth = betterAuth({
    // Use Supabase PostgreSQL database
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    }),

    // Base URL for auth endpoints
    baseURL: siteUrl,

    // Secret for signing tokens
    secret: process.env.BETTER_AUTH_SECRET,

    // Email and Password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true, // Users must verify email before logging in
        sendResetPassword: async ({ user, url }) => {
            await resend.emails.send({
                from: 'CVBanai <noreply@cvbanai.vercel.app>',
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
        sendOnSignUp: true, // Automatically send verification email on signup
        autoSignInAfterVerification: true, // Auto sign in after email verification
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: 'CVBanai <noreply@cvbanai.vercel.app>',
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

    // Social login providers
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
        }
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
