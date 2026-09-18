"use client";

import { useState } from "react";
import Link from "next/link";
import { saveProduct } from "../actions";
import type { Product, Category } from "../../../lib/tenant/types";

const FINISHES = [
  "Polished",
  "Honed",
  "Matte",
  "Satin",
  "Gloss",
  "Textured",
  "Natural",
];

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [texture, setTexture] = useState(product?.texture ?? "");
  const [color, setColor] = useState(product?.color ?? "#cccccc");
  const [repeatX, setRepeatX] = useState(product?.repeatX ?? 3);
  const [repeatY, setRepeatY] = useState(product?.repeatY ?? 3);
  const [roughness, setRoughness] = useState(product?.roughness ?? 0.5);
  const [metalness, setMetalness] = useState(product?.metalness ?? 0);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTexture(reader.result as string);
    reader.readAsDataURL(file);
  }

  const label =
    "text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2";
  const input =
    "w-full bg-transparent border-b border-stone-dark/40 text-cream py-2.5 text-sm focus:border-gold outline-none transition-colors placeholder:text-stone-dark/50";

  return (
    <form action={saveProduct} className="grid lg:grid-cols-[1fr_320px] gap-10">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="texture" value={texture} />

      {/* Fields */}
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={label}>Product name</label>
            <input
              name="name"
              defaultValue={product?.name}
              required
              className={input}
              placeholder="Calacatta Oro"
            />
          </div>
          <div>
            <label className={label}>Category</label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId ?? categories[0]?.id}
              className={`${input} appearance-none cursor-pointer`}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-charcoal">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={2}
            className={`${input} resize-none`}
            placeholder="Short description shown in the showroom"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className={label}>Size</label>
            <input
              name="size"
              defaultValue={product?.size}
              className={input}
              placeholder="60×120 cm"
            />
          </div>
          <div>
            <label className={label}>Finish</label>
            <select
              name="finish"
              defaultValue={product?.finish ?? "Matte"}
              className={`${input} appearance-none cursor-pointer`}
            >
              {FINISHES.map((f) => (
                <option key={f} value={f} className="bg-charcoal">
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Price</label>
            <input
              name="price"
              defaultValue={product?.price ?? "POA"}
              className={input}
              placeholder="POA"
            />
          </div>
        </div>

        {/* Material tuning */}
        <div className="border-t border-cream/10 pt-6 space-y-5">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold/70">
            3D material
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={label}>
                Tile repeat X — {repeatX}
              </label>
              <input
                type="range"
                name="repeatX"
                min={1}
                max={10}
                step={1}
                value={repeatX}
                onChange={(e) => setRepeatX(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
            </div>
            <div>
              <label className={label}>
                Tile repeat Y — {repeatY}
              </label>
              <input
                type="range"
                name="repeatY"
                min={1}
                max={10}
                step={1}
                value={repeatY}
                onChange={(e) => setRepeatY(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
            </div>
            <div>
              <label className={label}>
                Roughness — {roughness.toFixed(2)}
              </label>
              <input
                type="range"
                name="roughness"
                min={0}
                max={1}
                step={0.05}
                value={roughness}
                onChange={(e) => setRoughness(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
            </div>
            <div>
              <label className={label}>
                Metalness — {metalness.toFixed(2)}
              </label>
              <input
                type="range"
                name="metalness"
                min={0}
                max={1}
                step={0.05}
                value={metalness}
                onChange={(e) => setMetalness(Number(e.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className={label + " mb-0"}>Swatch colour</label>
            <input
              type="color"
              name="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 bg-transparent border border-cream/10 cursor-pointer"
            />
            <span className="text-stone-light/50 text-sm">{color}</span>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? true}
            className="w-4 h-4 accent-[var(--color-gold)]"
          />
          <span className="text-sm text-cream">
            Published (visible in the public showroom &amp; visualizer)
          </span>
        </label>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="text-[13px] tracking-[0.15em] uppercase bg-cream text-charcoal px-8 py-3.5 hover:bg-gold transition-colors"
          >
            {product ? "Save changes" : "Create product"}
          </button>
          <Link
            href="/admin/products"
            className="text-[12px] tracking-[0.1em] uppercase text-stone-light/50 hover:text-cream transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Texture / preview */}
      <div>
        <label className={label}>Texture</label>
        <div className="aspect-square border border-cream/10 overflow-hidden bg-charcoal-mid mb-3">
          {texture ? (
            <img
              src={texture}
              alt="Texture preview"
              className="w-full h-full object-cover"
              style={{
                imageRendering: "auto",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-light/30 text-sm">
              No texture
            </div>
          )}
        </div>
        <label className="block text-[12px] tracking-[0.1em] uppercase text-gold hover:text-gold-light cursor-pointer transition-colors">
          Upload image
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
        </label>
        <p className="text-stone-light/30 text-[11px] mt-3 leading-relaxed">
          Upload a seamless/tileable photo of the surface (JPG or PNG). It is
          stored with the product and used as the 3D material.
        </p>
      </div>
    </form>
  );
}
