import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-soft px-4 text-center">
      <img src={logo} alt="Clinic Copilot" width={695} height={572} className="h-24 w-auto" />
      <h1 className="mt-6 text-3xl font-bold text-deep sm:text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">Cette page arrive bientôt.</p>
      <Button variant="soft" className="mt-8" asChild><Link to="/"><ArrowLeft />Retour à l'accueil</Link></Button>
    </main>
  );
}
