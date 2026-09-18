import type { Tenant, Category, Product } from "../types";

/**
 * Seed tenant: LUMEN Ceramica — a light, airy ceramics house.
 * Warm white + terracotta/sage, Cormorant Garamond serif. Exists purely to
 * prove the platform re-skins completely from tenant data: same components,
 * same 3D engine, a totally different premium brand.
 */
export const lumenTenant: Tenant = {
  id: "lumen",
  slug: "lumen",
  name: "LUMEN",
  tagline: "Ceramica for the modern home",
  logo: "LUMEN",
  plan: "studio",
  status: "active",
  theme: {
    // A light brand: "charcoal" role is a soft warm off-white base.
    charcoal: "#f4efe9",
    charcoalLight: "#ece5dc",
    charcoalMid: "#e2d8cb",
    stone: "#8a8378",
    stoneLight: "#a89f92",
    stoneDark: "#6f675c",
    cream: "#2c2722",
    creamDark: "#3a342d",
    warmWhite: "#221e1a",
    accent: "#c26e4a",
    accentLight: "#d98a67",
    fontSerif: '"Cormorant Garamond", Georgia, serif',
    fontSans: '"Inter", system-ui, sans-serif',
    fontImports: [
      "Inter:wght@300;400;500;600",
      "Cormorant+Garamond:wght@500;600;700",
    ],
  },
  content: {
    eyebrow: "Handmade Ceramic Surfaces",
    heroHeadline: "Light, made\ntangible",
    heroSubline:
      "Glazed ceramic and porcelain tiles fired in small batches — warmth you can feel underfoot.",
    heroImage: "/tiles/hex-bianco.svg",
    aboutTitle: "Fired by hand, finished with light",
    aboutBody:
      "LUMEN began in a single kiln. Today our ceramicists still glaze every collection by hand, chasing the way light settles into a matte, imperfect surface.",
    stats: [
      { value: "12", label: "Years firing" },
      { value: "80", label: "Glaze recipes" },
      { value: "6", label: "Studios" },
    ],
  },
  contact: {
    email: "hello@lumen.example",
    phone: "+44 20 7946 0102",
    address: "8 Kiln Yard, London",
    social: [
      { label: "Instagram", url: "#" },
      { label: "Journal", url: "#" },
    ],
  },
};

export const lumenCategories: Category[] = [
  { id: "lumen-glazed", tenantId: "lumen", name: "Glazed", order: 1 },
  { id: "lumen-terracotta", tenantId: "lumen", name: "Terracotta", order: 2 },
  { id: "lumen-porcelain", tenantId: "lumen", name: "Porcelain", order: 3 },
  { id: "lumen-mosaic", tenantId: "lumen", name: "Mosaic", order: 4 },
];

export const lumenProducts: Product[] = [
  {
    id: "bianco-lucido",
    tenantId: "lumen",
    categoryId: "lumen-glazed",
    name: "Bianco Lucido",
    description: "High-gloss white glaze with gentle handmade variation.",
    size: "10×30 cm",
    price: "POA",
    texture: "/tiles/hex-bianco.svg",
    color: "#e8e0d8",
    roughness: 0.2,
    metalness: 0.02,
    repeatX: 5,
    repeatY: 5,
    published: true,
    order: 1,
  },
  {
    id: "cotto-antico",
    tenantId: "lumen",
    categoryId: "lumen-terracotta",
    name: "Cotto Antico",
    description: "Sun-baked terracotta with an aged, matte patina.",
    size: "20×20 cm",
    price: "POA",
    texture: "/tiles/rovere-naturale.svg",
    color: "#b5714a",
    roughness: 0.8,
    metalness: 0.0,
    repeatX: 5,
    repeatY: 5,
    published: true,
    order: 2,
  },
  {
    id: "porcellana-lino",
    tenantId: "lumen",
    categoryId: "lumen-porcelain",
    name: "Porcellana Lino",
    description: "Linen-textured porcelain in a soft greige.",
    size: "60×60 cm",
    price: "POA",
    texture: "/tiles/portland-ash.svg",
    color: "#9a9186",
    roughness: 0.6,
    metalness: 0.0,
    repeatX: 4,
    repeatY: 4,
    published: true,
    order: 3,
  },
  {
    id: "salvia-opaco",
    tenantId: "lumen",
    categoryId: "lumen-glazed",
    name: "Salvia Opaco",
    description: "Matte sage glaze that shifts with the light.",
    size: "13×13 cm",
    price: "POA",
    texture: "/tiles/pietra-grey.svg",
    color: "#7d8570",
    roughness: 0.7,
    metalness: 0.0,
    repeatX: 6,
    repeatY: 6,
    published: true,
    order: 4,
  },
];
