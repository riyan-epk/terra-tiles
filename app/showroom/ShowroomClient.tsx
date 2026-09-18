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
  const [sceneId, setSceneId] = useState<RoomScene["id"]>("bedroom");
  const [tileId, setTileId] = useState<string>(tiles[0]?.id ?? "");
  const [activeCat, setActiveCat] = useState("All");
  const [panelOpen, setPanelOpen] = useState(false);

  const scene = ROOM_SCENES.find((s) => s.id === sceneId) ?? ROOM_SCENES[0];
  const tile = tiles.find((t) => t.id === tileId) ?? tiles[0];

  const filters = ["All", ...categories];
  const shown =
    activeCat === "All" ? tiles : tiles.filter((t) => t.category === activeCat);

  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setStage({ w: el.clientWidth, h: el.clientHeight }),
    );
    ro.observe(el);
    setStage({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const aspect = scene.width / scene.height;
  const fitW = stage.w && stage.h ? Math.min(stage.w, stage.h * aspect) : 0;

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
    const bx = (fitW * (zoom - 1)) / 2;
    const by = ((fitW / aspect) * (zoom - 1)) / 2;
    setPan({
      x: Math.max(-bx, Math.min(bx, drag.current.px + dx)),
      y: Math.max(-by, Math.min(by, drag.current.py + dy)),
    });
  }
  function onWheel(e: React.WheelEvent) {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - e.deltaY * 0.002));
    setZoom(next);
    if (next <= 1) setPan({ x: 0, y: 0 });
  }

  const iconBtn =
    "w-9 h-9 flex items-center justify-center rounded-full bg-charcoal/70 backdrop-blur border border-cream/10 text-cream/80 hover:text-cream hover:bg-charcoal transition-colors";

  return (
    <div className="h-dvh w-full flex flex-col lg:flex-row bg-charcoal text-cream overflow-hidden">
      {/* Main */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="flex items-center justify-between px-5 h-16 flex-shrink-0 border-b border-cream/5">
          <div className="flex items-center gap-3">
            <a href="/" className={iconBtn} aria-label="Back">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold/70">
                {brandName} Showroom
              </p>
              <h1 className="font-serif text-lg text-cream leading-tight">
                {scene.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPanelOpen(true)}
              className="lg:hidden text-[11px] tracking-[0.12em] uppercase bg-gold text-charcoal px-4 py-2 rounded-full"
            >
              Tiles
            </button>
            <button onClick={reset} className={iconBtn} aria-label="Reset view" title="Reset view">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 9A8 8 0 006 5.3M4 15a8 8 0 0014 3.7" />
              </svg>
            </button>
          </div>
        </header>

        {/* Stage */}
        <div
          ref={stageRef}
          className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden select-none touch-none bg-charcoal-mid"
          style={{ cursor: zoom > 1 ? "grab" : "default" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onWheel={onWheel}
        >
          {fitW > 0 && tile && (
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: drag.current ? "none" : "transform 0.15s ease-out",
                boxShadow: "0 40px 100px -30px rgba(0,0,0,0.6)",
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

          {/* Camera controls — bottom-right of the stage only */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-charcoal/80 backdrop-blur border border-cream/10 rounded-full px-1.5 py-1.5">
            <button
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.4))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream/10 transition-colors"
              aria-label="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M5 12h14" /></svg>
            </button>
            <span className="text-[11px] tabular-nums text-cream/50 w-9 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.4))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream/10 transition-colors"
              aria-label="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
        </div>

        {/* Room selector bar — its own row, never over the floor */}
        <div className="flex-shrink-0 border-t border-cream/10 bg-charcoal-light px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar">
          {ROOM_SCENES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSceneId(s.id)}
              className={`flex-shrink-0 w-28 rounded-lg overflow-hidden border transition-all ${
                s.id === sceneId
                  ? "border-gold ring-1 ring-gold"
                  : "border-cream/10 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={s.image} alt={s.label} className="w-full h-14 object-cover" />
              <span className="block text-[10px] tracking-wide py-1.5 bg-charcoal/40 text-cream/80">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tile panel */}
      <aside
        className={`bg-charcoal-light lg:w-[380px] lg:static lg:translate-y-0 lg:border-l lg:border-cream/10 fixed inset-x-0 bottom-0 z-30 rounded-t-2xl lg:rounded-none shadow-2xl transition-transform duration-300 ${
          panelOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        }`}
        style={{ maxHeight: "82vh" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-1">Materials</p>
            <h2 className="font-serif text-xl text-cream">Floor Tiles</h2>
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream/10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveCat(f)}
              className={`text-[12px] tracking-wide px-4 py-1.5 rounded-full transition-colors ${
                activeCat === f ? "bg-gold text-charcoal" : "bg-cream/[0.06] text-cream/60 hover:text-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="px-6 pb-8 overflow-y-auto grid grid-cols-2 gap-4" style={{ maxHeight: "60vh" }}>
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
                    selected ? "border-gold ring-2 ring-gold" : "border-cream/10 group-hover:border-cream/30"
                  }`}
                >
                  <img src={t.texture} alt={t.name} className="w-full h-full object-cover" />
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
                <p className="text-[14px] font-medium mt-2 text-cream">{t.name}</p>
                <p className="text-[12px] text-cream/40">{t.sizeLabel}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}`}</style>
    </div>
  );
}
