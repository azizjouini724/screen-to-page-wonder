import { createFileRoute } from "@tanstack/react-router";
import { SettingsTabs } from "@/components/patient/settings/SettingsTabs";
import { EmergencyNote } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/parametres")({
  head: () => ({ meta: [{ title: "Paramètres · Clinic Copilot" }, { name: "description", content: "Gérez vos notifications, votre confidentialité et votre sécurité dans Clinic Copilot." }, { property: "og:title", content: "Paramètres · Clinic Copilot" }, { property: "og:description", content: "Gérez vos notifications, votre confidentialité et votre sécurité dans Clinic Copilot." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <><SettingsTabs /><EmergencyNote /></>,
});
