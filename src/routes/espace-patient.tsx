import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PatientLayout } from "@/components/patient/PatientLayout";

export const Route = createFileRoute("/espace-patient")({
  head: () => ({
    meta: [
      { title: "Espace Patient · Clinic Copilot" },
      { name: "description", content: "Votre espace patient Clinic Copilot : assistant IA, rendez-vous, messages et rappels." },
      { property: "og:title", content: "Espace Patient · Clinic Copilot" },
      { property: "og:description", content: "Votre espace patient Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <ProtectedRoute role="patient">
      <PatientLayout><Outlet /></PatientLayout>
    </ProtectedRoute>
  ),
});
