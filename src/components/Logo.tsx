import React from 'react'

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* SVG Icon */}
      <div className="relative flex shrink-0 items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-10 h-10 sm:w-12 sm:h-12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* U Shape */}
          <path 
            d="M20 15 V 55 C 20 75 35 85 50 85 C 65 85 80 75 80 55 V 15" 
            stroke="white" 
            strokeWidth="18" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Chat Tail */}
          <path d="M 30 80 L 10 100 L 25 65 Z" fill="white" />
          
          {/* Three Dots */}
          <circle cx="35" cy="55" r="5" fill="#3cffd0" />
          <circle cx="50" cy="55" r="5" fill="#3cffd0" />
          <circle cx="65" cy="55" r="5" fill="#3cffd0" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center translate-y-1">
        <span className="font-display text-[32px] sm:text-[44px] leading-[0.8] text-white tracking-widest">
          UNSAID
        </span>
        <div className="mt-2 flex items-center gap-1.5 font-sans-thin-caps text-[7px] sm:text-[9px] tracking-[0.25em] text-[#949494]">
          <span>SPEAK <span className="text-[#3cffd0]">FREELY.</span></span>
          <span>HELP <span className="text-[#3cffd0]">TRULY.</span></span>
        </div>
      </div>
    </div>
  )
}
