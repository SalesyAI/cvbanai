/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Accent - Teal (for CTAs, highlights - use sparingly, 10%)
                primary: {
                    400: '#2DD4BF', // Vibrant Seafoam (Dark mode CTA)
                    500: '#0D9488', // Modern Teal (Light mode CTA)
                    600: '#0F766E', // Darker teal for hover
                },
                // Secondary Accent - Mint (for success indicators, subtle highlights)
                accent: {
                    400: '#5EEAD4', // Bright Mint
                    500: '#14B8A6', // Mid Mint
                    600: '#134E4A', // Deep Teal (for active tabs in dark mode)
                },
                // Dark Mode Palette (60% background, 30% surfaces/text)
                dark: {
                    950: '#11181C', // Primary Background
                    900: '#1A2329', // Secondary Surface
                    800: '#232D36', // Slightly lighter surface for cards
                    700: '#2D3A45', // Borders, dividers
                },
                // Text Colors
                text: {
                    primary: '#ECFDF5',   // Pale Mint White (Dark mode primary text)
                    secondary: '#A1A1AA', // Neutral Light Gray (Dark mode secondary text)
                    muted: '#64748B',     // Slate Gray (Light mode secondary text)
                    dark: '#134E4A',      // Deep Teal Charcoal (Light mode primary text)
                },
                // Surface colors for light mode
                surface: {
                    light: '#FFFFFF',     // Pure White (Light mode background)
                    mint: '#F0FDFA',      // Very pale mint tint (Light mode secondary)
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(13, 148, 136, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(13, 148, 136, 0.5)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
