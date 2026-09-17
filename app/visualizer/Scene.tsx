"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";
import type { TileProduct, SurfaceTarget } from "./tile-data";

interface SceneProps {
  selectedTile: TileProduct | null;
  surfaceTarget: SurfaceTarget;
  textureCache: Map<string, THREE.Texture>;
  onResetCamera: boolean;
  onResetDone: () => void;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#f5f0eb" />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-near={0.1}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-2, 2.8, -1]} intensity={0.3} color="#c9a96e" />
      <pointLight position={[2, 2.8, 1]} intensity={0.2} color="#f5f0eb" />
    </>
  );
}

function CameraController({
  resetCamera,
  onResetDone,
}: {
  resetCamera: boolean;
  onResetDone: () => void;
}) {
  const controlsRef = useRef<any>(null);

  if (resetCamera && controlsRef.current) {
    controlsRef.current.reset();
    onResetDone();
  }

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      minDistance={2}
      maxDistance={14}
      minPolarAngle={Math.PI * 0.1}
      maxPolarAngle={Math.PI * 0.55}
      target={[0, 1.2, 0]}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 1.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2a2a2a" wireframe />
    </mesh>
  );
}

export default function Scene({
  selectedTile,
  surfaceTarget,
  textureCache,
  onResetCamera,
  onResetDone,
}: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [3.5, 2.8, 4.5], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ background: "#1a1a1a", width: "100%", height: "100%" }}
    >
      <Lighting />
      <CameraController resetCamera={onResetCamera} onResetDone={onResetDone} />

      <Suspense fallback={<LoadingFallback />}>
        <Room
          selectedTile={selectedTile}
          surfaceTarget={surfaceTarget}
          textureCache={textureCache}
        />
      </Suspense>

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.25}
        scale={10}
        blur={2}
        far={4}
      />
    </Canvas>
  );
}
