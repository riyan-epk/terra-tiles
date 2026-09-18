import type { Tenant, Category, Product } from "../types";
import { tileTextures } from "../tile-textures";

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
    aboutEyebrow: "Since 2013",
    aboutTitle: "Fired by hand,\nfinished with light",
    aboutBody:
      "LUMEN began in a single kiln. Today our ceramicists still glaze every collection by hand, chasing the way light settles into a matte, imperfect surface. No two tiles are identical — and that is the point.",
    stats: [
      { value: "12", label: "Years firing" },
      { value: "80", label: "Glaze recipes" },
      { value: "6", label: "Studios" },
    ],
    testimonialsEyebrow: "In good company",
    testimonials: [
      {
        quote:
          "LUMEN's glazes brought a warmth to our café that customers actually comment on. The hand-made variation is the whole charm.",
        author: "Marta Ruiz",
        role: "Founder, Corner Coffee",
        project: "Corner Coffee — Shoreditch",
      },
      {
        quote:
          "We clad an entire spa in Salvia Opaco. The way the matte glaze shifts through the day is something a printed tile could never do.",
        author: "Tom Fielding",
        role: "Architect, Fielding Studio",
        project: "Still Water Spa",
      },
      {
        quote:
          "Beautiful terracotta, delivered on time and consistent batch to batch. Rare for a handmade product.",
        author: "Priya Nair",
        role: "Interior Designer",
        project: "The Garden House",
      },
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
    texture: tileTextures.bianco,
    color: "#e8e0d8",
    finish: "Gloss",
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
    texture: tileTextures.wood,
    color: "#b5714a",
    finish: "Matte",
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
    texture: tileTextures.concrete,
    color: "#9a9186",
    finish: "Satin",
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
    texture: tileTextures.pietra,
    color: "#7d8570",
    finish: "Matte",
    roughness: 0.7,
    metalness: 0.0,
    repeatX: 6,
    repeatY: 6,
    published: true,
    order: 4,
  },
];
