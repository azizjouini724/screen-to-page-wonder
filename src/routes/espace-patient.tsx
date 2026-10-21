import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SpaceHome } from "@/components/site/SpaceHome";

export const Route = createFileRoute("/espace-patient")({
  head: () => ({
    meta: [
      { title: "Espace Patient · Clinic Copilot" },
      { name: "description", content: "Votre espace patient Clinic Copilot." },
      { property: "og:title", content: "Espace Patient · Clinic Copilot" },
      { property: "og:description", content: "Votre espace patient Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ProtectedRoute role="patient"><SpaceHome /></ProtectedRoute>,
});
