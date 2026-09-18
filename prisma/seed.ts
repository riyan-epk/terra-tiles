import { PrismaClient } from "@prisma/client";
import { terraTenant, terraCategories, terraProducts } from "../lib/tenant/data/terra";
import { lumenTenant, lumenCategories, lumenProducts } from "../lib/tenant/data/lumen";
import type { Tenant, Category, Product } from "../lib/tenant/types";

const prisma = new PrismaClient();

async function seedTenant(
  tenant: Tenant,
  categories: Category[],
  products: Product[],
) {
  await prisma.tenant.upsert({
    where: { id: tenant.id },
    create: {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      tagline: tenant.tagline,
      logo: tenant.logo,
      plan: tenant.plan,
      status: tenant.status,
      theme: tenant.theme as object,
      content: tenant.content as object,
      contact: tenant.contact as object,
    },
    update: {
      slug: tenant.slug,
      name: tenant.name,
      tagline: tenant.tagline,
      logo: tenant.logo,
      plan: tenant.plan,
      status: tenant.status,
      theme: tenant.theme as object,
      content: tenant.content as object,
      contact: tenant.contact as object,
    },
  });

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      create: { id: c.id, tenantId: c.tenantId, name: c.name, order: c.order },
      update: { name: c.name, order: c.order },
    });
  }

  for (const p of products) {
    const data = {
      tenantId: p.tenantId,
      categoryId: p.categoryId,
      name: p.name,
      description: p.description,
      size: p.size,
      price: p.price,
      finish: p.finish,
      texture: p.texture,
      normalMap: p.normalMap,
      color: p.color,
      roughness: p.roughness,
      metalness: p.metalness,
      repeatX: p.repeatX,
      repeatY: p.repeatY,
      published: p.published,
      order: p.order,
    };
    await prisma.product.upsert({
      where: { id: p.id },
      create: { id: p.id, ...data },
      update: data,
    });
  }
}

async function main() {
  await seedTenant(terraTenant, terraCategories, terraProducts);
  await seedTenant(lumenTenant, lumenCategories, lumenProducts);
  console.log("✓ Seeded tenants: TERRA, LUMEN");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
