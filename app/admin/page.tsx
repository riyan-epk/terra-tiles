import Link from "next/link";
import { requireAdmin } from "../../lib/tenant/adminAuth";
import { repo } from "../../lib/tenant/repository";
import AdminShell from "./AdminShell";

export default async function AdminOverviewPage() {
  const tenant = await requireAdmin();
  const [products, categories, inquiries] = await Promise.all([
    repo.getAllProducts(tenant.id),
    repo.getCategories(tenant.id),
    repo.listInquiries(tenant.id),
  ]);
  const published = products.filter((p) => p.published).length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    { label: "Products", value: products.length, sub: `${published} published` },
    { label: "Categories", value: categories.length, sub: "collections" },
    { label: "Inquiries", value: inquiries.length, sub: `${newInquiries} new` },
    { label: "Plan", value: tenant.plan, sub: tenant.status },
  ];

  return (
    <AdminShell tenant={tenant} active="overview">
      <header className="mb-10">
        <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-3">
          Dashboard
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-cream">
          Welcome back
        </h1>
        <p className="text-stone-light/50 text-sm mt-2">
          Manage the {tenant.name} showroom — products, branding and customer
          inquiries.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10 border border-cream/10 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-charcoal p-6">
            <p className="text-stone-light/40 text-[11px] tracking-[0.15em] uppercase mb-3">
              {s.label}
            </p>
            <p className="font-serif text-3xl text-cream capitalize">
              {s.value}
            </p>
            <p className="text-stone-light/40 text-[12px] mt-1 capitalize">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="border border-cream/10 p-6 hover:border-gold/40 transition-colors group"
        >
          <h3 className="font-serif text-xl text-cream mb-1 group-hover:text-gold transition-colors">
            Manage products →
          </h3>
          <p className="text-stone-light/50 text-sm">
            Add, edit and publish the tiles in your catalogue.
          </p>
        </Link>
        <Link
          href="/admin/branding"
          className="border border-cream/10 p-6 hover:border-gold/40 transition-colors group"
        >
          <h3 className="font-serif text-xl text-cream mb-1 group-hover:text-gold transition-colors">
            Edit branding →
          </h3>
          <p className="text-stone-light/50 text-sm">
            Change your name, tagline and showroom colours.
          </p>
        </Link>
      </div>
    </AdminShell>
  );
}
