/**
 * Host/subdomain parsing — deliberately dependency-free so the Edge middleware
 * can import it without pulling in the repository, seed data or tile textures
 * (which would blow the Edge Function size limit).
 */

/** Header the middleware writes the resolved tenant slug into. */
export const TENANT_HEADER = "x-tenant-slug";

/** Root domain the platform runs under in production. */
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost";

/**
 * Extract a tenant slug from a request host. Handles production subdomains,
 * `<slug>.localhost`, Vercel preview hosts, and the bare apex (returns null).
 */
export function slugFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();

  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");

  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0];
  }

  const rootParts = ROOT_DOMAIN.split(".");
  if (parts.length > rootParts.length) {
    const sub = parts[0];
    if (sub === "www" || sub === "app") return null;
    return sub;
  }

  return null;
}
