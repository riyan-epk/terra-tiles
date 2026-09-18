"use client";

import { useEffect, useMemo, useState } from "react";
import { cornerPinMatrix3d, type Pt } from "./homography";
import type { RoomScene } from "./showroom-data";

const K = 200; // px per metre for the (pre-warp) floor reference layer

interface RoomCompositeProps {
  scene: RoomScene;
  /** Displayed width in px; height follows the image aspect. */
  width: number;
  tileTexture: string;
  tileWm: number;
  tileHm: number;
  /** Lower roughness → glossier → stronger reflections. */
  gloss: number;
  groutColor?: string;
}

/**
 * Build one tile "cell" (tile face + surrounding grout) as a data URL, to be
 * repeated as the floor background. Half-grout on each edge so repeats merge
 * into full grout lines between tiles.
 */
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
      const g = Math.max(1.2, Math.min(w, h) * 0.03); // grout width
      // Grout fills the cell; tile face is inset by half-grout on each side.
      ctx.fillStyle = groutColor;
      ctx.fillRect(0, 0, w, h);
      // Draw texture "cover" into the inset face.
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
      // Subtle sheen for glossy tiles.
      if (gloss > 0.35) {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, `rgba(255,255,255,${0.06 * gloss})`);
        grad.addColorStop(0.5, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(0,0,0,${0.04 * gloss})`);
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
  groutColor = "#d9d3c9",
}: RoomCompositeProps) {
  const height = (width * scene.height) / scene.width;

  // Reference (pre-warp) layer sized to the floor's real proportions.
  const refW = scene.floorWidthM * K;
  const refH = scene.floorDepthM * K;
  const cellW = tileWm * K;
  const cellH = tileHm * K;

  const cell = useTileCell(tileTexture, cellW, cellH, groutColor, gloss);

  // Destination floor corners in displayed px.
  const dst: Pt[] = useMemo(
    () => scene.floor.map((p) => ({ x: p.x * width, y: p.y * height })),
    [scene, width, height],
  );
  const matrix = useMemo(() => cornerPinMatrix3d(refW, refH, dst), [refW, refH, dst]);

  const clipPts = (scene.clip ?? scene.floor)
    .map((p) => `${(p.x * 100).toFixed(2)}% ${(p.y * 100).toFixed(2)}%`)
    .join(", ");
  const clipPath = `polygon(${clipPts})`;

  return (
    <div
      style={{ position: "relative", width, height, overflow: "hidden" }}
    >
      {/* Base photograph */}
      <img
        src={scene.image}
        alt={scene.label}
        style={{ position: "absolute", inset: 0, width, height, display: "block" }}
        draggable={false}
      />

      {/* Warped tiled floor, clipped to the visible floor area */}
      <div style={{ position: "absolute", inset: 0, clipPath, WebkitClipPath: clipPath }}>
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
      </div>

      {/* Re-apply the photo's own light & shadow over the new tile */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath,
          WebkitClipPath: clipPath,
          mixBlendMode: "soft-light",
          opacity: scene.overlay,
        }}
      >
        <img
          src={scene.image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            display: "block",
            filter: "grayscale(1) contrast(1.05) brightness(1.05)",
          }}
          draggable={false}
        />
      </div>

      {/* A second, gentler multiply pass deepens the contact shadows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath,
          WebkitClipPath: clipPath,
          mixBlendMode: "multiply",
          opacity: scene.overlay * 0.35,
        }}
      >
        <img
          src={scene.image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            display: "block",
            filter: "grayscale(1) brightness(1.15)",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
