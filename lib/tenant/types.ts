/**
 * Core multi-tenant type system.
 *
 * These types are the contract for the whole platform. The repository layer
 * ({@link file://./repository.ts}) currently serves seeded data, but every
 * consumer reads through these interfaces — so swapping the backing store to
 * Postgres/Prisma later is a repository-only change, no consumer touches needed.
 */

/** A product surface material a customer can apply in the 3D visualizer. */
export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  /** Marketing blurb shown in the product detail view. */
  description?: string;
  /** Displayed size, e.g. "60×120 cm" or "Slab". */
  size: string;
  /** Human price string; "POA" (price on application) is valid for quote flow. */
  price: string;
  /** URL of the tileable surface texture used by the 3D engine. */
  texture: string;
  /** Optional normal map for extra surface depth. */
  normalMap?: string;
  /** Dominant colour, used for UI swatches and material tint fallback. */
  color: string;
  /** Surface finish, e.g. "Polished", "Honed", "Matte". */
  finish?: string;
  /** PBR material params consumed by the visualizer. */
  roughness: number;
  metalness: number;
  /** Texture tiling repetition across a surface. */
  repeatX: number;
  repeatY: number;
  /** Draft products are hidden from the public showroom. */
  published: boolean;
  /** Sort weight; lower shows first. */
  order: number;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  order: number;
}

/** Which surface(s) a selected product is applied to in the room. */
export type SurfaceTarget =
  | "all"
  | "floor"
  | "walls"
  | "left-wall"
  | "right-wall"
  | "back-wall";

/**
 * Per-tenant brand theme. Every value maps to a CSS custom property injected at
 * the document root, so the entire premium design re-skins per client with zero
 * component changes.
 */
export interface TenantTheme {
  /** Deep background / primary surface colour. */
  charcoal: string;
  charcoalLight: string;
  charcoalMid: string;
  /** Mid neutral (stone family). */
  stone: string;
  stoneLight: string;
  stoneDark: string;
  /** Light text / paper tone. */
  cream: string;
  creamDark: string;
  warmWhite: string;
  /** Signature accent (gold, brass, chrome, etc.). */
  accent: string;
  accentLight: string;
  /** Font family stacks. */
  fontSerif: string;
  fontSans: string;
  /** Google Fonts family query, e.g. "DM+Serif+Display" — combined into one link. */
  fontImports: string[];
}

/** A client testimonial shown in the marquee. */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  project: string;
}

/** Marketing copy + identity that fills the shared premium template per client. */
export interface TenantContent {
  /** Short eyebrow shown above the hero headline. */
  eyebrow: string;
  /** Hero headline; \n allowed for line breaks. */
  heroHeadline: string;
  heroSubline: string;
  /** Full-bleed hero background image URL. */
  heroImage: string;
  /** Eyebrow above the about section (e.g. "Est. 1987"). */
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  stats: { value: string; label: string }[];
  testimonialsEyebrow: string;
  testimonials: Testimonial[];
}

export interface TenantContact {
  email: string;
  phone: string;
  address: string;
  social: { label: string; url: string }[];
}

export interface Tenant {
  id: string;
  /** Subdomain slug: `<slug>.terravisualizer.com`. */
  slug: string;
  /** Brand display name. */
  name: string;
  /** One-line descriptor used in metadata + footer. */
  tagline: string;
  /** Logo mark: an inline SVG string or image URL. */
  logo: string;
  theme: TenantTheme;
  content: TenantContent;
  contact: TenantContact;
  /** Subscription plan — gates features later. */
  plan: "trial" | "studio" | "atelier";
  status: "active" | "suspended";
}

/** A saved room composition a customer can turn into a quote request. */
export interface RoomDesign {
  id: string;
  tenantId: string;
  /** Map of surface → product id. */
  surfaces: Partial<Record<Exclude<SurfaceTarget, "all" | "walls">, string>>;
  snapshotUrl?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  tenantId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  /** Products the customer selected, denormalised for the quote. */
  productIds: string[];
  roomDesignId?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}
