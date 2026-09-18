"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "../actions";

const initialState: InquiryState = { ok: false };

const inputBase =
  "w-full bg-transparent border-b border-stone-dark/30 text-cream py-3 text-sm focus:border-gold transition-colors duration-300 outline-none placeholder:text-stone-dark/50";
const labelBase =
  "text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2";

/** The public showroom's customer inquiry form — submits a real inquiry. */
export default function CustomerInquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="max-w-md border border-gold/30 p-8">
        <h3 className="font-serif text-2xl text-cream mb-2">Thank you</h3>
        <p className="text-stone-light/60 text-sm">
          Your inquiry has been received. Our team will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6 max-w-md">
      <div>
        <label className={labelBase}>Full Name</label>
        <input name="name" required className={inputBase} placeholder="Jane Doe" />
      </div>

      <div>
        <label className={labelBase}>Email</label>
        <input
          type="email"
          name="email"
          required
          className={inputBase}
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className={labelBase}>Phone (optional)</label>
        <input name="phone" className={inputBase} placeholder="+1 (555) 000-0000" />
      </div>

      <div>
        <label className={labelBase}>Tell Us About Your Project</label>
        <textarea
          name="message"
          rows={4}
          className={`${inputBase} resize-none`}
          placeholder="Brief description of your space, style preferences, and timeline…"
        />
      </div>

      {state.error && (
        <p className="text-[12px] text-red-400/80">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full text-[13px] tracking-[0.15em] uppercase bg-cream text-charcoal py-4 hover:bg-gold transition-colors duration-300 mt-4 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
