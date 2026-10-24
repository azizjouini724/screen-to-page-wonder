import { Link } from "@tanstack/react-router";
import { CalendarClock, CalendarPlus, Clock, MapPin, MessageCircle, RotateCcw, Star, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppointmentStatus, Doctor, PatientAppointment } from "@/data/appointments";
import { buildIcs, formatLongDate } from "@/lib/appointments";
import { cn } from "@/lib/utils";

export const statusMeta: Record<AppointmentStatus, { label: string; cls: string }> = {
  confirme: { label: "Confirmé", cls: "bg-success/15 text-success" },
  attente: { label: "En attente", cls: "bg-warning/20 text-accent-foreground" },
  termine: { label: "Terminé", cls: "bg-muted text-muted-foreground" },
  annule: { label: "Annulé", cls: "bg-destructive/10 text-destructive" },
};

const toneCls = { primary: "bg-primary/15 text-primary", info: "bg-info/15 text-info", accent: "bg-accent/20 text-accent-foreground" };

export function DoctorAvatar({ doctor, className }: { doctor: Doctor; className?: string }) {
  const ini = doctor.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold", toneCls[doctor.tone], className)} aria-hidden="true">{ini}</span>;
}

export function StatusPill({ status }: { status: AppointmentStatus }) {
  return <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", statusMeta[status].cls)}>{statusMeta[status].label}</span>;
}

export function downloadIcs(a: PatientAppointment, doctor: Doctor) {
  const blob = new Blob([buildIcs(a, doctor)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rendez-vous-${a.start.slice(0, 10)}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type CardActions = {
  onOpen: () => void;
  onCancel: () => void;
  onReschedule: () => void;
  onReview: () => void;
  onCalendar: () => void;
};

export function AppointmentActions({ a, doctor, actions, stacked }: { a: PatientAppointment; doctor: Doctor; actions: Omit<CardActions, "onOpen">; stacked?: boolean }) {
  const upcoming = a.status === "confirme" || a.status === "attente";
  const wrap = cn("flex flex-wrap gap-2", stacked && "flex-col items-stretch");
  if (upcoming) {
    return (
      <div className={wrap}>
        <Button size="sm" variant="soft" onClick={actions.onReschedule}><CalendarClock />Reporter</Button>
        <Button size="sm" variant="soft" onClick={actions.onCalendar}><CalendarPlus />Ajouter au calendrier</Button>
        <Button size="sm" variant="soft" asChild><Link to="/espace-patient/messages" search={{ medecin: doctor.id }}><MessageCircle />Écrire au médecin</Link></Button>
        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={actions.onCancel}><XCircle />Annuler</Button>
      </div>
    );
  }
  if (a.status === "termine") {
    return (
      <div className={wrap}>
        {a.review ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1.5 text-xs font-semibold text-primary">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />Avis envoyé ({a.review.rating}/5)
          </span>
        ) : (
          <Button size="sm" variant="hero" onClick={actions.onReview}><Star />Laisser un avis</Button>
        )}
        <Button size="sm" variant="soft" asChild><Link to="/espace-patient/medecins"><RotateCcw />Reprendre rendez-vous</Link></Button>
      </div>
    );
  }
  return (
    <div className={wrap}>
      <Button size="sm" variant="soft" asChild><Link to="/espace-patient/medecins"><RotateCcw />Reprendre rendez-vous</Link></Button>
    </div>
  );
}

export function AppointmentCard({ a, doctor, actions }: { a: PatientAppointment; doctor: Doctor; actions: CardActions }) {
  return (
    <article className="card-lift rounded-2xl border border-border bg-card p-5 shadow-soft">
      <button type="button" onClick={actions.onOpen} className="flex w-full items-start gap-4 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-label={`Voir le détail du rendez-vous avec ${doctor.name}`}>
        <DoctorAvatar doctor={doctor} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-deep">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
            <StatusPill status={a.status} />
          </div>
          <dl className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 text-deep"><Clock className="h-4 w-4 shrink-0 text-primary" /><dt className="sr-only">Date</dt><dd className="font-medium">{formatLongDate(a.start)}</dd></div>
            <div className="flex min-w-0 items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" /><dt className="sr-only">Adresse</dt><dd className="truncate">{doctor.address}</dd></div>
            <div className="text-muted-foreground sm:col-span-2"><dt className="inline font-medium text-deep">Motif : </dt><dd className="inline">{a.reason}</dd></div>
          </dl>
        </div>
      </button>
      <div className="mt-4 border-t border-border pt-4">
        <AppointmentActions a={a} doctor={doctor} actions={actions} />
      </div>
    </article>
  );
}
