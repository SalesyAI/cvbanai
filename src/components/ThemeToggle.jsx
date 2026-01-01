import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative p-2.5 rounded-xl 
                bg-light-100 dark:bg-dark-800 
                border border-light-200 dark:border-dark-700
                hover:bg-light-200 dark:hover:bg-dark-700
                transition-all duration-300
                group
                ${className}
            `}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <Sun
                    className={`
                        absolute inset-0 w-5 h-5 text-amber-500
                        transition-all duration-300
                        ${theme === 'dark'
                            ? 'opacity-0 rotate-90 scale-0'
                            : 'opacity-100 rotate-0 scale-100'
                        }
                    `}
                />
                {/* Moon Icon */}
                <Moon
                    className={`
                        absolute inset-0 w-5 h-5 text-primary-400
                        transition-all duration-300
                        ${theme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-0'
                        }
                    `}
                />
            </div>
        </button>
    )
}
