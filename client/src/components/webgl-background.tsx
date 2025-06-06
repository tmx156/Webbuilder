import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 100;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: "#ff6b9d", transparent: true, opacity: 0.6 }), particleCount]}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ]}>
          <mesh />
        </group>
      ))}
    </instancedMesh>
  );
}

function AnimatedLights() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime) * 5;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime) * 5;
      lightRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={lightRef} position={[5, 5, 5]} intensity={1} color="#ff6b9d" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#c8a2c8" />
    </>
  );
}

export default function WebGLBackground() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-rose-400/20 via-purple-400/10 to-mint-400/20">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        className="w-full h-full"
      >
        <AnimatedLights />
        <Stars 
          radius={100} 
          depth={50} 
          count={1000} 
          factor={4} 
          fade 
          speed={0.5}
        />
        <FloatingParticles />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
