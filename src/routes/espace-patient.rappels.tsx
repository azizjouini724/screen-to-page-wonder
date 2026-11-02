import { createFileRoute } from "@tanstack/react-router";
import { ReminderList } from "@/components/patient/reminders/ReminderList";
import { EmergencyNote } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/rappels")({
  head: () => ({ meta: [{ title: "Rappels · Clinic Copilot" }, { name: "description", content: "Vos rappels de rendez-vous et de traitements prescrits." }, { property: "og:title", content: "Rappels · Clinic Copilot" }, { property: "og:description", content: "Vos rappels de rendez-vous et de traitements prescrits." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <><ReminderList /><EmergencyNote /></>,
});
