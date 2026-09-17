"use client";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <span className="font-serif text-4xl tracking-[0.15em] text-cream">
              TERRA
            </span>
            <p className="text-stone-light/40 text-sm mt-4 leading-relaxed max-w-xs">
              Premium architectural surfaces for exceptional spaces.
              Curated since 1987.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-light/30 mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              {["Marble Look", "Wood Look", "Natural Stone", "Concrete", "Mosaic", "Terracotta"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-stone-light/50 text-sm hover:text-cream transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-light/30 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {["About", "Showrooms", "Careers", "Press", "Sustainability"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-stone-light/50 text-sm hover:text-cream transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-light/30 mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {["Contact", "Trade Program", "Find a Dealer", "Downloads", "FAQ"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-stone-light/50 text-sm hover:text-cream transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-light/30 mb-5">
              Showroom
            </h4>
            <div className="text-stone-light/50 text-sm space-y-2">
              <p>42 Via della Ceramica</p>
              <p>Milan, Italy 20121</p>
              <p className="pt-2">
                <a href="mailto:info@terra-tiles.com" className="hover:text-cream transition-colors duration-300">
                  info@terra-tiles.com
                </a>
              </p>
              <p>
                <a href="tel:+390212345678" className="hover:text-cream transition-colors duration-300">
                  +39 02 1234 5678
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <p className="text-stone-dark text-[12px] tracking-wider">
            &copy; 2024 Terra Surfaces. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {/* Social icons */}
            {[
              {
                label: "Instagram",
                path: "M7.8 2h8.4A5.8 5.8 0 0122 7.8v8.4A5.8 5.8 0 0116.2 22H7.8A5.8 5.8 0 012 16.2V7.8A5.8 5.8 0 017.8 2zm8 2H8.2A3.8 3.8 0 004 7.8v8.4A3.8 3.8 0 007.8 20h8.4a3.8 3.8 0 003.8-3.8V7.8A3.8 3.8 0 0016.2 4zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-2.5a1 1 0 110 2 1 1 0 010-2z",
              },
              {
                label: "Pinterest",
                path: "M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.808-2.425.853 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.48 1.806 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z",
              },
              {
                label: "LinkedIn",
                path: "M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
              },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="text-stone-dark hover:text-stone transition-colors duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          <div className="flex gap-6 text-[11px] tracking-wider text-stone-dark">
            <a href="#" className="hover:text-stone-light transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="hover:text-stone-light transition-colors duration-300">
              Terms
            </a>
            <a href="#" className="hover:text-stone-light transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
