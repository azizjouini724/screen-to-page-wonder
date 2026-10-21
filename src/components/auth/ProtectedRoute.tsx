import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/data/auth";

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const allowed = ready && user?.role === role;

  useEffect(() => {
    if (ready && !allowed) {
      navigate({ to: "/connexion", search: { raison: user ? "role" : "auth" }, replace: true });
    }
  }, [ready, allowed, user, navigate]);

  if (!allowed) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Chargement" /></div>;
  }
  return <>{children}</>;
}
