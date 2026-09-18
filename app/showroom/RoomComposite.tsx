"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { cornerPinMatrix3d, type Pt } from "./homography";
import type { RoomScene } from "./showroom-data";

const K = 200; // px per metre for the (pre-warp) floor reference layer

interface RoomCompositeProps {
  scene: RoomScene;
  width: number;
  tileTexture: string;
  tileWm: number;
  tileHm: number;
  /** 0..1, lower roughness → glossier → stronger reflections. */
  gloss: number;
  groutColor?: string;
}

/** One tile cell (face + surrounding grout) as a data URL, repeated as the floor. */
function useTileCell(
  texture: string,
  cellW: number,
  cellH: number,
  groutColor: string,
  gloss: number,
): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const w = Math.max(24, Math.round(cellW));
      const h = Math.max(24, Math.round(cellH));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const g = Math.max(1.4, Math.min(w, h) * 0.035);
      ctx.fillStyle = groutColor;
      ctx.fillRect(0, 0, w, h);
      const fx = g / 2,
        fy = g / 2,
        fw = w - g,
        fh = h - g;
      const ar = img.width / img.height;
      const far = fw / fh;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;
      if (ar > far) {
        sw = img.height * far;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / far;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, fx, fy, fw, fh);
      if (gloss > 0.3) {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, `rgba(255,255,255,${0.05 * gloss})`);
        grad.addColorStop(0.5, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(0,0,0,${0.05 * gloss})`);
        ctx.fillStyle = grad;
        ctx.fillRect(fx, fy, fw, fh);
      }
      setUrl(canvas.toDataURL());
    };
    img.src = texture;
    return () => {
      cancelled = true;
    };
  }, [texture, cellW, cellH, groutColor, gloss]);
  return url;
}

export default function RoomComposite({
  scene,
  width,
  tileTexture,
  tileWm,
  tileHm,
  gloss,
  groutColor = "#d7d1c7",
}: RoomCompositeProps) {
  const height = (width * scene.height) / scene.width;
  const maskId = useId().replace(/:/g, "");

  const refW = scene.floorWidthM * K;
  const refH = scene.floorDepthM * K;
  const cellW = tileWm * K;
  const cellH = tileHm * K;
  const cell = useTileCell(tileTexture, cellW, cellH, groutColor, gloss);

  const dst: Pt[] = useMemo(
    () => scene.floor.map((p) => ({ x: p.x * width, y: p.y * height })),
    [scene, width, height],
  );
  const matrix = useMemo(() => cornerPinMatrix3d(refW, refH, dst), [refW, refH, dst]);

  // Feathered floor mask (soft edges hide any imperfection in the outline).
  const pathD = useMemo(() => {
    const pts = (scene.clip ?? scene.floor).map(
      (p) => `${(p.x * width).toFixed(1)},${(p.y * height).toFixed(1)}`,
    );
    return `M${pts.join(" L")} Z`;
  }, [scene, width, height]);
  const feather = Math.max(6, width * 0.018);

  const fullImg: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width,
    height,
    display: "block",
  };

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      {/* Base photograph */}
      <img src={scene.image} alt={scene.label} style={fullImg} draggable={false} />

      {/* Mask definition */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        aria-hidden
      >
        <defs>
          <filter id={`b${maskId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={feather} />
          </filter>
          <mask id={`m${maskId}`} maskUnits="userSpaceOnUse">
            <path d={pathD} fill="#fff" filter={`url(#b${maskId})`} />
          </mask>
        </defs>
      </svg>

      {/* Floor group: tile + its own light/shadow/reflection, masked as one */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          isolation: "isolate",
          mask: `url(#m${maskId})`,
          WebkitMask: `url(#m${maskId})`,
        }}
      >
        {/* Warped tiled floor */}
        {cell && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: refW,
              height: refH,
              transform: matrix,
              transformOrigin: "0 0",
              backgroundImage: `url(${cell})`,
              backgroundRepeat: "repeat",
              backgroundSize: `${cellW}px ${cellH}px`,
            }}
          />
        )}

        {/* Broad tone from the photo's floor (shadows + gradients) */}
        <img
          src={scene.image}
          alt=""
          draggable={false}
          style={{
            ...fullImg,
            mixBlendMode: "soft-light",
            opacity: scene.overlay,
            filter: "grayscale(1) contrast(1.05)",
          }}
        />
        {/* Contact shadows */}
        <img
          src={scene.image}
          alt=""
          draggable={false}
          style={{
            ...fullImg,
            mixBlendMode: "multiply",
            opacity: scene.overlay * 0.4,
            filter: "grayscale(1) brightness(1.2)",
          }}
        />
        {/* Bright reflections / gloss — the room mirrored in a polished floor */}
        <img
          src={scene.image}
          alt=""
          draggable={false}
          style={{
            ...fullImg,
            mixBlendMode: "screen",
            opacity: 0.25 + gloss * 0.4,
            filter: "grayscale(1) brightness(0.9) contrast(1.5)",
          }}
        />
      </div>
    </div>
  );
}
