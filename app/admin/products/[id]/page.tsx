import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/tenant/adminAuth";
import { repo } from "../../../../lib/tenant/repository";
import AdminShell from "../../AdminShell";
import ProductForm from "../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tenant = await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    repo.getProduct(tenant.id, id),
    repo.getCategories(tenant.id),
  ]);
  if (!product) notFound();

  return (
    <AdminShell tenant={tenant} active="products">
      <header className="mb-8">
        <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-3">
          Catalogue
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-cream">
          Edit — {product.name}
        </h1>
      </header>
      <ProductForm categories={categories} product={product} />
    </AdminShell>
  );
}
