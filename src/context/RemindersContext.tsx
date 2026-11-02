import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentsContext";
import { applyReminderState, appointmentReminders, medicationExamples, snoozeReminder, type Reminder, type ReminderState, type ReminderView } from "@/lib/reminders";

type Saved = { medications: Reminder[]; states: Record<string, ReminderState>; read: string[] };
type Value = { reminders: ReminderView[]; ready: boolean; read: string[]; markRead: (id: string) => void; complete: (id: string) => void; snooze: (id: string) => void; now: Date };
const Context = createContext<Value | null>(null);
export function RemindersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { appointments, getDoctor, ready: appointmentsReady } = useAppointments();
  const [saved, setSaved] = useState<Saved>({ medications: [], states: {}, read: [] });
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    setReady(false);
    if (!user) return;
    try {
      const raw = localStorage.getItem(`cc_reminders_${user.id}`);
      setSaved(raw ? JSON.parse(raw) : { medications: medicationExamples(), states: {}, read: [] });
    } catch { setSaved({ medications: medicationExamples(), states: {}, read: [] }); }
    setReady(true);
  }, [user?.id]);
  const reminders = useMemo(() => [...saved.medications, ...appointmentReminders(appointments, id => getDoctor(id)?.name ?? "Votre médecin")].map(r => applyReminderState(r, saved.states[r.id])).sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()), [saved, appointments]);
  const commit = (next: Saved) => {
    if (!user) return;
    try { localStorage.setItem(`cc_reminders_${user.id}`, JSON.stringify(next)); setSaved(next); }
    catch { toast.error("Impossible d'enregistrer le rappel."); }
  };
  const change = (id: string, done: boolean) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder || reminder.status === "done") return;
    commit({ ...saved, states: { ...saved.states, [id]: done ? { status: "done" } : snoozeReminder(reminder) } });
  };
  return <Context.Provider value={{ reminders, ready: ready && appointmentsReady, now, read: saved.read, markRead: id => commit({ ...saved, read: [...new Set([...saved.read, id])] }), complete: id => change(id, true), snooze: id => change(id, false) }}>{children}</Context.Provider>;
}
export function useReminders() {
  const value = useContext(Context);
  if (!value) throw new Error("RemindersProvider manquant");
  return value;
}