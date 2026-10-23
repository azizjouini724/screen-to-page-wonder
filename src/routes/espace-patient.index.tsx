import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CalendarDays, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Reveal } from "@/components/site/Reveal";
import { AppointmentItem, AssistantCard, EmergencyNote, Panel, ReminderItem, StatCard } from "@/components/patient/PatientCards";
import { appointments, patientStats, todayReminders } from "@/data/patient";

export const Route = createFileRoute("/espace-patient/")({
  head: () => ({ meta: [{ title: "Accueil · Espace Patient" }, { name: "description", content: "Votre tableau de bord patient Clinic Copilot." }, { property: "og:title", content: "Accueil · Espace Patient" }, { property: "og:description", content: "Votre tableau de bord patient Clinic Copilot." }] }),
  component: PatientHome,
});

function PatientHome() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-deep sm:text-3xl">Bonjour, {user?.firstName}</h1>
          <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">Patient</span>
        </div>
        <p className="mt-1 text-muted-foreground">Prenez soin de vous, on est là pour vous guider.</p>
      </Reveal>

      <AssistantCard />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarDays} label="Prochains rendez-vous" value={patientStats.upcoming} hint="à venir" to="/espace-patient/rendez-vous" />
        <StatCard icon={MessageCircle} label="Messages non lus" value={patientStats.unreadMessages} hint="nouveaux" to="/espace-patient/messages" delay={80} />
        <StatCard icon={Bell} label="Rappels du jour" value={patientStats.todayReminders} hint="à faire" to="/espace-patient/rappels" delay={160} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Reveal>
          <Panel title="Vos prochains rendez-vous" action={<Link to="/espace-patient/rendez-vous" className="text-sm font-semibold text-primary hover:underline">Voir tout</Link>}>
            <ul className="space-y-3">{appointments.map((a) => <AppointmentItem key={a.id} a={a} />)}</ul>
          </Panel>
        </Reveal>
        <Reveal delay={100}>
          <Panel title="Rappels du jour">
            <ul className="space-y-3">{todayReminders.map((r) => <ReminderItem key={r.id} title={r.title} detail={r.detail} />)}</ul>
          </Panel>
        </Reveal>
      </div>

      <EmergencyNote />
    </div>
  );
}
