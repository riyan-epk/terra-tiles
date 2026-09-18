"use client";

import { motion } from "framer-motion";
import { textures } from "./placeholders";
import { useTenant } from "../../lib/tenant/TenantProvider";

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
  const { tenant, products } = useTenant();
  const { content } = tenant;
  const titleLines = content.aboutTitle.split("\n");
  // Showcase the tenant's own materials rather than a generic image.
  const featureImage = products[0]?.texture ?? textures.marbleWhite;
  const accentImage = products[1]?.texture ?? textures.interiorAccent;
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
              {content.aboutEyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream leading-[1.15] mb-8">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <div className="space-y-5 text-stone-light/60 leading-relaxed text-[15px]">
              <p>{content.aboutBody}</p>
            </div>

            <div className="mt-12 flex gap-16">
              {content.stats.map((stat) => (
                <div key={stat.label}>
                  <span className="font-serif text-3xl text-cream">
                    {stat.value}
                  </span>
                  <p className="text-stone-light/40 text-[12px] tracking-[0.15em] uppercase mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
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
                  src={featureImage}
                  alt={`${tenant.name} surface detail`}
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
                  src={accentImage}
                  alt={`${tenant.name} material detail`}
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
