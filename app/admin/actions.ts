"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentTenant } from "../../lib/tenant/resolve";
import { repo } from "../../lib/tenant/repository";
import {
  ADMIN_COOKIE,
  verifyPasscode,
  isAdminFor,
} from "../../lib/tenant/adminAuth";

/** Ensure the caller is authenticated for the active tenant; returns it. */
async function requireTenant() {
  const tenant = await getCurrentTenant();
  if (!(await isAdminFor(tenant.slug))) {
    redirect("/admin/login");
  }
  return tenant;
}

function num(v: FormDataEntryValue | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: FormDataEntryValue | null, fallback = ""): string {
  return typeof v === "string" && v.length ? v : fallback;
}

// --- Auth ---

export async function login(formData: FormData) {
  const tenant = await getCurrentTenant();
  const passcode = str(formData.get("passcode"));
  if (!verifyPasscode(passcode)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, tenant.slug, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// --- Products ---

export async function saveProduct(formData: FormData) {
  const tenant = await requireTenant();
  const id = str(formData.get("id"));

  const fields = {
    tenantId: tenant.id,
    categoryId: str(formData.get("categoryId")),
    name: str(formData.get("name"), "Untitled"),
    description: str(formData.get("description")) || undefined,
    size: str(formData.get("size"), "—"),
    price: str(formData.get("price"), "POA"),
    finish: str(formData.get("finish")) || undefined,
    texture: str(formData.get("texture"), "/tiles/calacatta-oro.svg"),
    color: str(formData.get("color"), "#cccccc"),
    roughness: num(formData.get("roughness"), 0.5),
    metalness: num(formData.get("metalness"), 0),
    repeatX: num(formData.get("repeatX"), 3),
    repeatY: num(formData.get("repeatY"), 3),
    published: formData.get("published") === "on",
  };

  if (id) {
    await repo.updateProduct(tenant.id, id, fields);
  } else {
    const existing = await repo.getAllProducts(tenant.id);
    const order = existing.reduce((m, p) => Math.max(m, p.order), 0) + 1;
    await repo.createProduct({ ...fields, order });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/visualizer");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const tenant = await requireTenant();
  const id = str(formData.get("id"));
  if (id) await repo.deleteProduct(tenant.id, id);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/visualizer");
}

export async function createCategory(formData: FormData) {
  const tenant = await requireTenant();
  const name = str(formData.get("name"));
  if (name) {
    const cats = await repo.getCategories(tenant.id);
    const order = cats.reduce((m, c) => Math.max(m, c.order), 0) + 1;
    await repo.createCategory({ tenantId: tenant.id, name, order });
  }
  revalidatePath("/admin/products");
}

// --- Branding ---

export async function saveBranding(formData: FormData) {
  const tenant = await requireTenant();
  await repo.updateTenant(tenant.id, {
    name: str(formData.get("name"), tenant.name),
    tagline: str(formData.get("tagline"), tenant.tagline),
    theme: {
      ...tenant.theme,
      accent: str(formData.get("accent"), tenant.theme.accent),
      accentLight: str(formData.get("accentLight"), tenant.theme.accentLight),
      charcoal: str(formData.get("charcoal"), tenant.theme.charcoal),
      charcoalLight: str(
        formData.get("charcoalLight"),
        tenant.theme.charcoalLight,
      ),
      cream: str(formData.get("cream"), tenant.theme.cream),
    },
  });
  // Branding affects every page's theme.
  revalidatePath("/", "layout");
  redirect("/admin/branding?saved=1");
}
