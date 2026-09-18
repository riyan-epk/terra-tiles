import { requireAdmin } from "../../../lib/tenant/adminAuth";
import { repo } from "../../../lib/tenant/repository";
import AdminShell from "../AdminShell";

export default async function InquiriesPage() {
  const tenant = await requireAdmin();
  const [inquiries, products] = await Promise.all([
    repo.listInquiries(tenant.id),
    repo.getAllProducts(tenant.id),
  ]);
  const productName = new Map(products.map((p) => [p.id, p.name]));

  return (
    <AdminShell tenant={tenant} active="inquiries">
      <header className="mb-8">
        <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-3">
          Leads
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-cream">Inquiries</h1>
        <p className="text-stone-light/50 text-sm mt-2">
          Quote requests customers send from your showroom appear here.
        </p>
      </header>

      {inquiries.length === 0 ? (
        <div className="border border-cream/10 p-12 text-center text-stone-light/50">
          No inquiries yet. When a customer requests a quote, it will show up
          here.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((i) => (
            <div key={i.id} className="border border-cream/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-cream font-medium">{i.customerName}</p>
                  <p className="text-stone-light/50 text-sm">
                    {i.customerEmail}
                    {i.customerPhone ? ` · ${i.customerPhone}` : ""}
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 border border-gold/40 text-gold">
                  {i.status}
                </span>
              </div>
              {i.message && (
                <p className="text-stone-light/70 text-sm mb-3">{i.message}</p>
              )}
              {i.productIds.length > 0 && (
                <p className="text-stone-light/40 text-[12px] uppercase tracking-wider">
                  Interested in:{" "}
                  {i.productIds
                    .map((id) => productName.get(id) ?? id)
                    .join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
