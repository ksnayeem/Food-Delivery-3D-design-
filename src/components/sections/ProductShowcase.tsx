import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { FloatingDashboard3D } from '../3d/FloatingDashboard3D'

export function ProductShowcase() {
  return (
    <section id="showcase" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-[160px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>HOLOGRAPHIC CONSOLE PREVIEW</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-5"
        >
          The Unified Command Center for{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Neural Infrastructure
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg font-light leading-relaxed"
        >
          Interact with a live 3D representation of your distributed compute fabric. Monitor GPU nodes,
          track cryptographic token flow, and trigger agent automations from a single pane of glass.
        </motion.p>
      </div>

      {/* 3D Dashboard Component */}
      <FloatingDashboard3D />
    </section>
  )
}
