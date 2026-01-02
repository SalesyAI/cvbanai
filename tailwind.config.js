/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    400: '#2DD4BF',
                    500: '#0D9488',
                    600: '#0F766E',
                },
                accent: {
                    400: '#5EEAD4',
                    500: '#14B8A6',
                    600: '#134E4A',
                },
                dark: {
                    950: '#11181C',
                    900: '#1A2329',
                    800: '#232D36',
                    700: '#2D3A45',
                },
                light: {
                    50: '#F8FAFA',  // Soft off-white (was pure white)
                    100: '#EDF2F2', // Warm light gray
                    200: '#DFE7E7', // Softer teal-gray
                    300: '#C5D4D4', // Muted accent
                },
                text: {
                    'dark-primary': '#ECFDF5',
                    'dark-secondary': '#A1A1AA',
                    'light-primary': '#1E3A3A',   // Softer than #134E4A
                    'light-secondary': '#5A6B6B', // Warmer gray
                },
            },
            animation: {
                // Basic animations
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-down': 'slideDown 0.5s ease-out forwards',
                'slide-left': 'slideLeft 0.5s ease-out forwards',
                'slide-right': 'slideRight 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'scale-up': 'scaleUp 0.2s ease-out forwards',
                // Micro-interactions
                'bounce-soft': 'bounceSoft 0.5s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'shake': 'shake 0.5s ease-in-out',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
                // Glow effects
                'glow': 'glow 2s ease-in-out infinite alternate',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                // Special
                'theme-switch': 'themeSwitch 0.3s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient-shift': 'gradientShift 3s ease infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'pop': 'pop 0.3s ease-out forwards',
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
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideLeft: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(13, 148, 136, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(13, 148, 136, 0.5)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(45, 212, 191, 0.4)' },
                },
                themeSwitch: {
                    '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.03)', opacity: '0.9' },
                },
                pop: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '70%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
