import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/site/Reveal";
import { DoctorCard } from "@/components/patient/doctors/DoctorCard";
import { DoctorFilters, defaultFilters, type Filters } from "@/components/patient/doctors/DoctorFilters";
import { useAppointments } from "@/context/AppointmentsContext";
import { doctors } from "@/data/doctors";
import { nextAvailable, parseLocal, toDateKey } from "@/lib/appointments";

export const Route = createFileRoute("/espace-patient/medecins/")({
  head: () => ({ meta: [{ title: "Découvrir les médecins · Espace Patient" }, { name: "description", content: "Trouvez un médecin par spécialité, langue et disponibilité." }, { property: "og:title", content: "Découvrir les médecins · Espace Patient" }, { property: "og:description", content: "Trouvez et réservez le bon médecin." }] }),
  component: DoctorsPage,
});

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function DoctorsPage() {
  const { appointments, ready } = useAppointments();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const results = useMemo(() => {
    const today = toDateKey(new Date());
    const q = norm(filters.q.trim());
    const rows = doctors.map((d) => ({ d, next: nextAvailable(appointments, d.id) }))
      .filter(({ d, next }) =>
        (!q || norm(d.name).includes(q) || norm(d.specialty).includes(q)) &&
        (filters.specialty === "all" || d.specialty === filters.specialty) &&
        (filters.language === "all" || d.languages.includes(filters.language as never)) &&
        (!filters.today || next?.slice(0, 10) === today));
    return rows.sort((a, b) => {
      if (filters.sort === "note") return b.d.rating - a.d.rating;
      if (filters.sort === "disponibilite") return (a.next ? parseLocal(a.next).getTime() : Infinity) - (b.next ? parseLocal(b.next).getTime() : Infinity);
      return a.d.distanceKm - b.d.distanceKm;
    });
  }, [appointments, filters]);

  const isLoading = loading || !ready;

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-deep sm:text-3xl">Découvrir les médecins</h1>
        <p className="mt-1 text-muted-foreground">Trouvez le bon praticien selon votre besoin, votre langue et vos disponibilités.</p>
      </Reveal>
      <DoctorFilters value={filters} onChange={setFilters} />
      <p className="text-sm text-muted-foreground" aria-live="polite">{isLoading ? "Chargement…" : `${results.length} médecin${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}`}</p>
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex gap-4"><Skeleton className="h-14 w-14 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-1/3" /></div></div>
              <Skeleton className="h-3 w-3/4" /><div className="grid grid-cols-2 gap-2"><Skeleton className="h-9" /><Skeleton className="h-9" /></div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-primary/30 bg-card px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft text-primary"><SearchX className="h-7 w-7" /></span>
          <p className="mt-4 font-semibold text-deep">Aucun médecin ne correspond à votre recherche</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">Essayez d'élargir vos filtres ou de modifier votre recherche.</p>
          <Button variant="hero" className="mt-6" onClick={() => setFilters(defaultFilters)}>Réinitialiser les filtres</Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map(({ d, next }, i) => <Reveal key={d.id} delay={i * 50}><DoctorCard doctor={d} next={next} /></Reveal>)}
        </div>
      )}
    </div>
  );
}
