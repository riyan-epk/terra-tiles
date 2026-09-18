"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTenant } from "../../lib/tenant/TenantProvider";

export default function Categories() {
  const { products, categories } = useTenant();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Build category cards from the tenant's own catalogue.
  const cards = categories
    .map((cat) => {
      const items = products.filter((p) => p.categoryId === cat.id);
      return {
        name: cat.name,
        subtitle: items.map((p) => p.name).slice(0, 3).join(", "),
        image: items[0]?.texture,
        sizes: Array.from(new Set(items.map((p) => p.size))),
        count: items.length,
      };
    })
    .filter((c) => c.count > 0);

  return (
    <section
      id="collections"
      className="relative py-32 md:py-40 bg-charcoal-light grain-overlay"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-4">
              Collections
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream">
              Explore by Category
            </h2>
          </div>
          <p className="text-stone-light/50 text-[13px] tracking-[0.1em] uppercase">
            Drag to explore &rarr;
          </p>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="gallery-scroll flex gap-6 overflow-x-auto px-6 md:px-16 pb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          const startX = e.pageX - el.offsetLeft;
          const scrollLeft = el.scrollLeft;
          const onMove = (ev: MouseEvent) => {
            const x = ev.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX);
          };
          const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
      >
        {cards.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="flex-shrink-0 w-[320px] md:w-[380px] group"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-mid">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                style={{
                  filter:
                    hoveredIdx !== null && hoveredIdx !== i
                      ? "brightness(0.5) saturate(0.3)"
                      : "brightness(0.75)",
                }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-80" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-stone-light/50 text-[11px] tracking-[0.2em] uppercase">
                  {cat.count} Series
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-cream mt-2">
                  {cat.name}
                </h3>
                <p className="text-stone-light/60 text-sm mt-1">
                  {cat.subtitle}
                </p>

                <div className="flex gap-2 mt-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {cat.sizes.map((size) => (
                    <span
                      key={size}
                      className="text-[10px] tracking-wider uppercase px-3 py-1.5 border border-cream/20 text-cream/70"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
