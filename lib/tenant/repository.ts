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
  /** ALL products (incl. drafts), ordered — for the admin dashboard. */
  getAllProducts(tenantId: string): Promise<Product[]>;
  getProduct(tenantId: string, productId: string): Promise<Product | null>;
  createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry>;
  listInquiries(tenantId: string): Promise<Inquiry[]>;

  // --- Admin mutations ---
  updateTenant(tenantId: string, patch: Partial<Tenant>): Promise<Tenant>;
  createProduct(input: Omit<Product, "id">): Promise<Product>;
  updateProduct(
    tenantId: string,
    productId: string,
    patch: Partial<Product>,
  ): Promise<Product>;
  deleteProduct(tenantId: string, productId: string): Promise<void>;
  createCategory(input: Omit<Category, "id">): Promise<Category>;
  updateInquiryStatus(
    tenantId: string,
    inquiryId: string,
    status: Inquiry["status"],
  ): Promise<void>;
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

  async getAllProducts(tenantId: string) {
    return products
      .filter((p) => p.tenantId === tenantId)
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

  async updateTenant(tenantId: string, patch: Partial<Tenant>) {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) throw new Error(`Tenant ${tenantId} not found`);
    // Merge shallowly, but deep-merge nested config objects.
    Object.assign(tenant, {
      ...patch,
      theme: patch.theme ? { ...tenant.theme, ...patch.theme } : tenant.theme,
      content: patch.content
        ? { ...tenant.content, ...patch.content }
        : tenant.content,
      contact: patch.contact
        ? { ...tenant.contact, ...patch.contact }
        : tenant.contact,
    });
    return tenant;
  }

  async createProduct(input: Omit<Product, "id">) {
    const product: Product = { ...input, id: `prd_${randomId()}` };
    products.push(product);
    return product;
  }

  async updateProduct(
    tenantId: string,
    productId: string,
    patch: Partial<Product>,
  ) {
    const product = products.find(
      (p) => p.tenantId === tenantId && p.id === productId,
    );
    if (!product) throw new Error(`Product ${productId} not found`);
    Object.assign(product, patch, { id: product.id, tenantId: product.tenantId });
    return product;
  }

  async deleteProduct(tenantId: string, productId: string) {
    const idx = products.findIndex(
      (p) => p.tenantId === tenantId && p.id === productId,
    );
    if (idx >= 0) products.splice(idx, 1);
  }

  async createCategory(input: Omit<Category, "id">) {
    const category: Category = { ...input, id: `cat_${randomId()}` };
    categories.push(category);
    return category;
  }

  async updateInquiryStatus(
    tenantId: string,
    inquiryId: string,
    status: Inquiry["status"],
  ) {
    const inquiry = inquiries.find(
      (i) => i.tenantId === tenantId && i.id === inquiryId,
    );
    if (inquiry) inquiry.status = status;
  }
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

/** The single repository instance the app reads through. Swap for a DB impl. */
export const repo: TenantRepository = new InMemoryRepository();

/** Slug used on localhost / apex when no subdomain is present. */
export const DEFAULT_TENANT_SLUG = "terra";
