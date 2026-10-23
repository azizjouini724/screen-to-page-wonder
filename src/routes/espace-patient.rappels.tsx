import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ComingSoon } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/rappels")({
  head: () => ({ meta: [{ title: "Rappels · Espace Patient" }, { name: "description", content: "Vos rappels de rendez-vous et de traitements." }, { property: "og:title", content: "Rappels · Espace Patient" }, { property: "og:description", content: "Vos rappels de rendez-vous et de traitements." }] }),
  component: () => <ComingSoon title="Rappels" text="Vos rappels de rendez-vous et de traitements." icon={Bell} />,
});
