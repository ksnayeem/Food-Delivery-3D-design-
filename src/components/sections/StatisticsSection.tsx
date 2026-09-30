import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { TrendingUp, Globe2, ShieldCheck, Users, Zap } from 'lucide-react'

interface CounterProps {
  from?: number
  to: number
  decimals?: number
  suffix?: string
  prefix?: string
}

function Counter({ from = 0, to, decimals = 0, suffix = '', prefix = '' }: CounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true, margin: '-60px' })
  const [displayValue, setDisplayValue] = useState(from.toFixed(decimals))

  useEffect(() => {
    if (!isInView) return

    const controls = animate(from, to, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        setDisplayValue(value.toFixed(decimals))
      },
    })

    return () => controls.stop()
  }, [isInView, from, to, decimals])

  return (
    <span ref={nodeRef} className="font-mono font-bold tracking-tight">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

export function StatisticsSection() {
  const stats = [
    {
      to: 10,
      decimals: 0,
      suffix: 'M+',
      prefix: '',
      label: 'Daily API Requests',
      sublabel: 'Zero rate-limit throttling',
      icon: Zap,
      trend: '+142% YoY',
      color: 'cyan',
    },
    {
      to: 99.99,
      decimals: 2,
      suffix: '%',
      prefix: '',
      label: 'Production Uptime SLA',
      sublabel: 'Financial SLA guarantee',
      icon: ShieldCheck,
      trend: 'Zero Downtime',
      color: 'emerald',
    },
    {
      to: 150,
      decimals: 0,
      suffix: 'K+',
      prefix: '',
      label: 'Active Developers',
      sublabel: 'Building production AI swarms',
      icon: Users,
      trend: 'Fast Growing',
      color: 'purple',
    },
    {
      to: 80,
      decimals: 0,
      suffix: '+',
      prefix: '',
      label: 'Global Edge PoPs',
      sublabel: 'Sub-15ms worldwide latency',
      icon: Globe2,
      trend: 'Tier-4 Datacenters',
      color: 'indigo',
    },
  ]

  return (
    <section id="metrics" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/60 via-slate-950/80 to-[#030712] border border-slate-800/80 p-8 sm:p-12 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/60">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col justify-between ${idx !== 0 ? 'sm:pl-8 pt-6 sm:pt-0' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  </div>

                  {/* Count-Up Animated Stat */}
                  <div className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] mb-2 flex items-baseline">
                    <Counter
                      to={stat.to}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>

                  <div className="text-sm font-semibold text-slate-200 mb-1">
                    {stat.label}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-light mt-3">
                  {stat.sublabel}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
