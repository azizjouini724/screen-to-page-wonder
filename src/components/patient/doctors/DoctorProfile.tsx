import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Banknote, Languages, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/patient/PatientCards";
import { sampleReviews, type Doctor } from "@/data/doctors";
import { DoctorInitials, Stars, VerifiedBadge } from "./DoctorBits";
import { SlotPicker } from "./SlotPicker";
import { BookingDialog } from "./BookingDialog";

export function DoctorProfile({ doctor }: { doctor: Doctor }) {
  const [start, setStart] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <Link to="/espace-patient/medecins" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Retour aux médecins</Link>

      <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
        <DoctorInitials doctor={doctor} className="h-20 w-20 text-xl" showOnline />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold text-deep">{doctor.name}</h1>{doctor.verified && <VerifiedBadge />}</div>
          <p className="text-muted-foreground">{doctor.specialty}</p>
          <p className="mt-1 flex items-center gap-2 text-sm"><Stars value={doctor.rating} /><span className="font-semibold text-deep">{doctor.rating.toLocaleString("fr-FR")}</span><span className="text-muted-foreground">({doctor.reviewsCount} avis)</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="hero" asChild><a href="#reserver">Réserver</a></Button>
          <Button variant="soft" asChild><Link to="/espace-patient/messages" search={{ medecin: doctor.id }}><MessageCircle />Écrire un message</Link></Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Panel title="À propos"><p className="text-muted-foreground">{doctor.bio}</p></Panel>
          <Panel title="Réserver un créneau" className="scroll-mt-24">
            <div id="reserver" className="scroll-mt-24"><SlotPicker doctorId={doctor.id} onPick={setStart} /></div>
          </Panel>
          <Panel title="Avis récents">
            <ul className="space-y-4">
              {sampleReviews.map((r) => (
                <li key={r.author} className="rounded-xl bg-soft/60 p-4">
                  <div className="flex items-center justify-between gap-2"><span className="font-semibold text-deep">{r.author}</span><span className="text-xs text-muted-foreground">{r.date}</span></div>
                  <Stars value={r.rating} />
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Langues parlées">
            <ul className="flex flex-wrap gap-2">{doctor.languages.map((l) => <li key={l} className="inline-flex items-center gap-1 rounded-full bg-soft px-3 py-1 text-sm font-medium text-primary"><Languages className="h-3.5 w-3.5" />{l}</li>)}</ul>
          </Panel>
          <Panel title="Adresse du cabinet">
            <div className="relative h-36 overflow-hidden rounded-xl bg-soft" aria-hidden="true">
              <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute left-1/4 top-0 h-full w-3 bg-card" /><div className="absolute left-0 top-1/2 h-3 w-full bg-card" />
              <MapPin className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-full fill-primary text-card" />
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-deep"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{doctor.address} · {doctor.distanceKm.toLocaleString("fr-FR")} km</p>
          </Panel>
          <Panel title="Tarif">
            <p className="flex items-center gap-2 text-deep"><Banknote className="h-5 w-5 text-primary" /><span className="text-2xl font-bold">{doctor.fee} DT</span><span className="text-sm text-muted-foreground">par consultation</span></p>
          </Panel>
        </div>
      </div>

      <BookingDialog doctor={doctor} start={start} onOpenChange={(o) => !o && setStart(null)} />
    </div>
  );
}
