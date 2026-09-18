import Link from "next/link";
import type { Tenant } from "../../lib/tenant/types";
import { logout } from "./actions";

const NAV = [
  { href: "/admin", label: "Overview", key: "overview" },
  { href: "/admin/products", label: "Products", key: "products" },
  { href: "/admin/branding", label: "Branding", key: "branding" },
  { href: "/admin/inquiries", label: "Inquiries", key: "inquiries" },
];

/** Premium admin chrome: brand header, section nav, logout. Re-skins per tenant. */
export default function AdminShell({
  tenant,
  active,
  children,
}: {
  tenant: Tenant;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-charcoal text-cream flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-dvh border-b lg:border-b-0 lg:border-r border-cream/10 flex lg:flex-col flex-row items-center lg:items-stretch justify-between lg:justify-start px-5 lg:px-6 py-4 lg:py-8 gap-4">
        <div className="lg:mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold/70">
            Studio
          </p>
          <span className="font-serif text-2xl tracking-[0.15em] text-cream">
            {tenant.name}
          </span>
        </div>

        <nav className="flex lg:flex-col gap-1 lg:gap-1 flex-1 lg:flex-none">
          {NAV.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`text-[12px] lg:text-sm tracking-[0.1em] uppercase px-3 lg:px-4 py-2 lg:py-2.5 transition-colors duration-200 ${
                  isActive
                    ? "bg-cream/10 text-cream border-l-2 border-gold"
                    : "text-stone-light/50 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="lg:mt-auto lg:pt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="hidden lg:block text-[11px] tracking-[0.12em] uppercase text-stone-light/40 hover:text-cream transition-colors"
          >
            ← View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-[11px] tracking-[0.12em] uppercase text-stone-light/40 hover:text-gold transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 md:px-12 py-10 lg:py-14 max-w-5xl w-full">
        {children}
      </main>
    </div>
  );
}
