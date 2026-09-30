import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CoreOrbProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>
}

export function CoreOrb({ mouse }: CoreOrbProps) {
  const groupRef = useRef<THREE.Group>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const wireframeCageRef = useRef<THREE.Mesh>(null)
  const outerRing1Ref = useRef<THREE.Mesh>(null)
  const outerRing2Ref = useRef<THREE.Mesh>(null)
  const outerRing3Ref = useRef<THREE.Mesh>(null)

  // Satellite refs
  const sat1Ref = useRef<THREE.Group>(null)
  const sat2Ref = useRef<THREE.Group>(null)
  const sat3Ref = useRef<THREE.Group>(null)

  // Floating geometric crystals
  const crystal1Ref = useRef<THREE.Mesh>(null)
  const crystal2Ref = useRef<THREE.Mesh>(null)
  const crystal3Ref = useRef<THREE.Mesh>(null)

  // Target rotation for smooth damping
  const targetRotation = useRef({ x: 0, y: 0 })

  // Satellite orbit parameters
  const satData = useMemo(() => [
    { speed: 1.2, radiusX: 2.8, radiusZ: 2.4, tilt: 0.35, color: '#38bdf8' },
    { speed: 0.8, radiusX: 3.4, radiusZ: 3.1, tilt: -0.45, color: '#a855f7' },
    { speed: 1.5, radiusX: 2.2, radiusZ: 2.6, tilt: 0.8, color: '#34d399' },
  ], [])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    // Smooth mouse response (lerp)
    targetRotation.current.x = mouse.current.y * 0.45
    targetRotation.current.y = mouse.current.x * 0.55

    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.18

      // Lerp group rotation towards mouse
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + t * 0.15, // base slow continuous rotation
        delta * 3
      )
    }

    // Inner core pulsing
    if (innerCoreRef.current) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.04
      innerCoreRef.current.scale.set(pulse, pulse, pulse)
      innerCoreRef.current.rotation.y += delta * 0.2
      innerCoreRef.current.rotation.z += delta * 0.1
    }

    // Wireframe cage counter-rotation
    if (wireframeCageRef.current) {
      wireframeCageRef.current.rotation.y -= delta * 0.3
      wireframeCageRef.current.rotation.x += delta * 0.15
    }

    // Glowing rings rotation
    if (outerRing1Ref.current) {
      outerRing1Ref.current.rotation.x += delta * 0.35
      outerRing1Ref.current.rotation.y += delta * 0.25
    }
    if (outerRing2Ref.current) {
      outerRing2Ref.current.rotation.y -= delta * 0.3
      outerRing2Ref.current.rotation.z += delta * 0.2
    }
    if (outerRing3Ref.current) {
      outerRing3Ref.current.rotation.z += delta * 0.22
      outerRing3Ref.current.rotation.x -= delta * 0.18
    }

    // Satellites orbiting
    if (sat1Ref.current) {
      const angle = t * satData[0].speed
      sat1Ref.current.position.x = Math.cos(angle) * satData[0].radiusX
      sat1Ref.current.position.z = Math.sin(angle) * satData[0].radiusZ
      sat1Ref.current.position.y = Math.sin(angle * 1.5) * 0.6
      sat1Ref.current.rotation.y += delta * 2
    }
    if (sat2Ref.current) {
      const angle = t * satData[1].speed + 2.1
      sat2Ref.current.position.x = Math.cos(angle) * satData[1].radiusX
      sat2Ref.current.position.z = Math.sin(angle) * satData[1].radiusZ
      sat2Ref.current.position.y = Math.cos(angle) * 0.8
      sat2Ref.current.rotation.x += delta * 2
    }
    if (sat3Ref.current) {
      const angle = t * satData[2].speed + 4.2
      sat3Ref.current.position.x = Math.cos(angle) * satData[2].radiusX
      sat3Ref.current.position.z = Math.sin(angle) * satData[2].radiusZ
      sat3Ref.current.position.y = Math.sin(angle * 0.8) * 0.9
      sat3Ref.current.rotation.z += delta * 2
    }

    // Floating crystals
    if (crystal1Ref.current) {
      crystal1Ref.current.position.y = 2.0 + Math.sin(t * 1.5) * 0.2
      crystal1Ref.current.rotation.y += delta * 0.6
      crystal1Ref.current.rotation.x += delta * 0.4
    }
    if (crystal2Ref.current) {
      crystal2Ref.current.position.y = -2.2 + Math.cos(t * 1.8) * 0.25
      crystal2Ref.current.rotation.y -= delta * 0.5
      crystal2Ref.current.rotation.z += delta * 0.3
    }
    if (crystal3Ref.current) {
      crystal3Ref.current.position.y = 1.2 + Math.sin(t * 2 + 1) * 0.2
      crystal3Ref.current.rotation.x += delta * 0.7
    }
  })

  return (
    <group ref={groupRef}>
      {/* 1. Inner Pulsating Crystalline Core */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[1.15, 3]} />
        <meshPhysicalMaterial
          color="#0f172a"
          emissive="#38bdf8"
          emissiveIntensity={0.65}
          roughness={0.15}
          metalness={0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Internal point light inside the core */}
      <pointLight color="#38bdf8" intensity={4} distance={8} decay={2} />
      <pointLight color="#c084fc" intensity={3} distance={6} decay={2} />

      {/* 2. Middle Wireframe Geometric Cage */}
      <mesh ref={wireframeCageRef}>
        <icosahedronGeometry args={[1.52, 1]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* 3. Glowing Orbital Rings with subtle thickness */}
      {/* Ring 1 - Cyan primary ring */}
      <mesh ref={outerRing1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.0, 0.022, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.4}
          roughness={0.2}
        />
      </mesh>

      {/* Ring 2 - Electric Purple secondary ring */}
      <mesh ref={outerRing2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.3, 0.018, 16, 100]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={1.2}
          roughness={0.3}
        />
      </mesh>

      {/* Ring 3 - Deep Indigo tertiary ring */}
      <mesh ref={outerRing3Ref} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
        <torusGeometry args={[2.55, 0.014, 16, 100]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={1.0}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 4. Orbiting Satellites */}
      {/* Satellite 1: Glowing Cyan Node with tiny ring */}
      <group ref={sat1Ref}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.8}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.015, 8, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        <pointLight color="#38bdf8" intensity={1.5} distance={3} />
      </group>

      {/* Satellite 2: Purple Octahedron Satellite */}
      <group ref={sat2Ref}>
        <mesh>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#a855f7"
            emissiveIntensity={1.6}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#a855f7" intensity={1.5} distance={3} />
      </group>

      {/* Satellite 3: Emerald Beacon */}
      <group ref={sat3Ref}>
        <mesh>
          <dodecahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={1.5}
            roughness={0.3}
          />
        </mesh>
        <pointLight color="#34d399" intensity={1.2} distance={2.5} />
      </group>

      {/* 5. Floating Geometric Shapes nearby for Depth */}
      <mesh ref={crystal1Ref} position={[-2.4, 1.8, -1.2]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={crystal2Ref} position={[2.6, -1.8, -0.8]}>
        <tetrahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#c084fc"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={crystal3Ref} position={[2.1, 1.9, -1.8]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#818cf8"
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}
