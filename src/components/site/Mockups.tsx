import type { ReactNode } from "react";
import {
  Bot, CalendarDays, MessageCircle, Bell, Home, User, Search, Star, Send, Users, Activity,
  LayoutDashboard, Shield, Settings, Stethoscope, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { patientAppointments, doctorAgenda, doctorsList } from "@/data/landing";
import { UrgencyBadge } from "./Cards";
import logo from "@/assets/logo.png";

export function PhoneMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-[220px] shrink-0 rounded-[2.2rem] bg-deep p-2 shadow-soft", className)}>
      <div className="relative h-[440px] overflow-hidden rounded-[1.8rem] bg-background">
        <div className="flex items-center justify-between px-5 pt-2.5 text-[10px] font-semibold text-deep">
          <span>9:41</span><span className="h-4 w-16 rounded-full bg-deep" /><span>100%</span>
        </div>
        <div className="h-full px-3 pt-2 text-deep">{children}</div>
      </div>
    </div>
  );
}

export function LaptopMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-t-2xl border-[10px] border-b-0 border-deep bg-deep">
        <div className="aspect-[16/10] overflow-hidden rounded-md bg-background">{children}</div>
      </div>
      <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-2xl bg-deep-muted" />
    </div>
  );
}

/* ---------- Patient dashboard (laptop) ---------- */
export function DashboardPreview() {
  const side = [LayoutDashboard, Bot, CalendarDays, MessageCircle, Bell, Settings];
  return (
    <div className="flex h-full text-[11px] text-deep">
      <aside className="flex w-12 flex-col items-center gap-3 bg-deep py-3 sm:w-36 sm:items-stretch sm:px-3">
        <div className="flex items-center gap-1.5 text-deep-foreground"><img src={logo} alt="" className="h-6 w-6 rounded bg-card p-0.5" /><span className="hidden font-bold sm:inline">Clinic Copilot</span></div>
        {["Accueil", "Assistant IA", "Rendez-vous", "Messages", "Rappels", "Paramètres"].map((l, i) => {
          const I = side[i]!;
          return <div key={l} className={cn("flex items-center gap-2 rounded-md p-1.5 text-deep-foreground/70", i === 0 && "bg-primary text-primary-foreground")}><I className="h-3.5 w-3.5 shrink-0" /><span className="hidden sm:inline">{l}</span></div>;
        })}
      </aside>
      <div className="flex-1 space-y-2.5 overflow-hidden p-3 sm:p-4">
        <div>
          <p className="text-sm font-bold sm:text-base">Bonjour, Sarah</p>
          <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-gradient-primary p-2.5 text-primary-foreground">
          <Bot className="h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1"><p className="font-semibold">Assistant IA</p><p className="truncate opacity-85">Décrivez vos symptômes pour être orienté</p></div>
          <span className="rounded-full bg-card px-2 py-0.5 font-semibold text-primary">Démarrer</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-border bg-card p-2.5">
            <p className="mb-1.5 font-semibold">Prochains rendez-vous</p>
            {patientAppointments.map((a) => (
              <div key={a.doctor} className="mb-1.5 flex items-center gap-1.5"><CalendarDays className="h-3 w-3 shrink-0 text-primary" /><div className="min-w-0"><p className="truncate font-medium">{a.doctor}</p><p className="truncate text-muted-foreground">{a.date}</p></div></div>
            ))}
          </div>
          <div className="space-y-2.5">
            <div className="rounded-xl border border-border bg-card p-2.5"><p className="font-semibold">Messages</p><p className="text-muted-foreground"><span className="font-semibold text-primary">2</span> nouveaux messages</p></div>
            <div className="rounded-xl border border-border bg-card p-2.5"><p className="font-semibold">Rappels</p><p className="text-muted-foreground">Vitamine D, 20:00</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Phone screens ---------- */
export function PhonePatientHome() {
  return (
    <div className="space-y-2.5 text-[10px]">
      <p className="text-sm font-bold">Bonjour, Sarah</p>
      <div className="rounded-xl bg-gradient-primary p-2.5 text-primary-foreground"><Bot className="mb-1 h-4 w-4" /><p className="font-semibold">Assistant IA</p><p className="opacity-85">Comment puis-je vous aider ?</p></div>
      <p className="font-semibold">Prochains rendez-vous</p>
      {patientAppointments.map((a) => (
        <div key={a.doctor} className="rounded-lg border border-border bg-card p-2"><p className="font-semibold">{a.doctor}</p><p className="text-muted-foreground">{a.specialty} · {a.date}</p></div>
      ))}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-soft p-2"><MessageCircle className="h-3.5 w-3.5 text-primary" /><p className="mt-1 font-semibold">Messages</p></div>
        <div className="rounded-lg bg-soft p-2"><Bell className="h-3.5 w-3.5 text-primary" /><p className="mt-1 font-semibold">Rappels</p></div>
      </div>
      <PhoneNav />
    </div>
  );
}

function PhoneNav() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-border bg-card py-2.5 text-muted-foreground">
      <Home className="h-4 w-4 text-primary" /><CalendarDays className="h-4 w-4" /><MessageCircle className="h-4 w-4" /><User className="h-4 w-4" />
    </div>
  );
}

export function PhoneLogin() {
  return (
    <div className="flex flex-col items-center pt-8 text-[10px]">
      <img src={logo} alt="" className="h-16 w-16 object-contain" />
      <p className="mt-2 text-sm font-bold">Clinic Copilot</p>
      <p className="text-muted-foreground">Votre santé, guidée intelligemment</p>
      <div className="mt-6 w-full space-y-2">
        <div className="rounded-lg border border-border bg-card p-2.5 text-muted-foreground">sarah@email.fr</div>
        <div className="rounded-lg border border-border bg-card p-2.5 text-muted-foreground">••••••••</div>
        <div className="rounded-full bg-gradient-primary p-2.5 text-center font-semibold text-primary-foreground">Se connecter</div>
        <p className="pt-2 text-center text-muted-foreground">Pas de compte ? <span className="font-semibold text-primary">S'inscrire</span></p>
      </div>
    </div>
  );
}

export function PhoneChat() {
  return (
    <div className="flex h-[400px] flex-col text-[10px]">
      <div className="mb-2 flex items-center justify-center gap-1.5 font-semibold"><Bot className="h-4 w-4 text-primary" /> Assistant IA</div>
      <div className="flex-1 space-y-2">
        <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-soft p-2">Bonjour ! Quels symptômes ressentez-vous ?</div>
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-primary p-2 text-primary-foreground">J'ai de la fièvre depuis 3 jours.</div>
        <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-soft p-2">Avez-vous des difficultés à respirer ?</div>
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-primary p-2 text-primary-foreground">Non, juste de la fatigue.</div>
        <div className="rounded-xl border border-warning/50 bg-warning/10 p-2">
          <p className="font-semibold">Résultat de l'orientation</p>
          <UrgencyBadge level="urgent" className="mt-1" />
          <p className="mt-1 text-muted-foreground">Consultez sous 24 h.</p>
        </div>
      </div>
      <div className="mb-3 flex items-center gap-1.5 rounded-full border border-border bg-card p-1.5 pl-3 text-muted-foreground">Écrire un message <Send className="ml-auto h-4 w-4 rounded-full bg-primary p-0.5 text-primary-foreground" /></div>
    </div>
  );
}

export function PhoneDoctors() {
  return (
    <div className="space-y-2 text-[10px]">
      <p className="text-sm font-bold">Médecins</p>
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-2 text-muted-foreground"><Search className="h-3.5 w-3.5" /> Spécialité, nom…</div>
      {doctorsList.map((d) => (
        <div key={d.name} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-soft text-primary"><Stethoscope className="h-3.5 w-3.5" /></span>
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{d.name}</p><p className="text-muted-foreground">{d.specialty}</p></div>
          <span className="flex items-center gap-0.5 font-semibold"><Star className="h-3 w-3 fill-accent text-accent" />{d.rating}</span>
        </div>
      ))}
      <PhoneNav />
    </div>
  );
}

/* ---------- Role previews ---------- */
export function PatientMini() {
  return (
    <div className="space-y-2 rounded-xl bg-card p-3 text-xs shadow-soft">
      <p className="font-bold text-deep">Bonjour, Sarah</p>
      <div className="flex items-center gap-2 rounded-lg bg-gradient-primary p-2 text-primary-foreground"><Bot className="h-4 w-4" /> Décrire mes symptômes</div>
      <div className="rounded-lg border border-border p-2"><p className="font-semibold text-deep">Dr. Karim Haddad</p><p className="text-muted-foreground">Demain, 10:00</p></div>
    </div>
  );
}

export function DoctorMini() {
  return (
    <div className="space-y-2 rounded-xl bg-card p-3 text-xs shadow-soft">
      <div className="grid grid-cols-3 gap-1.5 text-center">
        {[["RDV", "14"], ["Urgents", "2"], ["Occup.", "86%"]].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-soft p-1.5"><p className="text-base font-bold text-primary">{v}</p><p className="text-muted-foreground">{l}</p></div>
        ))}
      </div>
      {doctorAgenda.map((a) => (
        <div key={a.time} className="flex items-center gap-2 rounded-lg border border-border p-1.5"><span className="font-semibold text-deep">{a.time}</span><span className="min-w-0 flex-1 truncate text-muted-foreground">{a.patient}</span><UrgencyBadge level={a.level} /></div>
      ))}
    </div>
  );
}

export function AdminMini() {
  return (
    <div className="space-y-2 rounded-xl bg-card p-3 text-xs shadow-soft">
      <div className="grid grid-cols-3 gap-1.5 text-center">
        {[[Users, "1 240"], [Stethoscope, "48"], [Shield, "100%"]].map(([I, v], i) => {
          const Ic = I as typeof Users;
          return <div key={i} className="rounded-lg bg-soft p-1.5"><Ic className="mx-auto h-3.5 w-3.5 text-primary" /><p className="font-bold text-deep">{v as string}</p></div>;
        })}
      </div>
      <div className="rounded-lg border border-border p-2">
        <p className="mb-1.5 flex items-center gap-1 font-semibold text-deep"><BarChart3 className="h-3.5 w-3.5 text-primary" />Activité</p>
        <div className="flex h-12 items-end gap-1">{[40, 65, 50, 80, 60, 90, 75].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-primary" style={{ height: `${h}%` }} />)}</div>
      </div>
      <p className="flex items-center gap-1 text-muted-foreground"><Activity className="h-3.5 w-3.5 text-success" />Tous les services opérationnels</p>
    </div>
  );
}
