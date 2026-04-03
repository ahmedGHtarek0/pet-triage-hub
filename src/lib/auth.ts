import { ADMIN_PHONE, getUserByPhone } from "./data";

const AUTH_KEY = "petplanet_auth";

export type AuthRole = "admin" | "user" | null;

export interface AuthState {
  role: AuthRole;
  phone: string;
}

export function login(phone: string): { success: boolean; role: AuthRole; error?: string } {
  if (phone === ADMIN_PHONE) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role: "admin", phone }));
    return { success: true, role: "admin" };
  }
  const user = getUserByPhone(phone);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ role: "user", phone }));
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
