import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ==================== 1. PROCEDURAL 3D TRUCK MODEL ====================
function TruckModel({ activeVehicle }) {
  const truckRef = useRef()

  useFrame((state) => {
    if (truckRef.current) {
      const elapsed = state.clock.getElapsedTime()
      const targetScale = activeVehicle === 'lorry' ? 1.05 : 0.001
      const targetY = activeVehicle === 'lorry' ? -0.3 : -2.5
      
      // Smooth scale and position transitions
      truckRef.current.scale.x = THREE.MathUtils.lerp(truckRef.current.scale.x, targetScale, 0.08)
      truckRef.current.scale.y = THREE.MathUtils.lerp(truckRef.current.scale.y, targetScale, 0.08)
      truckRef.current.scale.z = THREE.MathUtils.lerp(truckRef.current.scale.z, targetScale, 0.08)
      
      truckRef.current.position.y = THREE.MathUtils.lerp(truckRef.current.position.y, targetY, 0.08)
      
      // Rotate slowly when active, spin rapidly as transition effect when inactive
      if (activeVehicle === 'lorry') {
        truckRef.current.rotation.y = elapsed * 0.25
      } else {
        const targetRot = elapsed * 2.2
        truckRef.current.rotation.y = THREE.MathUtils.lerp(truckRef.current.rotation.y, targetRot, 0.08)
      }
    }
  })

  // Physically Based Rendering Materials
  const blackPaint = new THREE.MeshStandardMaterial({
    color: '#0d0d11',
    roughness: 0.15,
    metalness: 0.85,
  })

  const shinyChrome = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 1.0,
    roughness: 0.05,
  })

  const tireRubber = new THREE.MeshStandardMaterial({
    color: '#1c1c22',
    roughness: 0.8,
    metalness: 0.05,
  })

  const darkGlass = new THREE.MeshStandardMaterial({
    color: '#0a0a0c',
    roughness: 0.05,
    metalness: 0.95,
  })

  const yellowLight = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#f59e0b',
    emissiveIntensity: 2.5,
  })

  return (
    <group ref={truckRef} position={[0, -0.3, 0]} scale={1.05}>
      {/* Chassis Frame */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.25, 1.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Cabin */}
      <mesh position={[-0.4, 1.25, 0]} material={blackPaint} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.6, 1.5]} />
      </mesh>

      {/* Sleeper Cabin Rear */}
      <mesh position={[0.8, 1.35, 0]} material={blackPaint} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.8, 1.5]} />
      </mesh>

      {/* Wind deflector on top */}
      <mesh position={[0.4, 2.3, 0]} material={blackPaint} castShadow>
        <boxGeometry args={[1.8, 0.25, 1.4]} />
      </mesh>

      {/* Sloped Engine Hood */}
      <mesh position={[-1.7, 0.85, 0]} material={blackPaint} castShadow receiveShadow>
        <boxGeometry args={[1.0, 1.0, 1.48]} />
      </mesh>

      {/* Sloped windshield */}
      <mesh position={[-1.32, 1.7, 0]} rotation={[0, 0, -Math.PI / 6]} material={darkGlass} castShadow>
        <boxGeometry args={[0.08, 0.65, 1.42]} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[-0.4, 1.4, 0.76]} material={darkGlass}>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
      </mesh>
      <mesh position={[-0.4, 1.4, -0.76]} material={darkGlass}>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
      </mesh>

      {/* Front Chrome Grille */}
      <mesh position={[-2.21, 0.85, 0]} material={shinyChrome} castShadow>
        <boxGeometry args={[0.05, 0.8, 1.0]} />
      </mesh>

      {/* Front Chrome Bumper */}
      <mesh position={[-2.22, 0.35, 0]} material={shinyChrome} castShadow>
        <boxGeometry args={[0.1, 0.25, 1.56]} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-2.22, 0.35, 0.65]} material={yellowLight}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      <mesh position={[-2.22, 0.35, -0.65]} material={yellowLight}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>

      {/* Fuel Tanks */}
      <mesh position={[0.2, 0.35, 0.82]} rotation={[Math.PI / 2, 0, 0]} material={shinyChrome} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 1.4, 16]} />
      </mesh>
      <mesh position={[0.2, 0.35, -0.82]} rotation={[Math.PI / 2, 0, 0]} material={shinyChrome} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 1.4, 16]} />
      </mesh>

      {/* Chrome Exhaust Stacks */}
      <mesh position={[1.45, 1.7, 0.6]} material={shinyChrome} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 12]} />
      </mesh>
      <mesh position={[1.45, 1.7, -0.6]} material={shinyChrome} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.2, 12]} />
      </mesh>

      {/* 6 Wheels System */}
      {[
        { pos: [-1.4, 0.3, 0.72], key: 'w_fl' },
        { pos: [-1.4, 0.3, -0.72], key: 'w_fr' },
        { pos: [0.8, 0.3, 0.72], key: 'w_mrl' },
        { pos: [0.8, 0.3, -0.72], key: 'w_mrr' },
        { pos: [1.6, 0.3, 0.72], key: 'w_rrl' },
        { pos: [1.6, 0.3, -0.72], key: 'w_rrr' }
      ].map((w) => (
        <group position={w.pos} key={w.key}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.26, 24]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, w.pos[2] > 0 ? 0.03 : -0.03]} material={shinyChrome}>
            <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ==================== 2. PROCEDURAL 3D DELIVERY BIKE MODEL ====================
function BikeModel({ activeVehicle }) {
  const bikeRef = useRef()

  useFrame((state) => {
    if (bikeRef.current) {
      const elapsed = state.clock.getElapsedTime()
      const targetScale = activeVehicle === 'bike' ? 1.15 : 0.001
      const targetY = activeVehicle === 'bike' ? -0.4 : -2.5
      
      bikeRef.current.scale.x = THREE.MathUtils.lerp(bikeRef.current.scale.x, targetScale, 0.08)
      bikeRef.current.scale.y = THREE.MathUtils.lerp(bikeRef.current.scale.y, targetScale, 0.08)
      bikeRef.current.scale.z = THREE.MathUtils.lerp(bikeRef.current.scale.z, targetScale, 0.08)
      
      bikeRef.current.position.y = THREE.MathUtils.lerp(bikeRef.current.position.y, targetY, 0.08)
      
      if (activeVehicle === 'bike') {
        bikeRef.current.rotation.y = elapsed * 0.25
      } else {
        const targetRot = elapsed * 2.2
        bikeRef.current.rotation.y = THREE.MathUtils.lerp(bikeRef.current.rotation.y, targetRot, 0.08)
      }
    }
  })

  const emeraldGreen = new THREE.MeshStandardMaterial({
    color: '#10b981',
    roughness: 0.15,
    metalness: 0.7
  })
  
  const slateDark = new THREE.MeshStandardMaterial({
    color: '#334155',
    metalness: 0.7,
    roughness: 0.4
  })

  const shinyChrome = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 1.0,
    roughness: 0.05
  })

  const tireRubber = new THREE.MeshStandardMaterial({
    color: '#1c1c22',
    roughness: 0.8,
    metalness: 0.05
  })

  const yellowLight = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#f59e0b',
    emissiveIntensity: 2.5
  })

  return (
    <group ref={bikeRef} position={[0, -2.5, 0]} scale={0.001}>
      {/* Moped Frame/Body */}
      <mesh position={[-0.1, 0.52, 0]} material={emeraldGreen} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.45, 0.35]} />
      </mesh>

      <mesh position={[-0.1, 0.3, 0]} material={slateDark} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.1, 0.28]} />
      </mesh>

      {/* Seat */}
      <mesh position={[-0.22, 0.78, 0]} castShadow>
        <boxGeometry args={[0.48, 0.08, 0.26]} />
        <meshStandardMaterial color="#111827" roughness={0.85} />
      </mesh>

      {/* Motor Block */}
      <mesh position={[-0.15, 0.45, 0]} material={shinyChrome} castShadow>
        <boxGeometry args={[0.36, 0.3, 0.26]} />
      </mesh>

      {/* Front Slanted Steering Fork */}
      <group position={[-0.62, 0.82, 0]} rotation={[0, 0, Math.PI / 10]}>
        <mesh material={shinyChrome} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.85, 12]} />
        </mesh>
      </group>

      {/* Handlebars */}
      <mesh position={[-0.72, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={shinyChrome} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.56, 12]} />
      </mesh>

      {/* Front Apron Shield */}
      <mesh position={[-0.74, 0.85, 0]} rotation={[0, 0, Math.PI / 12]} material={emeraldGreen} castShadow>
        <boxGeometry args={[0.12, 0.65, 0.42]} />
      </mesh>

      {/* Large Insulated Delivery Box */}
      <mesh position={[0.48, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.68, 0.68]} />
        <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.75} />
      </mesh>

      {/* Cyan Glowing Brand Plate */}
      <mesh position={[0.825, 1.1, 0]}>
        <boxGeometry args={[0.02, 0.26, 0.45]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2.5} />
      </mesh>

      {/* Wheels */}
      <group position={[-0.78, 0.32, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={shinyChrome}>
          <cylinderGeometry args={[0.15, 0.15, 0.18, 12]} />
        </mesh>
      </group>

      <group position={[0.62, 0.32, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={shinyChrome}>
          <cylinderGeometry args={[0.15, 0.15, 0.18, 12]} />
        </mesh>
      </group>

      {/* Headlight */}
      <mesh position={[-0.82, 1.12, 0]} material={yellowLight}>
        <sphereGeometry args={[0.065, 16, 16]} />
      </mesh>
    </group>
  )
}

// ==================== 3. PROCEDURAL 3D GOODS AUTO MODEL ====================
function AutoModel({ activeVehicle }) {
  const autoRef = useRef()

  useFrame((state) => {
    if (autoRef.current) {
      const elapsed = state.clock.getElapsedTime()
      const targetScale = activeVehicle === 'auto' ? 1.0 : 0.001
      const targetY = activeVehicle === 'auto' ? -0.35 : -2.5
      
      autoRef.current.scale.x = THREE.MathUtils.lerp(autoRef.current.scale.x, targetScale, 0.08)
      autoRef.current.scale.y = THREE.MathUtils.lerp(autoRef.current.scale.y, targetScale, 0.08)
      autoRef.current.scale.z = THREE.MathUtils.lerp(autoRef.current.scale.z, targetScale, 0.08)
      
      autoRef.current.position.y = THREE.MathUtils.lerp(autoRef.current.position.y, targetY, 0.08)
      
      if (activeVehicle === 'auto') {
        autoRef.current.rotation.y = elapsed * 0.25
      } else {
        const targetRot = elapsed * 2.2
        autoRef.current.rotation.y = THREE.MathUtils.lerp(autoRef.current.rotation.y, targetRot, 0.08)
      }
    }
  })

  const amberYellow = new THREE.MeshStandardMaterial({
    color: '#f59e0b', // Amber local yellow
    roughness: 0.15,
    metalness: 0.8
  })

  const darkBlueContainer = new THREE.MeshStandardMaterial({
    color: '#1d4ed8', // Deep cobalt blue container
    roughness: 0.2,
    metalness: 0.85
  })
  
  const fuchsiaDecalMat = new THREE.MeshStandardMaterial({
    color: '#ff007f',
    emissive: '#ff007f',
    emissiveIntensity: 1.8
  })

  const slateDark = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.7,
    roughness: 0.4
  })

  const shinyChrome = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 1.0,
    roughness: 0.05
  })

  const tireRubber = new THREE.MeshStandardMaterial({
    color: '#1c1c22',
    roughness: 0.8,
    metalness: 0.05
  })

  const darkGlass = new THREE.MeshStandardMaterial({
    color: '#0a0a0c',
    roughness: 0.05,
    metalness: 0.95
  })

  const yellowLight = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    emissive: '#f59e0b',
    emissiveIntensity: 2.5
  })

  return (
    <group ref={autoRef} position={[0, -2.5, 0]} scale={0.001}>
      {/* Auto Chassis bed */}
      <mesh position={[0, 0.3, 0]} material={slateDark} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.15, 1.25]} />
      </mesh>

      {/* Big Cargo Box */}
      <mesh position={[0.5, 0.98, 0]} material={darkBlueContainer} castShadow receiveShadow>
        <boxGeometry args={[1.7, 1.25, 1.2]} />
      </mesh>

      {/* Fuchsia decals */}
      <mesh position={[0.5, 1.1, 0.61]} material={fuchsiaDecalMat}>
        <boxGeometry args={[1.5, 0.06, 0.01]} />
      </mesh>
      <mesh position={[0.5, 1.1, -0.61]} material={fuchsiaDecalMat}>
        <boxGeometry args={[1.5, 0.06, 0.01]} />
      </mesh>

      {/* Driver Cab Main */}
      <mesh position={[-0.75, 1.0, 0]} material={amberYellow} castShadow receiveShadow>
        <boxGeometry args={[1.0, 1.32, 1.1]} />
      </mesh>

      <mesh position={[-1.25, 0.75, 0]} material={amberYellow} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.8, 1.1]} />
      </mesh>

      {/* Windshield */}
      <mesh position={[-1.2, 1.25, 0]} rotation={[0, 0, Math.PI / 15]} material={darkGlass} castShadow>
        <boxGeometry args={[0.05, 0.65, 1.06]} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[-0.75, 1.1, 0.56]} material={darkGlass}>
        <boxGeometry args={[0.5, 0.45, 0.02]} />
      </mesh>
      <mesh position={[-0.75, 1.1, -0.56]} material={darkGlass}>
        <boxGeometry args={[0.5, 0.45, 0.02]} />
      </mesh>

      {/* Wheels */}
      {/* Front Single Wheel */}
      <group position={[-1.25, 0.34, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.18, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={shinyChrome}>
          <cylinderGeometry args={[0.16, 0.16, 0.24, 12]} />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[0.75, 0.34, 0.62]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={shinyChrome}>
          <cylinderGeometry args={[0.16, 0.16, 0.24, 12]} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.75, 0.34, -0.62]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireRubber} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={shinyChrome}>
          <cylinderGeometry args={[0.16, 0.16, 0.24, 12]} />
        </mesh>
      </group>

      {/* Headlight */}
      <mesh position={[-1.43, 0.6, 0]} material={yellowLight}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
    </group>
  )
}

// ==================== MAIN 3D CANVAS SCENE WRAPPER ====================
export default function Truck3D() {
  const [activeVehicle, setActiveVehicle] = useState('lorry') // 'lorry' | 'bike' | 'auto'

  const buttonsData = [
    { id: 'lorry', text: '🚚 Lorry', activeColor: '#00f0ff', glow: 'rgba(0, 240, 255, 0.25)' },
    { id: 'bike', text: '🏍️ Bike', activeColor: '#10b981', glow: 'rgba(16, 185, 129, 0.25)' },
    { id: 'auto', text: '🛺 Auto', activeColor: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)' }
  ]

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing min-h-[350px] md:min-h-[460px] flex items-center justify-center">
      {/* 3D WebGL Canvas Layer */}
      <Canvas
        camera={{ position: [-5, 2.2, 5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.45} />
        
        {/* Dynamic Studio Spotlights creating cyan and fuchsia reflections */}
        <pointLight position={[10, 10, 10]} intensity={2.0} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff007f" />
        <directionalLight position={[0, 15, 0]} intensity={1.0} color="#ffffff" />
        
        {/* Procedural 3D Models */}
        <TruckModel activeVehicle={activeVehicle} />
        <BikeModel activeVehicle={activeVehicle} />
        <AutoModel activeVehicle={activeVehicle} />

        {/* Orbit Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      {/* Floating Glassmorphic selector tabs */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-1.5 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-glow select-none"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          boxShadow: '0 8px 32px 0 rgba(0, 240, 255, 0.15)'
        }}
      >
        {buttonsData.map((btn) => {
          const isActive = btn.id === activeVehicle
          return (
            <button
              key={btn.id}
              onClick={() => setActiveVehicle(btn.id)}
              className="px-3.5 py-1.5 rounded-full text-[10px] font-display font-extrabold uppercase tracking-wider transition-all duration-300"
              style={{
                background: isActive ? btn.activeColor : 'transparent',
                color: isActive ? '#0f172a' : '#94a3b8',
                boxShadow: isActive ? `0 0 10px ${btn.glow}` : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1.0)'
              }}
            >
              {btn.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
