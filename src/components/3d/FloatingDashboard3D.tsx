import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Activity, Cpu, ShieldCheck, Zap } from 'lucide-react'

// Internal 3D Floating Holographic Chassis
function DashboardChassis({ activeTab }: { activeTab: string }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    // Subtle idle floating and gentle tilting
    meshRef.current.position.y = Math.sin(t * 1.2) * 0.12
    meshRef.current.rotation.x = -0.15 + Math.sin(t * 0.8) * 0.03
    meshRef.current.rotation.y = 0.22 + Math.cos(t * 0.7) * 0.05
  })

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main Glass Chassis Slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6.8, 4.4, 0.2]} />
        <meshPhysicalMaterial
          color="#090d1a"
          metalness={0.9}
          roughness={0.15}
          transmission={0.4}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Outer Glowing Border Frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(6.82, 4.42, 0.22)]} />
        <lineBasicMaterial color={activeTab === 'security' ? '#10b981' : activeTab === 'neural' ? '#a855f7' : '#38bdf8'} linewidth={2} />
      </lineSegments>

      {/* Holographic grid layer */}
      <gridHelper
        args={[6.4, 16, '#38bdf8', '#1e293b']}
        position={[0, 0, 0.12]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* 3D Neural Nodes / Processing Cores */}
      {[-2.2, -0.7, 0.8, 2.3].map((x, i) => (
        <group key={i} position={[x, -1.3, 0.25]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive={i % 2 === 0 ? '#38bdf8' : '#a855f7'}
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          <pointLight
            color={i % 2 === 0 ? '#38bdf8' : '#a855f7'}
            intensity={0.8}
            distance={1.5}
            position={[0, 0, 0.2]}
          />
        </group>
      ))}

      {/* Optical Data Bus Conduit Ribbons */}
      <mesh position={[0, -1.3, 0.18]}>
        <boxGeometry args={[5.2, 0.04, 0.04]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* 3D Status Crystals on the corners */}
      {[
        [-3.2, 2.0],
        [3.2, 2.0],
        [-3.2, -2.0],
        [3.2, -2.0],
      ].map(([x, y], idx) => (
        <mesh key={idx} position={[x, y, 0.15]}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

export function FloatingDashboard3D() {
  const [activeTab, setActiveTab] = useState<'performance' | 'neural' | 'security'>('performance')

  return (
    <div className="relative w-full max-w-6xl mx-auto my-12">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
            Live 3D Console Stream
          </span>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'performance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Performance
          </button>
          <button
            onClick={() => setActiveTab('neural')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'neural'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Neural Engine
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Trust Enclave
          </button>
        </div>
      </div>

      {/* Main Container with 3D Depth Canvas and Layered Glass HUD */}
      <div className="relative rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-[#030712] p-4 sm:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 right-1/4 w-1/2 h-48 bg-purple-500/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: 3D Rendered Interactive Hardware Canvas */}
          <div className="lg:col-span-7 h-[360px] sm:h-[440px] relative rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950/60">
            <Canvas
              camera={{ position: [0, 0, 5.8], fov: 48 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[3, 4, 4]} intensity={2.5} color="#38bdf8" />
              <pointLight position={[-4, -3, 2]} intensity={2} color="#a855f7" />
              <directionalLight position={[0, 5, 2]} intensity={1} />
              <DashboardChassis activeTab={activeTab} />
            </Canvas>

            {/* Overlaid Micro Telemetry on the 3D canvas */}
            <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-300">GPU-CLUSTER::01-ONLINE</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">384 TFLOPS // 0.8ms Jitter</p>
            </div>

            <div className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono text-cyan-300">NEURAL BUS: 99.4% OPTIMAL</span>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Dashboard Data Cards & Charts */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Top Metric Card: Throughput */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Global Streaming Ingestion</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  +42.8% MoM
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">1,248,920</span>
                <span className="text-xs text-slate-400">req / sec</span>
              </div>
              {/* Dynamic SVG Waveform Chart */}
              <div className="mt-3 h-12 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                  <defs>
                    <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,25 Q15,8 28,18 T56,10 T80,16 T100,5 L100,30 L0,30 Z"
                    fill="url(#gradCyan)"
                  />
                  <path
                    d="M0,25 Q15,8 28,18 T56,10 T80,16 T100,5"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Neural Cluster Health Matrix */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">Distributed Agent Nodes</span>
                <span className="text-xs font-mono text-cyan-400">32/32 Active</span>
              </div>
              {/* Node status mini matrix grid */}
              <div className="grid grid-cols-8 gap-1.5 mb-2">
                {Array.from({ length: 32 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-3 rounded-[3px] transition-all hover:scale-125 ${
                      idx === 14
                        ? 'bg-purple-400 animate-pulse'
                        : idx % 7 === 0
                        ? 'bg-cyan-300'
                        : 'bg-cyan-500/70'
                    }`}
                    title={`Node ${idx + 1}: Healthy`}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>US-EAST-1</span>
                <span>EU-CENTRAL-1</span>
                <span>AP-NORTHEAST-1</span>
              </div>
            </div>

            {/* Live Security Guardrails Feed */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2 font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Zero-Trust Enclaves
                </span>
                <span className="text-emerald-400">100% Verified</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[99.8%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Floating Badges around the 3D Dashboard as requested in Section 8 */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/70">
          {/* Badge 1: 99.99% Uptime */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md hover:border-cyan-500/40 transition-all group">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">99.99%</div>
              <div className="text-[11px] text-slate-400">High-Availability SLA</div>
            </div>
          </div>

          {/* Badge 2: +42.8% Performance */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md hover:border-cyan-500/40 transition-all group">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">+42.8%</div>
              <div className="text-[11px] text-slate-400">Inference Speedup</div>
            </div>
          </div>

          {/* Badge 3: AI Processing */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md hover:border-purple-500/40 transition-all group">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">Neural Active</div>
              <div className="text-[11px] text-slate-400">Real-Time Synthesis</div>
            </div>
          </div>

          {/* Badge 4: 1.2M Requests */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md hover:border-indigo-500/40 transition-all group">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">1.2M req/s</div>
              <div className="text-[11px] text-slate-400">Edge Parallelism</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
