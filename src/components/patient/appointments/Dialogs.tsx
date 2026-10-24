import { useEffect, useState } from "react";
import { fr } from "date-fns/locale";
import { AlertCircle, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppointments } from "@/context/AppointmentsContext";
import { cancelReasons, type PatientAppointment } from "@/data/appointments";
import { formatLongDate, isBookableDay, parseLocal } from "@/lib/appointments";
import { cn } from "@/lib/utils";

type Props = { appointment: PatientAppointment | null; onOpenChange: (open: boolean) => void };

function ErrorLine({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <p role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{msg}</p>;
}

export function CancelDialog({ appointment, onOpenChange }: Props) {
  const { cancel, getDoctor } = useAppointments();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setReason(""); setError(null); }, [appointment?.id]);
  const doctor = appointment ? getDoctor(appointment.doctorId) : undefined;

  const confirm = async () => {
    if (!appointment) return;
    setBusy(true); setError(null);
    const r = await cancel(appointment.id, reason || undefined);
    setBusy(false);
    if (!r.ok) { setError(r.error); return; }
    toast.success("Rendez-vous annulé", { description: "Le créneau a été libéré." });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annuler ce rendez-vous ?</DialogTitle>
          <DialogDescription>{doctor?.name} · {appointment && formatLongDate(appointment.start)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm font-medium text-deep">Motif (facultatif)</p>
          <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
            {cancelReasons.map((r, i) => (
              <Label key={r} htmlFor={`cr-${i}`} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 font-normal hover:bg-soft/60 has-[[data-state=checked]]:border-primary">
                <RadioGroupItem id={`cr-${i}`} value={r} />{r}
              </Label>
            ))}
          </RadioGroup>
          <ErrorLine msg={error} />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Garder le rendez-vous</Button>
          <Button variant="destructive" className="rounded-full" onClick={confirm} disabled={busy}>
            {busy ? <><Loader2 className="animate-spin" />Annulation…</> : "Confirmer l'annulation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RescheduleDialog({ appointment, onOpenChange }: Props) {
  const { reschedule, slotsFor, getDoctor } = useAppointments();
  const [day, setDay] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setSlot(null); setError(null);
    setDay(appointment ? parseLocal(appointment.start) : undefined);
  }, [appointment?.id]);

  const doctor = appointment ? getDoctor(appointment.doctorId) : undefined;
  const slots = appointment && day ? slotsFor(appointment.doctorId, day, appointment.id).filter((s) => s !== appointment.start) : [];

  const confirm = async () => {
    if (!appointment || !slot) return;
    setBusy(true); setError(null);
    const r = await reschedule(appointment.id, slot);
    setBusy(false);
    if (!r.ok) { setError(r.error); setSlot(null); return; }
    toast.success("Rendez-vous reporté", { description: formatLongDate(slot) });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reporter le rendez-vous</DialogTitle>
          <DialogDescription>Choisissez un nouveau créneau avec {doctor?.name}. Actuel : {appointment && formatLongDate(appointment.start)}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
          <Calendar mode="single" locale={fr} selected={day} onSelect={(d) => { setDay(d); setSlot(null); }}
            disabled={(d) => !isBookableDay(d)} className="pointer-events-auto mx-auto rounded-xl border border-border p-3" />
          <div>
            <p className="mb-2 text-sm font-medium text-deep">{day ? day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "Choisissez une date"}</p>
            {day && slots.length === 0 && <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Aucun créneau disponible ce jour-là. Essayez une autre date.</p>}
            <div role="radiogroup" aria-label="Créneaux disponibles" className="grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={slot === s} onClick={() => setSlot(s)}
                  className={cn("rounded-lg border py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ring",
                    slot === s ? "border-primary bg-gradient-primary text-primary-foreground" : "border-border bg-card text-deep hover:border-primary/50")}>
                  {s.slice(11)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ErrorLine msg={error} />
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Fermer</Button>
          <Button variant="hero" onClick={confirm} disabled={!slot || busy}>
            {busy ? <><Loader2 className="animate-spin" />Report…</> : "Confirmer le nouveau créneau"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReviewDialog({ appointment, onOpenChange }: Props) {
  const { review, getDoctor } = useAppointments();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setRating(0); setComment(""); setError(null); }, [appointment?.id]);
  const doctor = appointment ? getDoctor(appointment.doctorId) : undefined;

  const submit = async () => {
    if (!appointment) return;
    if (rating < 1) { setError("Choisissez une note entre 1 et 5 étoiles."); return; }
    setBusy(true); setError(null);
    const r = await review(appointment.id, rating, comment);
    setBusy(false);
    if (!r.ok) { setError(r.error); return; }
    toast.success("Merci pour votre avis", { description: "Il aide les autres patients à bien choisir." });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Laisser un avis</DialogTitle>
          <DialogDescription>Votre consultation avec {doctor?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div role="radiogroup" aria-label="Note" className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)} onMouseEnter={() => setHover(n)}
                className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-ring">
                <Star className={cn("h-8 w-8 transition-colors duration-200", n <= (hover || rating) ? "fill-accent text-accent" : "text-border")} />
              </button>
            ))}
          </div>
          <div>
            <Label htmlFor="rv-comment">Commentaire (facultatif)</Label>
            <Textarea id="rv-comment" value={comment} maxLength={500} onChange={(e) => setComment(e.target.value)} className="mt-1.5 bg-card" rows={4} />
            <p className="mt-1.5 text-xs text-muted-foreground">N'écrivez aucune information médicale confidentielle.</p>
          </div>
          <ErrorLine msg={error} />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Fermer</Button>
          <Button variant="hero" onClick={submit} disabled={busy}>{busy ? <><Loader2 className="animate-spin" />Envoi…</> : "Envoyer mon avis"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
