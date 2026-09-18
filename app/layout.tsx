import type { Metadata } from "next";
import "./globals.css";
import { getCurrentTenant } from "../lib/tenant/resolve";
import { themeToCssVars, googleFontsHref } from "../lib/tenant/theme";

/** Per-tenant metadata (title/description follow the active brand). */
export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  return {
    title: `${tenant.name} | ${tenant.tagline}`,
    description: tenant.tagline,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getCurrentTenant();
  const themeVars = themeToCssVars(tenant.theme);
  const fontsHref = googleFontsHref(tenant.theme.fontImports);

  return (
    <html lang="en" style={themeVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Fonts follow the active tenant's brand. */}
        <link href={fontsHref} rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
