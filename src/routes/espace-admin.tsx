import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/espace-admin")({
  head: () => ({
    meta: [
      { title: "Espace Administrateur · Clinic Copilot" },
      { name: "description", content: "Supervisez et administrez Clinic Copilot." },
      { property: "og:title", content: "Espace Administrateur · Clinic Copilot" },
      { property: "og:description", content: "Supervisez et administrez Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Espace Administrateur" />,
});
