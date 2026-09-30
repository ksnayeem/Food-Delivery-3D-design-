import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function DroneMesh() {
  const droneGroupRef = useRef<THREE.Group>(null)
  const rotor1Ref = useRef<THREE.Mesh>(null)
  const rotor2Ref = useRef<THREE.Mesh>(null)
  const rotor3Ref = useRef<THREE.Mesh>(null)
  const rotor4Ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    // Smooth hover bobbing and slight bank
    if (droneGroupRef.current) {
      droneGroupRef.current.position.y = Math.sin(t * 2) * 0.15 + 0.3
      droneGroupRef.current.rotation.z = Math.sin(t * 1.5) * 0.05
      droneGroupRef.current.rotation.x = -0.15 + Math.sin(t * 1.2) * 0.03
    }

    // High-speed spinning rotors
    const rotorSpeed = delta * 30
    if (rotor1Ref.current) rotor1Ref.current.rotation.y += rotorSpeed
    if (rotor2Ref.current) rotor2Ref.current.rotation.y -= rotorSpeed
    if (rotor3Ref.current) rotor3Ref.current.rotation.y += rotorSpeed
    if (rotor4Ref.current) rotor4Ref.current.rotation.y -= rotorSpeed
  })

  return (
    <group ref={droneGroupRef} position={[0, 0.4, 0]}>
      {/* Central Drone Fuselage */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.28, 1.4]} />
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.2}
          clearcoat={0.6}
        />
      </mesh>

      {/* Front Optical Camera Eye */}
      <mesh position={[0, -0.05, 0.72]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Camera Spot Light Beam */}
      <spotLight
        position={[0, -0.1, 0.8]}
        target-position={[0, -4, 3]}
        angle={0.6}
        penumbra={0.8}
        intensity={3}
        color="#38bdf8"
      />

      {/* 4 Carbon Arms */}
      {[
        [-1.3, 0.08, 1.1],
        [1.3, 0.08, 1.1],
        [-1.3, 0.08, -1.1],
        [1.3, 0.08, -1.1],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x / 2, y, z / 2]}>
          <mesh rotation={[0, Math.atan2(z, x), 0]}>
            <boxGeometry args={[1.4, 0.08, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {[
        { pos: [-1.3, 0.15, 1.1] as [number, number, number], ref: rotor1Ref },
        { pos: [1.3, 0.15, 1.1] as [number, number, number], ref: rotor2Ref },
        { pos: [-1.3, 0.15, -1.1] as [number, number, number], ref: rotor3Ref },
        { pos: [1.3, 0.15, -1.1] as [number, number, number], ref: rotor4Ref },
      ].map(({ pos, ref }, idx) => (
        <group key={idx} position={pos}>
          {/* Motor Hub */}
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* LED Ring Under Motor */}
          <mesh position={[0, -0.1, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 24]} />
            <meshBasicMaterial color={idx < 2 ? '#22c55e' : '#ef4444'} />
          </mesh>
          {/* Spinning Propeller Blades */}
          <mesh ref={ref as React.RefObject<THREE.Mesh>} position={[0, 0.14, 0]}>
            <boxGeometry args={[1.3, 0.02, 0.12]} />
            <meshStandardMaterial color="#94a3b8" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {/* Insulated Food Delivery Pod Latch Underneath */}
      <group position={[0, -0.45, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 0.6, 0.9]} />
          <meshStandardMaterial
            color="#ea580c"
            emissive="#c2410c"
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Glowing Temperature Indicator Bar */}
        <mesh position={[0, 0, 0.46]}>
          <boxGeometry args={[0.6, 0.08, 0.02]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>
    </group>
  )
}

function CityGrid() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (gridRef.current) {
      // Simulate forward flight over city grid
      gridRef.current.position.z += delta * 1.5
      if (gridRef.current.position.z > 2) {
        gridRef.current.position.z = 0
      }
    }
  })

  return (
    <group ref={gridRef} position={[0, -2.4, 0]}>
      {/* Infinite City Road Grid Plane */}
      <gridHelper
        args={[24, 24, '#f97316', '#1e293b']}
        rotation={[0, 0, 0]}
      />

      {/* Futuristic City Skyscrapers Silhouette */}
      {[
        [-5, 0.8, -4, 1.4, 2.8, 1.4],
        [5, 1.2, -5, 1.8, 3.4, 1.8],
        [-6, 0.6, 2, 1.6, 2.2, 1.6],
        [6, 1.0, 3, 1.4, 3.0, 1.4],
      ].map(([x, y, z, w, h, d], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color="#090d1a"
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
            <lineBasicMaterial color="#38bdf8" transparent opacity={0.4} />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

export function DeliveryDrone3D() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 1.8, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 4]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-4, 2, -2]} intensity={2} color="#f97316" />
        <DroneMesh />
        <CityGrid />
      </Canvas>
    </div>
  )
}
