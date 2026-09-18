import { NextRequest, NextResponse } from "next/server";
import { slugFromHost, TENANT_HEADER } from "./lib/tenant/resolve";

/**
 * Resolves the tenant from the request host (subdomain) and forwards it to the
 * app as a request header. A `?tenant=<slug>` query param overrides it — handy
 * for local development and preview links where subdomains aren't convenient.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const override = req.nextUrl.searchParams.get("tenant");
  const slug = override || slugFromHost(host) || "";

  const requestHeaders = new Headers(req.headers);
  if (slug) requestHeaders.set(TENANT_HEADER, slug);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Run on pages, skip static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|tiles/).*)"],
};
