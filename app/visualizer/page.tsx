"use client";

import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import TileSelector from "./TileSelector";
import { tiles } from "./tile-data";
import type { TileProduct, SurfaceTarget } from "./tile-data";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function VisualizerPage() {
  const [selectedTile, setSelectedTile] = useState<TileProduct | null>(
    tiles[0]
  );
  const [surfaceTarget, setSurfaceTarget] = useState<SurfaceTarget>("all");
  const [resetCamera, setResetCamera] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(false);
  const textureCache = useMemo(() => new Map<string, THREE.Texture>(), []);

  return (
    <div className="min-h-screen bg-charcoal flex flex-col">
      {/* Nav bar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
        <a href="/" className="font-serif text-xl tracking-[0.2em] text-cream">
          TERRA
        </a>
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-[12px] tracking-[0.12em] uppercase text-stone-light/50 hover:text-cream transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <Scene
            selectedTile={selectedTile}
            surfaceTarget={surfaceTarget}
            textureCache={textureCache}
            onResetCamera={resetCamera}
            onResetDone={() => setResetCamera(false)}
          />

          {/* Viewport overlay controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="pointer-events-auto flex gap-2">
              <button
                onClick={() => setResetCamera(true)}
                className="bg-charcoal/80 backdrop-blur-sm border border-white/10 text-cream/70 hover:text-cream px-3 py-2 text-[10px] tracking-wider uppercase transition-colors"
                title="Reset camera"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                  />
                </svg>
              </button>
            </div>

            {/* Current tile indicator */}
            {selectedTile && (
              <div className="pointer-events-auto bg-charcoal/80 backdrop-blur-sm border border-white/10 px-4 py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 overflow-hidden border border-gold/30">
                  <img
                    src={selectedTile.texture}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-cream text-[11px] font-medium">
                    {selectedTile.name}
                  </p>
                  <p className="text-stone-light/40 text-[9px] uppercase tracking-wider">
                    {selectedTile.category} · {selectedTile.size}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interaction hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-stone-light/30 text-[10px] tracking-wider uppercase pointer-events-none">
            Drag to rotate · Scroll to zoom
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobilePanel(!mobilePanel)}
            className="lg:hidden absolute top-4 right-4 bg-charcoal/80 backdrop-blur-sm border border-white/10 text-cream px-4 py-2 text-[11px] tracking-wider uppercase"
          >
            {mobilePanel ? "Close" : "Select Tile"}
          </button>
        </div>

        {/* Tile selector panel — desktop */}
        <div className="hidden lg:block w-[340px] border-l border-white/5 bg-charcoal overflow-hidden">
          <TileSelector
            selectedTile={selectedTile}
            onSelectTile={setSelectedTile}
            surfaceTarget={surfaceTarget}
            onSurfaceChange={setSurfaceTarget}
            onResetCamera={() => setResetCamera(true)}
          />
        </div>

        {/* Tile selector panel — mobile */}
        {mobilePanel && (
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-[60vh] bg-charcoal border-t border-white/5 z-30 overflow-hidden">
            <TileSelector
              selectedTile={selectedTile}
              onSelectTile={(tile) => {
                setSelectedTile(tile);
                setMobilePanel(false);
              }}
              surfaceTarget={surfaceTarget}
              onSurfaceChange={setSurfaceTarget}
              onResetCamera={() => setResetCamera(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
