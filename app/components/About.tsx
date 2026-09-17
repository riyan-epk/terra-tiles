"use client";

import { motion } from "framer-motion";
import { textures } from "./placeholders";

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <section id="about" className="relative py-32 md:py-40 grain-overlay bg-charcoal">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 lg:col-start-1"
          >
            <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-6">
              Est. 1987
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-[1.15] mb-8">
              Crafted for
              <br />
              Architecture
            </h2>
            <div className="space-y-5 text-stone-light/60 leading-relaxed text-[15px]">
              <p>
                For over three decades, Terra has sourced and curated the
                world's finest architectural surfaces. From quarries in Carrara
                to kilns in Sassuolo, every tile in our collection has been
                selected for its material integrity and visual depth.
              </p>
              <p>
                We work with architects, interior designers, and discerning
                homeowners who understand that surfaces aren't just finishes —
                they're the foundation of spatial character.
              </p>
            </div>

            <div className="mt-12 flex gap-16">
              <div>
                <span className="font-serif text-3xl text-cream">200+</span>
                <p className="text-stone-light/40 text-[12px] tracking-[0.15em] uppercase mt-2">
                  Curated Series
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl text-cream">35</span>
                <p className="text-stone-light/40 text-[12px] tracking-[0.15em] uppercase mt-2">
                  Years of Craft
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl text-cream">12</span>
                <p className="text-stone-light/40 text-[12px] tracking-[0.15em] uppercase mt-2">
                  Countries
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-6 lg:col-start-7 relative"
          >
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={textures.marbleWhite}
                  alt="Marble tile texture detail"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
              </div>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="absolute -bottom-12 -left-12 w-48 md:w-64 aspect-square overflow-hidden border-4 border-charcoal hidden lg:block"
              >
                <img
                  src={textures.interiorAccent}
                  alt="Interior with premium tiles"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
