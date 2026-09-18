"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "../../lib/tenant/TenantProvider";

export default function ProductShowcase() {
  const { products: tenantProducts, categories } = useTenant();
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const products = tenantProducts.map((p) => ({
    name: p.name,
    category: nameById.get(p.categoryId) ?? "Other",
    size: p.size,
    finish: p.finish ?? "—",
    image: p.texture,
  }));
  const filters = [
    "All",
    ...categories
      .filter((c) => tenantProducts.some((p) => p.categoryId === c.id))
      .map((c) => c.name),
  ];

  const filtered =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <section
      id="gallery"
      className="relative py-32 md:py-40 bg-charcoal grain-overlay"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-4">
            Gallery
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-10">
            Product Showcase
          </h2>

          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[12px] tracking-[0.15em] uppercase px-5 py-2.5 border transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-cream text-charcoal border-cream"
                    : "border-stone-dark/30 text-stone-light/60 hover:border-cream/40 hover:text-cream"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                <div className="relative aspect-square overflow-hidden bg-charcoal-mid">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-500" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-gold text-[10px] tracking-[0.2em] uppercase">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-xl text-cream mt-1">
                      {product.name}
                    </h4>
                    <div className="flex gap-4 mt-2 text-[11px] text-stone-light/60">
                      <span>{product.size}</span>
                      <span>{product.finish}</span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <svg
                      className="w-5 h-5 text-cream/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center lightbox-backdrop bg-charcoal/80"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={filtered[lightbox]?.image}
                  alt={filtered[lightbox]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-charcoal-light p-6 flex items-center justify-between">
                <div>
                  <span className="text-gold text-[10px] tracking-[0.2em] uppercase">
                    {filtered[lightbox]?.category}
                  </span>
                  <h4 className="font-serif text-2xl text-cream mt-1">
                    {filtered[lightbox]?.name}
                  </h4>
                </div>
                <div className="text-right text-[12px] text-stone-light/60 space-y-1">
                  <p>Size: {filtered[lightbox]?.size}</p>
                  <p>Finish: {filtered[lightbox]?.finish}</p>
                </div>
              </div>

              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 text-cream/60 hover:text-cream transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
