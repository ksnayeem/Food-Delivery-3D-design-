import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Cpu, CloudLightning, Copy, Check } from 'lucide-react'

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [copied, setCopied] = useState(false)

  const steps = [
    {
      num: '01',
      tag: 'CONNECT',
      title: 'Initialize Agent Mesh',
      description:
        'Install our zero-dependency SDK via npm or pip. Connect your infrastructure with one line of code and automatic cryptographic handshake.',
      icon: Terminal,
      codeTitle: 'connect.ts',
      codeSnippet: `import { Aetheris } from '@aetheris/core'

const client = new Aetheris({
  apiKey: process.env.AETHERIS_SECRET,
  region: 'auto-optimal',
})

// Auto-discovers GPU clusters & local neural pipelines
await client.cluster.connect()`,
      metrics: 'Connection time: ~420ms',
    },
    {
      num: '02',
      tag: 'AUTOMATE',
      title: 'Synthesize Agent Graph',
      description:
        'Compose multi-agent workflows using declarative graph syntax or our visual orchestrator. Autonomous consensus nodes handle error recovery.',
      icon: Cpu,
      codeTitle: 'workflow.ts',
      codeSnippet: `const pipeline = client.orchestrate({
  planner: 'claude-3-5-sonnet',
  coder: 'gpt-4o',
  verifier: 'aetheris-neural-eval'
})

// Autonomous consensus before execution
pipeline.on('anomaly', (event) => {
  event.healSelf({ maxRetries: 3 })
})`,
      metrics: 'Consensus latency: < 12ms',
    },
    {
      num: '03',
      tag: 'SCALE',
      title: 'Deploy to Global Edge',
      description:
        'Workloads are automatically partitioned and warm-cached across 300+ global edge facilities with sub-millisecond roundtrip latency.',
      icon: CloudLightning,
      codeTitle: 'deploy.ts',
      codeSnippet: `// Instant zero-downtime edge distribution
const deployment = await pipeline.deploy({
  regions: ['all-edge-zones'],
  replication: 'byzantine-fault-tolerant',
  enclaveSecurity: true
})

console.log(deployment.status) // "active_worldwide"`,
      metrics: 'Propagation: 300+ Edge Nodes',
    },
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="how-it-works" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
          <span>EFFORTLESS ONBOARDING</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-5">
          From Concept to Global Execution in{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Three Steps
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          Start building production AI pipelines without rewriting your existing backend stack.
        </p>
      </div>

      {/* Interactive Horizontal Timeline on Desktop / Vertical on Mobile */}
      <div className="relative mb-12">
        {/* Desktop Connecting Line */}
        <div className="hidden lg:block absolute top-8 left-12 right-12 h-0.5 bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
            initial={{ width: '33%' }}
            animate={{
              width: activeStep === 0 ? '33%' : activeStep === 1 ? '66%' : '100%',
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* 3 Step Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isActive = activeStep === idx
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_30px_rgba(56,189,248,0.15)] -translate-y-1'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_#38bdf8]'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    STEP {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {step.metrics}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Code / Workflow Preview Box for Active Step */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-slate-800 bg-[#070b14] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs text-slate-400">
              {steps[activeStep].codeTitle}
            </span>
          </div>

          <button
            onClick={() => handleCopy(steps[activeStep].codeSnippet)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 overflow-x-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#050811]">
          <pre>{steps[activeStep].codeSnippet}</pre>
        </div>
      </motion.div>
    </section>
  )
}
