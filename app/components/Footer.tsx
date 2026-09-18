"use client";

import { useTenant } from "../../lib/tenant/TenantProvider";

export default function Footer() {
  const { tenant, categories } = useTenant();
  const { contact } = tenant;
  const year = new Date().getFullYear();
  return (
    <footer className="bg-charcoal border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <span className="font-serif text-4xl tracking-[0.15em] text-cream">
              {tenant.name}
            </span>
            <p className="text-stone-light/40 text-sm mt-4 leading-relaxed max-w-xs">
              {tenant.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-light/30 mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href="/visualizer"
                    className="text-stone-light/50 text-sm hover:text-cream transition-colors duration-300"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
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
              <p>{contact.address}</p>
              <p className="pt-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-cream transition-colors duration-300"
                >
                  {contact.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-cream transition-colors duration-300"
                >
                  {contact.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <p className="text-stone-dark text-[12px] tracking-wider">
            &copy; {year} {tenant.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {contact.social.map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                className="text-stone-dark hover:text-stone text-[12px] tracking-[0.12em] uppercase transition-colors duration-300"
              >
                {social.label}
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
