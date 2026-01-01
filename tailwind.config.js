/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
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
                // Dark Mode Palette
                dark: {
                    950: '#11181C', // Primary Background
                    900: '#1A2329', // Secondary Surface
                    800: '#232D36', // Slightly lighter surface for cards
                    700: '#2D3A45', // Borders, dividers
                },
                // Light Mode Palette
                light: {
                    50: '#FFFFFF',  // Pure White background
                    100: '#F0FDFA', // Very pale mint tint (secondary surface)
                    200: '#CCFBF1', // Mint tint for hover states
                    300: '#99F6E4', // Stronger mint for accents
                },
                // Text Colors
                text: {
                    // Dark mode text
                    'dark-primary': '#ECFDF5',   // Pale Mint White
                    'dark-secondary': '#A1A1AA', // Neutral Light Gray
                    // Light mode text
                    'light-primary': '#134E4A',  // Deep Teal Charcoal
                    'light-secondary': '#64748B', // Slate Gray
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'theme-switch': 'themeSwitch 0.3s ease-out',
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
                themeSwitch: {
                    '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
