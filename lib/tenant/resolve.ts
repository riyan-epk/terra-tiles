import { headers } from "next/headers";
import { repo, DEFAULT_TENANT_SLUG } from "./repository";
import type { Tenant } from "./types";

/** Header the middleware writes the resolved tenant slug into. */
export const TENANT_HEADER = "x-tenant-slug";

/** Root domain the platform runs under in production. */
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost";

/**
 * Extract a tenant slug from a request host.
 *
 * Handles production subdomains (`terra.terravisualizer.com`), local subdomains
 * (`terra.localhost:3000`), Vercel preview hosts, and the apex/bare host (falls
 * back to the default tenant). Returns null when the host is just the apex.
 */
export function slugFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  // Strip port.
  const hostname = host.split(":")[0].toLowerCase();

  // Bare localhost or IP → no subdomain.
  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");

  // `<slug>.localhost`
  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0];
  }

  // `<slug>.<root-domain>` — anything with a subdomain in front of the root.
  const rootParts = ROOT_DOMAIN.split(".");
  if (parts.length > rootParts.length) {
    const sub = parts[0];
    // Ignore common non-tenant subdomains.
    if (sub === "www" || sub === "app") return null;
    return sub;
  }

  return null;
}

/**
 * Resolve the active tenant for the current request (server components/routes).
 * Reads the slug the middleware placed in the request header, falls back to the
 * default tenant, and always returns a live tenant (never throws for the demo).
 */
export async function getCurrentTenant(): Promise<Tenant> {
  const hdrs = await headers();
  const slug = hdrs.get(TENANT_HEADER) || DEFAULT_TENANT_SLUG;
  const tenant =
    (await repo.getTenantBySlug(slug)) ??
    (await repo.getTenantBySlug(DEFAULT_TENANT_SLUG));

  if (!tenant) {
    throw new Error(
      `No tenant found for slug "${slug}" and no default tenant configured.`,
    );
  }
  return tenant;
}
