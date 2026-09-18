import { getCurrentTenant } from "../../../lib/tenant/resolve";
import { isAdminFor } from "../../../lib/tenant/adminAuth";
import { redirect } from "next/navigation";
import { login } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const tenant = await getCurrentTenant();
  if (await isAdminFor(tenant.slug)) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="min-h-dvh bg-charcoal text-cream flex items-center justify-center px-6 grain-overlay">
      <div className="w-full max-w-sm">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-2">
          {tenant.name} Studio
        </p>
        <h1 className="font-serif text-3xl text-cream mb-2">Admin access</h1>
        <p className="text-stone-light/50 text-sm mb-8">
          Enter your studio passcode to manage this showroom.
        </p>

        <form action={login} className="space-y-5">
          <div>
            <label className="text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2">
              Passcode
            </label>
            <input
              type="password"
              name="passcode"
              autoFocus
              className="w-full bg-transparent border-b border-stone-dark/40 text-cream py-3 text-sm focus:border-gold outline-none transition-colors placeholder:text-stone-dark/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-400/80">
              Incorrect passcode. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full text-[13px] tracking-[0.15em] uppercase bg-cream text-charcoal py-3.5 hover:bg-gold transition-colors duration-300"
          >
            Enter Studio
          </button>
        </form>

        <p className="text-stone-light/30 text-[11px] mt-8 leading-relaxed">
          Demo passcode: <span className="text-stone-light/60">demo1234</span> —
          replace with real accounts before launch.
        </p>
      </div>
    </div>
  );
}
