import { Clock, FileText, MapPin, Star } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Doctor, PatientAppointment } from "@/data/appointments";
import { formatLongDate } from "@/lib/appointments";
import { AppointmentActions, DoctorAvatar, StatusPill, type CardActions } from "./AppointmentCard";

export function AppointmentDrawer({ a, doctor, onOpenChange, actions }: {
  a: PatientAppointment | null; doctor: Doctor | undefined; onOpenChange: (o: boolean) => void; actions: Omit<CardActions, "onOpen">;
}) {
  return (
    <Sheet open={!!a} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {a && doctor && (
          <>
            <SheetHeader className="text-left">
              <SheetTitle>Détail du rendez-vous</SheetTitle>
              <SheetDescription>Toutes les informations de votre consultation.</SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-soft p-4">
              <DoctorAvatar doctor={doctor} className="h-14 w-14" />
              <div className="min-w-0 flex-1"><p className="font-bold text-deep">{doctor.name}</p><p className="text-sm text-muted-foreground">{doctor.specialty}</p></div>
              <StatusPill status={a.status} />
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Date et heure</dt><dd className="font-semibold text-deep">{formatLongDate(a.start)} ({a.durationMin} min)</dd></div></div>
              <div className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Adresse</dt><dd className="font-semibold text-deep">{doctor.address}</dd></div></div>
              <div className="flex gap-3"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Motif</dt><dd className="font-semibold text-deep">{a.reason}</dd></div></div>
              {a.cancelReason && <div className="rounded-xl bg-destructive/10 p-3"><dt className="text-destructive">Motif d'annulation</dt><dd className="font-semibold text-deep">{a.cancelReason}</dd></div>}
              {a.review && (
                <div className="rounded-xl border border-border p-3">
                  <dt className="text-muted-foreground">Votre avis</dt>
                  <dd className="mt-1 flex gap-0.5" aria-label={`${a.review.rating} sur 5`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={n <= a.review!.rating ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4 text-border"} />)}</dd>
                  {a.review.comment && <dd className="mt-1 text-deep">{a.review.comment}</dd>}
                </div>
              )}
            </dl>
            <div className="mt-8"><AppointmentActions a={a} doctor={doctor} actions={actions} stacked /></div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
