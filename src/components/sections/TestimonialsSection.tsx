import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      id: '1',
      name: 'Dr. Elena Rostova',
      role: 'VP of Autonomous Systems',
      company: 'NovaCore AI',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=180&h=180&q=80',
      rating: 5,
      quote:
        'AETHERIS cut our edge inference latency by 68% overnight. The multi-agent consensus engine handles complex cluster failovers without a single dropped WebSocket packet.',
      metrics: '42M requests/day at < 4ms P99',
    },
    {
      id: '2',
      name: 'Marcus Vance',
      role: 'Lead Distributed Architect',
      company: 'CloudScale Global',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&h=180&q=80',
      rating: 5,
      quote:
        'The developer ergonomics are unbelievable. We plugged in the TypeScript SDK and had full hardware-enclave zero-trust verification operating in production in less than an hour.',
      metrics: 'Zero-trust attestation across 12 clusters',
    },
    {
      id: '3',
      name: 'Sarah Zhang',
      role: 'Head of Machine Learning',
      company: 'FinTech Quantum',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=180&h=180&q=80',
      rating: 5,
      quote:
        'We process high-frequency financial telemetry where millisecond spikes mean catastrophic slippage. AETHERIS gave us rock-solid deterministic predictability with zero jitter.',
      metrics: '$8.4B daily transaction volume monitored',
    },
    {
      id: '4',
      name: 'Alex Rivera',
      role: 'Chief Technology Officer',
      company: 'Hyperion Robotics',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=180&h=180&q=80',
      rating: 5,
      quote:
        'The 3D observability visualizer and real-time token telemetry transformed how our engineering team debugs autonomous drone fleets in real-world environments.',
      metrics: '1,400+ autonomous units synchronized',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isAutoPlay, testimonials.length])

  const handlePrev = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section id="testimonials" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION VALIDATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-5">
          Trusted by Leaders Building the{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Future of Intelligence
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          See why top engineering teams migrate their mission-critical AI workloads to AETHERIS.
        </p>
      </div>

      {/* Testimonial Carousel Card with 3D Depth */}
      <div className="max-w-4xl mx-auto relative perspective-1000">
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl overflow-hidden min-h-[340px] flex flex-col justify-between">
          {/* Top subtle border glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <Quote className="absolute top-6 right-8 w-20 h-20 text-slate-800/30 pointer-events-none" />

          {/* Testimonial Content with Animated Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="relative z-10"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="ml-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {current.metrics}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-lg sm:text-2xl font-normal text-slate-100 leading-relaxed mb-8">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-cyan-500/40 shadow-lg"
                />
                <div>
                  <h4 className="text-base font-bold text-white font-['Outfit']">
                    {current.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {current.role} • <span className="text-cyan-400 font-medium">{current.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls: Prev/Next & Dots */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-800/80 relative z-10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlay(false)
                    setCurrentIndex(idx)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? 'w-8 bg-cyan-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
