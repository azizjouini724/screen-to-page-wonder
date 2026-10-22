import {
  Home, User, CalendarDays, MessageCircle, Bell, Compass, Settings, type LucideIcon,
} from "lucide-react";

export type PatientPath =
  | "/espace-patient" | "/espace-patient/profil" | "/espace-patient/rendez-vous" | "/espace-patient/messages"
  | "/espace-patient/rappels" | "/espace-patient/medecins" | "/espace-patient/parametres" | "/espace-patient/assistant";

export const sidebarLinks: { label: string; to: PatientPath; icon: LucideIcon }[] = [
  { label: "Accueil", to: "/espace-patient", icon: Home },
  { label: "Mon profil", to: "/espace-patient/profil", icon: User },
  { label: "Mes rendez-vous", to: "/espace-patient/rendez-vous", icon: CalendarDays },
  { label: "Messagerie", to: "/espace-patient/messages", icon: MessageCircle },
  { label: "Rappels", to: "/espace-patient/rappels", icon: Bell },
  { label: "Découvrir", to: "/espace-patient/medecins", icon: Compass },
  { label: "Paramètres", to: "/espace-patient/parametres", icon: Settings },
];

export const bottomLinks: { label: string; to: PatientPath; icon: LucideIcon }[] = [
  { label: "Accueil", to: "/espace-patient", icon: Home },
  { label: "Rendez-vous", to: "/espace-patient/rendez-vous", icon: CalendarDays },
  { label: "Chat", to: "/espace-patient/messages", icon: MessageCircle },
  { label: "Profil", to: "/espace-patient/profil", icon: User },
];

export const patientStats = {
  upcoming: 2,
  unreadMessages: 3,
  todayReminders: 1,
};

export const notificationCount = 4;

export type AppointmentStatus = "confirme" | "attente";
export type Appointment = {
  id: string; doctor: string; specialty: string; date: string; time: string; status: AppointmentStatus; tone: "primary" | "info" | "accent";
};

export const appointments: Appointment[] = [
  { id: "a1", doctor: "Dr. Amine Ben Ali", specialty: "Médecin généraliste", date: "Demain", time: "10:00", status: "confirme", tone: "primary" },
  { id: "a2", doctor: "Dr. Leila Mansouri", specialty: "Pneumologue", date: "Lun. 27 oct.", time: "14:30", status: "attente", tone: "info" },
  { id: "a3", doctor: "Dr. Youssef Trabelsi", specialty: "Médecin généraliste", date: "Mer. 5 nov.", time: "09:15", status: "confirme", tone: "accent" },
];

export const todayReminders = [
  { id: "r1", title: "Rendez-vous demain à 10:00", detail: "Dr. Amine Ben Ali · Cabinet El Menzah" },
  { id: "r2", title: "Rendez-vous de contrôle à planifier", detail: "Suivi recommandé par Dr. Leila Mansouri" },
];

export const defaultProfile = {
  phone: "+216 22 345 678",
  birthDate: "1992-04-14",
  allergies: ["Pénicilline", "Pollen"],
  history: ["Asthme léger"],
  treatments: ["Ventoline au besoin"],
  consentAssessments: true,
  consentReminders: true,
  language: "fr",
};

export const languages = [
  { value: "fr", label: "Français", enabled: true },
  { value: "ar", label: "Arabe", enabled: false },
  { value: "en", label: "Anglais", enabled: false },
];
