import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { demoAccounts, type AppUser, type Role, type StoredAccount } from "@/data/auth";
import { findAccount } from "@/lib/auth";

const SESSION_KEY = "cc_session";
const ACCOUNTS_KEY = "cc_accounts";

export type RegisterInput = {
  firstName: string; lastName: string; email: string; password: string; role: Exclude<Role, "admin">;
};

type AuthValue = {
  user: AppUser | null;
  role: Role | null;
  ready: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<AppUser | null>;
  logout: () => void;
  register: (input: RegisterInput) => Promise<{ ok: true; user: AppUser } | { ok: false; error: string }>;
};

const AuthContext = createContext<AuthValue | null>(null);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readAccounts(): StoredAccount[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]"); } catch { return []; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    await wait(700);
    const u = findAccount([...demoAccounts, ...readAccounts()], email, password);
    if (u) {
      (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
    }
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    await wait(800);
    const accounts = readAccounts();
    const email = input.email.trim().toLowerCase();
    if ([...demoAccounts, ...accounts].some((a) => a.email.toLowerCase() === email)) {
      return { ok: false as const, error: "Un compte existe déjà avec cet e-mail." };
    }
    const acc: StoredAccount = {
      id: crypto.randomUUID(), firstName: input.firstName, lastName: input.lastName, email,
      role: input.role, password: input.password, pending: input.role === "medecin",
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, acc]));
    const { password: _p, ...u } = acc;
    return { ok: true as const, user: u };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, ready, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
