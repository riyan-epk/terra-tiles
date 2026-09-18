"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import TileSelector from "./TileSelector";
import QuoteDialog from "../components/QuoteDialog";
import type { TileProduct, SurfaceTarget } from "./tile-data";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

interface VisualizerClientProps {
  tiles: TileProduct[];
  categories: string[];
  brandName: string;
}

export default function VisualizerClient({
  tiles,
  categories,
  brandName,
}: VisualizerClientProps) {
  const [selectedTile, setSelectedTile] = useState<TileProduct | null>(
    tiles[0] ?? null,
  );
  const [surfaceTarget, setSurfaceTarget] = useState<SurfaceTarget>("all");
  const [resetCamera, setResetCamera] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [selections, setSelections] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [quoteOpen, setQuoteOpen] = useState(false);
  const textureCache = useMemo(() => new Map<string, THREE.Texture>(), []);

  const inSelection = (id: string) => selections.some((s) => s.id === id);

  function toggleSelection(tile: TileProduct | null) {
    if (!tile) return;
    setSelections((prev) =>
      prev.some((s) => s.id === tile.id)
        ? prev.filter((s) => s.id !== tile.id)
        : [...prev, { id: tile.id, name: tile.name }],
    );
  }

  return (
    <div className="h-dvh bg-charcoal flex flex-col overflow-hidden">
      <header className="h-14 lg:h-16 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
        <a href="/" className="font-serif text-xl tracking-[0.2em] text-cream">
          {brandName}
        </a>
        <div className="flex items-center gap-5">
          <button
            onClick={() => setQuoteOpen(true)}
            disabled={selections.length === 0}
            className="text-[11px] tracking-[0.12em] uppercase bg-gold text-charcoal px-4 py-2 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Request Quote
            {selections.length > 0 ? ` (${selections.length})` : ""}
          </button>
          <a
            href="/"
            className="hidden sm:inline text-[12px] tracking-[0.12em] uppercase text-stone-light/50 hover:text-cream transition-colors"
          >
            Back to Home
          </a>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0">
            <Scene
              selectedTile={selectedTile}
              surfaceTarget={surfaceTarget}
              textureCache={textureCache}
              onResetCamera={resetCamera}
              onResetDone={() => setResetCamera(false)}
            />
          </div>

          <div className="absolute bottom-20 lg:bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-10">
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
                    {selectedTile.category} &middot; {selectedTile.size}
                  </p>
                </div>
                <button
                  onClick={() => toggleSelection(selectedTile)}
                  className={`ml-1 text-[10px] tracking-[0.12em] uppercase px-2.5 py-1.5 border transition-colors ${
                    inSelection(selectedTile.id)
                      ? "border-gold bg-gold text-charcoal"
                      : "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
                  }`}
                  title="Add this material to your quote"
                >
                  {inSelection(selectedTile.id) ? "✓ Added" : "+ Add"}
                </button>
              </div>
            )}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-stone-light/30 text-[10px] tracking-wider uppercase pointer-events-none z-10">
            Drag to rotate &middot; Scroll to zoom
          </div>

          <button
            onClick={() => setMobilePanel(!mobilePanel)}
            className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-gold text-charcoal font-medium px-6 py-3 text-[12px] tracking-[0.15em] uppercase z-20"
          >
            {mobilePanel ? "Close Panel" : "Select Tile"}
          </button>
        </div>

        <div className="hidden lg:block w-[340px] border-l border-white/5 bg-charcoal overflow-hidden">
          <TileSelector
            tiles={tiles}
            categories={categories}
            selectedTile={selectedTile}
            onSelectTile={setSelectedTile}
            surfaceTarget={surfaceTarget}
            onSurfaceChange={setSurfaceTarget}
            onResetCamera={() => setResetCamera(true)}
          />
        </div>

        {mobilePanel && (
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-[65vh] bg-charcoal border-t border-white/5 z-30 overflow-hidden rounded-t-2xl">
            <div className="w-10 h-1 bg-stone-dark/40 rounded-full mx-auto mt-3 mb-1" />
            <TileSelector
              tiles={tiles}
              categories={categories}
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

      <QuoteDialog
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        selected={selections}
        brandName={brandName}
      />
    </div>
  );
}
