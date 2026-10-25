import { describe, expect, it } from "vitest";
import type { PatientAppointment } from "@/data/appointments";
import { addReview, availableSlots, buildIcs, cancelAppointment, demoAppointments, rescheduleAppointment } from "@/lib/appointments";
import { doctors } from "@/data/appointments";

const now = new Date(2026, 9, 23, 12, 0); // vendredi 23 oct. 2026
const base = (): PatientAppointment[] => [
  { id: "a", doctorId: "d1", start: "2026-10-27T10:00", durationMin: 30, reason: "x", status: "confirme" },
  { id: "b", doctorId: "d1", start: "2026-10-27T10:30", durationMin: 30, reason: "y", status: "confirme" },
  { id: "c", doctorId: "d1", start: "2026-10-01T09:00", durationMin: 30, reason: "z", status: "termine" },
];

describe("rendez-vous", () => {
  it("les démos contiennent 2 à venir, 1 terminé, 1 annulé", () => {
    const s = demoAppointments(now).map((a) => a.status);
    expect(s.filter((x) => x === "confirme" || x === "attente")).toHaveLength(2);
    expect(s.filter((x) => x === "termine")).toHaveLength(1);
    expect(s.filter((x) => x === "annule")).toHaveLength(1);
  });

  it("refuse de reporter sur un créneau déjà réservé du même médecin", () => {
    const r = rescheduleAppointment(base(), "a", "2026-10-27T10:30", now);
    expect(r.ok).toBe(false);
  });

  it("le report libère l'ancien créneau et réserve le nouveau", () => {
    const r = rescheduleAppointment(base(), "a", "2026-10-28T09:00", now);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const day = new Date(2026, 9, 27);
    expect(availableSlots(r.list, "d1", day, now)).toContain("2026-10-27T10:00");
    expect(availableSlots(r.list, "d1", new Date(2026, 9, 28), now)).not.toContain("2026-10-28T09:00");
  });

  it("l'annulation rend le créneau à nouveau disponible", () => {
    const r = cancelAppointment(base(), "b", "Je me sens mieux");
    expect(r.ok && r.list.find((a) => a.id === "b")?.status).toBe("annule");
    if (r.ok) expect(availableSlots(r.list, "d1", new Date(2026, 9, 27), now)).toContain("2026-10-27T10:30");
  });

  it("aucun créneau le week-end", () => {
    expect(availableSlots([], "d1", new Date(2026, 9, 25), now)).toEqual([]);
  });

  it("un seul avis, uniquement pour un rendez-vous terminé", () => {
    expect(addReview(base(), "a", 5, "").ok).toBe(false);
    const r = addReview(base(), "c", 4, "Très bien");
    expect(r.ok).toBe(true);
    if (r.ok) expect(addReview(r.list, "c", 5, "").ok).toBe(false);
  });

  it("le fichier .ics contient l'événement et l'heure de début", () => {
    const ics = buildIcs(base()[0]!, doctors[0]!, now);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART:20261027T100000");
    expect(ics).toContain("DTEND:20261027T103000");
  });
});

describe("réservation", () => {
  it("une réservation est confirmée et le créneau n'est plus proposé", async () => {
    const { bookAppointment } = await import("@/lib/appointments");
    const r = bookAppointment([], { id: "n", doctorId: "d1", start: "2026-10-27T11:00", reason: "Toux" }, now);
    expect(r.ok && r.list[0]?.status).toBe("confirme");
    if (r.ok) {
      expect(availableSlots(r.list, "d1", new Date(2026, 9, 27), now)).not.toContain("2026-10-27T11:00");
      expect(bookAppointment(r.list, { id: "m", doctorId: "d1", start: "2026-10-27T11:00", reason: "x" }, now).ok).toBe(false);
    }
  });
  it("le motif est obligatoire", async () => {
    const { bookAppointment } = await import("@/lib/appointments");
    expect(bookAppointment([], { id: "n", doctorId: "d1", start: "2026-10-27T11:00", reason: "  " }, now).ok).toBe(false);
  });
  it("pas de réservation au-delà de 14 jours", () => {
    expect(availableSlots([], "d1", new Date(2026, 10, 9), now)).toEqual([]);
  });
});
