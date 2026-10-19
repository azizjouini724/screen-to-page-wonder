import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Inscription · Clinic Copilot" },
      { name: "description", content: "Créez votre compte Clinic Copilot." },
      { property: "og:title", content: "Inscription · Clinic Copilot" },
      { property: "og:description", content: "Créez votre compte Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Inscription" />,
});
