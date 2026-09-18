import { requireAdmin } from "../../../lib/tenant/adminAuth";
import AdminShell from "../AdminShell";
import { saveBranding } from "../actions";

export default async function BrandingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const tenant = await requireAdmin();
  const { saved } = await searchParams;
  const t = tenant.theme;

  const label =
    "text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2";
  const textInput =
    "w-full bg-transparent border-b border-stone-dark/40 text-cream py-2.5 text-sm focus:border-gold outline-none transition-colors";

  const colors: { name: string; value: string; hint: string }[] = [
    { name: "accent", value: t.accent, hint: "Signature accent (buttons, highlights)" },
    { name: "accentLight", value: t.accentLight, hint: "Accent hover" },
    { name: "charcoal", value: t.charcoal, hint: "Page background" },
    { name: "charcoalLight", value: t.charcoalLight, hint: "Panel background" },
    { name: "cream", value: t.cream, hint: "Primary text" },
  ];

  return (
    <AdminShell tenant={tenant} active="branding">
      <header className="mb-8">
        <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-3">
          Identity
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-cream">Branding</h1>
        <p className="text-stone-light/50 text-sm mt-2">
          These control your public showroom, visualizer and this dashboard.
        </p>
      </header>

      {saved && (
        <div className="border border-gold/40 text-gold text-sm px-4 py-3 mb-8">
          Branding saved. View your{" "}
          <a href="/" className="underline hover:text-gold-light">
            showroom
          </a>{" "}
          to see the change.
        </div>
      )}

      <form action={saveBranding} className="space-y-8 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={label}>Brand name</label>
            <input name="name" defaultValue={tenant.name} className={textInput} />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <input
              name="tagline"
              defaultValue={tenant.tagline}
              className={textInput}
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold/70 mb-4">
            Palette
          </p>
          <div className="space-y-4">
            {colors.map((c) => (
              <div key={c.name} className="flex items-center gap-4">
                <input
                  type="color"
                  name={c.name}
                  defaultValue={c.value}
                  className="w-12 h-12 bg-transparent border border-cream/10 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-cream text-sm capitalize">{c.name}</p>
                  <p className="text-stone-light/40 text-[12px]">{c.hint}</p>
                </div>
                <span className="text-stone-light/40 text-[12px] font-mono">
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="text-[13px] tracking-[0.15em] uppercase bg-cream text-charcoal px-8 py-3.5 hover:bg-gold transition-colors"
        >
          Save branding
        </button>
      </form>
    </AdminShell>
  );
}
