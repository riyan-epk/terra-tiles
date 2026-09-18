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
}

function shade(hex: [number, number, number], f: number): string {
  const c = hex.map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/**
 * Build a BLOCK of tiles (cols×rows) as a data URL, each tile a randomly
 * flipped crop of the source so the repeat period is a whole block, not a
 * single identical tile — which is what makes CSS-tiled marble read as fake.
 * Grout is thin and colour-matched to the stone.
 */
function useTileBlock(
  texture: string,
  cellW: number,
  cellH: number,
  gloss: number,
): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const cw = Math.max(20, Math.round(cellW));
      const ch = Math.max(20, Math.round(cellH));

      // Average colour for a matching grout line.
      const s = document.createElement("canvas");
      s.width = s.height = 1;
      const sc = s.getContext("2d");
      let avg: [number, number, number] = [200, 195, 188];
      if (sc) {
        sc.drawImage(img, 0, 0, 1, 1);
        const d = sc.getImageData(0, 0, 1, 1).data;
        avg = [d[0], d[1], d[2]];
      }
      const grout = shade(avg, 0.86);

      const cols = cw > 200 ? 2 : 3;
      const rows = ch > 200 ? 2 : 3;
      const canvas = document.createElement("canvas");
      canvas.width = cw * cols;
      canvas.height = ch * rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const g = Math.max(1, Math.min(cw, ch) * 0.016); // thin grout

      ctx.fillStyle = grout;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const ar = img.width / img.height;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cw + g / 2;
          const y = r * ch + g / 2;
          const fw = cw - g;
          const fh = ch - g;
          const far = fw / fh;
          // cover crop
          let sw = img.width,
            sh = img.height,
            sx = 0,
            sy = 0;
          if (ar > far) {
            sw = img.height * far;
            sx = (img.width - sw) * Math.random();
          } else {
            sh = img.width / far;
            sy = (img.height - sh) * Math.random();
          }
          const flipX = Math.random() < 0.5 ? -1 : 1;
          const flipY = Math.random() < 0.5 ? -1 : 1;
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, fw, fh);
          ctx.clip();
          ctx.translate(x + fw / 2, y + fh / 2);
          ctx.scale(flipX, flipY);
          ctx.drawImage(img, sx, sy, sw, sh, -fw / 2, -fh / 2, fw, fh);
          ctx.restore();
          if (gloss > 0.3) {
            const grad = ctx.createLinearGradient(x, y, x + fw, y + fh);
            grad.addColorStop(0, `rgba(255,255,255,${0.05 * gloss})`);
            grad.addColorStop(0.5, "rgba(255,255,255,0)");
            grad.addColorStop(1, `rgba(0,0,0,${0.04 * gloss})`);
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, fw, fh);
          }
        }
      }
      setUrl(canvas.toDataURL());
    };
    img.src = texture;
    return () => {
      cancelled = true;
    };
  }, [texture, cellW, cellH, gloss]);
  return url;
}

export default function RoomComposite({
  scene,
  width,
  tileTexture,
  tileWm,
  tileHm,
  gloss,
}: RoomCompositeProps) {
  const height = (width * scene.height) / scene.width;
  const maskId = useId().replace(/:/g, "");

  const refW = scene.floorWidthM * K;
  const refH = scene.floorDepthM * K;
  const cellW = tileWm * K;
  const cellH = tileHm * K;
  const cols = cellW > 200 ? 2 : 3;
  const rows = cellH > 200 ? 2 : 3;
  const block = useTileBlock(tileTexture, cellW, cellH, gloss);

  const dst: Pt[] = useMemo(
    () => scene.floor.map((p) => ({ x: p.x * width, y: p.y * height })),
    [scene, width, height],
  );
  const matrix = useMemo(() => cornerPinMatrix3d(refW, refH, dst), [refW, refH, dst]);

  const pathD = useMemo(() => {
    const pts = (scene.clip ?? scene.floor).map(
      (p) => `${(p.x * width).toFixed(1)},${(p.y * height).toFixed(1)}`,
    );
    return `M${pts.join(" L")} Z`;
  }, [scene, width, height]);
  const feather = Math.max(3, width * 0.008);

  const fullImg: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width,
    height,
    display: "block",
  };

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <img src={scene.image} alt={scene.label} style={fullImg} draggable={false} />

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

      <div
        style={{
          position: "absolute",
          inset: 0,
          isolation: "isolate",
          mask: `url(#m${maskId})`,
          WebkitMask: `url(#m${maskId})`,
        }}
      >
        {block && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: refW,
              height: refH,
              transform: matrix,
              transformOrigin: "0 0",
              backgroundImage: `url(${block})`,
              backgroundRepeat: "repeat",
              backgroundSize: `${cellW * cols}px ${cellH * rows}px`,
            }}
          />
        )}

        {/* Broad tone (front-bright / back-dark, soft shadows) */}
        <img
          src={scene.image}
          alt=""
          draggable={false}
          style={{
            ...fullImg,
            mixBlendMode: "soft-light",
            opacity: Math.min(1, scene.overlay + 0.1),
            filter: "grayscale(1) contrast(1.08)",
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
            opacity: scene.overlay * 0.45,
            filter: "grayscale(1) brightness(1.15)",
          }}
        />
        {/* Reflections / gloss — the room mirrored in a polished floor */}
        <img
          src={scene.image}
          alt=""
          draggable={false}
          style={{
            ...fullImg,
            mixBlendMode: "screen",
            opacity: 0.3 + gloss * 0.45,
            filter: "grayscale(1) brightness(0.85) contrast(1.6)",
          }}
        />
      </div>
    </div>
  );
}
