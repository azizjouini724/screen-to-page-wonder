import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bell, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import type { Appointment, PatientPath } from "@/data/patient";
import { cn } from "@/lib/utils";

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-bold text-deep">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function HeartIllustration() {
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--tertiary)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <circle cx="105" cy="92" r="78" fill="var(--card)" opacity="0.6" />
      <path d="M100 150 C40 112 30 70 55 50 C75 34 95 44 100 60 C105 44 125 34 145 50 C170 70 160 112 100 150Z" fill="url(#hg)" />
      <path d="M70 92 h18 l8 -16 l10 30 l8 -14 h18" fill="none" stroke="var(--card)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 40 c18 4 26 22 22 40 c-3 14 -14 22 -26 22" fill="none" stroke="var(--deep)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="146" cy="104" r="10" fill="var(--card)" stroke="var(--deep)" strokeWidth="5" />
      <circle cx="146" cy="40" r="5" fill="var(--deep)" />
      <circle cx="170" cy="32" r="5" fill="var(--deep)" />
    </svg>
  );
}

export function AssistantCard() {
  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-soft p-6 shadow-soft sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-tertiary/20 blur-2xl" />
        <div className="relative grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Assistant IA</p>
            <h2 className="mt-2 text-2xl font-bold text-deep sm:text-3xl">Comment vous sentez-vous ?</h2>
            <p className="mt-2 max-w-md text-muted-foreground">Décrivez vos symptômes et recevez une première orientation prudente.</p>
            <Button variant="hero" size="lg" className="mt-6" asChild><Link to="/espace-patient/assistant">Commencer <ArrowRight /></Link></Button>
          </div>
          <div className="mx-auto h-36 w-40 sm:h-44 sm:w-full"><HeartIllustration /></div>
        </div>
      </section>
    </Reveal>
  );
}

export function StatCard({ icon: Icon, label, value, hint, to, delay = 0 }: { icon: LucideIcon; label: string; value: number; hint: string; to: PatientPath; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link to={to} className="card-lift flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft focus-visible:outline-2 focus-visible:outline-ring">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-soft text-primary"><Icon className="h-6 w-6" /></span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-deep">{value} <span className="text-sm font-medium text-muted-foreground">{hint}</span></p>
        </div>
      </Link>
    </Reveal>
  );
}

const toneCls = { primary: "bg-primary/15 text-primary", info: "bg-info/15 text-info", accent: "bg-accent/20 text-accent-foreground" };

export function AppointmentItem({ a }: { a: Appointment }) {
  const ini = a.doctor.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors duration-200 hover:bg-soft/60 sm:gap-4">
      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold", toneCls[a.tone])}>{ini}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-deep">{a.doctor}</p>
        <p className="truncate text-sm text-muted-foreground">{a.specialty}</p>
      </div>
      <div className="hidden text-right text-sm sm:block">
        <p className="font-medium text-deep">{a.date}</p>
        <p className="flex items-center justify-end gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{a.time}</p>
      </div>
      <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", a.status === "confirme" ? "bg-success/15 text-success" : "bg-warning/20 text-accent-foreground")}>
        {a.status === "confirme" ? "Confirmé" : "En attente"}
      </span>
    </li>
  );
}

export function ReminderItem({ title, detail }: { title: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-soft/60 p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card text-primary"><Bell className="h-4 w-4" /></span>
      <div className="min-w-0"><p className="font-semibold text-deep">{title}</p><p className="text-sm text-muted-foreground">{detail}</p></div>
    </li>
  );
}

export function ComingSoon({ title, text, icon: Icon }: { title: string; text: string; icon: LucideIcon }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-deep sm:text-3xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">{text}</p>
      <Reveal className="mt-8">
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-primary/30 bg-card px-6 py-16 text-center shadow-soft">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-soft text-primary"><Icon className="h-8 w-8" /></span>
          <p className="mt-5 text-lg font-semibold text-deep">Bientôt disponible</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">Cette fonctionnalité arrive très prochainement dans votre espace.</p>
          <Button variant="soft" className="mt-6" asChild><Link to="/espace-patient">Retour à l'accueil</Link></Button>
        </div>
      </Reveal>
    </div>
  );
}

export function EmergencyNote() {
  return (
    <p className="mt-10 rounded-xl border border-destructive/20 bg-card px-4 py-3 text-center text-sm text-muted-foreground">
      <span className="font-semibold text-deep">Orientation, pas un diagnostic.</span> En cas d'urgence vitale, appelez le 190 (SAMU).
    </p>
  );
}
