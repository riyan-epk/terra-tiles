"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
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
  defaultColor: string,
) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: defaultColor,
      roughness: 0.75,
      metalness: 0,
      envMapIntensity: 0.5,
      side: THREE.FrontSide,
    });
  }, []);

  useEffect(() => {
    if (!tile || !shouldApply) {
      material.map = null;
      material.color.set(defaultColor);
      material.roughness = 0.75;
      material.metalness = 0;
      material.envMapIntensity = 0.5;
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
  material: THREE.MeshStandardMaterial,
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
  // Glossier (lower-roughness) surfaces pick up more of the room's reflections.
  material.envMapIntensity = 0.4 + (1 - tile.roughness) * 1.3;
  material.needsUpdate = true;
}

function shouldApplyToSurface(
  surfaceName: string,
  target: SurfaceTarget,
): boolean {
  if (target === "all") return true;
  if (target === "floor" && surfaceName === "floor") return true;
  if (target === "walls" && surfaceName.includes("wall")) return true;
  if (target === surfaceName) return true;
  return false;
}

/** A soft upholstered sofa built from rounded segments. */
function Sofa() {
  const fabric = "#6b6259";
  const fabricDark = "#5c544c";
  return (
    <group position={[-2.05, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 0.95]} />
        <meshStandardMaterial color={fabricDark} roughness={0.95} />
      </mesh>
      {/* Seat cushions */}
      {[-0.5, 0.5].map((z, i) => (
        <mesh key={i} position={[0, 0.56, z * 0.5]} castShadow>
          <boxGeometry args={[1.9, 0.18, 0.44]} />
          <meshStandardMaterial color={fabric} roughness={0.9} />
        </mesh>
      ))}
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.38]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.7, 0.24]} />
        <meshStandardMaterial color={fabric} roughness={0.9} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x * 0.95, 0.52, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.95]} />
          <meshStandardMaterial color={fabricDark} roughness={0.92} />
        </mesh>
      ))}
      {/* Accent pillow */}
      <mesh position={[-0.55, 0.68, -0.15]} rotation={[0.2, 0.3, 0.1]} castShadow>
        <boxGeometry args={[0.34, 0.34, 0.12]} />
        <meshStandardMaterial color="#b98a5e" roughness={0.85} />
      </mesh>
      {/* Feet */}
      {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 10]} />
          <meshStandardMaterial color="#2a2018" roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function CoffeeTable() {
  return (
    <group position={[-0.35, 0, 0.35]}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.05, 0.55]} />
        <meshStandardMaterial
          color="#8a6a48"
          roughness={0.35}
          metalness={0.05}
          envMapIntensity={0.6}
        />
      </mesh>
      {[[-0.42, -0.2], [0.42, -0.2], [-0.42, 0.2], [0.42, 0.2]].map(
        ([x, z], i) => (
          <mesh key={i} position={[x, 0.15, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 10]} />
            <meshStandardMaterial
              color="#241f1a"
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
        ),
      )}
      {/* Coffee-table books */}
      <mesh position={[0.15, 0.38, 0]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.22]} />
        <meshStandardMaterial color="#b5462f" roughness={0.7} />
      </mesh>
      <mesh position={[0.13, 0.42, 0.02]} rotation={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.28, 0.03, 0.2]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.7} />
      </mesh>
    </group>
  );
}

function FloorLamp() {
  return (
    <group position={[2.35, 0, 1.6]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        <meshStandardMaterial color="#241f1a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1.8, 12]} />
        <meshStandardMaterial color="#2a2620" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Shade (emissive to read as a lit lamp) */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.28, 24, 1, true]} />
        <meshStandardMaterial
          color="#f3e4c6"
          emissive="#f0d8a0"
          emissiveIntensity={0.6}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight position={[0, 1.7, 0]} intensity={0.5} color="#ffe9c2" distance={4} />
    </group>
  );
}

function PottedPlant() {
  return (
    <group position={[2.5, 0, -1.9]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.2, 0.55, 16]} />
        <meshStandardMaterial color="#cabaa6" roughness={0.7} envMapIntensity={0.4} />
      </mesh>
      {[
        [0, 0.75, 0, 0.32],
        [0.18, 0.9, 0.1, 0.24],
        [-0.15, 0.88, -0.08, 0.22],
        [0.05, 1.05, -0.05, 0.18],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 14, 14]} />
          <meshStandardMaterial color={i % 2 ? "#3f5738" : "#4a6a42"} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** A tall window on the +X wall, aligned with the daylight in the scene. */
function Window() {
  const x = ROOM_W / 2 - 0.03;
  return (
    <group position={[x, 1.7, -0.8]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Bright sky panel */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial
          color="#cfe0f5"
          emissive="#dfecff"
          emissiveIntensity={0.9}
          roughness={1}
        />
      </mesh>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.75, 2.35, 0.06]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
      {/* Cut-out illusion via inner dark reveal */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial color="#cfe0f5" emissive="#eef4ff" emissiveIntensity={0.7} />
      </mesh>
      {/* Mullions */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.04, 2.2, 0.03]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.6, 0.04, 0.03]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
    </group>
  );
}

function WallArt() {
  return (
    <group position={[-1.2, 1.75, -ROOM_D / 2 + 0.03]}>
      {[0, 0.95].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.95, 0.04]} />
            <meshStandardMaterial color="#241f1a" roughness={0.4} envMapIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.58, 0.83]} />
            <meshStandardMaterial
              color={i ? "#8a7b6b" : "#b98a5e"}
              roughness={0.85}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Room({
  selectedTile,
  surfaceTarget,
  textureCache,
}: RoomProps) {
  const groupRef = useRef<THREE.Group>(null);

  const floorMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("floor", surfaceTarget),
    textureCache,
    "#cbbda8",
  );
  const backWallMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("back-wall", surfaceTarget),
    textureCache,
    "#e8e0d8",
  );
  const leftWallMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("left-wall", surfaceTarget),
    textureCache,
    "#e2dad2",
  );
  const rightWallMat = useTiledMaterial(
    selectedTile,
    shouldApplyToSurface("right-wall", surfaceTarget),
    textureCache,
    "#e2dad2",
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
        <meshStandardMaterial color="#f5f0eb" roughness={0.95} envMapIntensity={0.3} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} material={backWallMat} receiveShadow>
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

      {/* Skirting + crown trim on the three solid walls */}
      {[
        { pos: [0, 0.05, -ROOM_D / 2 + 0.012], size: [ROOM_W, 0.1, 0.03] },
        { pos: [-ROOM_W / 2 + 0.012, 0.05, 0], size: [0.03, 0.1, ROOM_D] },
        { pos: [ROOM_W / 2 - 0.012, 0.05, 0], size: [0.03, 0.1, ROOM_D] },
        { pos: [0, ROOM_H - 0.06, -ROOM_D / 2 + 0.012], size: [ROOM_W, 0.12, 0.04] },
        { pos: [-ROOM_W / 2 + 0.012, ROOM_H - 0.06, 0], size: [0.04, 0.12, ROOM_D] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos as [number, number, number]} castShadow>
          <boxGeometry args={b.size as [number, number, number]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.5} envMapIntensity={0.4} />
        </mesh>
      ))}

      {/* Area rug under the seating */}
      <mesh position={[-0.9, 0.008, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 2.1]} />
        <meshStandardMaterial color="#9a8b78" roughness={0.98} envMapIntensity={0.2} />
      </mesh>
      <mesh position={[-0.9, 0.012, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.7, 1.85]} />
        <meshStandardMaterial color="#b0a08c" roughness={0.98} envMapIntensity={0.2} />
      </mesh>

      <Sofa />
      <CoffeeTable />
      <FloorLamp />
      <PottedPlant />
      <Window />
      <WallArt />
    </group>
  );
}
