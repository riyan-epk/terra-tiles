"use client";

import { motion } from "framer-motion";
import { textures } from "./placeholders";

export default function RoomPreview() {
  return (
    <section
      id="preview"
      className="relative py-32 md:py-40 bg-charcoal grain-overlay overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-6">
              Coming Soon
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-[1.15] mb-6">
              See Your Space
              <br />
              <span className="text-stone-light">Before You Build</span>
            </h2>
            <p className="text-stone-light/60 text-[15px] leading-relaxed mb-8 max-w-lg">
              Our 3D room visualizer lets you preview any tile from our
              collection in realistic room settings. Choose your space, select
              your surface, and see how light, texture, and pattern transform a
              room — all before placing an order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/visualizer"
                className="group inline-flex items-center justify-center gap-3 text-[13px] tracking-[0.15em] uppercase bg-gold text-charcoal px-8 py-4 hover:bg-gold-light transition-colors duration-300"
              >
                Try it in 3D
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </a>
              <span className="text-stone-light/40 text-[12px] tracking-wider uppercase self-center">
                No download required
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer">
              <img
                src={textures.roomInterior}
                alt="Modern room interior with premium tile flooring"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors duration-500" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-cream/40 flex items-center justify-center backdrop-blur-sm bg-charcoal/20 group-hover:scale-110 group-hover:border-cream/60 transition-all duration-500">
                  <svg
                    className="w-8 h-8 text-cream"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313M3 16.5v-2.25m0 0l2.25 1.313M3 14.25l2.25-1.313m0 0L12 9.75m6.75 3.188L21 14.25m0 0l-2.25 1.313m2.25-1.313v2.25M12 9.75l6.75 3.188M12 9.75L5.25 12.938"
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute top-5 left-5 bg-gold/90 text-charcoal px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold">
                Interactive 3D
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -right-4 md:right-8 flex gap-2 bg-charcoal-light/95 backdrop-blur-md p-3 border border-white/5"
            >
              {[textures.marbleWhite, textures.woodGrain, textures.stoneGrey].map(
                (src, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 overflow-hidden border-2 transition-all cursor-pointer hover:scale-110 ${
                      i === 0
                        ? "border-gold"
                        : "border-transparent hover:border-cream/30"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
              <div className="w-12 h-12 border-2 border-dashed border-stone-dark/30 flex items-center justify-center text-stone-dark text-lg">
                +
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
