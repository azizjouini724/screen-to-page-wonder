import { BadgeCheck, Star } from "lucide-react";
import type { Doctor } from "@/data/doctors";
import { parseLocal, toDateKey } from "@/lib/appointments";
import { cn } from "@/lib/utils";

const toneCls = { primary: "bg-primary/15 text-primary", info: "bg-info/15 text-info", accent: "bg-accent/20 text-accent-foreground" };

export function DoctorInitials({ doctor, className, showOnline }: { doctor: Doctor; className?: string; showOnline?: boolean }) {
  const ini = doctor.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span className={cn("relative grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-bold", toneCls[doctor.tone], className)} aria-hidden="true">
      {ini}
      {showOnline && <span className={cn("absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card", doctor.online ? "bg-success" : "bg-muted-foreground/50")} />}
    </span>
  );
}

export function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Note ${value.toLocaleString("fr-FR")} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn(size, n <= Math.round(value) ? "fill-accent text-accent" : "text-border")} aria-hidden="true" />)}
    </span>
  );
}

export function VerifiedBadge() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"><BadgeCheck className="h-3.5 w-3.5" />Vérifié</span>;
}

export function availabilityLabel(next: string | null, now = new Date()) {
  if (!next) return { label: "Aucune disponibilité sous 14 jours", cls: "text-muted-foreground" };
  const today = toDateKey(now);
  const tomorrow = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  const key = next.slice(0, 10);
  if (key === today) return { label: `Disponible aujourd'hui à ${next.slice(11)}`, cls: "text-success" };
  if (key === tomorrow) return { label: `Disponible demain à ${next.slice(11)}`, cls: "text-primary" };
  const d = parseLocal(next).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return { label: `Disponible le ${d}`, cls: "text-muted-foreground" };
}
