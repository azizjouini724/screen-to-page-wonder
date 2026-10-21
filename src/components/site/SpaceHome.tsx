import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { roleLabels } from "@/data/auth";

export function SpaceHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-soft px-4 text-center">
      <img src={logo} alt="Clinic Copilot" width={695} height={572} className="h-24 w-auto" />
      <h1 className="mt-6 text-3xl font-bold text-deep sm:text-4xl">Bonjour, {user.firstName}</h1>
      <p className="mt-3 inline-flex rounded-full bg-soft px-4 py-1 text-sm font-semibold text-primary">{roleLabels[user.role]}</p>
      {user.pending && <p className="mt-3 text-sm text-muted-foreground">Votre compte est en attente de vérification.</p>}
      <Button variant="soft" className="mt-8" onClick={() => { logout(); navigate({ to: "/" }); }}><LogOut />Se déconnecter</Button>
    </main>
  );
}
