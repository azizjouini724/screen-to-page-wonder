import { Link } from "@tanstack/react-router";
import { CalendarCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/data/doctors";
import { availabilityLabel, DoctorInitials, Stars, VerifiedBadge } from "./DoctorBits";

export function DoctorCard({ doctor, next }: { doctor: Doctor; next: string | null }) {
  const av = availabilityLabel(next);
  return (
    <article className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <DoctorInitials doctor={doctor} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-deep">{doctor.name}</h3>
            {doctor.verified && <VerifiedBadge />}
          </div>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
            <Stars value={doctor.rating} /><span className="font-semibold text-deep">{doctor.rating.toLocaleString("fr-FR")}</span>
            <span className="text-muted-foreground">({doctor.reviewsCount} avis)</span>
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 shrink-0 text-primary" />{doctor.distanceKm.toLocaleString("fr-FR")} km · {doctor.city}</p>
        <p className={`flex items-center gap-2 font-medium ${av.cls}`}><CalendarCheck className="h-4 w-4 shrink-0" />{av.label}</p>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <Button variant="soft" asChild><Link to="/espace-patient/medecins/$id" params={{ id: doctor.id }}>Voir le profil</Link></Button>
        <Button variant="hero" asChild><Link to="/espace-patient/medecins/$id" params={{ id: doctor.id }} hash="reserver">Réserver</Link></Button>
      </div>
    </article>
  );
}
