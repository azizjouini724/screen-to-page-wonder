import { SLOT_TIMES, type Doctor, type PatientAppointment, type Review } from "@/data/appointments";

export const pad = (n: number) => String(n).padStart(2, "0");
export const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseLocal = (s: string) => {
  const [date, time = "00:00"] = s.split("T");
  const [y, m, d] = date!.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return new Date(y!, m! - 1, d!, h!, mi!);
};

/** Un créneau est occupé s'il existe un rendez-vous non annulé du même médecin à la même heure. */
export function isSlotTaken(list: PatientAppointment[], doctorId: string, start: string, ignoreId?: string) {
  return list.some((a) => a.id !== ignoreId && a.doctorId === doctorId && a.start === start && a.status !== "annule");
}

export function isBookableDay(d: Date, now = new Date()) {
  const day = d.getDay();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return day !== 0 && day !== 6 && d >= today;
}

export function availableSlots(list: PatientAppointment[], doctorId: string, day: Date, now = new Date(), ignoreId?: string) {
  if (!isBookableDay(day, now)) return [];
  const key = toDateKey(day);
  return SLOT_TIMES.map((t) => `${key}T${t}`).filter((s) => parseLocal(s) > now && !isSlotTaken(list, doctorId, s, ignoreId));
}

export type Result = { ok: true; list: PatientAppointment[] } | { ok: false; error: string };

export function cancelAppointment(list: PatientAppointment[], id: string, reason?: string): Result {
  const a = list.find((x) => x.id === id);
  if (!a) return { ok: false, error: "Rendez-vous introuvable." };
  if (a.status !== "confirme" && a.status !== "attente") return { ok: false, error: "Ce rendez-vous ne peut plus être annulé." };
  return { ok: true, list: list.map((x) => (x.id === id ? { ...x, status: "annule", ...(reason ? { cancelReason: reason } : {}) } : x)) };
}

/** Libère l'ancien créneau et réserve le nouveau en une seule opération. */
export function rescheduleAppointment(list: PatientAppointment[], id: string, newStart: string, now = new Date()): Result {
  const a = list.find((x) => x.id === id);
  if (!a) return { ok: false, error: "Rendez-vous introuvable." };
  if (a.status !== "confirme" && a.status !== "attente") return { ok: false, error: "Ce rendez-vous ne peut plus être reporté." };
  if (parseLocal(newStart) <= now) return { ok: false, error: "Ce créneau est déjà passé." };
  if (isSlotTaken(list, a.doctorId, newStart, id)) return { ok: false, error: "Ce créneau vient d'être réservé. Choisissez-en un autre." };
  return { ok: true, list: list.map((x) => (x.id === id ? { ...x, start: newStart } : x)) };
}

export function addReview(list: PatientAppointment[], id: string, rating: number, comment: string, now = new Date()): Result {
  const a = list.find((x) => x.id === id);
  if (!a) return { ok: false, error: "Rendez-vous introuvable." };
  if (a.status !== "termine") return { ok: false, error: "Vous pourrez laisser un avis après le rendez-vous." };
  if (a.review) return { ok: false, error: "Vous avez déjà laissé un avis pour ce rendez-vous." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: "Choisissez une note entre 1 et 5 étoiles." };
  const review: Review = { rating, comment: comment.trim().slice(0, 500), createdAt: now.toISOString() };
  return { ok: true, list: list.map((x) => (x.id === id ? { ...x, review } : x)) };
}

export function formatLongDate(start: string) {
  const d = parseLocal(start);
  const s = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const icsDate = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function buildIcs(a: PatientAppointment, doctor: Doctor, now = new Date()) {
  const start = parseLocal(a.start);
  const end = new Date(start.getTime() + a.durationMin * 60000);
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Clinic Copilot//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${a.id}@clinic-copilot`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(`Rendez-vous avec ${doctor.name}`)}`,
    `DESCRIPTION:${icsEscape(`${doctor.specialty} · Motif : ${a.reason}`)}`,
    `LOCATION:${icsEscape(doctor.address)}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}

/** 4 rendez-vous de démonstration relatifs à aujourd'hui : 2 à venir, 1 terminé, 1 annulé. */
export function demoAppointments(now = new Date()): PatientAppointment[] {
  const nextWeekday = (offset: number) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + (offset >= 0 ? 1 : -1));
    return toDateKey(d);
  };
  return [
    { id: "demo-1", doctorId: "d-benali", start: `${nextWeekday(2)}T10:00`, durationMin: 30, reason: "Fièvre et fatigue depuis 3 jours", status: "confirme" },
    { id: "demo-2", doctorId: "d-mansouri", start: `${nextWeekday(9)}T14:30`, durationMin: 30, reason: "Suivi de l'asthme", status: "attente" },
    { id: "demo-3", doctorId: "d-trabelsi", start: `${nextWeekday(-12)}T09:30`, durationMin: 30, reason: "Contrôle annuel", status: "termine" },
    { id: "demo-4", doctorId: "d-benali", start: `${nextWeekday(-4)}T11:00`, durationMin: 30, reason: "Douleurs au dos", status: "annule", cancelReason: "Je me sens mieux" },
  ];
}
