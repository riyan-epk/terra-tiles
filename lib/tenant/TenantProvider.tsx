"use client";

import { createContext, useContext } from "react";
import type { Tenant, Product, Category } from "./types";

/** Everything client components need about the active tenant, resolved once server-side. */
export interface TenantBundle {
  tenant: Tenant;
  products: Product[];
  categories: Category[];
}

const TenantContext = createContext<TenantBundle | null>(null);

export function TenantProvider({
  value,
  children,
}: {
  value: TenantBundle;
  children: React.ReactNode;
}) {
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

/** Read the active tenant bundle. Throws if used outside the provider. */
export function useTenant(): TenantBundle {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return ctx;
}
