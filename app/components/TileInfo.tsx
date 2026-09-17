"use client";

import { motion } from "framer-motion";

const specs = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.5" />
        <text x="13" y="18" fill="currentColor" fontSize="6" fontFamily="sans-serif">60</text>
        <text x="28" y="18" fill="currentColor" fontSize="6" fontFamily="sans-serif">120</text>
      </svg>
    ),
    title: "Size Range",
    desc: "From 10×10 mosaics to 120×260 grand-format slabs. Full range of modular sizes for any installation.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 6C24 6 30 16 30 24C30 32 24 42 24 42" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 6C24 6 18 16 18 24C18 32 24 42 24 42" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1" />
        <line x1="8" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    title: "Finishes",
    desc: "Polished, honed, satin, textured, bush-hammered, and lappato. Each finish engineered for specific applications.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 38L24 10L40 38H8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="30" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Technical Specs",
    desc: "Water absorption < 0.5%. Frost-proof. Slip resistance R9–R12. Suitable for high-traffic commercial and residential use.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="14" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 22H42" stroke="currentColor" strokeWidth="1" />
        <path d="M6 30H42" stroke="currentColor" strokeWidth="1" />
        <path d="M18 14V38" stroke="currentColor" strokeWidth="1" />
        <path d="M30 14V38" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    title: "Applications",
    desc: "Floors, walls, facades, countertops, wet areas, pools, outdoor terraces. Rated for internal and external use.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Certifications",
    desc: "ISO 13006, CE marked, LEED contributing. Green-certified production with minimal environmental impact.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="8" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="26" y="8" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="26" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="26" y="26" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Pattern Matching",
    desc: "Digital vein-matching technology ensures seamless visual continuity across large-format installations.",
  },
];

export default function TileInfo() {
  return (
    <section id="specs" className="relative py-32 md:py-40 bg-charcoal-light grain-overlay">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-4">
            Specifications
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream">
            About the Tiles
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-dark/10">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-charcoal-light p-10 group hover:bg-charcoal-mid/50 transition-colors duration-500"
            >
              <div className="text-stone group-hover:text-gold transition-colors duration-500 mb-6">
                {spec.icon}
              </div>
              <h3 className="font-serif text-xl text-cream mb-3">
                {spec.title}
              </h3>
              <p className="text-stone-light/50 text-sm leading-relaxed">
                {spec.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
