import type { Product, Category } from "../../lib/tenant/types";

/**
 * The 3D visualizer's view model for a selectable material. It mirrors the
 * platform {@link Product} but flattens `categoryId` into a display `category`
 * name so the selector UI needs no lookups. Build it from tenant data with
 * {@link toTileProducts}.
 */
export interface TileProduct {
  id: string;
  name: string;
  texture: string;
  normalMap?: string;
  size: string;
  category: string;
  color: string;
  roughness: number;
  metalness: number;
  repeatX: number;
  repeatY: number;
}

/** Map tenant products + categories into the visualizer view model. */
export function toTileProducts(
  products: Product[],
  categories: Category[],
): TileProduct[] {
  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    texture: p.texture,
    normalMap: p.normalMap,
    size: p.size,
    category: nameById.get(p.categoryId) ?? "Other",
    color: p.color,
    roughness: p.roughness,
    metalness: p.metalness,
    repeatX: p.repeatX,
    repeatY: p.repeatY,
  }));
}

/** Category filter labels for a set of tiles, always led by "All". */
export function tileCategoryLabels(tiles: TileProduct[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const t of tiles) {
    if (!seen.has(t.category)) {
      seen.add(t.category);
      ordered.push(t.category);
    }
  }
  return ["All", ...ordered];
}

/** Which surface(s) a selected product is applied to in the room. */
export type SurfaceTarget =
  | "all"
  | "floor"
  | "walls"
  | "left-wall"
  | "right-wall"
  | "back-wall";

export const surfaceOptions: { label: string; value: SurfaceTarget }[] = [
  { label: "Entire Room", value: "all" },
  { label: "Floor Only", value: "floor" },
  { label: "All Walls", value: "walls" },
  { label: "Left Wall", value: "left-wall" },
  { label: "Right Wall", value: "right-wall" },
  { label: "Back Wall", value: "back-wall" },
];
