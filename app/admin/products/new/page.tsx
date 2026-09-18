import { requireAdmin } from "../../../../lib/tenant/adminAuth";
import { repo } from "../../../../lib/tenant/repository";
import AdminShell from "../../AdminShell";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const tenant = await requireAdmin();
  const categories = await repo.getCategories(tenant.id);

  return (
    <AdminShell tenant={tenant} active="products">
      <header className="mb-8">
        <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-3">
          Catalogue
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-cream">
          New product
        </h1>
      </header>
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
