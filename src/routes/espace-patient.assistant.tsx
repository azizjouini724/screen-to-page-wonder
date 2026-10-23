import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { ComingSoon } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/assistant")({
  head: () => ({ meta: [{ title: "Assistant IA · Espace Patient" }, { name: "description", content: "Décrivez vos symptômes pour recevoir une orientation prudente." }, { property: "og:title", content: "Assistant IA · Espace Patient" }, { property: "og:description", content: "Décrivez vos symptômes pour recevoir une orientation prudente." }] }),
  component: () => <ComingSoon title="Assistant IA" text="Décrivez vos symptômes pour recevoir une orientation prudente." icon={Bot} />,
});
