import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CalendarCheck, CalendarDays, CalendarX, type LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { useAppointments } from "@/context/AppointmentsContext";
import type { PatientAppointment } from "@/data/appointments";
import { parseLocal } from "@/lib/appointments";
import { AppointmentCard, downloadIcs } from "./AppointmentCard";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { CancelDialog, RescheduleDialog, ReviewDialog } from "./Dialogs";

type TabKey = "avenir" | "termines" | "annules";

const empty: Record<TabKey, { icon: LucideIcon; title: string; text: string; cta: string }> = {
  avenir: { icon: CalendarDays, title: "Aucun rendez-vous à venir", text: "Trouvez un médecin et réservez un créneau en quelques secondes.", cta: "Prendre rendez-vous" },
  termines: { icon: CalendarCheck, title: "Aucun rendez-vous terminé", text: "Vos consultations passées apparaîtront ici.", cta: "Trouver un médecin" },
  annules: { icon: CalendarX, title: "Aucun rendez-vous annulé", text: "Tant mieux ! Vos annulations apparaîtraient ici.", cta: "Découvrir les médecins" },
};

function EmptyState({ k }: { k: TabKey }) {
  const { icon: Icon, title, text, cta } = empty[k];
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-primary/30 bg-card px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-soft text-primary"><Icon className="h-7 w-7" /></span>
      <p className="mt-4 font-semibold text-deep">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      <Button variant="hero" className="mt-6" asChild><Link to="/espace-patient/medecins">{cta}</Link></Button>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Chargement des rendez-vous">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/4" /><Skeleton className="h-3 w-2/3" /></div>
        </div>
      ))}
    </div>
  );
}

export function useGroupedAppointments() {
  const { appointments } = useAppointments();
  return useMemo(() => {
    const by = (dir: 1 | -1) => (x: PatientAppointment, y: PatientAppointment) => dir * (parseLocal(x.start).getTime() - parseLocal(y.start).getTime());
    return {
      avenir: appointments.filter((a) => a.status === "confirme" || a.status === "attente").sort(by(1)),
      termines: appointments.filter((a) => a.status === "termine").sort(by(-1)),
      annules: appointments.filter((a) => a.status === "annule").sort(by(-1)),
    };
  }, [appointments]);
}

export function AppointmentTabs() {
  const { ready, error, getDoctor, appointments } = useAppointments();
  const groups = useGroupedAppointments();
  const [tab, setTab] = useState<TabKey>("avenir");
  const [openId, setOpenId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const find = (id: string | null) => (id ? appointments.find((a) => a.id === id) ?? null : null);
  const opened = find(openId);

  const actionsFor = (a: PatientAppointment, fromDrawer = false) => ({
    onOpen: () => setOpenId(a.id),
    onCancel: () => { if (fromDrawer) setOpenId(null); setCancelId(a.id); },
    onReschedule: () => { if (fromDrawer) setOpenId(null); setRescheduleId(a.id); },
    onReview: () => { if (fromDrawer) setOpenId(null); setReviewId(a.id); },
    onCalendar: () => { const d = getDoctor(a.doctorId); if (d) downloadIcs(a, d); },
  });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "avenir", label: "À venir" }, { key: "termines", label: "Terminés" }, { key: "annules", label: "Annulés" },
  ];

  return (
    <>
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
        <TabsList className="h-auto w-full justify-start gap-1 rounded-full bg-card p-1 shadow-soft sm:w-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key} className="flex-1 gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground sm:flex-none">
              {t.label}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{ready ? groups[t.key].length : "–"}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-6">
            {error ? (
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>
            ) : !ready ? <Skeletons /> : groups[t.key].length === 0 ? <EmptyState k={t.key} /> : (
              <div className="space-y-4">
                {groups[t.key].map((a, i) => {
                  const d = getDoctor(a.doctorId);
                  return d ? <Reveal key={a.id} delay={i * 60}><AppointmentCard a={a} doctor={d} actions={actionsFor(a)} /></Reveal> : null;
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AppointmentDrawer a={opened} doctor={opened ? getDoctor(opened.doctorId) : undefined} onOpenChange={(o) => !o && setOpenId(null)} actions={opened ? actionsFor(opened, true) : actionsFor({} as PatientAppointment, true)} />
      <CancelDialog appointment={find(cancelId)} onOpenChange={(o) => !o && setCancelId(null)} />
      <RescheduleDialog appointment={find(rescheduleId)} onOpenChange={(o) => !o && setRescheduleId(null)} />
      <ReviewDialog appointment={find(reviewId)} onOpenChange={(o) => !o && setReviewId(null)} />
    </>
  );
}
