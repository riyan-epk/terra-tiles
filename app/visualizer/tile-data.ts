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

export const tileCategories = ["All", "Marble", "Wood", "Stone", "Concrete", "Mosaic"] as const;

export const tiles: TileProduct[] = [
  {
    id: "calacatta-oro",
    name: "Calacatta Oro",
    texture: "/tiles/calacatta-oro.svg",
    size: "60×120 cm",
    category: "Marble",
    color: "#f0ebe5",
    roughness: 0.15,
    metalness: 0.05,
    repeatX: 3,
    repeatY: 3,
  },
  {
    id: "rovere-naturale",
    name: "Rovere Naturale",
    texture: "/tiles/rovere-naturale.svg",
    size: "20×120 cm",
    category: "Wood",
    color: "#8b6b4a",
    roughness: 0.7,
    metalness: 0.0,
    repeatX: 6,
    repeatY: 6,
  },
  {
    id: "pietra-grey",
    name: "Pietra Grey",
    texture: "/tiles/pietra-grey.svg",
    size: "60×120 cm",
    category: "Stone",
    color: "#6a625a",
    roughness: 0.5,
    metalness: 0.02,
    repeatX: 3,
    repeatY: 3,
  },
  {
    id: "portland-ash",
    name: "Portland Ash",
    texture: "/tiles/portland-ash.svg",
    size: "60×60 cm",
    category: "Concrete",
    color: "#787878",
    roughness: 0.85,
    metalness: 0.0,
    repeatX: 4,
    repeatY: 4,
  },
  {
    id: "hex-bianco",
    name: "Hex Bianco",
    texture: "/tiles/hex-bianco.svg",
    size: "Sheet",
    category: "Mosaic",
    color: "#e8e0d8",
    roughness: 0.3,
    metalness: 0.02,
    repeatX: 5,
    repeatY: 5,
  },
];

export type SurfaceTarget = "all" | "floor" | "walls" | "left-wall" | "right-wall" | "back-wall";

export const surfaceOptions: { label: string; value: SurfaceTarget }[] = [
  { label: "Entire Room", value: "all" },
  { label: "Floor Only", value: "floor" },
  { label: "All Walls", value: "walls" },
  { label: "Left Wall", value: "left-wall" },
  { label: "Right Wall", value: "right-wall" },
  { label: "Back Wall", value: "back-wall" },
];
