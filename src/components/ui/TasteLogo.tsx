interface TasteLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export function TasteLogo({ size = 'md', showTagline = true }: TasteLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Bespoke 3D Animated Taste & Spices Emblem */}
      <div
        className={`relative flex items-center justify-center ${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-amber-400/50 group-hover:scale-105 transition-all duration-300`}
      >
        {/* Ambient Ring Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-rose-500 rounded-2xl blur-xs opacity-50 group-hover:opacity-100 transition-opacity" />

        {/* Custom Culinary Taste & Spices Icon SVG */}
        <svg
          className="w-3/5 h-3/5 relative z-10 text-white fill-none stroke-currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Flame of Taste */}
          <path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="url(#tasteFlameGrad)"
            stroke="none"
          />
          {/* Fork Prongs of Flavor */}
          <path
            d="M12 2v4M9.5 3v3M14.5 3v3"
            stroke="#fef08a"
            strokeWidth="1.8"
          />
          <defs>
            <linearGradient id="tasteFlameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pulsing Aroma Speckle */}
        <div className="w-1.5 h-1.5 rounded-full bg-amber-300 absolute -top-1 -right-1 shadow-[0_0_8px_#fde047] animate-ping" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className={`${textSizes[size]} font-black tracking-tight text-white font-['Outfit'] flex items-center gap-1.5 leading-none`}>
          <span>NAYEEM</span>
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            SPICES
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] font-mono tracking-widest text-amber-300/80 uppercase font-semibold mt-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            SIGNATURE TASTE & AROMA
          </span>
        )}
      </div>
    </div>
  )
}
