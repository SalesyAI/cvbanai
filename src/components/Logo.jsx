import React from 'react';

export default function Logo({ className = "h-8", showText = true, textColor = "text-white" }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Icon Part */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-auto flex-shrink-0"
            >
                {/* Document Background Shape */}
                <path
                    d="M30 20H60L80 40V80C80 82.2091 78.2091 84 76 84H30C27.7909 84 26 82.2091 26 80V24C26 21.7909 27.7909 20 30 20Z"
                    stroke="#88D8F1"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Folded Corner */}
                <path
                    d="M60 20V40H80"
                    stroke="#88D8F1"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* The Large Checkmark */}
                <path
                    d="M10 60L40 90L95 15"
                    stroke="#88D8F1"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0px 0px 8px rgba(136, 216, 241, 0.4))' }}
                />
            </svg>

            {/* Text Part */}
            {showText && (
                <span className={`text-2xl font-bold tracking-tight ${textColor}`}>
                    CVBanai
                </span>
            )}
        </div>
    );
}
