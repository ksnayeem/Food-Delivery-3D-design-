import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { X, Layers, RotateCw, Plus, Star, Flame, Clock, Sparkles, Check } from 'lucide-react'
import type { FoodItem } from '../../types'
import { FoodModel3D } from '../3d/FoodModel3D'
import { Button } from './Button'

interface FoodModal3DProps {
  food: FoodItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (food: FoodItem, toppings: string[]) => void
}

export function FoodModal3D({ food, isOpen, onClose, onAddToCart }: FoodModal3DProps) {
  const [isExploded, setIsExploded] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [isAdded, setIsAdded] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsExploded(false)
      setSelectedToppings([])
      setIsAdded(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!food) return null

  const extraToppings = [
    { name: 'Double Aged Truffle Gouda', price: 2.5 },
    { name: 'Crispy Smoked Pancetta', price: 3.0 },
    { name: 'Pickled Habanero Jalapeños', price: 1.5 },
    { name: 'Extra Umami Aioli Dip', price: 1.8 },
  ]

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    )
  }

  const extraPrice = selectedToppings.length * 2.2
  const totalPrice = (food.price + extraPrice).toFixed(2)

  const handleAdd = () => {
    onAddToCart(food, selectedToppings)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      onClose()
    }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Left Column: Interactive 3D Food Studio */}
            <div className="lg:col-span-7 h-[360px] sm:h-[460px] lg:h-[580px] relative bg-gradient-to-b from-slate-900/90 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between p-4 sm:p-6">
              {/* Studio Header & Controls */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D CULINARY STUDIO</span>
                </div>

                {/* Exploded View Toggle */}
                {food.modelType === 'burger' && (
                  <button
                    onClick={() => setIsExploded(!isExploded)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isExploded
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_#f59e0b]'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isExploded ? 'Assemble Layers' : 'Explode Ingredients'}</span>
                  </button>
                )}
              </div>

              {/* 3D Canvas */}
              <div className="absolute inset-0 z-0">
                <Canvas
                  camera={{ position: [0, 0, 4.8], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <FoodModel3D
                    type={food.modelType}
                    isExploded={isExploded}
                    autoRotate={true}
                    mouse={mouse}
                  />
                </Canvas>
              </div>

              {/* Bottom Instructions Badge */}
              <div className="flex items-center justify-between z-10 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  360° Real-time Three.js Rendering
                </span>
                <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400">
                  Thermal Guaranteed 68°C
                </span>
              </div>
            </div>

            {/* Right Column: Culinary Details, Customizer & Checkout */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between max-h-[580px] overflow-y-auto">
              <div>
                {/* Close Button */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    {food.category}
                  </span>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dish Name */}
                <h3 className="text-2xl font-black text-white font-['Outfit'] mb-2">
                  {food.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {food.description}
                </p>

                {/* Badges: Rating, Calories, Prep Time */}
                <div className="flex items-center gap-3 py-3 border-y border-slate-800/80 mb-6 text-xs text-slate-300">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{food.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>{food.calories} kcal</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{food.prepTime}</span>
                  </div>
                </div>

                {/* Ingredients Breakdown */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-2.5">
                    Artisan Ingredients:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {food.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Optional Customizer Toppings */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-2.5">
                    Customize in 3D:
                  </h4>
                  <div className="space-y-2">
                    {extraToppings.map((item) => {
                      const isSelected = selectedToppings.includes(item.name)
                      return (
                        <div
                          key={item.name}
                          onClick={() => toggleTopping(item.name)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/50 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-amber-500 border-amber-400 text-slate-950'
                                  : 'border-slate-700'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </span>
                            {item.name}
                          </span>
                          <span className="font-mono text-amber-400">+${item.price.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Add to Cart Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Price</span>
                  <span className="text-2xl font-black text-white font-mono">${totalPrice}</span>
                </div>

                <Button
                  variant="primary"
                  onClick={handleAdd}
                  className="flex-1 justify-center bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold"
                  icon={isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                >
                  {isAdded ? 'Added to Cart!' : 'Add to Order'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
