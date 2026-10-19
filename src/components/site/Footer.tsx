import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { navLinks } from "@/data/landing";

export function Footer() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo dark />
          <p className="mt-4 text-lg font-semibold">L'IA oriente, le médecin décide.</p>
          <p className="mt-2 text-sm text-deep-foreground/60">Orientation, pas un diagnostic. En cas d'urgence, appelez le 15 ou le 112.</p>
        </div>
        <nav aria-label="Liens du pied de page">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-tertiary">Découvrir</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => <li key={l.href}><a href={`/${l.href}`} className="text-deep-foreground/75 hover:text-deep-foreground">{l.label}</a></li>)}
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-tertiary">Espaces</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/espace-patient" className="text-deep-foreground/75 hover:text-deep-foreground">Espace Patient</Link></li>
            <li><Link to="/espace-medecin" className="text-deep-foreground/75 hover:text-deep-foreground">Espace Médecin</Link></li>
            <li><Link to="/espace-admin" className="text-deep-foreground/75 hover:text-deep-foreground">Espace Administrateur</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-deep-foreground/10 py-6 text-center text-xs text-deep-foreground/50">© 2026 Clinic Copilot. Tous droits réservés.</div>
    </footer>
  );
}
