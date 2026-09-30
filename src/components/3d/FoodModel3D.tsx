import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FoodModel3DProps {
  type: 'burger' | 'pizza' | 'ramen' | 'sushi'
  isExploded?: boolean
  autoRotate?: boolean
  mouse?: React.MutableRefObject<{ x: number; y: number }>
}

/* ================= 1. 3D GOURMET BURGER ================= */
function Burger3D({ isExploded }: { isExploded: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  // Floating layer spacing
  const spacing = isExploded ? 0.75 : 0

  // Random sesame seeds positions on top bun
  const sesamePositions = useMemo(() => {
    const list: [number, number, number][] = []
    for (let i = 0; i < 40; i++) {
      const phi = Math.random() * Math.PI * 0.4
      const theta = Math.random() * Math.PI * 2
      const r = 1.32
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi) - 0.2
      const z = r * Math.sin(phi) * Math.sin(theta)
      list.push([x, y, z])
    }
    return list
  }, [])

  return (
    <group ref={groupRef}>
      {/* Top Brioche Bun */}
      <group position={[0, 0.9 + spacing * 2.2, 0]}>
        <mesh>
          <sphereGeometry args={[1.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Sesame Seeds */}
        {sesamePositions.map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} rotation={[Math.random(), Math.random(), 0]}>
            <coneGeometry args={[0.035, 0.08, 5]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Ripe Tomato Slice */}
      <mesh position={[0, 0.55 + spacing * 1.5, 0]} rotation={[0.05, 0, 0.05]}>
        <cylinderGeometry args={[1.25, 1.25, 0.16, 32]} />
        <meshPhysicalMaterial
          color="#dc2626"
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>

      {/* Melted Cheddar Cheese Drape */}
      <mesh position={[0, 0.35 + spacing * 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.9, 0.08, 1.9]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Charred Wagyu Patty */}
      <mesh position={[0, 0.05 + spacing * 0.3, 0]}>
        <cylinderGeometry args={[1.32, 1.35, 0.42, 32]} />
        <meshStandardMaterial
          color="#3b1d11"
          roughness={0.85}
        />
      </mesh>

      {/* Crispy Ruffled Emerald Lettuce */}
      <mesh position={[0, -0.3 - spacing * 0.6, 0]} rotation={[0.08, 0.4, -0.05]}>
        <cylinderGeometry args={[1.5, 1.4, 0.12, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          roughness={0.5}
        />
      </mesh>

      {/* Bottom Brioche Bun */}
      <mesh position={[0, -0.65 - spacing * 1.4, 0]}>
        <cylinderGeometry args={[1.3, 1.25, 0.45, 32]} />
        <meshStandardMaterial
          color="#b45309"
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

/* ================= 2. 3D ARTISAN PIZZA ================= */
function Pizza3D() {
  const pepperonis = useMemo(() => [
    [-0.5, 0.09, -0.4],
    [0.6, 0.09, -0.5],
    [-0.7, 0.09, 0.3],
    [0.4, 0.09, 0.5],
    [0.0, 0.09, 0.1],
    [-0.1, 0.09, -0.8],
    [0.8, 0.09, 0.0],
  ], [])

  const basilLeaves = useMemo(() => [
    [-0.3, 0.11, 0.4],
    [0.3, 0.11, -0.2],
    [-0.4, 0.11, -0.6],
    [0.5, 0.11, 0.3],
  ], [])

  return (
    <group rotation={[0.45, 0, 0]}>
      {/* Crispy Crust Outer Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.22, 16, 48]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Melted Cheese & Tomato Sauce Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.62, 1.62, 0.1, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Pepperoni Discs */}
      {pepperonis.map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 20]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} />
        </mesh>
      ))}

      {/* Fresh Basil Leaves */}
      {basilLeaves.map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]} rotation={[0.2, idx, 0.1]}>
          <boxGeometry args={[0.22, 0.02, 0.14]} />
          <meshStandardMaterial color="#16a34a" roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

/* ================= 3. 3D NEON RAMEN BOWL ================= */
function Ramen3D() {
  return (
    <group position={[0, -0.4, 0]}>
      {/* Ceramic Ramen Bowl */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.8, 0.9, 1.4, 32, 1, true]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Bowl Base Stand */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      {/* Bowl Rim Accent Ring */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.04, 16, 48]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>

      {/* Rich Golden Tonkotsu Broth */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[1.68, 1.68, 0.05, 32]} />
        <meshPhysicalMaterial
          color="#d97706"
          roughness={0.15}
          metalness={0.2}
          clearcoat={0.9}
        />
      </mesh>

      {/* Braised Chashu Pork Slices */}
      <mesh position={[-0.5, 1.02, -0.2]} rotation={[0.1, 0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>
      <mesh position={[-0.7, 1.04, 0.3]} rotation={[0.05, 0.9, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.06, 24]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>

      {/* Soft Boiled Nitamago Lava Egg */}
      <group position={[0.6, 1.05, -0.3]} rotation={[0, -0.3, 0.2]}>
        {/* Egg White */}
        <mesh>
          <sphereGeometry args={[0.38, 20, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Lava Yolk */}
        <mesh position={[0.05, 0.08, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Nori Seaweed Sheet */}
      <mesh position={[-0.4, 1.45, -1.2]} rotation={[-0.3, 0.2, 0]}>
        <boxGeometry args={[0.8, 1.1, 0.03]} />
        <meshStandardMaterial color="#064e3b" roughness={0.8} />
      </mesh>

      {/* Narutomaki Pink Swirl Fish Cake */}
      <group position={[0.4, 1.02, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 16]} />
          <meshStandardMaterial color="#fdf2f8" />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <torusGeometry args={[0.12, 0.03, 8, 24]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>
    </group>
  )
}

/* ================= 4. 3D DRAGON SUSHI ================= */
function Sushi3D() {
  const sushiPieces = useMemo(() => [
    [-1.2, 0.22, 0],
    [-0.4, 0.22, 0],
    [0.4, 0.22, 0],
    [1.2, 0.22, 0],
  ], [])

  return (
    <group rotation={[0.35, 0, 0]}>
      {/* Bamboo Slate Platter */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 0.16, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Platter Gold Trim */}
      <lineSegments position={[0, 0.09, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.82, 0.02, 1.82)]} />
        <lineBasicMaterial color="#f59e0b" />
      </lineSegments>

      {/* 4 Artisan Sushi Rolls */}
      {sushiPieces.map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          {/* Rice Cylinder */}
          <mesh>
            <cylinderGeometry args={[0.38, 0.38, 0.36, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>
          {/* Black Nori Wrapper Band */}
          <mesh>
            <cylinderGeometry args={[0.385, 0.385, 0.24, 24, 1, true]} />
            <meshStandardMaterial color="#022c22" roughness={0.7} />
          </mesh>
          {/* Torched Salmon Drape on Top */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.7, 0.08, 0.45]} />
            <meshStandardMaterial color="#fb923c" roughness={0.3} />
          </mesh>
          {/* Orange Tobiko Roe Pearls */}
          <mesh position={[0, 0.26, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ea580c" roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Green Wasabi Rose Rosette */}
      <mesh position={[1.4, 0.2, -0.5]}>
        <coneGeometry args={[0.22, 0.28, 12]} />
        <meshStandardMaterial color="#84cc16" roughness={0.8} />
      </mesh>

      {/* Pink Pickled Ginger Petals */}
      <mesh position={[1.4, 0.15, 0.4]} rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial color="#f472b6" roughness={0.5} transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

/* ================= MAIN CONTAINER WRAPPER ================= */
export function FoodModel3D({
  type,
  isExploded = false,
  autoRotate = true,
  mouse,
}: FoodModel3DProps) {
  const masterGroupRef = useRef<THREE.Group>(null)

  // Floating Steam / Culinary Aroma Particles
  const steamParticles = useMemo(() => {
    const list: [number, number, number, number][] = []
    for (let i = 0; i < 35; i++) {
      list.push([
        (Math.random() - 0.5) * 2.2,
        Math.random() * 2.5 + 0.5,
        (Math.random() - 0.5) * 2.2,
        Math.random() * 0.8 + 0.3, // speed
      ])
    }
    return list
  }, [])

  useFrame(({ clock }, delta) => {
    if (!masterGroupRef.current) return
    const t = clock.getElapsedTime()

    // Smooth floating oscillation
    masterGroupRef.current.position.y = Math.sin(t * 1.5) * 0.1

    // Cursor tracking with lerp
    if (mouse?.current) {
      const targetX = mouse.current.y * 0.3
      const targetY = mouse.current.x * 0.45
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetX,
        delta * 3
      )
      if (autoRotate) {
        masterGroupRef.current.rotation.y += delta * 0.4
      } else {
        masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          masterGroupRef.current.rotation.y,
          targetY,
          delta * 3
        )
      }
    } else if (autoRotate) {
      masterGroupRef.current.rotation.y += delta * 0.45
    }
  })

  return (
    <group ref={masterGroupRef}>
      {/* Warm Ambient Lights for Food Appeal */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={1.8} color="#fef08a" />
      <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[0, -2, 3]} intensity={1.2} color="#fb923c" />

      {/* Render selected 3D Food Geometry */}
      {type === 'burger' && <Burger3D isExploded={isExploded} />}
      {type === 'pizza' && <Pizza3D />}
      {type === 'ramen' && <Ramen3D />}
      {type === 'sushi' && <Sushi3D />}

      {/* Floating Golden Seasoning & Aroma Sparkles */}
      {steamParticles.map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}
