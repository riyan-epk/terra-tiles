import Link from "next/link";
import { requireAdmin } from "../../../lib/tenant/adminAuth";
import { repo } from "../../../lib/tenant/repository";
import AdminShell from "../AdminShell";
import { deleteProduct, createCategory } from "../actions";

export default async function AdminProductsPage() {
  const tenant = await requireAdmin();
  const [products, categories] = await Promise.all([
    repo.getAllProducts(tenant.id),
    repo.getCategories(tenant.id),
  ]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <AdminShell tenant={tenant} active="products">
      <header className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-3">
            Catalogue
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="text-[12px] tracking-[0.15em] uppercase bg-cream text-charcoal px-6 py-3 hover:bg-gold transition-colors"
        >
          + Add product
        </Link>
      </header>

      {/* Quick add category */}
      <form
        action={createCategory}
        className="flex items-center gap-2 mb-8 flex-wrap"
      >
        <span className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40">
          Categories:
        </span>
        {categories.map((c) => (
          <span
            key={c.id}
            className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-cream/10 text-stone-light/60"
          >
            {c.name}
          </span>
        ))}
        <input
          name="name"
          placeholder="New category"
          className="bg-transparent border-b border-stone-dark/40 text-cream text-sm py-1.5 px-2 focus:border-gold outline-none w-36 placeholder:text-stone-dark/50"
        />
        <button
          type="submit"
          className="text-[11px] tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors"
        >
          Add
        </button>
      </form>

      {products.length === 0 ? (
        <div className="border border-cream/10 p-12 text-center">
          <p className="text-stone-light/50 mb-4">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="text-gold text-sm tracking-[0.1em] uppercase hover:text-gold-light"
          >
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="border border-cream/10 divide-y divide-cream/10">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 hover:bg-cream/[0.03] transition-colors"
            >
              <div className="w-12 h-12 flex-shrink-0 overflow-hidden border border-cream/10">
                <img
                  src={p.texture}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-medium truncate">
                  {p.name}
                </p>
                <p className="text-stone-light/40 text-[12px] uppercase tracking-wider">
                  {catName.get(p.categoryId) ?? "—"} · {p.size}
                  {p.finish ? ` · ${p.finish}` : ""}
                </p>
              </div>
              <span
                className={`text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 border ${
                  p.published
                    ? "border-gold/40 text-gold"
                    : "border-stone-dark/40 text-stone-light/40"
                }`}
              >
                {p.published ? "Live" : "Draft"}
              </span>
              <Link
                href={`/admin/products/${p.id}`}
                className="text-[12px] tracking-[0.1em] uppercase text-stone-light/60 hover:text-cream transition-colors"
              >
                Edit
              </Link>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="text-[12px] tracking-[0.1em] uppercase text-stone-light/40 hover:text-red-400/80 transition-colors"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
