import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Optimization: Move Scene logic to its own component and use refs for updates.
// This prevents React from re-rendering the component every frame (60-120fps).
function Scene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Load the model. useGLTF handles caching automatically.
  // We use Suspense in the parent to handle the loading state.
  const { scene } = useGLTF('/heavy-model.glb');

  // 2. Optimization: Update the rotation directly via the ref inside useFrame.
  // This is much faster than updating component state (useState) every frame.
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
      <primitive object={scene} />
    </mesh>
  );
}

// 3. Optimization: Provide a fallback UI for the loading state.
function Loader() {
  return (
    <Html center>
      <div className="text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm">
        Loading 3D Assets...
      </div>
    </Html>
  );
}

export default function App() {
  return (
    <div className="h-screen w-full bg-neutral-900">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* 4. Optimization: Wrap the scene in Suspense to handle the asynchronous GLTF loading.
            This prevents the entire UI from hanging while the model loads. */}
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the GLTF to start loading as early as possible.
useGLTF.preload('/heavy-model.glb');
