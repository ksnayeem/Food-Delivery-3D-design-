import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap, ShoppingBag } from 'lucide-react'
import type { FoodItem, CartItem } from './types'
import { FOOD_ITEMS } from './data/foodData'
import { FoodNavbar } from './components/layout/FoodNavbar'
import { FoodHero } from './components/sections/FoodHero'
import { MenuSection } from './components/sections/MenuSection'
import { CustomizerSection } from './components/sections/CustomizerSection'
import { LiveTrackingSection } from './components/sections/LiveTrackingSection'
import { WhyChooseUs } from './components/sections/WhyChooseUs'
import { FoodReviews } from './components/sections/FoodReviews'
import { FoodFooter } from './components/layout/FoodFooter'
import { CartDrawer } from './components/ui/CartDrawer'
import { FoodModal3D } from './components/ui/FoodModal3D'

export function App() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      food: FOOD_ITEMS[0],
      quantity: 1,
      selectedToppings: ['Black Truffle Aioli'],
    },
  ])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [inspectFood, setInspectFood] = useState<FoodItem | null>(null)
  const [isInspectOpen, setIsInspectOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [lastOrder, setLastOrder] = useState<{
    orderNumber: string
    droneId: string
    etaMinutes: number
    totalAmount: number
  } | null>(null)

  // Add standard food item to cart
  const handleAddToCart = (food: FoodItem, toppings: string[] = []) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.food.id === food.id && JSON.stringify(i.selectedToppings) === JSON.stringify(toppings)
      )
      if (existingIdx > -1) {
        const updated = [...prev]
        updated[existingIdx].quantity += 1
        return updated
      }
      return [...prev, { food, quantity: 1, selectedToppings: toppings }]
    })
  }

  // Add customized 3D burger with calculated custom price
  const handleAddCustomBurger = (
    baseBurger: FoodItem,
    toppings: string[],
    customPrice: number
  ) => {
    const customFoodItem: FoodItem = {
      ...baseBurger,
      id: `custom-burger-${Date.now()}`,
      name: 'Custom 3D Wagyu Stack',
      price: customPrice,
      description: `Customized with: ${toppings.join(', ')}`,
    }
    setCart((prev) => [...prev, { food: customFoodItem, quantity: 1, selectedToppings: toppings }])
    setIsCartOpen(true)
  }

  // Update item quantity
  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev]
      const newQty = updated[index].quantity + delta
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index)
      }
      updated[index].quantity = newQty
      return updated
    })
  }

  // Remove item from cart
  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  // Open 3D inspector modal
  const handleInspectFood = (food: FoodItem) => {
    setInspectFood(food)
    setIsInspectOpen(true)
  }

  // Order placed notification
  const handleCheckoutSuccess = (orderInfo?: any) => {
    setCart([])
    if (orderInfo) {
      setLastOrder({
        orderNumber: orderInfo.orderNumber || 'ORD-2026-9041',
        droneId: orderInfo.droneId || 'POD-DRONE-X9',
        etaMinutes: orderInfo.etaMinutes || 14,
        totalAmount: orderInfo.totalAmount || 0,
      })
    }
    setOrderSuccess(true)
    setTimeout(() => setOrderSuccess(false), 7000)
  }

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Dynamic Background Radiance Pools */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-600/10 blur-[160px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-orange-600/10 blur-[170px] rounded-full" />
        <div className="absolute bottom-1/4 left-10 w-[650px] h-[650px] bg-rose-600/10 blur-[180px] rounded-full" />

        {/* Subtle Cybernetic Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      {/* Floating Glass Gourmet Navbar */}
      <FoodNavbar
        cartCount={cart.reduce((total, i) => total + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Flow */}
      <main className="relative z-10 flex flex-col">
        {/* 1. 3D Culinary Hero Section with Interactive Dish Switcher */}
        <FoodHero
          onInspect={handleInspectFood}
          onAddToCart={(dish) => {
            handleAddToCart(dish)
            setIsCartOpen(true)
          }}
        />

        {/* 2. Interactive 3D Catalog Menu with Category Filters */}
        <MenuSection
          onInspect={handleInspectFood}
          onAddToCart={(dish) => {
            handleAddToCart(dish)
            setIsCartOpen(true)
          }}
          searchQuery={searchQuery}
        />

        {/* 3. 3D Burger & Recipe Customizer Lab */}
        <CustomizerSection onAddCustomBurger={handleAddCustomBurger} />

        {/* 4. Live 3D Autonomous Drone Fleet & City Radar Tracker */}
        <LiveTrackingSection />

        {/* 5. Why Choose Us (Thermal Pods, Sub-20 Min, Michelin Chefs) */}
        <WhyChooseUs />

        {/* 6. Food Critic & Customer Reviews */}
        <FoodReviews />
      </main>

      {/* Footer with Fleet Telemetry */}
      <FoodFooter />

      {/* Slide-out Cart Drawer with Delivery Mode & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* 3D Food Inspection Studio Modal */}
      <FoodModal3D
        food={inspectFood}
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Order Confirmed Animated Toast Banner */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                Order {lastOrder?.orderNumber ? `${lastOrder.orderNumber}` : '#ORD-2026'} Dispatched!
              </h4>
              <p className="text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                Drone {lastOrder?.droneId || 'POD-DRONE-X9'} is airborne • ETA: {lastOrder?.etaMinutes || 14} mins • ${lastOrder?.totalAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Floating Sticky Cart Bar */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-4 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-[0_4px_25px_rgba(245,158,11,0.5)] flex items-center justify-between text-sm active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>View Bag ({cart.reduce((t, i) => t + i.quantity, 0)})</span>
            </div>
            <span className="font-mono font-black text-base">
              ${cart.reduce((s, i) => s + i.food.price * i.quantity, 0).toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default App
