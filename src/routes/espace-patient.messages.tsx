import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { ComingSoon } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/messages")({
  validateSearch: (s: Record<string, unknown>): { medecin?: string } => (typeof s["medecin"] === "string" ? { medecin: s["medecin"] } : {}),
  head: () => ({ meta: [{ title: "Messagerie · Espace Patient" }, { name: "description", content: "Échangez en toute sécurité avec vos médecins." }, { property: "og:title", content: "Messagerie · Espace Patient" }, { property: "og:description", content: "Échangez en toute sécurité avec vos médecins." }] }),
  component: () => <ComingSoon title="Messagerie" text="Échangez en toute sécurité avec vos médecins." icon={MessageCircle} />,
});
