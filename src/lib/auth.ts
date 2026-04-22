import { getAdminPhone } from "./data";
import { supabase } from "@/integrations/supabase/client";

const AUTH_KEY = "petplanet_auth";

export type AuthRole = "admin" | "user" | null;

export interface AuthState {
  role: AuthRole;
  phone: string;
}

const normalizePhone = (p: string) => p.replace(/[\s\-()+]/g, "").trim();

export async function login(phone: string): Promise<{ success: boolean; role: AuthRole; error?: string }> {
  const input = normalizePhone(phone);
  const adminPhone = normalizePhone(getAdminPhone());
  if (input === adminPhone) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role: "admin", phone: input }));
    return { success: true, role: "admin" };
  }

  // Check database for user — fetch all and match normalized to handle spaces/formatting
  const { data } = await supabase
    .from("patients")
    .select("id, owner_phone");

  const match = (data || []).find((p) => normalizePhone(p.owner_phone || "") === input);

  if (match) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role: "user", phone: input }));
    return { success: true, role: "user" };
  }

  return { success: false, role: null, error: "Phone number not found" };
}

export function getAuth(): AuthState {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) return JSON.parse(stored);
  return { role: null, phone: "" };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
