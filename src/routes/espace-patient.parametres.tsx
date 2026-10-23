import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/parametres")({
  head: () => ({ meta: [{ title: "Paramètres · Espace Patient" }, { name: "description", content: "Gérez les préférences de votre compte." }, { property: "og:title", content: "Paramètres · Espace Patient" }, { property: "og:description", content: "Gérez les préférences de votre compte." }] }),
  component: () => <ComingSoon title="Paramètres" text="Gérez les préférences de votre compte." icon={Settings} />,
});
