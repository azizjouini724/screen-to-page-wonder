import type { AppUser, Role, StoredAccount } from "@/data/auth";

export const roleHome: Record<Role, "/espace-patient" | "/espace-medecin" | "/espace-admin"> = {
  patient: "/espace-patient",
  medecin: "/espace-medecin",
  admin: "/espace-admin",
};

export function findAccount(accounts: StoredAccount[], email: string, password: string): AppUser | null {
  const e = email.trim().toLowerCase();
  const acc = accounts.find((a) => a.email.toLowerCase() === e && a.password === password);
  if (!acc) return null;
  const { password: _p, ...user } = acc;
  return user;
}

/** 0 à 4 */
export function passwordStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return s;
}
