import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion · Clinic Copilot" },
      { name: "description", content: "Connectez-vous à votre compte Clinic Copilot." },
      { property: "og:title", content: "Connexion · Clinic Copilot" },
      { property: "og:description", content: "Connectez-vous à votre compte Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <PlaceholderPage title="Connexion" />,
});
