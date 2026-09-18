"use server";

import { revalidatePath } from "next/cache";
import { getCurrentTenant } from "../lib/tenant/resolve";
import { repo } from "../lib/tenant/repository";

export interface InquiryState {
  ok: boolean;
  error?: string;
}

/**
 * Public quote/inquiry submission, used by the showroom contact form and the
 * visualizer's "request a quote" flow. Creates a tenant-scoped inquiry that
 * appears in that client's admin inbox. Shaped for React's useActionState.
 */
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const tenant = await getCurrentTenant();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const productIds = String(formData.get("productIds") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!name || !email) {
    return { ok: false, error: "Please provide your name and email." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  await repo.createInquiry({
    tenantId: tenant.id,
    customerName: name,
    customerEmail: email,
    customerPhone: phone || undefined,
    message,
    productIds,
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true };
}
