import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SpaceHome } from "@/components/site/SpaceHome";

export const Route = createFileRoute("/espace-admin")({
  head: () => ({
    meta: [
      { title: "Espace Administrateur · Clinic Copilot" },
      { name: "description", content: "Supervisez et administrez Clinic Copilot." },
      { property: "og:title", content: "Espace Administrateur · Clinic Copilot" },
      { property: "og:description", content: "Supervisez et administrez Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ProtectedRoute role="admin"><SpaceHome /></ProtectedRoute>,
});
