"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import Room, { type RoomType } from "./Room";
import type { TileProduct, SurfaceTarget } from "./tile-data";

interface SceneProps {
  selectedTile: TileProduct | null;
  surfaceTarget: SurfaceTarget;
  textureCache: Map<string, THREE.Texture>;
  roomType: RoomType;
  onResetCamera: boolean;
  onResetDone: () => void;
}

/**
 * Studio + daylight lighting. The Environment builds an image-based lighting
 * map procedurally from Lightformers (no HDRI download), giving soft realistic
 * reflections on polished surfaces; a directional key light casts the shadows,
 * and a warm rect light simulates daylight through the window.
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#f3ede5" />

      {/* Key light — casts soft shadows. Angled as if from the window. */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.6}
        color="#fff6ea"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={25}
        shadow-camera-near={0.1}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />

      {/* Cool sky fill from the opposite side. */}
      <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#dfe6f0" />

      {/* Warm bounce near the floor. */}
      <pointLight position={[0, 0.6, 1.5]} intensity={0.2} color="#e8c9a0" />

      {/* Procedural image-based lighting for realistic reflections. */}
      <Environment resolution={256}>
        <group>
          {/* Big soft ceiling softbox. */}
          <Lightformer
            intensity={1.4}
            form="rect"
            position={[0, 4, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[8, 6, 1]}
            color="#fff6ec"
          />
          {/* Bright window on the +X side. */}
          <Lightformer
            intensity={2.2}
            form="rect"
            position={[5, 2, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[5, 4, 1]}
            color="#eaf1ff"
          />
          {/* Warm side fill. */}
          <Lightformer
            intensity={0.8}
            form="rect"
            position={[-5, 2, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[5, 4, 1]}
            color="#f3e2cb"
          />
        </group>
      </Environment>
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
  roomType,
  onResetCamera,
  onResetDone,
}: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [3.5, 2.8, 4.5], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ background: "#151310", width: "100%", height: "100%" }}
    >
      <Lighting />
      <CameraController resetCamera={onResetCamera} onResetDone={onResetDone} />

      <Suspense fallback={<LoadingFallback />}>
        <Room
          selectedTile={selectedTile}
          surfaceTarget={surfaceTarget}
          textureCache={textureCache}
          roomType={roomType}
        />
      </Suspense>

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={4}
        color="#1a1510"
      />
    </Canvas>
  );
}
