import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Preload, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Scene component optimized for performance.
 * - Uses useRef instead of useState for animations to avoid re-rendering the whole component every frame.
 * - Separates geometry and loaded models for clarity.
 */
function Scene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { scene } = useGLTF('/heavy-model.glb');

  // Animation logic: Update the ref directly without triggering React re-renders.
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      {/* 
        Loading the heavy model inside the same scene. 
        Note: If this model is extremely heavy, consider separate Suspense boundaries.
      */}
      <primitive object={scene} position={[0, -2, 0]} />
    </group>
  );
}

/**
 * Fallback component to show while the 3D assets are loading.
 */
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="gray" wireframe />
    </mesh>
  );
}

export default function App() {
  return (
    <div className="h-screen w-full bg-slate-900">
      <Canvas
        shadows
        dpr={[1, 2]} // Performance: Limit pixel ratio for high-res screens
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping
        }}
      >
        <Suspense fallback={<Loader />}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <Scene />
          
          <OrbitControls makeDefault enableDamping />
          
          {/* Preload ensures assets are fetched early */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preloading for better performance
useGLTF.preload('/heavy-model.glb');
