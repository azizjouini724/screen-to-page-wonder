import { describe, expect, it } from "vitest";
import { appointmentReminders, applyReminderState, medicationExamples, snoozeReminder, reminderSection } from "@/lib/reminders";
import { canDeleteAccount, defaultSettings, validNewPassword } from "@/lib/settings";
import type { PatientAppointment } from "@/data/appointments";

const appointment: PatientAppointment = { id: "a", doctorId: "d", start: "2026-11-04T10:00", durationMin: 30, reason: "Suivi", status: "confirme" };
describe("Rappels", () => {
  it("génère le rappel exactement 24 heures avant", () => {
    const reminders = appointmentReminders([appointment], () => "Médecin");
    expect(new Date(appointment.start).getTime() - new Date(reminders[0]?.due ?? "").getTime()).toBe(24 * 60 * 60000);
  });
  it("génère le rappel exactement 30 minutes avant", () => {
    const reminders = appointmentReminders([appointment], () => "Médecin");
    expect(new Date(appointment.start).getTime() - new Date(reminders[1]?.due ?? "").getTime()).toBe(30 * 60000);
  });
  it("supprime les rappels des rendez-vous annulés", () => expect(appointmentReminders([{ ...appointment, status: "annule" }], () => "Médecin")).toEqual([]));
  it("ne génère aucun rappel pour un rendez-vous en attente", () => expect(appointmentReminders([{ ...appointment, status: "attente" }], () => "Médecin")).toEqual([]));
  it("met à jour les dates après report sans reprendre l'état précédent", () => {
    const original = appointmentReminders([appointment], () => "Médecin");
    const moved = appointmentReminders([{ ...appointment, start: "2026-11-05T11:00" }], () => "Médecin");
    expect(new Date(moved[0]?.due ?? "").getTime() - new Date(original[0]?.due ?? "").getTime()).toBe(25 * 60 * 60000);
    expect(moved[0]?.id).not.toBe(original[0]?.id);
  });
  it("propose trois médicaments fictifs", () => expect(medicationExamples()).toHaveLength(3));
  it("reporte un rappel de 15 minutes", () => {
    const reminder = { id: "r", type: "medication" as const, title: "Traitement", detail: "", due: "2026-11-02T13:00:00Z" };
    const state = snoozeReminder(applyReminderState(reminder), new Date("2026-11-02T12:00:00Z"));
    expect(state.due).toBe("2026-11-02T13:15:00.000Z");
    expect(state.status).toBe("snoozed");
  });
  it("reporte un rappel en retard à 15 minutes après maintenant", () => {
    const reminder = applyReminderState({ id: "r", type: "medication", title: "", detail: "", due: "2026-11-02T08:00:00Z" });
    expect(snoozeReminder(reminder, new Date("2026-11-02T13:00:00Z")).due).toBe("2026-11-02T13:15:00.000Z");
  });
  it("classe un rappel fait dans Terminés", () => expect(reminderSection({ id: "r", type: "medication", title: "", detail: "", due: "2026-11-02T13:00:00Z", status: "done" })).toBe("done"));
});
describe("Paramètres", () => {
  it("initialise la plage silencieuse de 22:00 à 07:00", () => expect([defaultSettings.notifications.quietStart, defaultSettings.notifications.quietEnd]).toEqual(["22:00", "07:00"]));
  it("seul le français est actif", () => expect(defaultSettings.display.language).toBe("fr"));
  it("exige la deuxième étape pour supprimer", () => expect(canDeleteAccount(1, "SUPPRIMER")).toBe(false));
  it("exige le mot exact SUPPRIMER", () => { expect(canDeleteAccount(2, "supprimer")).toBe(false); expect(canDeleteAccount(2, "SUPPRIMER")).toBe(true); });
  it("refuse un nouveau mot de passe non confirmé", () => expect(validNewPassword("ancien", "Nouveau123", "autre")).toBe(false));
});