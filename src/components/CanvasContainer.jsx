import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import ParticlesBg from './ParticlesBg'

function FloatingShapes() {
  const meshRef1 = useRef()
  const meshRef2 = useRef()
  const meshRef3 = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.15
      meshRef1.current.rotation.y = time * 0.2
      meshRef1.current.position.y = Math.sin(time * 0.5) * 0.5 + 2
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = time * -0.1
      meshRef2.current.rotation.y = time * 0.15
      meshRef2.current.position.y = Math.cos(time * 0.4) * 0.4 - 2
      meshRef2.current.position.x = Math.sin(time * 0.3) * 0.3 - 4
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.x = time * 0.08
      meshRef3.current.rotation.y = time * -0.12
      meshRef3.current.position.y = Math.sin(time * 0.3) * 0.3 - 1
      meshRef3.current.position.x = Math.cos(time * 0.5) * 0.4 + 4
    }
  })

  return (
    <group>
      {/* Torus / Ring */}
      <mesh ref={meshRef1} position={[3, 2, -2]}>
        <torusGeometry args={[1, 0.2, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.9} emissive="#8b5cf6" emissiveIntensity={0.5} />
      </mesh>
      {/* Cube */}
      <mesh ref={meshRef2} position={[-4, -2, -3]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.8} emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
      {/* Octahedron */}
      <mesh ref={meshRef3} position={[4, -1, -4]}>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial color="#d946ef" roughness={0.1} metalness={0.9} emissive="#d946ef" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default function CanvasContainer({ isPortals }) {
  return (
    <div className="webgl-canvas">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff007f" />
        <ParticlesBg isPortals={isPortals} />
        <FloatingShapes />
      </Canvas>
    </div>
  )
}
