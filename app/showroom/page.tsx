import { getCurrentTenant } from "../../lib/tenant/resolve";
import { repo } from "../../lib/tenant/repository";
import ShowroomClient, { type ShowroomTile } from "./ShowroomClient";

/** Parse a human size like "60×120 cm" or "600 x 1200 mm" into metres [w,h]. */
function parseSizeMeters(size: string): [number, number] {
  const nums = (size.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
  let unit = 0.01; // default cm
  if (/mm/i.test(size)) unit = 0.001;
  else if (/\bm\b/i.test(size) && !/cm|mm/i.test(size)) unit = 1;
  if (nums.length >= 2) return [nums[0] * unit, nums[1] * unit];
  if (nums.length === 1) return [nums[0] * unit, nums[0] * unit];
  return [0.3, 0.3]; // e.g. "Sheet"
}

export default async function ShowroomPage() {
  const tenant = await getCurrentTenant();
  const [products, categories] = await Promise.all([
    repo.getProducts(tenant.id),
    repo.getCategories(tenant.id),
  ]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));

  const tiles: ShowroomTile[] = products.map((p) => {
    const [wM, hM] = parseSizeMeters(p.size);
    return {
      id: p.id,
      name: p.name,
      sizeLabel: p.size,
      category: catName.get(p.categoryId) ?? "Other",
      texture: p.texture,
      wM,
      hM,
      gloss: Math.max(0, Math.min(1, 1 - p.roughness)),
    };
  });

  const usedCats = categories
    .filter((c) => products.some((p) => p.categoryId === c.id))
    .map((c) => c.name);

  return (
    <ShowroomClient tiles={tiles} categories={usedCats} brandName={tenant.name} />
  );
}
