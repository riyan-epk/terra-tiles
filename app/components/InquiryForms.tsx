"use client";

import { motion } from "framer-motion";
import { textures } from "./placeholders";
import { useTenant } from "../../lib/tenant/TenantProvider";

export default function InquiryForms() {
  const { products } = useTenant();
  const backdrop = products[0]?.texture ?? textures.heroMarble;
  return (
    <section id="contact" className="relative bg-charcoal grain-overlay">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Customer Inquiry */}
          <div className="relative">
            <div className="absolute inset-0 hidden lg:block">
              <img
                src={backdrop}
                alt=""
                className="w-full h-full object-cover opacity-20"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative z-10 px-6 md:px-16 py-24 lg:py-32"
            >
              <p className="text-gold text-[12px] tracking-[0.3em] uppercase mb-4">
                For Homeowners &amp; Designers
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
                Customer Inquiry
              </h2>
              <p className="text-stone-light/50 text-sm mb-12 max-w-md">
                Tell us about your project and we'll connect you with the right
                specialist from our team.
              </p>

              <form
                className="space-y-6 max-w-md"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-stone-dark/30 text-cream py-3 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-stone-dark/30 text-cream py-3 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-transparent border-b border-stone-dark/30 text-cream py-3 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Project Type
                  </label>
                  <select className="w-full bg-transparent border-b border-stone-dark/30 text-cream py-3 text-sm focus:border-gold transition-colors duration-300 appearance-none cursor-pointer">
                    <option value="" className="bg-charcoal">
                      Select a project type
                    </option>
                    <option value="residential" className="bg-charcoal">
                      Residential — New Build
                    </option>
                    <option value="renovation" className="bg-charcoal">
                      Residential — Renovation
                    </option>
                    <option value="commercial" className="bg-charcoal">
                      Commercial Interior
                    </option>
                    <option value="landscape" className="bg-charcoal">
                      Landscape / Outdoor
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Tell Us About Your Project
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-transparent border-b border-stone-dark/30 text-cream py-3 text-sm focus:border-gold transition-colors duration-300 resize-none placeholder:text-stone-dark/50"
                    placeholder="Brief description of your space, style preferences, and timeline..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-[13px] tracking-[0.15em] uppercase bg-cream text-charcoal py-4 hover:bg-gold transition-colors duration-300 mt-4"
                >
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </div>

          {/* Dealer Inquiry */}
          <div className="relative bg-charcoal-light/50 border-l border-white/5">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="px-6 md:px-16 py-24 lg:py-32"
            >
              <p className="text-stone text-[12px] tracking-[0.3em] uppercase mb-4">
                For Dealers &amp; Distributors
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
                Become a Partner
              </h2>
              <p className="text-stone-light/50 text-sm mb-12 max-w-md">
                Join our network of authorized dealers. Access exclusive
                collections, trade pricing, and dedicated support.
              </p>

              <form
                className="space-y-6 max-w-md"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-charcoal/50 border border-stone-dark/20 text-cream px-4 py-3.5 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                    placeholder="Your Company"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      className="w-full bg-charcoal/50 border border-stone-dark/20 text-cream px-4 py-3.5 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-charcoal/50 border border-stone-dark/20 text-cream px-4 py-3.5 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-charcoal/50 border border-stone-dark/20 text-cream px-4 py-3.5 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                    placeholder="dealer@company.com"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Business Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Tile Showroom",
                      "General Contractor",
                      "Architecture Firm",
                      "Interior Design Studio",
                    ].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 text-sm text-stone-light/60 cursor-pointer group"
                      >
                        <div className="w-4 h-4 border border-stone-dark/30 group-hover:border-gold/50 transition-colors flex-shrink-0" />
                        <span className="group-hover:text-cream transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Region / Territory
                  </label>
                  <input
                    type="text"
                    className="w-full bg-charcoal/50 border border-stone-dark/20 text-cream px-4 py-3.5 text-sm focus:border-gold transition-colors duration-300 placeholder:text-stone-dark/50"
                    placeholder="City, State, or Region"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-charcoal/50 border border-stone-dark/20 text-cream px-4 py-3.5 text-sm focus:border-gold transition-colors duration-300 resize-none placeholder:text-stone-dark/50"
                    placeholder="Current product lines, annual volume, or specific interests..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-[13px] tracking-[0.15em] uppercase border-2 border-gold text-gold py-4 hover:bg-gold hover:text-charcoal transition-all duration-300 mt-4"
                >
                  Apply for Partnership
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
