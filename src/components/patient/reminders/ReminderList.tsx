import { Bell, CalendarDays, Check, Clock, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReminders } from "@/context/RemindersContext";
import { MEDICATION_NOTICE, reminderSection, type ReminderView } from "@/lib/reminders";
import { cn } from "@/lib/utils";

export function ReminderItem({ reminder }: { reminder: ReminderView }) {
  const { complete, snooze } = useReminders();
  const Icon = reminder.type === "medication" ? Pill : CalendarDays;
  return <li className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-lg", reminder.type === "medication" ? "bg-accent/15 text-accent-foreground" : "bg-soft text-primary")}><Icon className="h-5 w-5" /></span>
      <div className="min-w-0"><h3 className="font-semibold text-deep">{reminder.title}</h3><p className="text-sm text-muted-foreground">{reminder.detail}</p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm"><Clock className="h-3.5 w-3.5" /><time dateTime={reminder.due}>{new Date(reminder.due).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time><span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", reminder.status === "done" ? "bg-success/15 text-success" : reminder.status === "snoozed" ? "bg-warning/15 text-accent-foreground" : "bg-soft text-primary")}>{reminder.status === "done" ? "Fait" : reminder.status === "snoozed" ? "Reporté" : "À faire"}</span></p>
      </div>
    </div>
    {reminder.status !== "done" && <div className="flex shrink-0 flex-wrap gap-2"><Button variant="soft" size="sm" onClick={() => complete(reminder.id)}><Check />{reminder.type === "medication" ? "Pris" : "Marquer comme fait"}</Button><Button variant="outline" size="sm" onClick={() => snooze(reminder.id)}><Clock />Reporter de 15 minutes</Button></div>}
  </li>;
}
export function ReminderList() {
  const { reminders, now, ready } = useReminders();
  if (!ready) return <p role="status" className="py-10 text-muted-foreground">Chargement de vos rappels…</p>;
  const count = reminders.filter(r => reminderSection(r, now) === "today").length;
  return <div className="space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold text-deep">Rappels</h1><p className="mt-2 text-muted-foreground">{now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p></div><span className="flex items-center gap-2 rounded-full bg-soft px-4 py-2 font-semibold text-primary"><Bell className="h-4 w-4" />{count} {count === 1 ? "rappel du jour" : "rappels du jour"}</span></div>
    <p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">{MEDICATION_NOTICE}</p>
    {([{ id: "today", title: "Aujourd'hui", empty: "Aucun rappel à faire aujourd'hui." }, { id: "upcoming", title: "À venir", empty: "Aucun rappel à venir." }, { id: "done", title: "Terminés", empty: "Aucun rappel terminé pour le moment." }] as const).map(section => {
      const list = reminders.filter(r => reminderSection(r, now) === section.id);
      return <section key={section.id} aria-label={section.title}><h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-deep">{section.title}<span className="text-sm font-medium text-muted-foreground">{list.length}</span></h2>{list.length ? <ul className="space-y-3">{list.map(r => <ReminderItem key={r.id} reminder={r} />)}</ul> : <div className="flex items-center gap-3 border-y border-dashed border-border py-7 text-sm text-muted-foreground"><Check className="h-5 w-5 text-primary" />{section.empty}</div>}</section>;
    })}
  </div>;
}