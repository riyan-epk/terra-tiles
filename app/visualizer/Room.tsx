"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { TileProduct, SurfaceTarget } from "./tile-data";

const ROOM_W = 6;
const ROOM_H = 3.2;
const ROOM_D = 5;

interface RoomProps {
  selectedTile: TileProduct | null;
  surfaceTarget: SurfaceTarget;
  textureCache: Map<string, THREE.Texture>;
}

function useTiledMaterial(
  tile: TileProduct | null,
  shouldApply: boolean,
  textureCache: Map<string, THREE.Texture>,
  defaultColor: string
) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: defaultColor,
      roughness: 0.7,
      metalness: 0,
      side: THREE.FrontSide,
    });
  }, []);

  useEffect(() => {
    if (!tile || !shouldApply) {
      material.map = null;
      material.color.set(defaultColor);
      material.roughness = 0.7;
      material.metalness = 0;
      material.needsUpdate = true;
      return;
    }

    const cached = textureCache.get(tile.id);
    if (cached) {
      applyTexture(cached, tile, material);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(tile.texture, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 8;
      textureCache.set(tile.id, tex);
      applyTexture(tex, tile, material);
    });
  }, [tile, shouldApply]);

  return material;
}

function applyTexture(
  tex: THREE.Texture,
  tile: TileProduct,
  material: THREE.MeshStandardMaterial
) {
  const cloned = tex.clone();
  cloned.wrapS = THREE.RepeatWrapping;
  cloned.wrapT = THREE.RepeatWrapping;
  cloned.repeat.set(tile.repeatX, tile.repeatY);
  cloned.needsUpdate = true;
  material.map = cloned;
  material.color.set("#ffffff");
  material.roughness = tile.roughness;
  material.metalness = tile.metalness;
  material.needsUpdate = true;
}

function shouldApplyToSurface(
  surfaceName: string,
  target: SurfaceTarget
): boolean {
  if (target === "all") return true;
  if (target === "floor" && surfaceName === "floor") return true;
  if (target === "walls" && surfaceName.includes("wall")) return true;
  if (target === surfaceName) return true;
  return false;
}

function Furniture() {
  return (
    <group>
      {/* Sofa */}
      <group position={[-2.2, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.35, 0.8]} />
          <meshStandardMaterial color="#4a4540" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, -0.3]}>
          <boxGeometry args={[1.8, 0.35, 0.2]} />
          <meshStandardMaterial color="#3d3835" roughness={0.9} />
        </mesh>
        <mesh position={[-0.8, 0.15, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.8]} />
          <meshStandardMaterial color="#3d3835" roughness={0.9} />
        </mesh>
        <mesh position={[0.8, 0.15, 0]}>
          <boxGeometry args={[0.15, 0.3, 0.8]} />
          <meshStandardMaterial color="#3d3835" roughness={0.9} />
        </mesh>
      </group>

      {/* Coffee table */}
      <group position={[-0.5, 0, 0.4]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.5]} />
          <meshStandardMaterial color="#8a6a48" roughness={0.4} metalness={0.05} />
        </mesh>
        {[[-0.38, -0.18], [0.38, -0.18], [-0.38, 0.18], [0.38, 0.18]].map(
          ([x, z], i) => (
            <mesh key={i} position={[x, 0.13, z]}>
              <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
              <meshStandardMaterial color="#2a2520" metalness={0.6} roughness={0.3} />
            </mesh>
          )
        )}
      </group>

      {/* Tall plant / vase */}
      <group position={[2.5, 0, -2]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.5, 12]} />
          <meshStandardMaterial color="#c4b8a8" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#4a6040" roughness={0.9} />
        </mesh>
        <mesh position={[0.15, 0.85, 0.1]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial color="#3d5535" roughness={0.9} />
        </mesh>
      </group>

      {/* Wall art frame */}
      <group position={[0, 1.8, -ROOM_D / 2 + 0.02]}>
        <mesh>
          <boxGeometry args={[1.2, 0.8, 0.04]} />
          <meshStandardMaterial color="#2a2520" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshStandardMaterial color="#6a625a" roughness={0.8} />
        </mesh>
      </group>

      {/* Rug */}
      <mesh position={[-0.5, 0.005, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 1.8]} />
        <meshStandardMaterial color="#8a7b6b" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function Room({ selectedTile, surfaceTarget, textureCache }: RoomProps) {
  const groupRef = useRef<THREE.Group>(null);

  const floorMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("floor", surfaceTarget),
    textureCache,
    "#d4c5b5"
  );
  const backWallMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("back-wall", surfaceTarget),
    textureCache,
    "#e8e0d8"
  );
  const leftWallMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("left-wall", surfaceTarget),
    textureCache,
    "#e0d8d0"
  );
  const rightWallMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("right-wall", surfaceTarget),
    textureCache,
    "#e0d8d0"
  );

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={floorMat}
        receiveShadow
      >
        <planeGeometry args={[ROOM_W, ROOM_D]} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#f5f0eb" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh
        position={[0, ROOM_H / 2, -ROOM_D / 2]}
        material={backWallMat}
        receiveShadow
      >
        <planeGeometry args={[ROOM_W, ROOM_H]} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-ROOM_W / 2, ROOM_H / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={leftWallMat}
        receiveShadow
      >
        <planeGeometry args={[ROOM_D, ROOM_H]} />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[ROOM_W / 2, ROOM_H / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        material={rightWallMat}
        receiveShadow
      >
        <planeGeometry args={[ROOM_D, ROOM_H]} />
      </mesh>

      {/* Baseboard trim */}
      {[
        { pos: [0, 0.04, -ROOM_D / 2 + 0.01] as [number, number, number], size: [ROOM_W, 0.08, 0.02] as [number, number, number] },
        { pos: [-ROOM_W / 2 + 0.01, 0.04, 0] as [number, number, number], size: [0.02, 0.08, ROOM_D] as [number, number, number] },
        { pos: [ROOM_W / 2 - 0.01, 0.04, 0] as [number, number, number], size: [0.02, 0.08, ROOM_D] as [number, number, number] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#f5f0eb" roughness={0.5} />
        </mesh>
      ))}

      {/* Furniture */}
      <Furniture />
    </group>
  );
}
