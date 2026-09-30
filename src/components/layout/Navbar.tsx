import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'

interface NavbarProps {
  onOpenDemo: () => void
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Track active section for active indicator
      const sections = ['hero', 'features', 'showcase', 'how-it-works', 'testimonials', 'pricing']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Product', href: '#showcase', id: 'showcase' },
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Solutions', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Pricing', href: '#pricing', id: 'pricing' },
    { name: 'Resources', href: '#testimonials', id: 'testimonials' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 sm:px-6 pt-4 transition-all duration-300 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.4)]'
            : 'bg-slate-950/30 backdrop-blur-md border border-white/5'
        }`}
      >
        {/* Animated 3D Glow Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]">
            <div className="w-5 h-5 relative flex items-center justify-center">
              {/* Outer rotating decorative polygon */}
              <div className="absolute inset-0 border border-cyan-400/60 rounded-md rotate-45 group-hover:rotate-90 transition-transform duration-700" />
              {/* Inner glowing core */}
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white font-['Outfit'] flex items-center gap-1.5">
              AETHERIS
              <span className="text-[10px] tracking-widest text-cyan-400 font-mono font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                AI
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1.5 rounded-xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-cyan-500/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            )
          })}
        </div>

        {/* Right Actions: Login & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenDemo}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Login
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenDemo}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-slate-800 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-slate-950/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl md:hidden z-50"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-600 -rotate-90" />
                </a>
              ))}
              <div className="pt-3 mt-1 border-t border-slate-800 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenDemo()
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-300 hover:text-white rounded-xl bg-slate-900/60"
                >
                  Sign In
                </button>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenDemo()
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
