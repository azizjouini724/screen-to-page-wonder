export type { Doctor } from "./doctors";
export { doctors } from "./doctors";

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
  createdAt?: string;
};

/** Créneaux proposés : du lundi au vendredi, 09:00 à 16:30, toutes les 30 minutes. */
export const SLOT_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export const cancelReasons = [
  "Je ne suis plus disponible",
  "Je me sens mieux",
  "J'ai trouvé un autre créneau",
  "Autre raison",
];
