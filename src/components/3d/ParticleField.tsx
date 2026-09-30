import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  speed?: number
  radius?: number
}

export function ParticleField({ count = 1200, speed = 0.05, radius = 25 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const color1 = new THREE.Color('#38bdf8') // cyan
    const color2 = new THREE.Color('#818cf8') // indigo
    const color3 = new THREE.Color('#c084fc') // purple
    const color4 = new THREE.Color('#ffffff') // bright star

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const r = THREE.MathUtils.randFloat(4, radius)
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2)
      const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1))

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      // Random color mix
      const rand = Math.random()
      let c = color1
      if (rand > 0.75) c = color4
      else if (rand > 0.5) c = color2
      else if (rand > 0.25) c = color3

      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count, radius])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * speed * 0.15
    pointsRef.current.rotation.x += delta * speed * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
