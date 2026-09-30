import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Sparkles, Layers, RotateCw, Plus, Check, Flame, ShieldCheck } from 'lucide-react'
import { FoodModel3D } from '../3d/FoodModel3D'
import { Button } from '../ui/Button'
import type { FoodItem } from '../../types'
import { FOOD_ITEMS } from '../../data/foodData'
import { api } from '../../api/client'

interface CustomizerSectionProps {
  onAddCustomBurger: (burger: FoodItem, toppings: string[], price: number) => void
}

export function CustomizerSection({ onAddCustomBurger }: CustomizerSectionProps) {
  const [isExploded, setIsExploded] = useState(false)
  const [pattyCount, setPattyCount] = useState<1 | 2 | 3>(2)
  const [cheeseType, setCheeseType] = useState('Melting Aged Gouda')
  const [selectedToppings, setSelectedToppings] = useState<string[]>([
    'Black Truffle Aioli',
    'Caramelized Balsamic Shallots',
  ])
  const [isAdded, setIsAdded] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })

  const baseBurger = FOOD_ITEMS[0]

  const availableToppings = [
    { name: 'Crispy Smoked Pancetta', price: 2.8, cal: 120 },
    { name: 'Pickled Habanero Jalapeños', price: 1.2, cal: 15 },
    { name: 'Black Truffle Aioli', price: 1.5, cal: 90 },
    { name: 'Caramelized Balsamic Shallots', price: 1.5, cal: 45 },
    { name: 'Organic Fried Duck Egg', price: 2.2, cal: 110 },
  ]

  const toggleTopping = (name: string) => {
    setSelectedToppings((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    )
  }

  // Calculate dynamic price and calories with local fallback
  const extraPattyPrice = (pattyCount - 1) * 4.5
  const toppingsPrice = selectedToppings.reduce((sum, tName) => {
    const found = availableToppings.find((t) => t.name === tName)
    return sum + (found ? found.price : 0)
  }, 0)
  const fallbackPrice = (baseBurger.price + extraPattyPrice + toppingsPrice).toFixed(2)

  const extraCalories =
    (pattyCount - 1) * 240 +
    selectedToppings.reduce((sum, tName) => {
      const found = availableToppings.find((t) => t.name === tName)
      return sum + (found ? found.cal : 0)
    }, 0)
  const fallbackCalories = baseBurger.calories + extraCalories

  const [serverPrice, setServerPrice] = useState<string>(fallbackPrice)
  const [serverCalories, setServerCalories] = useState<number>(fallbackCalories)
  const [isServerSynced, setIsServerSynced] = useState(false)

  // Verify calculation on the backend
  useEffect(() => {
    let active = true
    api
      .calculateCustomBurger({
        baseFoodId: baseBurger.id,
        pattyCount,
        cheeseType,
        selectedToppings,
      })
      .then((calc) => {
        if (active && calc) {
          setServerPrice(calc.totalPrice.toFixed(2))
          setServerCalories(calc.totalCalories)
          setIsServerSynced(true)
        }
      })
      .catch(() => {
        if (active) {
          setServerPrice(fallbackPrice)
          setServerCalories(fallbackCalories)
        }
      })
    return () => {
      active = false
    }
  }, [pattyCount, cheeseType, selectedToppings, fallbackPrice, fallbackCalories, baseBurger.id])

  const totalPrice = serverPrice
  const totalCalories = serverCalories

  const handleAdd = () => {
    onAddCustomBurger(baseBurger, selectedToppings, parseFloat(totalPrice))
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <section id="customizer" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE 3D LAB</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
          Architect Your Own{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Culinary Masterpiece
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          Customize ingredients in real-time 3D. Explode the layers to view the cross-section, calibrate
          patty thickness, and inspect thermal moisture in real-time.
        </p>
      </div>

      {/* Interactive 3D Customizer Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Left: 3D Render Canvas with Exploded View Toggle */}
        <div className="lg:col-span-7 h-[400px] sm:h-[480px] relative rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/90 border border-slate-800 flex flex-col justify-between p-4 sm:p-6">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-amber-400">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>360° Drag & Inspect</span>
            </div>

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
          </div>

          <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 0, 4.4], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={!isExploded}
                autoRotateSpeed={1.0}
                maxPolarAngle={Math.PI / 2 + 0.3}
                minPolarAngle={Math.PI / 3 - 0.2}
                dampingFactor={0.06}
              />
              <FoodModel3D
                type="burger"
                isExploded={isExploded}
                autoRotate={false}
                mouse={mouse}
              />
            </Canvas>
          </div>

          {/* Mobile Touch Rotation Hint Badge */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border border-amber-500/50 text-amber-300 text-[11px] font-mono shadow-xl backdrop-blur-md pointer-events-none sm:hidden z-10">
            <RotateCw className="w-3 h-3 text-amber-400" />
            <span>Touch & drag to rotate</span>
          </div>

          <div className="flex items-center justify-between z-10 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-rose-400">
              <Flame className="w-3.5 h-3.5" />
              {totalCalories} kcal
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-amber-400 font-bold">
              ${totalPrice}
            </span>
          </div>
        </div>

        {/* Right: Customization Controls Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Patty Stack Selector */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              1. Wagyu Patty Thickness:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setPattyCount(count as 1 | 2 | 3)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    pattyCount === count
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {count === 1 && 'Single (180g)'}
                  {count === 2 && 'Double (360g)'}
                  {count === 3 && 'Triple Monster'}
                </button>
              ))}
            </div>
          </div>

          {/* Cheese Selection */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              2. Artisanal Cheese Melt:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['Melting Aged Gouda', 'Smoked Cheddar', 'Truffle Havarti', 'Pepper Jack'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setCheeseType(ch)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                    cheeseType === ch
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Gourmet Toppings Checklist */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              3. Artisan Extras & Sauces:
            </h4>
            <div className="space-y-2">
              {availableToppings.map((top) => {
                const isSelected = selectedToppings.includes(top.name)
                return (
                  <div
                    key={top.name}
                    onClick={() => toggleTopping(top.name)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
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
                      {top.name}
                    </span>
                    <span className="font-mono text-amber-400">+${top.price.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Total & Add Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Custom Total</span>
                {isServerSynced && (
                  <span className="flex items-center gap-0.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified
                  </span>
                )}
              </div>
              <span className="text-2xl font-black text-white font-mono">${totalPrice}</span>
            </div>

            <Button
              variant="primary"
              onClick={handleAdd}
              className="flex-1 justify-center bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black"
              icon={isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {isAdded ? 'Added Custom Burger!' : 'Add Custom Burger'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
