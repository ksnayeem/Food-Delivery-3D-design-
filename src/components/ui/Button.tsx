import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glow' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-semibold',
  }

  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 select-none overflow-hidden cursor-pointer group active:scale-[0.98]'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-indigo-500 border border-cyan-400/30',
    secondary:
      'bg-slate-900/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800/90 hover:border-slate-500 hover:text-white backdrop-blur-md shadow-sm',
    glow:
      'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/40 hover:scale-[1.02]',
    outline:
      'bg-transparent text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/5',
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Subtle shine reflection sweep on hover */}
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && <span className="transition-transform group-hover:-translate-x-0.5">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="transition-transform group-hover:translate-x-0.5">{icon}</span>}
      </span>
    </button>
  )
}
