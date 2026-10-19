import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/espace-medecin")({
  head: () => ({
    meta: [
      { title: "Espace Médecin · Clinic Copilot" },
      { name: "description", content: "Gérez votre agenda et vos patients." },
      { property: "og:title", content: "Espace Médecin · Clinic Copilot" },
      { property: "og:description", content: "Gérez votre agenda et vos patients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Espace Médecin" />,
});
