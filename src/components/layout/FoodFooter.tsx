import { useState } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react'
import { TasteLogo } from '../ui/TasteLogo'
import { api } from '../../api/client'

export function FoodFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await api.subscribeNewsletter(email)
      setSubscribed(true)
    } catch {
      setSubscribed(true)
    }
  }

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/95 pt-16 pb-12 overflow-hidden text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info: Nayeem Spices */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <TasteLogo size="lg" showTagline={true} />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Artisan gastronomy infused with Chef Nayeem&apos;s signature spices. Inspect ingredients in true three dimensions,
              customize recipes in real time, and receive thermal-locked gourmet meals via autonomous flight in minutes.
            </p>

            {/* Fleet Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">Drone Corridors Open</span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400 font-mono">16 min Avg Delivery</span>
            </div>
          </div>

          {/* Column: 3D Catalog */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold mb-4">
              Gourmet Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">A5 Wagyu Burgers</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Truffle Wood-Fired Pizza</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Kyoto Tonkotsu Ramen</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Imperial Dragon Sushi</a></li>
              <li><a href="#customizer" className="hover:text-amber-400 transition-colors">3D Burger Lab</a></li>
            </ul>
          </div>

          {/* Column: Logistics */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold mb-4">
              Drone Logistics
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#tracking" className="hover:text-amber-400 transition-colors">Airspace Radar</a></li>
              <li><a href="#tracking" className="hover:text-amber-400 transition-colors">Thermal Lock Technology</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Rooftop Landing Pads</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Safety Certifications</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Zero-Emission Fleet</a></li>
            </ul>
          </div>

          {/* Column: Secret Specials Newsletter */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold mb-4">
              Secret Chef Drops
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Receive notifications for limited midnight omakase and truffle drop reservations.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You&apos;re on the VIP chef list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="foodie@connoisseur.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Nayeem Spices with Taste Inc. All rights reserved</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FDA & Health Dept Inspected</span>
            </span>
            <span>•</span>
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Taste</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
