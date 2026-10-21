import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SpaceHome } from "@/components/site/SpaceHome";

export const Route = createFileRoute("/espace-medecin")({
  head: () => ({
    meta: [
      { title: "Espace Médecin · Clinic Copilot" },
      { name: "description", content: "Gérez votre agenda et vos patients." },
      { property: "og:title", content: "Espace Médecin · Clinic Copilot" },
      { property: "og:description", content: "Gérez votre agenda et vos patients." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ProtectedRoute role="medecin"><SpaceHome /></ProtectedRoute>,
});
