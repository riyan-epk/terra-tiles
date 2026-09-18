"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import type { TileProduct, SurfaceTarget } from "./tile-data";

export type RoomType = "living" | "bedroom" | "bathroom";

const ROOM_W = 6;
const ROOM_H = 3.2;
const ROOM_D = 5;

interface RoomProps {
  selectedTile: TileProduct | null;
  surfaceTarget: SurfaceTarget;
  textureCache: Map<string, THREE.Texture>;
  roomType: RoomType;
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
      envMapIntensity: 0.6,
      side: THREE.FrontSide,
    });
  }, []);

  useEffect(() => {
    if (!tile || !shouldApply) {
      material.map = null;
      material.color.set(defaultColor);
      material.roughness = 0.75;
      material.metalness = 0;
      material.envMapIntensity = 0.6;
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
  material.envMapIntensity = 0.5 + (1 - tile.roughness) * 1.4;
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

/* ---------------------------------- Shared props ---------------------------- */

const FABRIC = "#6b6259";
const FABRIC_DARK = "#5c544c";
const WOOD = "#8a6a48";
const METAL_DARK = "#241f1a";

function LampOnTop({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.52, z]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.04, 16]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.09, 0.13, 0.16, 20, 1, true]} />
        <meshStandardMaterial
          color="#f3e4c6"
          emissive="#f0d29a"
          emissiveIntensity={0.7}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight position={[0, 0.33, 0]} intensity={0.35} color="#ffe6bd" distance={3} />
    </group>
  );
}

function Nightstand({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.42]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} envMapIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.34, 0.215]}>
        <boxGeometry args={[0.4, 0.02, 0.02]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.7} roughness={0.3} />
      </mesh>
      <LampOnTop x={0} z={0} />
    </group>
  );
}

/* --------------------------------- Bedroom ---------------------------------- */

function Bed() {
  // Head against the back wall (−Z), extends toward +Z.
  const headZ = -ROOM_D / 2 + 0.12;
  return (
    <group position={[0, 0, headZ + 1.15]}>
      {/* Frame / platform */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.15, 0.32, 2.25]} />
        <meshStandardMaterial color="#3f362d" roughness={0.6} envMapIntensity={0.4} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.42, 0.05]} castShadow>
        <boxGeometry args={[2.0, 0.26, 2.05]} />
        <meshStandardMaterial color="#efe9e0" roughness={0.9} />
      </mesh>
      {/* Duvet covering the lower two-thirds */}
      <mesh position={[0, 0.5, 0.35]} castShadow>
        <boxGeometry args={[2.02, 0.16, 1.5]} />
        <meshStandardMaterial color="#cdd4d0" roughness={0.95} />
      </mesh>
      {/* Duvet fold near the top */}
      <mesh position={[0, 0.56, -0.38]} castShadow>
        <boxGeometry args={[2.02, 0.12, 0.5]} />
        <meshStandardMaterial color="#dfe4e0" roughness={0.95} />
      </mesh>
      {/* Headboard (upholstered) */}
      <mesh position={[0, 0.85, -1.06]} castShadow>
        <boxGeometry args={[2.2, 1.2, 0.16]} />
        <meshStandardMaterial color={FABRIC} roughness={0.9} />
      </mesh>
      {/* Pillows */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.62, -0.72]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.78, 0.2, 0.44]} />
          <meshStandardMaterial color="#f6f2ec" roughness={0.85} />
        </mesh>
      ))}
      {/* Accent cushion */}
      <mesh position={[0, 0.66, -0.5]} rotation={[0.25, 0.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.3]} />
        <meshStandardMaterial color="#b98a5e" roughness={0.85} />
      </mesh>
      {/* Feet */}
      {[[-0.95, -1.05], [0.95, -1.05], [-0.95, 1.05], [0.95, 1.05]].map(
        ([x, z], i) => (
          <mesh key={i} position={[x, 0.04, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 10]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.5} roughness={0.4} />
          </mesh>
        ),
      )}
    </group>
  );
}

function BedroomFurniture() {
  return (
    <group>
      {/* Rug under the bed */}
      <mesh position={[0, 0.008, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 2.6]} />
        <meshStandardMaterial color="#9a8b78" roughness={0.98} envMapIntensity={0.2} />
      </mesh>
      <Bed />
      <Nightstand x={-1.45} z={-ROOM_D / 2 + 0.35} />
      <Nightstand x={1.45} z={-ROOM_D / 2 + 0.35} />
      {/* Wall art above the bed */}
      <group position={[0, 2.15, -ROOM_D / 2 + 0.03]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.7, 0.04]} />
          <meshStandardMaterial color={METAL_DARK} roughness={0.4} envMapIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.28, 0.58]} />
          <meshStandardMaterial color="#c4a988" roughness={0.85} />
        </mesh>
      </group>
      {/* Bench at foot of bed */}
      <mesh position={[0, 0.24, 1.75]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.4, 0.5]} />
        <meshStandardMaterial color={FABRIC_DARK} roughness={0.9} />
      </mesh>
      <PottedPlant x={2.5} z={-1.9} />
    </group>
  );
}

/* -------------------------------- Living room ------------------------------- */

function Sofa() {
  return (
    <group position={[-2.05, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 0.95]} />
        <meshStandardMaterial color={FABRIC_DARK} roughness={0.95} />
      </mesh>
      {[-0.5, 0.5].map((z, i) => (
        <mesh key={i} position={[0, 0.56, z * 0.5]} castShadow>
          <boxGeometry args={[1.9, 0.18, 0.44]} />
          <meshStandardMaterial color={FABRIC} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, -0.38]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.7, 0.24]} />
        <meshStandardMaterial color={FABRIC} roughness={0.9} />
      </mesh>
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x * 0.95, 0.52, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.95]} />
          <meshStandardMaterial color={FABRIC_DARK} roughness={0.92} />
        </mesh>
      ))}
      <mesh position={[-0.55, 0.68, -0.15]} rotation={[0.2, 0.3, 0.1]} castShadow>
        <boxGeometry args={[0.34, 0.34, 0.12]} />
        <meshStandardMaterial color="#b98a5e" roughness={0.85} />
      </mesh>
      {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]}>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 10]} />
          <meshStandardMaterial color={METAL_DARK} roughness={0.4} metalness={0.5} />
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
        <meshStandardMaterial color={WOOD} roughness={0.35} metalness={0.05} envMapIntensity={0.6} />
      </mesh>
      {[[-0.42, -0.2], [0.42, -0.2], [-0.42, 0.2], [0.42, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.15, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 10]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
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

function FloorLamp({ x = 2.35, z = 1.6 }: { x?: number; z?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1.8, 12]} />
        <meshStandardMaterial color="#2a2620" metalness={0.7} roughness={0.3} />
      </mesh>
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

function PottedPlant({ x = 2.5, z = -1.9 }: { x?: number; z?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.2, 0.55, 16]} />
        <meshStandardMaterial color="#cabaa6" roughness={0.7} envMapIntensity={0.4} />
      </mesh>
      {[
        [0, 0.75, 0, 0.32],
        [0.18, 0.9, 0.1, 0.24],
        [-0.15, 0.88, -0.08, 0.22],
        [0.05, 1.05, -0.05, 0.18],
      ].map(([px, py, pz, r], i) => (
        <mesh key={i} position={[px, py, pz]} castShadow>
          <sphereGeometry args={[r, 14, 14]} />
          <meshStandardMaterial color={i % 2 ? "#3f5738" : "#4a6a42"} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function LivingFurniture() {
  return (
    <group>
      <mesh position={[-0.9, 0.008, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 2.1]} />
        <meshStandardMaterial color="#9a8b78" roughness={0.98} envMapIntensity={0.2} />
      </mesh>
      <Sofa />
      <CoffeeTable />
      <FloorLamp />
      <PottedPlant />
      <group position={[-1.2, 1.75, -ROOM_D / 2 + 0.03]}>
        {[0, 0.95].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.95, 0.04]} />
              <meshStandardMaterial color={METAL_DARK} roughness={0.4} envMapIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.58, 0.83]} />
              <meshStandardMaterial color={i ? "#8a7b6b" : "#b98a5e"} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* --------------------------------- Bathroom --------------------------------- */

function BathroomFurniture() {
  const white = "#f4f1ec";
  return (
    <group>
      {/* Freestanding tub */}
      <group position={[-1.7, 0, -0.6]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.6, 0.85]} />
          <meshStandardMaterial color={white} roughness={0.2} metalness={0.02} envMapIntensity={1} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.4, 0.3, 0.6]} />
          <meshStandardMaterial color="#dfeaf0" roughness={0.15} metalness={0.05} />
        </mesh>
      </group>
      {/* Vanity with basin */}
      <group position={[1.9, 0, -1.2]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.8, 0.55]} />
          <meshStandardMaterial color={WOOD} roughness={0.5} envMapIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[1.45, 0.05, 0.6]} />
          <meshStandardMaterial color="#e8e2d8" roughness={0.25} envMapIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.14, 24]} />
          <meshStandardMaterial color={white} roughness={0.15} metalness={0.05} envMapIntensity={1} />
        </mesh>
        {/* Mirror */}
        <mesh position={[0, 1.7, -0.26]}>
          <boxGeometry args={[1.0, 1.1, 0.04]} />
          <meshStandardMaterial color="#aebfc8" roughness={0.05} metalness={0.9} envMapIntensity={1.4} />
        </mesh>
      </group>
      <PottedPlant x={-2.4} z={1.6} />
      <mesh position={[0, 0.008, 1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.6, 1.0]} />
        <meshStandardMaterial color="#d8cbb8" roughness={0.98} envMapIntensity={0.2} />
      </mesh>
    </group>
  );
}

/* ----------------------------------- Window --------------------------------- */

function Window() {
  const x = ROOM_W / 2 - 0.03;
  return (
    <group position={[x, 1.7, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial color="#cfe0f5" emissive="#dfecff" emissiveIntensity={0.9} roughness={1} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.75, 2.35, 0.06]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
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

/* ----------------------------------- Room ----------------------------------- */

export default function Room({
  selectedTile,
  surfaceTarget,
  textureCache,
  roomType,
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={floorMat} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#f5f0eb" roughness={0.95} envMapIntensity={0.3} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} material={backWallMat} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
      </mesh>
      <mesh position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={leftWallMat} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
      </mesh>
      <mesh position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={rightWallMat} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
      </mesh>

      {/* Skirting + crown trim */}
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

      <Window />

      {roomType === "bedroom" && <BedroomFurniture />}
      {roomType === "bathroom" && <BathroomFurniture />}
      {roomType === "living" && <LivingFurniture />}
    </group>
  );
}
