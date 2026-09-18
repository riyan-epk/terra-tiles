"use client";

import { motion } from "framer-motion";
import { useTenant } from "../../lib/tenant/TenantProvider";

export default function Testimonials() {
  const { tenant } = useTenant();
  const testimonials = tenant.content.testimonials;
  return (
    <section className="relative py-32 md:py-40 bg-charcoal-light grain-overlay overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-4">
            {tenant.content.testimonialsEyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream">
            What They Say
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal-light to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal-light to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex gap-8 w-max">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-[500px] flex-shrink-0 border border-white/5 bg-charcoal/50 p-10 group hover:border-gold/20 transition-colors duration-500"
            >
              {/* Quote mark */}
              <svg
                className="w-8 h-8 text-gold/30 mb-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>

              <p className="text-cream/80 text-[15px] leading-relaxed mb-8 italic">
                {t.quote}
              </p>

              <div>
                <p className="text-cream text-sm font-medium">{t.author}</p>
                <p className="text-stone-light/40 text-[12px] mt-1">
                  {t.role}
                </p>
                <p className="text-gold/50 text-[11px] tracking-[0.1em] uppercase mt-2">
                  {t.project}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
