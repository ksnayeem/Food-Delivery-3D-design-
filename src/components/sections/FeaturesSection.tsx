import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Zap,
  Network,
  ShieldCheck,
  Terminal,
  Activity,
  ArrowUpRight,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react'

export function FeaturesSection() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeChartBar, setActiveChartBar] = useState(3)

  const handleCopy = () => {
    navigator.clipboard?.writeText('import { AgentMesh } from "@aetheris/sdk"')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const features = [
    {
      id: 'automation',
      icon: Bot,
      color: 'cyan',
      badge: 'AUTONOMOUS',
      title: 'AI Swarm Automation',
      description:
        'Self-coordinating neural agents resolve complex infrastructure anomalies, auto-rebalance cluster workloads, and generate self-healing patches.',
      renderVisual: () => (
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>agent_consensus</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Active
            </span>
          </div>
          {/* Animated node pipeline */}
          <div className="flex items-center justify-between gap-1 py-1">
            {['Trigger', 'Planner', 'Coder', 'Verify'].map((node, i) => (
              <div key={node} className="flex items-center gap-1">
                <div className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] hover:border-cyan-400 transition-colors">
                  {node}
                </div>
                {i < 3 && <div className="w-3 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500" />}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'realtime',
      icon: Zap,
      color: 'purple',
      badge: 'SUB-5MS',
      title: 'Real-Time Neural Inference',
      description:
        'Edge-optimized kernel compilation delivering sub-5ms token streaming with dynamic speculative decoding and instant layer caching.',
      renderVisual: () => (
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-mono text-[11px]">Median Latency</span>
            <span className="text-purple-400 font-bold font-mono text-xs">3.8 ms</span>
          </div>
          {/* Waveform graphic */}
          <div className="h-10 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
              <path
                d="M0,18 Q20,2 40,14 T70,4 T100,10"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <circle cx="70" cy="4" r="3" fill="#c084fc" className="animate-pulse" />
            </svg>
            <div className="absolute right-2 top-0 text-[10px] font-mono text-purple-300 bg-purple-500/20 px-1 rounded">
              P99: 8.2ms
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'architecture',
      icon: Network,
      color: 'indigo',
      badge: 'HYPER-SCALE',
      title: 'Distributed Global Mesh',
      description:
        'Elastic global cluster network across 80+ countries with Byzantine-tolerant state consensus and automated traffic re-routing.',
      renderVisual: () => (
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span>Global Topology</span>
            <span className="text-indigo-400">84 Regions</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 rounded-sm transition-all duration-500 ${
                  i === 5 || i === 12
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-indigo-900/60 hover:bg-indigo-400'
                }`}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'ZERO-TRUST',
      title: 'Cryptographic Enclaves',
      description:
        'Hardware-level TPM v2.0 attestation, end-to-end confidential memory partitions, and automated SOC2 / HIPAA compliance audits.',
      renderVisual: () => (
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400 text-[11px]">Enclave Attestation</span>
            <span className="text-emerald-400 font-semibold text-[11px]">VERIFIED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-full" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">AES-256</span>
          </div>
        </div>
      ),
    },
    {
      id: 'devtools',
      icon: Terminal,
      color: 'amber',
      badge: 'TYPE-SAFE SDK',
      title: 'Declarative Developer SDK',
      description:
        'First-class TypeScript, Python, and Rust packages with hot-reloading local sandboxes and deterministic session recording.',
      renderVisual: () => (
        <div className="w-full mt-4 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 font-mono text-[11px] text-slate-300 relative group/code">
          <div className="flex items-center justify-between text-slate-500 pb-1 mb-1 border-b border-slate-800/80">
            <span className="text-[10px]">main.ts</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Copy snippet"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <pre className="text-[10px] text-slate-300 overflow-x-auto">
            <span className="text-purple-400">const</span> agent = <span className="text-cyan-400">new</span> AgentMesh()
            <br />
            <span className="text-purple-400">await</span> agent.<span className="text-emerald-400">dispatch</span>()
          </pre>
        </div>
      ),
    },
    {
      id: 'analytics',
      icon: Activity,
      color: 'rose',
      badge: 'TELEMETRY',
      title: 'Hyper-Scale Observability',
      description:
        'Real-time token consumption economics, latency heatmaps, entropy drift detection, and automated root-cause attribution.',
      renderVisual: () => (
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span>Throughput Trend</span>
            <span className="text-rose-400 font-bold">+184%</span>
          </div>
          <div className="flex items-end gap-1.5 h-8">
            {[35, 55, 45, 80, 65, 95, 88].map((h, i) => (
              <div
                key={i}
                onClick={() => setActiveChartBar(i)}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-sm cursor-pointer transition-all duration-300 ${
                  activeChartBar === i
                    ? 'bg-rose-400 shadow-[0_0_8px_#fb7185]'
                    : 'bg-rose-900/50 hover:bg-rose-500/70'
                }`}
              />
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION-READY CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-5">
          Engineered for the Next Era of{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Autonomous Compute
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          Every layer of the AETHERIS platform is built with sub-millisecond hardware acceleration,
          distributed state guarantees, and military-grade isolation.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon
          const glowBorderMap = {
            cyan: 'hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.25)]',
            purple: 'hover:border-purple-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)]',
            indigo: 'hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)]',
            emerald: 'hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)]',
            amber: 'hover:border-amber-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)]',
            rose: 'hover:border-rose-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.25)]',
          }

          const iconBgMap = {
            cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
            purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
            emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          }

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                glowBorderMap[feature.color as keyof typeof glowBorderMap]
              }`}
            >
              {/* Subtle top card glow on hover */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                {/* Header: Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                      iconBgMap[feature.color as keyof typeof iconBgMap]
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800">
                    {feature.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{feature.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-cyan-400" />
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Small visual interactive element */}
              <div className="mt-4">
                {feature.renderVisual()}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
