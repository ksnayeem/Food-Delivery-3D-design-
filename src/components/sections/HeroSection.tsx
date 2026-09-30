import { motion } from 'framer-motion'
import { ArrowRight, Play, Star, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { HeroCanvas } from '../3d/HeroCanvas'

interface HeroSectionProps {
  onOpenDemo: () => void
}

export function HeroSection({ onOpenDemo }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background glow pools */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Editorial & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col items-start text-left"
        >
          {/* Small animated badge: AI-Powered Platform */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-cyan-400/60 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-xs font-mono font-medium tracking-wide text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AI-Powered Platform v3.4
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">Next-Gen Release</span>
          </motion.div>

          {/* Large Headline: Build Faster. Think Smarter. */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black font-['Outfit'] tracking-tight text-white leading-[1.08] mb-6">
            Build{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent inline-block drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]">
              Faster.
            </span>
            <br />
            Think{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent inline-block drop-shadow-[0_0_25px_rgba(168,85,247,0.3)]">
              Smarter.
            </span>
          </h1>

          {/* Short Supporting Paragraph */}
          <p className="text-slate-300/90 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-light">
            Deploy autonomous AI agent swarms and sub-millisecond edge neural compute.
            Orchestrate, scale, and monitor distributed models with zero infrastructure friction.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenDemo}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenDemo}
              icon={<Play className="w-4 h-4 fill-slate-300" />}
              iconPosition="left"
            >
              Explore Platform
            </Button>
          </div>

          {/* Small Trust Indicators below buttons */}
          <div className="pt-6 border-t border-slate-800/80 w-full max-w-xl">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Avatar Stack */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 1"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 2"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 3"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="User 4"
                />
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-950 ring-2 ring-slate-900 text-[10px] font-bold text-cyan-300">
                  +10k
                </div>
              </div>

              {/* Rating and Social Proof */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white ml-1.5">4.98/5</span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5">
                  Trusted by 10,000+ engineering teams worldwide
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 h-[420px] sm:h-[520px] lg:h-[620px] relative flex items-center justify-center"
        >
          {/* Subtle Ambient Backing Halo for the 3D core */}
          <div className="absolute w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none" />

          {/* 3D Scene Component */}
          <div className="w-full h-full relative z-10">
            <HeroCanvas />
          </div>

          {/* Floating Subtle Annotation Badges on the 3D scene */}
          <div className="absolute top-8 right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/75 border border-slate-800/80 backdrop-blur-md shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono text-cyan-300">CORE ORB::ONLINE</span>
          </div>

          <div className="absolute bottom-10 left-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/75 border border-slate-800/80 backdrop-blur-md shadow-lg pointer-events-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-300">ATTUNED TO MOUSE PARALLAX</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
