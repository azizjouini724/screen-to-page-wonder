import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { ComingSoon } from "@/components/patient/PatientCards";

export const Route = createFileRoute("/espace-patient/medecins")({
  head: () => ({ meta: [{ title: "Découvrir les médecins · Espace Patient" }, { name: "description", content: "Trouvez le bon praticien selon votre besoin." }, { property: "og:title", content: "Découvrir les médecins · Espace Patient" }, { property: "og:description", content: "Trouvez le bon praticien selon votre besoin." }] }),
  component: () => <ComingSoon title="Découvrir les médecins" text="Trouvez le bon praticien selon votre besoin." icon={Compass} />,
});
