import { getCurrentTenant } from "../../lib/tenant/resolve";
import { repo } from "../../lib/tenant/repository";
import { toTileProducts, tileCategoryLabels } from "./tile-data";
import VisualizerClient from "./VisualizerClient";

export default async function VisualizerPage() {
  const tenant = await getCurrentTenant();
  const [products, categories] = await Promise.all([
    repo.getProducts(tenant.id),
    repo.getCategories(tenant.id),
  ]);

  const tiles = toTileProducts(products, categories);
  const categoryLabels = tileCategoryLabels(tiles);

  return (
    <VisualizerClient
      tiles={tiles}
      categories={categoryLabels}
      brandName={tenant.name}
    />
  );
}
