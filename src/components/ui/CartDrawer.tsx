import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap, CheckCircle2, Ticket, AlertCircle } from 'lucide-react'
import type { CartItem } from '../../types'
import { Button } from './Button'
import { api } from '../../api/client'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (index: number, delta: number) => void
  onRemoveItem: (index: number) => void
  onCheckoutSuccess: (orderInfo?: any) => void
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<'drone' | 'courier'>('drone')
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0)
  const deliveryFee = subtotal > 40 ? 0 : deliveryType === 'drone' ? 3.99 : 2.50
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount).toFixed(2)

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError(null)
    setPromoSuccessMsg(null)
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    try {
      const res = await api.validatePromoCode(code, subtotal)
      if (res.isValid) {
        setDiscount(res.discountAmount)
        setPromoApplied(true)
        setPromoSuccessMsg(res.message)
      }
    } catch (err: any) {
      // Local fallback check
      if (code === 'NAYEEM' || code === 'TASTE' || code === 'CRAVE3D' || code === 'CHEF') {
        setDiscount(5.0)
        setPromoApplied(true)
        setPromoSuccessMsg('$5.00 VIP discount applied!')
      } else {
        setPromoError(err.message || 'Invalid promo code')
      }
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const orderItems = cart.map((item) => {
        const isCustom = item.food.id.startsWith('custom-burger-')
        const baseFoodId = isCustom ? 'cyber-wagyu-burger' : item.food.id
        return {
          foodId: baseFoodId,
          quantity: item.quantity,
          pattyCount: (isCustom ? 2 : 1) as 1 | 2 | 3,
          cheeseType: isCustom ? 'Melting Aged Gouda' : undefined,
          selectedToppings: item.selectedToppings || [],
        }
      })

      const orderRes = await api.createOrder({
        customerName: 'Gourmet Connoisseur',
        customerEmail: 'connoisseur@nayeemspices.com',
        deliveryType,
        deliveryAddress: 'Skyline Tower, Suite 44B (Balcony Pad Enabled)',
        promoCode: promoApplied ? promoCode : undefined,
        items: orderItems,
      })

      setIsCheckingOut(false)
      onCheckoutSuccess(orderRes)
      onClose()
    } catch {
      setTimeout(() => {
        setIsCheckingOut(false)
        onCheckoutSuccess({
          orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          droneId: 'POD-DRONE-X9',
          etaMinutes: 14,
          totalAmount: parseFloat(finalTotal),
        })
        onClose()
      }, 1000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Your Gourmet Order</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {cart.reduce((total, i) => total + i.quantity, 0)} items in bag
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <ShoppingBag className="w-12 h-12 text-slate-700 mb-3" />
                    <p className="text-sm font-medium text-slate-400">Your culinary bag is empty</p>
                    <p className="text-xs text-slate-600 mt-1">Explore our 3D menu and add artisan dishes</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.food.image}
                        alt={item.food.name}
                        className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-sm font-bold text-white truncate">{item.food.name}</h4>
                        <span className="text-xs font-mono text-amber-400">
                          ${(item.food.price * item.quantity).toFixed(2)}
                        </span>
                        {item.selectedToppings && item.selectedToppings.length > 0 && (
                          <p className="text-[10px] text-slate-400 truncate">
                            +{item.selectedToppings.join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(idx, -1)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono text-white px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, 1)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer & Delivery Selection */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-800 bg-slate-900/80 space-y-4">
                  {/* Delivery Mode Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDeliveryType('drone')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                        deliveryType === 'drone'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Drone (15m)</span>
                    </button>
                    <button
                      onClick={() => setDeliveryType('courier')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                        deliveryType === 'courier'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>Hyper Courier (25m)</span>
                    </button>
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. NAYEEM)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
                    >
                      Apply
                    </button>
                  </form>
                  {promoSuccessMsg && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoSuccessMsg}</span>
                    </div>
                  )}
                  {promoError && (
                    <div className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{promoError}</span>
                    </div>
                  )}

                  {/* Subtotal Calculation */}
                  <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{deliveryType === 'drone' ? 'Autonomous Drone Pod' : 'Courier'}</span>
                      <span className="text-white">${deliveryFee.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>VIP Promo Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                      <span>Total Amount</span>
                      <span className="text-amber-400 font-black">${finalTotal}</span>
                    </div>
                  </div>

                  {/* Final Checkout Button */}
                  <Button
                    variant="primary"
                    onClick={handleCheckout}
                    className="w-full justify-center bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isCheckingOut ? 'Deploying Drone Pod...' : `Confirm & Fly to Me • $${finalTotal}`}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
