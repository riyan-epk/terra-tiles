"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import RoomComposite from "./RoomComposite";
import { ROOM_SCENES, type RoomScene } from "./showroom-data";

export interface ShowroomTile {
  id: string;
  name: string;
  sizeLabel: string;
  category: string;
  texture: string;
  wM: number;
  hM: number;
  gloss: number;
}

interface ShowroomClientProps {
  tiles: ShowroomTile[];
  categories: string[];
  brandName: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function ShowroomClient({
  tiles,
  categories,
  brandName,
}: ShowroomClientProps) {
  const [sceneId, setSceneId] = useState<RoomScene["id"]>("living");
  const [tileId, setTileId] = useState<string>(tiles[0]?.id ?? "");
  const [activeCat, setActiveCat] = useState("All");
  const [panelOpen, setPanelOpen] = useState(false); // mobile bottom sheet

  const scene = ROOM_SCENES.find((s) => s.id === sceneId) ?? ROOM_SCENES[0];
  const tile = tiles.find((t) => t.id === tileId) ?? tiles[0];

  const filters = ["All", ...categories];
  const shown =
    activeCat === "All" ? tiles : tiles.filter((t) => t.category === activeCat);

  // Viewport sizing.
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setStage({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setStage({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Composite width fitted to the stage (contain).
  const aspect = scene.width / scene.height;
  const fitW = stage.w && stage.h ? Math.min(stage.w, stage.h * aspect) : 0;

  // Zoom & pan.
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);
  useEffect(() => {
    reset();
  }, [sceneId, reset]);

  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    if (zoom <= 1) return;
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    const bound = (fitW * (zoom - 1)) / 2;
    const boundY = ((fitW / aspect) * (zoom - 1)) / 2;
    setPan({
      x: Math.max(-bound, Math.min(bound, drag.current.px + dx)),
      y: Math.max(-boundY, Math.min(boundY, drag.current.py + dy)),
    });
  }
  function onPointerUp() {
    drag.current = null;
  }
  function onWheel(e: React.WheelEvent) {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - e.deltaY * 0.002));
    setZoom(next);
    if (next <= 1) setPan({ x: 0, y: 0 });
  }

  return (
    <div className="h-dvh w-full flex flex-col lg:flex-row bg-[#f6f4f1] text-[#2a2a2a] overflow-hidden">
      {/* Stage */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <a
              href="/"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors"
              aria-label="Back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <span className="text-lg font-medium tracking-tight">{scene.label}</span>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={reset}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors"
              aria-label="Reset view"
              title="Reset view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 9A8 8 0 006 5.3M4 15a8 8 0 0014 3.7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Composite viewport */}
        <div
          ref={stageRef}
          className="flex-1 min-h-0 flex items-center justify-center overflow-hidden select-none touch-none"
          style={{ cursor: zoom > 1 ? "grab" : "default" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
        >
          {fitW > 0 && tile && (
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: drag.current ? "none" : "transform 0.15s ease-out",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)",
              }}
            >
              <RoomComposite
                scene={scene}
                width={fitW}
                tileTexture={tile.texture}
                tileWm={tile.wM}
                tileHm={tile.hM}
                gloss={tile.gloss}
              />
            </div>
          )}
        </div>

        {/* Camera controls */}
        <div className="absolute bottom-24 lg:bottom-6 right-5 z-20 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full shadow-md px-1.5 py-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.4))}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="text-[11px] tabular-nums text-black/50 w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.4))}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Room selector */}
        <div className="absolute bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 z-20 flex gap-2 max-w-[90vw] overflow-x-auto pb-1 no-scrollbar">
          {ROOM_SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSceneId(s.id)}
              className={`flex-shrink-0 w-24 rounded-lg overflow-hidden border-2 transition-all bg-white shadow-sm ${
                s.id === sceneId ? "border-[#2a2a2a]" : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img src={s.image} alt={s.label} className="w-full h-14 object-cover" />
              <span className="block text-[10px] font-medium py-1">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile: open tile panel */}
        <button
          onClick={() => setPanelOpen(true)}
          className="lg:hidden absolute bottom-6 right-5 z-20 bg-[#2a2a2a] text-white text-[12px] tracking-wide uppercase px-5 py-3 rounded-full shadow-lg"
        >
          Choose Tile
        </button>
      </div>

      {/* Tile panel (right on desktop, bottom sheet on mobile) */}
      <div
        className={`bg-white lg:w-[380px] lg:static lg:translate-y-0 lg:shadow-none fixed inset-x-0 bottom-0 z-30 rounded-t-2xl lg:rounded-none shadow-2xl transition-transform duration-300 ${
          panelOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold tracking-tight">Floor Tiles</h2>
          <button
            onClick={() => setPanelOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category filters */}
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveCat(f)}
              className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                activeCat === f
                  ? "bg-[#2a2a2a] text-white"
                  : "bg-black/[0.04] text-black/60 hover:bg-black/[0.08]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tile grid */}
        <div className="px-6 pb-8 overflow-y-auto grid grid-cols-2 gap-4" style={{ maxHeight: "58vh" }}>
          {shown.map((t) => {
            const selected = t.id === tileId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTileId(t.id);
                  setPanelOpen(false);
                }}
                className="text-left group"
              >
                <div
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                    selected ? "border-[#2a2a2a] ring-2 ring-[#2a2a2a]" : "border-black/10 group-hover:border-black/30"
                  }`}
                >
                  <img src={t.texture} alt={t.name} className="w-full h-full object-cover" />
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-[14px] font-medium mt-2">{t.name}</p>
                <p className="text-[12px] text-black/45">{t.sizeLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}`}</style>
    </div>
  );
}
