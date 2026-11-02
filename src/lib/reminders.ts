import type { PatientAppointment } from "@/data/appointments";
import { parseLocal, toDateKey } from "@/lib/appointments";

export type Reminder = { id: string; type: "appointment" | "medication"; title: string; detail: string; due: string };
export type ReminderState = { status: "done" | "snoozed"; due?: string };
export type ReminderView = Reminder & { status: "todo" | "done" | "snoozed" };
export const MEDICATION_NOTICE = "Ces horaires viennent uniquement de votre médecin. L'assistant ne crée ni ne modifie aucun traitement.";

export function medicationExamples(now = new Date()): Reminder[] {
  return [
    { title: "Traitement A", hour: 8, detail: "Exemple fictif · prescription du médecin" },
    { title: "Traitement B", hour: 13, detail: "Exemple fictif · prescription du médecin" },
    { title: "Traitement C", hour: 20, detail: "Exemple fictif · prescription du médecin" },
  ].map((m, i) => ({ id: `medication-${toDateKey(now)}-${i}`, type: "medication", title: m.title, detail: m.detail, due: new Date(now.getFullYear(), now.getMonth(), now.getDate(), m.hour).toISOString() }));
}

export function appointmentReminders(appointments: PatientAppointment[], doctorName: (id: string) => string): Reminder[] {
  return appointments.filter(a => a.status === "confirme").flatMap(a => [1440, 30].map(minutes => ({
    id: `appointment-${a.id}-${a.start}-${minutes}`, type: "appointment" as const,
    title: `Rendez-vous ${minutes === 1440 ? "dans 24 h" : "dans 30 minutes"}`,
    detail: doctorName(a.doctorId), due: new Date(parseLocal(a.start).getTime() - minutes * 60000).toISOString(),
  })));
}

export function applyReminderState(reminder: Reminder, state?: ReminderState): ReminderView {
  return { ...reminder, due: state?.due ?? reminder.due, status: state?.status ?? "todo" };
}
export function snoozeReminder(reminder: ReminderView, now = new Date()): ReminderState {
  return { status: "snoozed", due: new Date(Math.max(now.getTime(), new Date(reminder.due).getTime()) + 15 * 60000).toISOString() };
}
export function reminderSection(reminder: ReminderView, now = new Date()) {
  if (reminder.status === "done") return "done";
  return new Date(reminder.due).getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() ? "today" : "upcoming";
}