"use client";

import { motion } from "framer-motion";
import { useTenant } from "../../lib/tenant/TenantProvider";

export default function Hero() {
  const { tenant } = useTenant();
  const [headlineTop, headlineBottom] = tenant.content.heroHeadline.split("\n");

  return (
    <section className="relative h-screen w-full overflow-hidden grain-overlay">
      {/* Palette-driven background — re-skins per tenant (dark or light) with no image. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-charcoal-light), var(--color-charcoal) 55%, var(--color-charcoal-mid))",
          }}
        />
        {/* Signature accent glow. */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-[20%] -right-[15%] w-[70vw] h-[70vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 38%, transparent), transparent 68%)",
          }}
        />
        {/* Cool counter-glow for depth. */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, delay: 0.3 }}
          className="absolute -bottom-[25%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-stone) 30%, transparent), transparent 70%)",
          }}
        />
        {/* Fine vein lines echoing marble/craft, tinted by the accent. */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-[0.12]"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
          style={{ color: "var(--color-accent)" }}
        >
          <line x1="180" y1="0" x2="520" y2="1000" stroke="currentColor" strokeWidth="1" />
          <line x1="760" y1="0" x2="1000" y2="1000" stroke="currentColor" strokeWidth="0.75" />
          <line x1="1200" y1="0" x2="880" y2="1000" stroke="currentColor" strokeWidth="1.25" />
          <line x1="420" y1="180" x2="1380" y2="360" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        {/* Bottom settle for text legibility on any palette. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, color-mix(in srgb, var(--color-charcoal) 92%, transparent))",
          }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center md:justify-end pb-48 md:pb-32 px-6 md:px-16 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <p className="text-stone-light/60 text-[13px] tracking-[0.3em] uppercase mb-6">
            {tenant.content.eyebrow}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-cream max-w-4xl">
            {headlineTop}
            {headlineBottom && (
              <>
                <br />
                <span className="text-stone-light">{headlineBottom}</span>
              </>
            )}
          </h1>
          <p className="mt-8 text-stone-light/70 text-lg max-w-xl leading-relaxed">
            {tenant.content.heroSubline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 flex items-center gap-6"
        >
          <a
            href="/visualizer"
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
