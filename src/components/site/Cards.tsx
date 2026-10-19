import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/data/landing";

export function FeatureCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="card-lift h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-soft text-primary"><Icon className="h-6 w-6" /></div>
      <h3 className="font-semibold text-deep">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function StepCard({ n, icon: Icon, title, text }: { n: number; icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="card-lift relative h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">{n}</span>
        <Icon className="h-6 w-6 text-secondary" />
      </div>
      <h3 className="mt-5 font-semibold text-deep">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

const urgencyStyles: Record<UrgencyLevel, { badge: string; card: string }> = {
  urgence: { badge: "bg-destructive text-destructive-foreground", card: "border-destructive/40 bg-destructive/5" },
  urgent: { badge: "bg-warning text-accent-foreground", card: "border-warning/40 bg-warning/5" },
  courant: { badge: "bg-primary text-primary-foreground", card: "border-primary/30 bg-primary/5" },
  conseil: { badge: "bg-success text-deep", card: "border-success/40 bg-success/5" },
};
const urgencyLabels: Record<UrgencyLevel, string> = { urgence: "Urgence", urgent: "Urgent", courant: "Courant", conseil: "Conseil" };

export function UrgencyBadge({ level, className }: { level: UrgencyLevel; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", urgencyStyles[level].badge, className)}>{urgencyLabels[level]}</span>;
}

export function UrgencyCard({ level, icon: Icon, title, text }: { level: UrgencyLevel; icon: LucideIcon; title: string; text: string }) {
  return (
    <div className={cn("card-lift h-full rounded-2xl border-2 p-6", urgencyStyles[level].card)}>
      <div className={cn("mb-4 grid h-12 w-12 place-items-center rounded-xl", urgencyStyles[level].badge)}><Icon className="h-6 w-6" /></div>
      <h3 className="text-lg font-bold text-deep">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function RoleCard({ title, tagline, children }: { title: string; tagline: string; children: React.ReactNode }) {
  return (
    <div className="card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="bg-gradient-soft p-5">{children}</div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-deep">{title}</h3>
        <p className="mt-1 text-muted-foreground">{tagline}</p>
      </div>
    </div>
  );
}
