import { createFileRoute, notFound } from "@tanstack/react-router";
import { DoctorProfile } from "@/components/patient/doctors/DoctorProfile";
import { doctors } from "@/data/doctors";

export const Route = createFileRoute("/espace-patient/medecins/$id")({
  loader: ({ params }) => {
    const doctor = doctors.find((d) => d.id === params.id);
    if (!doctor) throw notFound();
    return { doctor };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.doctor.name} · Clinic Copilot` }, { name: "description", content: `${loaderData.doctor.specialty} à ${loaderData.doctor.city}. Réservez un créneau en ligne.` }, { property: "og:title", content: `${loaderData.doctor.name} · Clinic Copilot` }, { property: "og:description", content: loaderData.doctor.bio }]
      : [{ title: "Médecin introuvable · Clinic Copilot" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <p className="rounded-2xl bg-card p-8 text-center text-muted-foreground">Ce médecin est introuvable.</p>,
  component: () => <DoctorProfile doctor={Route.useLoaderData().doctor} />,
});
