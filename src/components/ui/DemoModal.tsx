import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, RefreshCw, CheckCircle2, Terminal, Cpu, ArrowRight } from 'lucide-react'
import { Button } from './Button'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<'agent' | 'latency' | 'security'>('agent')
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      runSimulation(activeWorkflow)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const runSimulation = (mode: 'agent' | 'latency' | 'security') => {
    setIsRunning(true)
    setLogs(['[0.00ms] Initializing neural orchestrator runtime...'])

    const stepLogs = mode === 'agent' ? [
      '[12.4ms] Synthesizing multi-agent graph: Planner → Coder → Verifier',
      '[24.1ms] Spawning isolated secure microVM sandbox [uuid: 7f8a-9c12]',
      '[42.8ms] Agent consensus reached: 3/3 validators confirmed',
      '[68.2ms] Executing zero-trust code generation pipeline...',
      '[89.0ms] Code verified. 0 vulnerabilities found. Static analysis passed.',
      '[104.5ms] Workload deployed to 32 edge clusters successfully (0 cold start).'
    ] : mode === 'latency' ? [
      '[5.1ms] Pinging global cluster nodes: 84 regions reporting...',
      '[14.2ms] Routing via low-latency optical path (Tokyo -> SF -> Frankfurt)',
      '[22.8ms] Dynamic GPU tensor parallelism synchronized',
      '[31.4ms] Model weights warm-cached across L1 edge memories',
      '[38.9ms] Peak measured TTFT: 14.8ms | Total latency: 41.2ms'
    ] : [
      '[4.2ms] Enclave cryptographic handshake initialized (AES-256-GCM)',
      '[18.7ms] Attestation token validated against hardware TPM v2.0',
      '[29.3ms] Ephemeral memory partition locked with zero external egress',
      '[48.1ms] Differential privacy noise layer applied (ε = 0.5)',
      '[62.4ms] SOC2 & HIPAA audit log sealed with immutable block hash.'
    ]

    let currentIdx = 0
    const interval = setInterval(() => {
      if (currentIdx < stepLogs.length) {
        setLogs(prev => [...prev, stepLogs[currentIdx]])
        currentIdx++
      } else {
        setIsRunning(false)
        clearInterval(interval)
      }
    }, 450)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AETHERIS Neural Sandbox
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-normal">
                      Interactive Live Demo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Run simulated autonomous multi-agent pipelines in real-time</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workflow Mode Tabs */}
            <div className="px-6 pt-4 flex gap-2 border-b border-slate-800/80 bg-slate-950">
              <button
                onClick={() => {
                  setActiveWorkflow('agent')
                  runSimulation('agent')
                }}
                className={`pb-3 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
                  activeWorkflow === 'agent'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                01: Multi-Agent Synthesis
              </button>
              <button
                onClick={() => {
                  setActiveWorkflow('latency')
                  runSimulation('latency')
                }}
                className={`pb-3 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
                  activeWorkflow === 'latency'
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                02: Global Edge Routing
              </button>
              <button
                onClick={() => {
                  setActiveWorkflow('security')
                  runSimulation('security')
                }}
                className={`pb-3 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
                  activeWorkflow === 'security'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                03: Zero-Trust Attestation
              </button>
            </div>

            {/* Simulated Live Console Log */}
            <div className="p-6">
              <div className="rounded-xl border border-slate-800 bg-[#070b14] p-4 font-mono text-xs text-slate-300 min-h-[220px] max-h-[260px] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    bash - aetheris-cli::stream-session
                  </span>
                  <span>status: {isRunning ? 'executing...' : 'completed'}</span>
                </div>

                <div className="space-y-2">
                  {logs.map((line, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        line.includes('successfully') || line.includes('passed') || line.includes('Verified')
                          ? 'text-emerald-400 font-semibold'
                          : line.includes('Synthesizing') || line.includes('Pinging')
                          ? 'text-cyan-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>Processing next neural node...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Free Developer Access includes 5,000 credits/mo</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => runSimulation(activeWorkflow)}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Rerun Test
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onClose}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Claim API Key
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
