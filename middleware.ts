import { NextRequest, NextResponse } from "next/server";
import { slugFromHost, TENANT_HEADER } from "./lib/tenant/resolve";

/** Cookie that remembers a `?tenant=` override for local/preview testing. */
const TENANT_COOKIE = "tenant_override";

/**
 * Resolves the active tenant and forwards it to the app as a request header.
 *
 * Priority: an explicit `?tenant=<slug>` query override, then the host
 * subdomain (production), then a remembered override cookie. The query override
 * is also written to a cookie so it survives redirects and navigation on
 * localhost/preview where subdomains aren't used. In production the subdomain
 * always beats the cookie, so tenancy stays correct.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const override = req.nextUrl.searchParams.get("tenant");
  const cookie = req.cookies.get(TENANT_COOKIE)?.value;
  const slug = override || slugFromHost(host) || cookie || "";

  const requestHeaders = new Headers(req.headers);
  if (slug) requestHeaders.set(TENANT_HEADER, slug);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (override && override !== cookie) {
    res.cookies.set(TENANT_COOKIE, override, { path: "/", sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|tiles/).*)"],
};
