export type Doctor = {
  id: string; name: string; specialty: string; address: string; tone: "primary" | "info" | "accent";
};

export const doctors: Doctor[] = [
  { id: "d-benali", name: "Dr. Amine Ben Ali", specialty: "Médecin généraliste", address: "12 rue de Marseille, El Menzah, Tunis", tone: "primary" },
  { id: "d-mansouri", name: "Dr. Leila Mansouri", specialty: "Pneumologue", address: "45 avenue Habib Bourguiba, Tunis", tone: "info" },
  { id: "d-trabelsi", name: "Dr. Youssef Trabelsi", specialty: "Médecin généraliste", address: "8 rue du Lac Léman, Les Berges du Lac", tone: "accent" },
];

export type AppointmentStatus = "confirme" | "attente" | "termine" | "annule";

export type Review = { rating: number; comment: string; createdAt: string };

export type PatientAppointment = {
  id: string;
  doctorId: string;
  /** Local date-time "YYYY-MM-DDTHH:mm" */
  start: string;
  durationMin: number;
  reason: string;
  status: AppointmentStatus;
  cancelReason?: string;
  review?: Review;
};

/** Créneaux proposés : du lundi au vendredi, 09:00 à 16:30, toutes les 30 minutes. */
export const SLOT_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export const cancelReasons = [
  "Je ne suis plus disponible",
  "Je me sens mieux",
  "J'ai trouvé un autre créneau",
  "Autre raison",
];
