import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/rendez-vous")({
  head: () => ({ meta: [{ title: "Mes rendez-vous · Espace Patient" }, { name: "description", content: "Consultez et gérez vos rendez-vous." }, { property: "og:title", content: "Mes rendez-vous · Espace Patient" }, { property: "og:description", content: "Consultez et gérez vos rendez-vous." }] }),
  component: () => <ComingSoon title="Mes rendez-vous" text="Consultez et gérez vos rendez-vous." icon={CalendarDays} />,
});
