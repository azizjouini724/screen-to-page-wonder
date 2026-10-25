import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Clock, Loader2, MapPin, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppointments } from "@/context/AppointmentsContext";
import type { Doctor } from "@/data/doctors";
import { formatLongDate } from "@/lib/appointments";

export function BookingDialog({ doctor, start, onOpenChange }: { doctor: Doctor; start: string | null; onOpenChange: (o: boolean) => void }) {
  const { book } = useAppointments();
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => { if (start) { setReason(""); setTouched(false); setError(null); setDone(false); } }, [start]);

  const invalid = reason.trim().length === 0;
  const confirm = async () => {
    setTouched(true);
    if (invalid || !start) return;
    setBusy(true); setError(null);
    const r = await book(doctor.id, start, reason);
    setBusy(false);
    if (!r.ok) { setError(r.error); return; }
    setDone(true);
    toast.success("Rendez-vous confirmé", { description: `${doctor.name} · ${formatLongDate(start)}` });
  };

  return (
    <Dialog open={!!start} onOpenChange={onOpenChange}>
      <DialogContent>
        {done && start ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <DialogTitle className="mt-4 text-xl">Rendez-vous confirmé</DialogTitle>
            <DialogDescription className="mt-2">{doctor.name} · {formatLongDate(start)}</DialogDescription>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button variant="hero" asChild><Link to="/espace-patient/rendez-vous">Voir mes rendez-vous</Link></Button>
              <Button variant="soft" asChild><Link to="/espace-patient/medecins">Retour aux médecins</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirmer le rendez-vous</DialogTitle>
              <DialogDescription>Vérifiez le récapitulatif avant de valider.</DialogDescription>
            </DialogHeader>
            <dl className="space-y-2 rounded-xl bg-soft p-4 text-sm">
              <div><dt className="sr-only">Médecin</dt><dd className="font-semibold text-deep">{doctor.name} <span className="font-normal text-muted-foreground">· {doctor.specialty}</span></dd></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><dt className="sr-only">Date</dt><dd className="font-medium text-deep">{start && formatLongDate(start)}</dd></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><dt className="sr-only">Adresse</dt><dd className="text-deep">{doctor.address}</dd></div>
            </dl>
            <div>
              <Label htmlFor="bk-reason">Motif de la consultation <span className="text-destructive">*</span></Label>
              <Textarea id="bk-reason" value={reason} maxLength={300} rows={3} onChange={(e) => setReason(e.target.value)} onBlur={() => setTouched(true)}
                aria-invalid={touched && invalid} aria-describedby={touched && invalid ? "bk-err" : undefined} className="mt-1.5 bg-card" placeholder="Ex. : toux persistante depuis une semaine" />
              {touched && invalid && <p id="bk-err" className="mt-1.5 text-sm font-medium text-destructive">Indiquez le motif de la consultation.</p>}
            </div>
            <p className="flex items-start gap-2 rounded-xl border border-destructive/20 p-3 text-sm text-muted-foreground"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />Cette plateforme ne remplace pas les services d'urgence.</p>
            {error && <p role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button variant="hero" onClick={confirm} disabled={busy}>{busy ? <><Loader2 className="animate-spin" />Réservation…</> : "Confirmer le rendez-vous"}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
