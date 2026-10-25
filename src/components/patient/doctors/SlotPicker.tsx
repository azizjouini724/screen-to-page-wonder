import { useState } from "react";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useAppointments } from "@/context/AppointmentsContext";
import { daySlots, isBookableDay, nextAvailable, parseLocal } from "@/lib/appointments";
import { cn } from "@/lib/utils";

export function SlotPicker({ doctorId, onPick }: { doctorId: string; onPick: (start: string) => void }) {
  const { appointments } = useAppointments();
  const [day, setDay] = useState<Date | undefined>(() => {
    const n = nextAvailable(appointments, doctorId);
    return n ? parseLocal(n) : new Date();
  });
  const slots = day ? daySlots(appointments, doctorId, day) : [];
  const freeCount = slots.filter((s) => s.free).length;

  return (
    <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
      <Calendar mode="single" locale={fr} selected={day} onSelect={setDay} disabled={(d) => !isBookableDay(d)}
        className="pointer-events-auto mx-auto rounded-xl border border-border bg-card p-3" />
      <div>
        <p className="mb-1 font-semibold text-deep">{day ? day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "Choisissez une date"}</p>
        <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">{day ? `${freeCount} créneau${freeCount > 1 ? "x" : ""} disponible${freeCount > 1 ? "s" : ""}` : ""}</p>
        {day && freeCount === 0 && <p className="mb-3 rounded-xl bg-muted p-4 text-sm text-muted-foreground">Aucun créneau libre ce jour-là. Essayez une autre date.</p>}
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4" aria-label="Créneaux">
          {slots.map((s) => (
            <li key={s.start}>
              <button type="button" disabled={!s.free} onClick={() => onPick(s.start)} aria-label={s.free ? `Réserver à ${s.time}` : `${s.time}, indisponible`}
                className={cn("w-full rounded-lg border py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ring",
                  s.free ? "border-primary/30 bg-card text-primary hover:bg-gradient-primary hover:text-primary-foreground" : "cursor-not-allowed border-border bg-muted text-muted-foreground/60 line-through")}>
                {s.time}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
