import type { Tenant, Category, Product, Inquiry } from "./types";
import { terraTenant, terraCategories, terraProducts } from "./data/terra";
import { lumenTenant, lumenCategories, lumenProducts } from "./data/lumen";

/**
 * The data-access boundary for the whole platform.
 *
 * Every page and API route reads tenant data through this interface — never
 * from the seed files directly. Today it is backed by in-memory seed data; to
 * go to production, implement this same interface against Postgres/Prisma and
 * swap the exported `repo` instance. No consumer changes required.
 */
export interface TenantRepository {
  getTenantBySlug(slug: string): Promise<Tenant | null>;
  listTenants(): Promise<Tenant[]>;
  getCategories(tenantId: string): Promise<Category[]>;
  /** Published products only, ordered — for the public showroom & visualizer. */
  getProducts(tenantId: string): Promise<Product[]>;
  getProduct(tenantId: string, productId: string): Promise<Product | null>;
  createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry>;
  listInquiries(tenantId: string): Promise<Inquiry[]>;
}

const tenants: Tenant[] = [terraTenant, lumenTenant];
const categories: Category[] = [...terraCategories, ...lumenCategories];
const products: Product[] = [...terraProducts, ...lumenProducts];
/** In-memory inquiry store — replaced by a table in the DB-backed repo. */
const inquiries: Inquiry[] = [];

class InMemoryRepository implements TenantRepository {
  async getTenantBySlug(slug: string) {
    return tenants.find((t) => t.slug === slug && t.status === "active") ?? null;
  }

  async listTenants() {
    return tenants.filter((t) => t.status === "active");
  }

  async getCategories(tenantId: string) {
    return categories
      .filter((c) => c.tenantId === tenantId)
      .sort((a, b) => a.order - b.order);
  }

  async getProducts(tenantId: string) {
    return products
      .filter((p) => p.tenantId === tenantId && p.published)
      .sort((a, b) => a.order - b.order);
  }

  async getProduct(tenantId: string, productId: string) {
    return (
      products.find((p) => p.tenantId === tenantId && p.id === productId) ?? null
    );
  }

  async createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">) {
    const inquiry: Inquiry = {
      ...input,
      id: `inq_${Math.random().toString(36).slice(2, 10)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    inquiries.push(inquiry);
    return inquiry;
  }

  async listInquiries(tenantId: string) {
    return inquiries
      .filter((i) => i.tenantId === tenantId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/** The single repository instance the app reads through. Swap for a DB impl. */
export const repo: TenantRepository = new InMemoryRepository();

/** Slug used on localhost / apex when no subdomain is present. */
export const DEFAULT_TENANT_SLUG = "terra";
