import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Star, Flame, Clock, Sparkles, ArrowRight, Eye, ShieldCheck, Zap, Hand } from 'lucide-react'
import type { FoodItem } from '../../types'
import { FOOD_ITEMS } from '../../data/foodData'
import { FoodModel3D } from '../3d/FoodModel3D'
import { Button } from '../ui/Button'

interface FoodHeroProps {
  onInspect: (food: FoodItem) => void
  onAddToCart: (food: FoodItem) => void
}

export function FoodHero({ onInspect, onAddToCart }: FoodHeroProps) {
  const [selectedDishIdx, setSelectedDishIdx] = useState(0)
  const mouse = useRef({ x: 0, y: 0 })

  const currentDish = FOOD_ITEMS[selectedDishIdx]

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    mouse.current = { x, y }
  }

  return (
    <section
      id="hero"
      onPointerMove={handlePointerMove}
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      {/* Background warm appetizing radiance */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Culinary Storytelling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex flex-col items-start text-left"
        >
          {/* Animated Badge: Nayeem Spices with Taste */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-xs font-mono font-medium tracking-wide text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              NAYEEM SPICES & SIGNATURE TASTE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">Pure Aroma</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black font-['Outfit'] tracking-tight text-white leading-[1.08] mb-6">
            Nayeem Spices.{' '}
            <br />
            Unrivaled{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent inline-block drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]">
              Taste in 3D.
            </span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-slate-300/90 text-base sm:text-lg leading-relaxed max-w-xl mb-6 font-light">
            Infused with Chef Nayeem&apos;s legendary secret spice blends. From double Wagyu smash burgers to wood-fired truffle pizzas,
            inspect every layer in interactive 3D and enjoy thermal-locked drone delivery in minutes.
          </p>

          {/* 3D Dish Selector Switcher */}
          <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800">
            {FOOD_ITEMS.slice(0, 4).map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedDishIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDishIdx === idx
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {idx === 0 && '🍔 Wagyu Burger'}
                {idx === 1 && '🍕 Truffle Pizza'}
                {idx === 2 && '🍜 Kyoto Ramen'}
                {idx === 3 && '🍣 Dragon Roll'}
              </button>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onAddToCart(currentDish)}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Order for ${currentDish.price.toFixed(2)}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onInspect(currentDish)}
              icon={<Eye className="w-4 h-4 text-amber-400" />}
              iconPosition="left"
            >
              Inspect in 3D Studio
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-slate-800/80 w-full max-w-xl flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>18-Min Avg Drone ETA</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>68°C Thermal Lock Guaranteed</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive 3D Dish Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-6 h-[440px] sm:h-[540px] lg:h-[620px] relative flex items-center justify-center"
        >
          {/* Ambient Circular Glow Plate */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-rose-500/20 blur-3xl pointer-events-none" />

          {/* 3D Food Canvas with Touch and Orbit Controls */}
          <div className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 0, 4.4], fov: 44 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.2}
                maxPolarAngle={Math.PI / 2 + 0.3}
                minPolarAngle={Math.PI / 3 - 0.2}
                dampingFactor={0.06}
              />
              <FoodModel3D
                type={currentDish.modelType}
                isExploded={false}
                autoRotate={false}
                mouse={mouse}
              />
            </Canvas>
          </div>

          {/* Mobile Touch Rotation Prompt Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border border-amber-500/50 text-amber-300 text-[11px] font-mono shadow-xl backdrop-blur-md pointer-events-none sm:hidden">
            <Hand className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Drag with finger to rotate in 3D</span>
          </div>

          {/* Floating Badges */}
          <div className="absolute top-10 left-4 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-md shadow-xl">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">{currentDish.calories} kcal</div>
              <div className="text-[10px] text-slate-400">Nutritional Balance</div>
            </div>
          </div>

          <div className="absolute bottom-12 right-4 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-md shadow-xl">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono">{currentDish.prepTime}</div>
              <div className="text-[10px] text-slate-400">Precision Prep Time</div>
            </div>
          </div>

          <div className="absolute top-8 right-6 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-amber-500/40 text-amber-400 text-xs font-bold shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{currentDish.rating} Rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
