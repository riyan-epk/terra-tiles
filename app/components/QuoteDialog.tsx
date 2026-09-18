"use client";

import { useActionState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitInquiry, type InquiryState } from "../actions";

interface QuoteDialogProps {
  open: boolean;
  onClose: () => void;
  /** Products the customer has selected, to attach to the quote. */
  selected: { id: string; name: string }[];
  brandName: string;
}

const initialState: InquiryState = { ok: false };

export default function QuoteDialog({
  open,
  onClose,
  selected,
  brandName,
}: QuoteDialogProps) {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  );

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const label =
    "text-[11px] tracking-[0.15em] uppercase text-stone-light/40 block mb-2";
  const input =
    "w-full bg-transparent border-b border-stone-dark/40 text-cream py-2.5 text-sm focus:border-gold outline-none transition-colors placeholder:text-stone-dark/40";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center lightbox-backdrop bg-charcoal/80 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-charcoal-light border border-cream/10 p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 text-cream/50 hover:text-cream transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {state.ok ? (
              <div className="py-10 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-gold/40 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-cream mb-2">
                  Request received
                </h3>
                <p className="text-stone-light/50 text-sm max-w-xs mx-auto">
                  Thank you — the {brandName} team will be in touch shortly about
                  your selection.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 text-[12px] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
                  Request a quote
                </p>
                <h3 className="font-serif text-2xl text-cream mb-6">
                  Your selection
                </h3>

                {selected.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {selected.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] tracking-wider uppercase px-3 py-1.5 border border-gold/30 text-cream/70"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}

                <form action={formAction} className="space-y-5">
                  <input
                    type="hidden"
                    name="productIds"
                    value={selected.map((s) => s.id).join(",")}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={label}>Name</label>
                      <input name="name" required className={input} placeholder="Your name" />
                    </div>
                    <div>
                      <label className={label}>Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className={input}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={label}>Phone (optional)</label>
                    <input name="phone" className={input} placeholder="+1 …" />
                  </div>
                  <div>
                    <label className={label}>Message</label>
                    <textarea
                      name="message"
                      rows={3}
                      className={`${input} resize-none`}
                      placeholder="Tell us about your project, quantities, timeline…"
                    />
                  </div>

                  {state.error && (
                    <p className="text-[12px] text-red-400/80">{state.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full text-[13px] tracking-[0.15em] uppercase bg-cream text-charcoal py-3.5 hover:bg-gold transition-colors disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send request"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
