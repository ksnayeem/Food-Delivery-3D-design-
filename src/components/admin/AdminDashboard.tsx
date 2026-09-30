import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Activity,
  Database,
  Radio,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Thermometer,
  Zap,
  ArrowLeft,
  RefreshCw,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'
import { FOOD_ITEMS } from '../../data/foodData'
import type { FoodItem, OrderStatus } from '../../types'

export function AdminDashboard() {
  const { isAdminOpen, setIsAdminOpen } = useAuth()
  const [activeTab, setActiveTab] = useState<'pipeline' | 'inventory' | 'fleet' | 'promos'>('pipeline')
  const [orders, setOrders] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<FoodItem[]>(FOOD_ITEMS)
  const [isLoading, setIsLoading] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null)

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      const [allOrders, catalog] = await Promise.all([
        api.getAllOrders(),
        api.getMenu('all'),
      ])
      if (allOrders) setOrders(allOrders)
      if (catalog && catalog.length > 0) setMenuItems(catalog)
    } catch (e) {
      console.warn('Failed to load live admin data:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAdminOpen) {
      fetchAdminData()
    }
  }, [isAdminOpen])

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      setStatusFeedback(`Order ${orderId.slice(0, 8)} transitioned to ${newStatus}`)
      setTimeout(() => setStatusFeedback(null), 3000)
    } catch (err: any) {
      setStatusFeedback(`Error: ${err.message}`)
      setTimeout(() => setStatusFeedback(null), 3000)
    }
  }

  const handleToggleAvailability = async (item: FoodItem) => {
    const updatedStatus = !(item.isAvailable !== false)
    try {
      await api.updateMenuItem(item.id, { isAvailable: updatedStatus })
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: updatedStatus } : i))
      )
    } catch {
      // local toggle fallback
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: updatedStatus } : i))
      )
    }
  }

  // Aggregate stats
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'KITCHEN_PREPARING').length
  const airborneCount = orders.filter((o) => o.status === 'AIRBORNE' || o.status === 'HERMETICALLY_SEALED').length

  if (!isAdminOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-[#06080e] text-slate-100 flex flex-col"
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white font-['Outfit'] tracking-tight">
                  NAYEEM SPICES // EXECUTIVE COMMAND
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ADMIN SUITE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Autonomous Kitchen, Airspace Telemetry & Orders Engine
              </p>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">PostgreSQL:</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Redis Cache:</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-400">Kafka Bus:</span>
              <span className="text-emerald-400 font-bold">Streaming</span>
            </div>
          </div>

          {/* Actions: Refresh & Exit */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </header>

        {/* Feedback Alert */}
        {statusFeedback && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 text-center text-xs font-mono text-amber-300 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{statusFeedback}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
          {/* Metrics Overview Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Gross Platform Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% from peak dinner window</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Active Orders</span>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {orders.length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                {confirmedCount} in kitchen • {airborneCount} airborne
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Drone Fleet Availability</span>
                <Radio className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                100%
              </div>
              <div className="text-[11px] text-cyan-400 font-mono mt-1">
                POD-DRONE-X9 in Corridor #12
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Thermal Lock Pod Temp</span>
                <Thermometer className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-black text-orange-400 font-mono">
                68.5°C
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Hermetic seal compliance: Nominal
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'pipeline', label: '1. Kitchen Orders Pipeline', icon: ShoppingBag },
              { id: 'inventory', label: '2. Menu & Inventory Control', icon: Layers },
              { id: 'fleet', label: '3. Drone Fleet Radar Control', icon: Radio },
              { id: 'promos', label: '4. Promo Codes & Marketing', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* TAB 1: Kitchen Orders Pipeline */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Live Dispatch Queue</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {orders.length} orders
                  </span>
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="py-20 text-center rounded-2xl bg-slate-950/60 border border-slate-800">
                  <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-300">No Orders in Dispatch Queue</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Place an order on the storefront to test real-time dispatch and state transitions.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((ord: any) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold font-mono text-white">
                            {ord.orderNumber}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-300 font-semibold">
                            {ord.customerName}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400">{ord.customerEmail}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              ord.status === 'CONFIRMED'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : ord.status === 'KITCHEN_PREPARING'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : ord.status === 'PLATED'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : ord.status === 'HERMETICALLY_SEALED'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : ord.status === 'AIRBORNE'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            {ord.deliveryType === 'drone' ? 'Autonomous Drone Pod #409' : 'Hyper Courier'}
                          </span>
                          <span>•</span>
                          <span>Address: {ord.deliveryAddress}</span>
                          <span>•</span>
                          <span className="font-mono text-amber-400 font-bold">
                            Total: ${parseFloat(ord.totalAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* State Transition Action Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'KITCHEN_PREPARING')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-[11px] font-semibold text-slate-300"
                        >
                          Station Prep
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'PLATED')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-400 text-[11px] font-semibold text-slate-300"
                        >
                          Mark Plated
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'HERMETICALLY_SEALED')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-400 text-[11px] font-semibold text-slate-300"
                        >
                          Thermal Lock
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'AIRBORNE')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 hover:bg-cyan-500/10 text-[11px] font-semibold text-cyan-300"
                        >
                          Fly Drone
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 text-[11px] font-semibold text-emerald-300"
                        >
                          Delivered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Menu & Inventory Control */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Culinary Menu Inventory</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Real-time stock availability & pricing overrides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {menuItems.map((item) => {
                  const isAvailable = item.isAvailable !== false
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-800 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-xs font-mono text-amber-400 font-bold block">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className={isAvailable ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                          {isAvailable ? 'In Stock' : 'Sold Out'}
                        </span>
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-medium"
                        >
                          {isAvailable ? (
                            <>
                              <ToggleRight className="w-4 h-4 text-emerald-400" />
                              <span>Toggle</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 text-rose-400" />
                              <span>Restore</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Drone Fleet Radar Control */}
          {activeTab === 'fleet' && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Drone Fleet Telemetry Terminal</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Live Pod Flight Parameters & Climate Sensors
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/40">
                  Airspace Grid Clear
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Primary Drone</span>
                  <span className="text-xl font-black text-white font-mono">POD-DRONE-X9</span>
                  <span className="text-xs text-emerald-400 font-mono block mt-1">Autonomous Rotor OK</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Designated Corridor</span>
                  <span className="text-xl font-black text-amber-400 font-mono">Corridor #12</span>
                  <span className="text-xs text-slate-400 font-mono block mt-1">Direct Skyline Line</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Insulated Pod Temp</span>
                  <span className="text-xl font-black text-rose-400 font-mono">68.5°C Steady</span>
                  <span className="text-xs text-slate-400 font-mono block mt-1">Target Lock: 68.0°C - 70.0°C</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Promo Codes & Marketing */}
          {activeTab === 'promos' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Active Gourmet Promo Codes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { code: 'NAYEEM', discount: '$5.00 OFF', desc: 'Platform Launch VIP' },
                  { code: 'TASTE', discount: '$5.00 OFF', desc: 'Artisan Connoisseur Special' },
                  { code: 'CRAVE3D', discount: '$5.00 OFF', desc: '3D Burger Lab Drop' },
                  { code: 'CHEF', discount: '$5.00 OFF', desc: 'Executive Chef Secret List' },
                ].map((p) => (
                  <div key={p.code} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-sm font-black font-mono text-amber-400 block tracking-wider">
                      {p.code}
                    </span>
                    <span className="text-xs text-white font-bold block mt-1">{p.discount}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{p.desc}</span>
                    <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </AnimatePresence>
  )
}
