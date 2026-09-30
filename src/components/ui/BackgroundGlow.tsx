import { useEffect, useState } from 'react'

export function BackgroundGlow() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle cursor-following ambient radial glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-15 transition-transform duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(168,85,247,0.2) 50%, transparent 70%)',
          left: `${mousePos.x - 300}px`,
          top: `${mousePos.y - 300}px`,
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Static ambient light gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[550px] h-[550px] bg-purple-600/10 blur-[170px] rounded-full pointer-events-none" />

      {/* Cybernetic background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}
