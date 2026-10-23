import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { doctors, type Doctor, type PatientAppointment } from "@/data/appointments";
import {
  addReview, availableSlots, cancelAppointment, demoAppointments, parseLocal, rescheduleAppointment, type Result,
} from "@/lib/appointments";
import { useAuth } from "./AuthContext";

type Outcome = { ok: true } | { ok: false; error: string };

type Value = {
  appointments: PatientAppointment[];
  ready: boolean;
  error: string | null;
  getDoctor: (id: string) => Doctor | undefined;
  slotsFor: (doctorId: string, day: Date, ignoreId?: string) => string[];
  book: (doctorId: string, start: string, reason: string) => Promise<Outcome>;
  cancel: (id: string, reason?: string) => Promise<Outcome>;
  reschedule: (id: string, newStart: string) => Promise<Outcome>;
  review: (id: string, rating: number, comment: string) => Promise<Outcome>;
};

const Ctx = createContext<Value | null>(null);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Passe automatiquement en "terminé" les rendez-vous confirmés dont l'heure est passée. */
function settle(list: PatientAppointment[], now = new Date()) {
  return list.map((a) => (a.status === "confirme" && parseLocal(a.start).getTime() + a.durationMin * 60000 < now.getTime() ? { ...a, status: "termine" as const } : a));
}

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const key = user ? `cc_appointments_${user.id}` : null;
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<PatientAppointment[]>([]);

  useEffect(() => {
    if (!key) return;
    setReady(false);
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(key);
        const list = settle(raw ? (JSON.parse(raw) as PatientAppointment[]) : demoAppointments());
        listRef.current = list;
        setAppointments(list);
        localStorage.setItem(key, JSON.stringify(list));
        setError(null);
      } catch {
        setError("Impossible de charger vos rendez-vous. Réessayez dans un instant.");
      }
      setReady(true);
    }, 500);
    return () => clearTimeout(t);
  }, [key]);

  /** Toutes les écritures passent par ici : lecture de l'état le plus récent, puis écriture unique. */
  const commit = useCallback(async (fn: (list: PatientAppointment[]) => Result): Promise<Outcome> => {
    await wait(450);
    const r = fn(listRef.current);
    if (!r.ok) return r;
    listRef.current = r.list;
    setAppointments(r.list);
    if (key) localStorage.setItem(key, JSON.stringify(r.list));
    return { ok: true };
  }, [key]);

  const value: Value = {
    appointments,
    ready,
    error,
    getDoctor: (id) => doctors.find((d) => d.id === id),
    slotsFor: (doctorId, day, ignoreId) => availableSlots(appointments, doctorId, day, new Date(), ignoreId),
    book: (doctorId, start, reason) => commit((list) => {
      if (availableSlots(list, doctorId, parseLocal(start)).indexOf(start) === -1) return { ok: false, error: "Ce créneau n'est plus disponible." };
      return { ok: true, list: [...list, { id: crypto.randomUUID(), doctorId, start, durationMin: 30, reason, status: "attente" }] };
    }),
    cancel: (id, reason) => commit((list) => cancelAppointment(list, id, reason)),
    reschedule: (id, newStart) => commit((list) => rescheduleAppointment(list, id, newStart)),
    review: (id, rating, comment) => commit((list) => addReview(list, id, rating, comment)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppointments() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppointments doit être utilisé dans AppointmentsProvider");
  return v;
}
