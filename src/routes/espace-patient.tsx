import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/espace-patient")({
  head: () => ({
    meta: [
      { title: "Espace Patient · Clinic Copilot" },
      { name: "description", content: "Votre espace patient Clinic Copilot." },
      { property: "og:title", content: "Espace Patient · Clinic Copilot" },
      { property: "og:description", content: "Votre espace patient Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Espace Patient" />,
});
