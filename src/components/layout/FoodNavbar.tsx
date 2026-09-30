import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin, Search, Menu, X, ChevronDown, Sparkles } from 'lucide-react'
import { TasteLogo } from '../ui/TasteLogo'
import { api } from '../../api/client'

interface FoodNavbarProps {
  cartCount: number
  onOpenCart: () => void
  onSelectCategory: (category: string) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function FoodNavbar({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}: FoodNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [location] = useState('Skyline Tower, Suite 44B')
  const [isApiOnline, setIsApiOnline] = useState(false)

  useEffect(() => {
    api.checkHealth().then(() => setIsApiOnline(true)).catch(() => setIsApiOnline(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 pt-3 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-xl border border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.5)]'
            : 'bg-slate-950/40 backdrop-blur-md border border-white/5'
        }`}
      >
        {/* Left: Nayeem Spices with Taste Logo */}
        <a href="#hero">
          <TasteLogo size="md" />
        </a>

        {/* Center: Delivery Location Pill (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 cursor-pointer">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-500 uppercase font-mono flex items-center gap-1.5">
              Deliver To
              {isApiOnline && (
                <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  API Active
                </span>
              )}
            </span>
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              {location}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </span>
          </div>
        </div>

        {/* Center-Right: Search Input */}
        <div className="hidden md:flex items-center relative w-56 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Wagyu, Truffle, Ramen..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Navigation Anchors */}
        <div className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <a href="#menu" className="hover:text-amber-400 transition-colors">3D Menu</a>
          <a href="#customizer" className="hover:text-amber-400 transition-colors">Customizer</a>
          <a href="#tracking" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Drone Radar
          </a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
        </div>

        {/* Right Action: Cart Button with Animated Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center ml-0.5">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 bg-slate-950/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl xl:hidden z-50 space-y-4"
          >
            <div className="flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-2.5 text-sm font-semibold text-slate-200">
              <a
                href="#menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-900 flex justify-between items-center"
              >
                <span>3D Gourmet Menu</span>
                <span className="text-amber-400 text-xs">8 dishes</span>
              </a>
              <a
                href="#customizer"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-900 flex justify-between items-center"
              >
                <span>3D Burger Customizer</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-900 flex justify-between items-center"
              >
                <span>Live Drone Radar</span>
                <span className="text-emerald-400 text-xs font-mono">15m ETA</span>
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-900"
              >
                Customer Reviews
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
