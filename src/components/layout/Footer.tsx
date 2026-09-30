import { useState } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
    }
  }

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/90 pt-16 pb-12 overflow-hidden text-sm">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-14 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/40">
                <div className="w-4 h-4 border border-cyan-400/80 rounded rotate-45" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute" />
              </div>
              <span className="text-xl font-bold tracking-wider text-white font-['Outfit']">
                AETHERIS
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              The next-generation distributed 3D neural platform. Orchestrating autonomous agents, ultra-low latency compute, and real-time observability.
            </p>

            {/* Live Operational Status Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">All Systems Operational</span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400 font-mono">99.998%</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Neural Engine</a></li>
              <li><a href="#showcase" className="hover:text-cyan-400 transition-colors">Autonomous Agents</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Global Edge Mesh</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Zero-Trust Enclaves</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing & SLA</a></li>
            </ul>
          </div>

          {/* Column 2: Developers */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Python SDK</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">TypeScript SDK</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">REST & gRPC APIs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Enterprise AI</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">High-Frequency Trading</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Autonomous Robotics</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Healthcare Security</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Case Studies</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-4">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Weekly telemetry breakdowns, agent architecture papers, and updates.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscription confirmed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="eng-lead@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span>© 2026 AETHERIS Technologies Inc. All rights reserved.</span>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>SOC2 Type II</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>GDPR</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all" aria-label="GitHub">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all" aria-label="X / Twitter">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
