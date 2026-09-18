import { headers } from "next/headers";
import { repo, DEFAULT_TENANT_SLUG } from "./repository";
import { TENANT_HEADER } from "./host";
import type { Tenant } from "./types";

// Re-exported for existing consumers; the source of truth is ./host.
export { TENANT_HEADER, ROOT_DOMAIN, slugFromHost } from "./host";

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
