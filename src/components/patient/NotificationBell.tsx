import { Link } from "@tanstack/react-router";
import { Bell, CalendarCheck, MessageCircle, Pill, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useReminders } from "@/context/RemindersContext";
import { useAppointments } from "@/context/AppointmentsContext";
import { useSettings } from "@/context/SettingsContext";
import type { PatientPath } from "@/data/patient";
import { parseLocal } from "@/lib/appointments";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { reminders, read, markRead, now } = useReminders();
  const { appointments, getDoctor } = useAppointments();
  const { settings } = useSettings();
  const notifications: { id: string; title: string; detail: string; date: number; to: PatientPath; icon: typeof Bell }[] = [
    ...reminders.filter(r => r.status !== "done" && new Date(r.due) <= now && settings.privacy.reminders && (r.type === "medication" ? settings.notifications.medications : settings.notifications.appointments)).map(r => ({ id: r.id, title: r.title, detail: r.detail, date: new Date(r.due).getTime(), to: "/espace-patient/rappels" as const, icon: r.type === "medication" ? Pill : Bell })),
    ...appointments.filter(a => a.status === "confirme" && settings.notifications.appointments).map(a => ({ id: `confirmation-${a.id}-${a.start}`, title: "Rendez-vous confirmé", detail: getDoctor(a.doctorId)?.name ?? "Votre médecin", date: a.createdAt ? new Date(a.createdAt).getTime() : parseLocal(a.start).getTime() - 3 * 86400000, to: "/espace-patient/rendez-vous" as const, icon: CalendarCheck })),
    ...(settings.notifications.messages ? [{ id: "demo-message", title: "Nouveau message · démonstration", detail: "Dr. Amine Ben Ali", date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9).getTime(), to: "/espace-patient/messages" as const, icon: MessageCircle }] : []),
  ].filter(n => n.date <= now.getTime()).sort((a, b) => b.date - a.date);
  const count = notifications.filter(n => !read.includes(n.id)).length;
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Notifications, ${count} non lues`}><Bell className="h-5 w-5" />{count > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{count}</span>}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]"><DropdownMenuLabel className="flex justify-between">Notifications <span className="font-normal text-muted-foreground">{count} non lues</span></DropdownMenuLabel><DropdownMenuSeparator />{notifications.length ? notifications.slice(0, 5).map(({ id, title, detail, to, icon: Icon }) => <DropdownMenuItem key={id} asChild><Link to={to} onClick={() => markRead(id)} className="items-start py-3"><Icon className="mt-1 h-4 w-4 text-primary" /><span className="min-w-0 flex-1"><span className={cn("block whitespace-normal", !read.includes(id) && "font-semibold")}>{title}</span><span className="block text-xs text-muted-foreground">{detail}</span></span>{!read.includes(id) && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}</Link></DropdownMenuItem>) : <p className="p-4 text-sm text-muted-foreground">Aucune notification pour le moment.</p>}<DropdownMenuSeparator /><DropdownMenuItem asChild><Link to="/espace-patient/rappels" className="justify-between">Tout voir<ArrowRight className="h-4 w-4" /></Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}