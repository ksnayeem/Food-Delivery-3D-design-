import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Flame, Clock, Plus, Eye, Sparkles } from 'lucide-react'
import type { FoodItem } from '../../types'
import { FOOD_ITEMS } from '../../data/foodData'

interface MenuSectionProps {
  onInspect: (food: FoodItem) => void
  onAddToCart: (food: FoodItem) => void
  searchQuery: string
}

export function MenuSection({ onInspect, onAddToCart, searchQuery }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'burgers', label: 'Artisan Burgers' },
    { id: 'pizza', label: 'Wood-Fired Pizza' },
    { id: 'ramen', label: 'Kyoto Ramen' },
    { id: 'sushi', label: 'Imperial Sushi' },
    { id: 'desserts', label: 'Sweet Finishes' },
  ]

  const filteredDishes = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <section id="menu" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CURATED 3D MENU</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
          Explore Our{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Artisan Catalog
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          Hover over any dish to see ingredient details, or launch the 3D inspection studio to examine
          the textures, ingredients, and thermal breakdown.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDishes.map((dish, idx) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group relative rounded-3xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 p-4 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Dish Image with 3D Preview Overlay */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-900">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Badges on image */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {dish.isChefSpecial && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase shadow-md">
                      Chef Special
                    </span>
                  )}
                  {dish.spicyLevel > 0 && (
                    <span className="px-1.5 py-0.5 rounded-lg bg-rose-500/90 text-white text-[10px] font-bold flex items-center gap-0.5">
                      {'🌶️'.repeat(dish.spicyLevel)}
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold font-mono flex items-center gap-1 border border-slate-700">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{dish.rating}</span>
                </div>

                {/* Hover 3D Quick Inspect Button */}
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <button
                    onClick={() => onInspect(dish)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-105 transition-transform"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspect in 3D</span>
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                {dish.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {dish.tagline}
              </p>

              {/* Micro-Stats: Calories & Prep Time */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-4 pb-3 border-b border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-400" />
                  {dish.calories} kcal
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {dish.prepTime}
                </span>
              </div>
            </div>

            {/* Bottom: Price & Add to Cart Action */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block">Price</span>
                <span className="text-lg font-black text-white font-mono">
                  ${dish.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => onAddToCart(dish)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
