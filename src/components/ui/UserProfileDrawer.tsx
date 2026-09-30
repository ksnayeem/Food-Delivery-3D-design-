import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Shield,
  MapPin,
  Zap,
  ShoppingBag,
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Radio,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'
import type { UserRole } from '../../types'

export function UserProfileDrawer() {
  const { user, isProfileOpen, setIsProfileOpen, switchRole, updateAddress, setIsAdminOpen } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'roles'>('profile')
  const [orders, setOrders] = useState<any[]>([])
  const [addressInput, setAddressInput] = useState(user.address)
  const [balconyPad, setBalconyPad] = useState(user.balconyPadEnabled)
  const [addressSaved, setAddressSaved] = useState(false)

  useEffect(() => {
    if (isProfileOpen) {
      api.getAllOrders().then((allOrders) => {
        if (allOrders) setOrders(allOrders)
      }).catch(() => {})
    }
  }, [isProfileOpen])

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    updateAddress(addressInput, balconyPad)
    setAddressSaved(true)
    setTimeout(() => setAddressSaved(false), 2000)
  }

  const roleColors: Record<UserRole, { badge: string; text: string; bg: string }> = {
    CUSTOMER: { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', text: 'VIP Connoisseur', bg: 'from-emerald-500/10' },
    ADMIN: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: 'Executive Admin', bg: 'from-amber-500/15' },
    CHEF: { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30', text: 'Executive Chef', bg: 'from-rose-500/10' },
    DISPATCHER: { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', text: 'Fleet Dispatcher', bg: 'from-cyan-500/10' },
  }

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                    <User className="w-3.5 h-3.5" />
                    <span>USER PROFILE & MEMBERSHIP</span>
                  </div>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Card */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
                    {user.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-bold text-white truncate">{user.fullName}</h3>
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase ${(roleColors[user.role as UserRole] || roleColors.CUSTOMER).badge}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-amber-400">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>{user.spicePoints} Spice Loyalty Credits</span>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="grid grid-cols-3 gap-1 mt-6 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-2 rounded-lg transition-all ${
                      activeTab === 'profile'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-2 rounded-lg transition-all relative ${
                      activeTab === 'orders'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Orders
                    {orders.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-amber-300">
                        {orders.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('roles')}
                    className={`py-2 rounded-lg transition-all ${
                      activeTab === 'roles'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Roles & Demo
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* 1. Profile Details & Delivery Address Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-5">
                    {/* VIP Connoisseur Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          {user.tier}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          Tier Status Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Enjoy complimentary autonomous drone deliveries on orders over $40 and exclusive priority kitchen dispatching.
                      </p>
                    </div>

                    {/* Address & Balcony Drone Pad */}
                    <form onSubmit={handleSaveAddress} className="space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          Delivery Coordinates
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400">GPS Locked</span>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Street / Tower Address</label>
                        <input
                          type="text"
                          value={addressInput}
                          onChange={(e) => setAddressInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Balcony Pad Toggle */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <Radio className="w-4 h-4 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block">Balcony Drone Landing Pad</span>
                            <span className="text-[10px] text-slate-500 block">Enables precision rooftop/balcony drop</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setBalconyPad(!balconyPad)}
                          className={`w-11 h-6 rounded-full transition-colors relative ${
                            balconyPad ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              balconyPad ? 'left-6' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        {addressSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Address Calibrated!</span>
                          </>
                        ) : (
                          <span>Save Delivery Address</span>
                        )}
                      </button>
                    </form>

                    {/* Admin Access Shortcut if role is ADMIN */}
                    {user.role === 'ADMIN' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border border-amber-500/50 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-400" />
                            <h4 className="text-sm font-bold text-white">Admin Privileges Active</h4>
                          </div>
                          <span className="text-[10px] font-mono bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                            COMMAND
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                          You have full control over kitchen dispatch, order state machines, and drone fleet radar.
                        </p>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false)
                            setIsAdminOpen(true)
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                        >
                          <span>Open Admin Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Orders History Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-3">
                    {orders.length === 0 ? (
                      <div className="py-16 text-center">
                        <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-400">No past orders found</p>
                        <p className="text-xs text-slate-600 mt-1">Order your first artisan dish from our 3D catalog</p>
                      </div>
                    ) : (
                      orders.map((ord: any) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-white">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                ord.status === 'CONFIRMED'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : ord.status === 'AIRBORNE'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : ord.status === 'DELIVERED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              {ord.deliveryType === 'drone' ? 'Drone Flight #12' : 'Courier'}
                            </span>
                            <span className="font-mono text-white font-bold">
                              ${parseFloat(ord.totalAmount).toFixed(2)}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <span>{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-emerald-400">ETA: {ord.etaMinutes} mins</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. Role Switcher / Demo Tab */}
                {activeTab === 'roles' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instant multi-role simulation. Switch identity to test role-based permissions across Customer, Executive Chef, Drone Dispatcher, and Platform Admin:
                    </p>

                    <div className="space-y-2.5">
                      {[
                        {
                          role: 'CUSTOMER' as UserRole,
                          title: 'Gourmet Patron (Customer)',
                          desc: 'Full catalog, 3D customizer, cart checkout & live drone tracking.',
                        },
                        {
                          role: 'CHEF' as UserRole,
                          title: 'Executive Chef (Kitchen Station 04)',
                          desc: 'Kitchen order board, dish plating & thermal sealing triggers.',
                        },
                        {
                          role: 'DISPATCHER' as UserRole,
                          title: 'Drone Fleet Radar Dispatcher',
                          desc: 'Autonomous corridor oversight, battery & climate telemetry monitoring.',
                        },
                        {
                          role: 'ADMIN' as UserRole,
                          title: 'Executive Administrator (Chef Nayeem)',
                          desc: 'Complete control suite, revenue stats, inventory toggles & orders pipeline.',
                        },
                      ].map((item) => (
                        <div
                          key={item.role}
                          onClick={() => switchRole(item.role)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            user.role === item.role
                              ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-400/20'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white flex items-center gap-2">
                              {item.title}
                            </span>
                            {user.role === item.role && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500 text-slate-950 font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          setIsAdminOpen(true)
                        }}
                        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Launch Admin Dashboard</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px]">ID: {user.id}</span>
                <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Authenticated Session
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
