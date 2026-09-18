"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "../../lib/tenant/TenantProvider";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Collections", href: "#collections" },
  { label: "Gallery", href: "#gallery" },
  { label: "Specifications", href: "#specs" },
  { label: "3D Visualizer", href: "/visualizer" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const { tenant } = useTenant();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--color-charcoal) 92%, transparent)"
            : "color-mix(in srgb, var(--color-charcoal) 0%, transparent)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          borderBottom: scrolled
            ? "1px solid color-mix(in srgb, var(--color-cream) 8%, transparent)"
            : "1px solid transparent",
          transition: "background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-bottom 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <a href="#" className="relative z-50">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-2xl tracking-[0.2em] text-cream block"
            >
              {tenant.name}
            </motion.span>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] tracking-[0.15em] uppercase text-stone-light/70 hover:text-cream transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-cream origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[1.5px] bg-cream"
            />
            <motion.span
              animate={
                menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
              }
              className="block w-6 h-[1.5px] bg-cream origin-center"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-charcoal/98 flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                  className="font-serif text-3xl text-cream hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
