import type { ReactNode } from "react";
import { Brain, CalendarCheck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/Logo";

const points = [
  { icon: Brain, title: "Orientation par l'IA", text: "Une évaluation prudente de vos symptômes." },
  { icon: CalendarCheck, title: "Rendez-vous faciles", text: "Le bon médecin, au bon moment." },
  { icon: ShieldCheck, title: "Données protégées", text: "Chiffrées et partagées avec votre accord." },
];

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-deep p-12 text-deep-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-tertiary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <Logo dark className="relative" />
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">De vos symptômes, <span className="text-tertiary">vers les bons soins.</span></h2>
          <ul className="mt-10 space-y-6">
            {points.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-deep-muted text-tertiary"><Icon className="h-5 w-5" /></span>
                <div><p className="font-semibold">{title}</p><p className="text-sm text-deep-foreground/70">{text}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-deep-foreground/50">L'IA oriente, le médecin décide.</p>
      </aside>
      <main className="flex items-start justify-center bg-gradient-soft px-4 py-10 sm:px-8 lg:items-center">
        <div className="w-full max-w-lg">
          <Logo className="mb-8 lg:hidden" />
          <h1 className="text-3xl font-bold tracking-tight text-deep">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
