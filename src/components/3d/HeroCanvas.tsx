import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CoreOrb } from './CoreOrb'
import { ParticleField } from './ParticleField'

function SceneLighting({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      // Light smoothly tracks mouse in 3D space
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        mouse.current.x * 4,
        0.05
      )
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        mouse.current.y * 3,
        0.05
      )
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -5, -4]} intensity={0.6} color="#38bdf8" />
      {/* Dynamic cursor-following specular light */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 4]}
        intensity={3.5}
        distance={12}
        color="#38bdf8"
      />
      <pointLight position={[-4, 3, -2]} intensity={2.5} color="#c084fc" />
    </>
  )
}

function CameraRig({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }) => {
    // Subtle camera parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.8, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.6, 0.04)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroCanvas() {
  const mouse = useRef({ x: 0, y: 0 })
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setIsSupported(false)
      }
    } catch {
      setIsSupported(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouse.current = { x, y }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isSupported) {
    // Fallback if WebGL is unavailable
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/30 to-purple-500/20 blur-2xl animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full border border-cyan-500/40 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <CameraRig mouse={mouse} />
          <SceneLighting mouse={mouse} />
          <ParticleField count={1000} speed={0.06} radius={18} />
          <CoreOrb mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
