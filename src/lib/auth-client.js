import { createAuthClient } from 'better-auth/react';

// Create the BetterAuth client for React
export const authClient = createAuthClient({
    // Base URL - uses same origin in production, explicit URL for development
    baseURL: import.meta.env.VITE_SITE_URL || window.location.origin
});

// Export individual methods for convenience
export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
    sendVerificationEmail
} = authClient;
