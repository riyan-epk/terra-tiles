import { prisma } from "../prisma";
import type { TenantRepository } from "./repository";
import type {
  Tenant,
  TenantTheme,
  TenantContent,
  TenantContact,
  Category,
  Product,
  Inquiry,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toTenant(row: any): Tenant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    logo: row.logo,
    plan: row.plan,
    status: row.status,
    theme: row.theme as TenantTheme,
    content: row.content as TenantContent,
    contact: row.contact as TenantContact,
  };
}

function toProduct(row: any): Product {
  return {
    id: row.id,
    tenantId: row.tenantId,
    categoryId: row.categoryId,
    name: row.name,
    description: row.description ?? undefined,
    size: row.size,
    price: row.price,
    finish: row.finish ?? undefined,
    texture: row.texture,
    normalMap: row.normalMap ?? undefined,
    color: row.color,
    roughness: row.roughness,
    metalness: row.metalness,
    repeatX: row.repeatX,
    repeatY: row.repeatY,
    published: row.published,
    order: row.order,
  };
}

function toInquiry(row: any): Inquiry {
  return {
    id: row.id,
    tenantId: row.tenantId,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone ?? undefined,
    message: row.message,
    productIds: row.productIds ?? [],
    roomDesignId: row.roomDesignId ?? undefined,
    status: row.status,
    createdAt:
      row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

/** Postgres-backed repository. Same contract as the in-memory one. */
export class PrismaRepository implements TenantRepository {
  async getTenantBySlug(slug: string) {
    const row = await prisma.tenant.findUnique({ where: { slug } });
    if (!row || row.status !== "active") return null;
    return toTenant(row);
  }

  async listTenants() {
    const rows = await prisma.tenant.findMany({ where: { status: "active" } });
    return rows.map(toTenant);
  }

  async getCategories(tenantId: string) {
    const rows = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
    });
    return rows.map((r) => ({
      id: r.id,
      tenantId: r.tenantId,
      name: r.name,
      order: r.order,
    })) as Category[];
  }

  async getProducts(tenantId: string) {
    const rows = await prisma.product.findMany({
      where: { tenantId, published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toProduct);
  }

  async getAllProducts(tenantId: string) {
    const rows = await prisma.product.findMany({
      where: { tenantId },
      orderBy: { order: "asc" },
    });
    return rows.map(toProduct);
  }

  async getProduct(tenantId: string, productId: string) {
    const row = await prisma.product.findFirst({
      where: { id: productId, tenantId },
    });
    return row ? toProduct(row) : null;
  }

  async createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">) {
    const row = await prisma.inquiry.create({
      data: {
        tenantId: input.tenantId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        message: input.message,
        productIds: input.productIds,
        roomDesignId: input.roomDesignId,
      },
    });
    return toInquiry(row);
  }

  async listInquiries(tenantId: string) {
    const rows = await prisma.inquiry.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toInquiry);
  }

  async updateTenant(tenantId: string, patch: Partial<Tenant>) {
    const current = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!current) throw new Error(`Tenant ${tenantId} not found`);
    const row = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: patch.name ?? undefined,
        tagline: patch.tagline ?? undefined,
        logo: patch.logo ?? undefined,
        plan: patch.plan ?? undefined,
        status: patch.status ?? undefined,
        theme: patch.theme
          ? { ...(current.theme as object), ...patch.theme }
          : undefined,
        content: patch.content
          ? { ...(current.content as object), ...patch.content }
          : undefined,
        contact: patch.contact
          ? { ...(current.contact as object), ...patch.contact }
          : undefined,
      },
    });
    return toTenant(row);
  }

  async createProduct(input: Omit<Product, "id">) {
    const row = await prisma.product.create({ data: input });
    return toProduct(row);
  }

  async updateProduct(
    tenantId: string,
    productId: string,
    patch: Partial<Product>,
  ) {
    await prisma.product.updateMany({
      where: { id: productId, tenantId },
      data: {
        categoryId: patch.categoryId,
        name: patch.name,
        description: patch.description,
        size: patch.size,
        price: patch.price,
        finish: patch.finish,
        texture: patch.texture,
        normalMap: patch.normalMap,
        color: patch.color,
        roughness: patch.roughness,
        metalness: patch.metalness,
        repeatX: patch.repeatX,
        repeatY: patch.repeatY,
        published: patch.published,
        order: patch.order,
      },
    });
    const updated = await this.getProduct(tenantId, productId);
    if (!updated) throw new Error(`Product ${productId} not found`);
    return updated;
  }

  async deleteProduct(tenantId: string, productId: string) {
    await prisma.product.deleteMany({ where: { id: productId, tenantId } });
  }

  async createCategory(input: Omit<Category, "id">) {
    const row = await prisma.category.create({ data: input });
    return { id: row.id, tenantId: row.tenantId, name: row.name, order: row.order };
  }

  async updateInquiryStatus(
    tenantId: string,
    inquiryId: string,
    status: Inquiry["status"],
  ) {
    await prisma.inquiry.updateMany({
      where: { id: inquiryId, tenantId },
      data: { status },
    });
  }
}
