import type { CSSProperties } from "react";
import type { TenantTheme } from "./types";

/**
 * Convert a tenant theme into CSS custom properties.
 *
 * These map onto the exact design tokens the components already use
 * (`--color-charcoal`, `--color-gold`, `--font-serif`, …), so setting them as
 * an inline style on <html> re-skins the entire premium UI per tenant with no
 * component edits. Inline custom properties win over the stylesheet `:root`
 * defaults, so the theme is deterministic.
 *
 * The brand accent is exposed both as `--color-gold` (legacy token name the
 * components reference) and `--color-accent` (semantic name for new code).
 */
export function themeToCssVars(theme: TenantTheme): CSSProperties {
  return {
    "--color-charcoal": theme.charcoal,
    "--color-charcoal-light": theme.charcoalLight,
    "--color-charcoal-mid": theme.charcoalMid,
    "--color-stone": theme.stone,
    "--color-stone-light": theme.stoneLight,
    "--color-stone-dark": theme.stoneDark,
    "--color-cream": theme.cream,
    "--color-cream-dark": theme.creamDark,
    "--color-warm-white": theme.warmWhite,
    "--color-gold": theme.accent,
    "--color-gold-light": theme.accentLight,
    "--color-accent": theme.accent,
    "--color-accent-light": theme.accentLight,
    "--font-serif": theme.fontSerif,
    "--font-sans": theme.fontSans,
    // Drive base page colours off the tokens too.
    backgroundColor: theme.charcoal,
    color: theme.cream,
  } as CSSProperties;
}

/**
 * Build a single Google Fonts stylesheet URL from a tenant's font imports.
 * Combining families into one request keeps the critical path fast.
 */
export function googleFontsHref(fontImports: string[]): string {
  const families = fontImports.map((f) => `family=${f}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
