import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentTenant } from "./resolve";
import type { Tenant } from "./types";

/**
 * Demo admin gate.
 *
 * A single shared passcode protects the dashboard and, on success, we store the
 * tenant slug the visitor is authenticated for in an httpOnly cookie. This is a
 * placeholder for real per-user auth (Clerk/Auth.js) — it is deliberately simple
 * so the dashboard is usable now. Swap {@link verifyPasscode} + the cookie for a
 * real session when auth is wired.
 */
export const ADMIN_COOKIE = "admin_tenant";

/** Shared demo passcode. Override with ADMIN_PASSCODE in the environment. */
export function adminPasscode(): string {
  return process.env.ADMIN_PASSCODE ?? "demo1234";
}

export function verifyPasscode(input: string): boolean {
  return input.trim() === adminPasscode();
}

/** The tenant slug the current visitor is authenticated for, if any. */
export async function getAdminSlug(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}

/** True when the visitor is authenticated for the given tenant. */
export async function isAdminFor(tenantSlug: string): Promise<boolean> {
  return (await getAdminSlug()) === tenantSlug;
}

/**
 * Guard for protected admin pages: resolves the active tenant and redirects to
 * the login screen unless the visitor is authenticated for it.
 */
export async function requireAdmin(): Promise<Tenant> {
  const tenant = await getCurrentTenant();
  if (!(await isAdminFor(tenant.slug))) {
    redirect("/admin/login");
  }
  return tenant;
}
