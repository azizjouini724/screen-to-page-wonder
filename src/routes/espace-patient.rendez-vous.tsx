import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { AppointmentTabs, useGroupedAppointments } from "@/components/patient/appointments/AppointmentTabs";
import { useAppointments } from "@/context/AppointmentsContext";

export const Route = createFileRoute("/espace-patient/rendez-vous")({
  head: () => ({ meta: [{ title: "Mes rendez-vous · Espace Patient" }, { name: "description", content: "Consultez, reportez ou annulez vos rendez-vous médicaux." }, { property: "og:title", content: "Mes rendez-vous · Espace Patient" }, { property: "og:description", content: "Consultez et gérez vos rendez-vous." }] }),
  component: Page,
});

function Page() {
  const { ready } = useAppointments();
  const { avenir } = useGroupedAppointments();
  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-deep sm:text-3xl">Mes rendez-vous</h1>
            <p className="mt-1 text-muted-foreground">{ready ? `${avenir.length} rendez-vous à venir` : "Chargement…"}</p>
          </div>
          <Button variant="hero" asChild><Link to="/espace-patient/medecins"><Plus />Nouveau rendez-vous</Link></Button>
        </div>
      </Reveal>
      <AppointmentTabs />
    </div>
  );
}
