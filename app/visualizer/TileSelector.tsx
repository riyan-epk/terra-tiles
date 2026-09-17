"use client";

import { useState } from "react";
import { tiles, tileCategories, surfaceOptions } from "./tile-data";
import type { TileProduct, SurfaceTarget } from "./tile-data";

interface TileSelectorProps {
  selectedTile: TileProduct | null;
  onSelectTile: (tile: TileProduct) => void;
  surfaceTarget: SurfaceTarget;
  onSurfaceChange: (target: SurfaceTarget) => void;
  onResetCamera: () => void;
}

export default function TileSelector({
  selectedTile,
  onSelectTile,
  surfaceTarget,
  onSurfaceChange,
  onResetCamera,
}: TileSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? tiles
      : tiles.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <p className="text-gold text-[11px] tracking-[0.25em] uppercase mb-1">
          Tile Visualizer
        </p>
        <h2 className="font-serif text-xl text-cream">Select a Tile</h2>
      </div>

      {/* Category filters */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5 border-b border-white/5">
        {tileCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-cream text-charcoal border-cream"
                : "border-stone-dark/30 text-stone-light/60 hover:border-cream/40 hover:text-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tile grid */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((tile) => (
            <button
              key={tile.id}
              onClick={() => onSelectTile(tile)}
              className={`group text-left transition-all duration-200 ${
                selectedTile?.id === tile.id
                  ? "ring-2 ring-gold"
                  : "ring-1 ring-white/5 hover:ring-white/20"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-charcoal-mid">
                <img
                  src={tile.texture}
                  alt={tile.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {selectedTile?.id === tile.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-charcoal"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-2.5 bg-charcoal-light">
                <p className="text-cream text-[12px] font-medium truncate">
                  {tile.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-stone-light/40 text-[10px] uppercase tracking-wider">
                    {tile.category}
                  </span>
                  <span className="text-stone-light/40 text-[10px]">
                    {tile.size}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Surface target + controls */}
      <div className="px-5 py-4 border-t border-white/5 space-y-3">
        <div>
          <label className="text-[10px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
            Apply To
          </label>
          <select
            value={surfaceTarget}
            onChange={(e) => onSurfaceChange(e.target.value as SurfaceTarget)}
            className="w-full bg-charcoal border border-stone-dark/20 text-cream px-3 py-2 text-[12px] focus:border-gold transition-colors appearance-none cursor-pointer"
          >
            {surfaceOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-charcoal">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onResetCamera}
          className="w-full text-[11px] tracking-[0.12em] uppercase border border-stone-dark/30 text-stone-light/60 py-2.5 hover:border-cream/40 hover:text-cream transition-all duration-200"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
