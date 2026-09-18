"use client";

import { motion } from "framer-motion";
import { textures } from "./placeholders";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden grain-overlay">
      <div className="absolute inset-0">
        <img
          src={textures.heroMarble}
          alt=""
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center md:justify-end pb-48 md:pb-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <p className="text-stone-light/60 text-[13px] tracking-[0.3em] uppercase mb-6">
            Premium Architectural Tiles
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-cream max-w-4xl">
            Surfaces That
            <br />
            <span className="text-stone-light">Define Spaces</span>
          </h1>
          <p className="mt-8 text-stone-light/60 text-lg max-w-xl leading-relaxed">
            Curated collections of porcelain, marble, and natural stone — each
            piece selected for texture, tone, and timeless character.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 flex items-center gap-6"
        >
          <a
            href="#collections"
            className="group inline-flex items-center gap-3 text-[13px] tracking-[0.15em] uppercase text-cream border border-cream/20 px-8 py-4 hover:bg-cream hover:text-charcoal transition-all duration-500"
          >
            Explore Collections
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="text-[13px] tracking-[0.15em] uppercase text-stone-light/50 hover:text-cream transition-colors duration-300"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-cue"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-stone-light/40">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-stone-light/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
