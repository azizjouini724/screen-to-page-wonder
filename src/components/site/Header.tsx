import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { navLinks } from "@/data/landing";
import { useAuth } from "@/context/AuthContext";
import { roleHome } from "@/lib/auth";

function AuthActions({ mobile }: { mobile?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (user) {
    return (
      <>
        <span className={mobile ? "col-span-2 text-sm text-muted-foreground" : "text-sm text-muted-foreground"}>Bonjour, <span className="font-semibold text-deep">{user.firstName}</span></span>
        <Button variant="hero" asChild><Link to={roleHome[user.role]}>Mon espace</Link></Button>
        <Button variant="soft" onClick={() => { logout(); navigate({ to: "/" }); }}><LogOut />Se déconnecter</Button>
      </>
    );
  }
  return (
    <>
      <Button variant={mobile ? "soft" : "ghost"} asChild><Link to="/connexion">Se connecter</Link></Button>
      <Button variant="hero" asChild><Link to="/inscription">Commencer</Link></Button>
    </>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navLinks.map((l) => (
            <a key={l.href} href={`/${l.href}`} className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">{l.label}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex"><AuthActions /></div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {navLinks.map((l) => (
              <a key={l.href} href={`/${l.href}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium text-foreground hover:bg-soft">{l.label}</a>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3"><AuthActions mobile /></div>
        </div>
      )}
    </header>
  );
}
