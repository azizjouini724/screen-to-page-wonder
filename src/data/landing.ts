import {
  Stethoscope, Brain, CalendarCheck, MessageSquareLock, BellRing,
  ClipboardList, ShieldCheck, UserSearch, CalendarClock, MessagesSquare, Bell,
  Siren, AlertTriangle, HeartPulse, Leaf, UserCheck, KeyRound, Cpu, Lock,
  type LucideIcon,
} from "lucide-react";

export const navLinks = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Espaces", href: "#espaces" },
  { label: "Sécurité", href: "#securite" },
];

export const features: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Brain, title: "Symptômes & IA", text: "Décrivez ce que vous ressentez, l'IA vous guide pas à pas." },
  { icon: Stethoscope, title: "Médecins & spécialités", text: "Le bon praticien selon votre besoin et votre localisation." },
  { icon: CalendarCheck, title: "Rendez-vous faciles", text: "Réservez un créneau disponible en quelques secondes." },
  { icon: MessageSquareLock, title: "Chat sécurisé", text: "Échangez avec votre médecin en toute confidentialité." },
  { icon: BellRing, title: "Rappels & notifications", text: "Ne manquez plus aucun rendez-vous ni traitement." },
];

export const steps: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ClipboardList, title: "Décrivez vos symptômes", text: "Répondez à quelques questions simples, à votre rythme." },
  { icon: ShieldCheck, title: "Recevez une orientation prudente", text: "L'IA évalue le niveau d'urgence avec prudence." },
  { icon: UserSearch, title: "Trouvez le bon médecin", text: "Spécialité, disponibilités et proximité réunies." },
  { icon: CalendarClock, title: "Réservez un créneau", text: "Choisissez l'horaire qui vous convient." },
  { icon: MessagesSquare, title: "Échangez avec le médecin", text: "Le résumé IA est partagé avec votre accord." },
  { icon: Bell, title: "Recevez vos rappels", text: "Notifications avant chaque rendez-vous." },
];

export type UrgencyLevel = "urgence" | "urgent" | "courant" | "conseil";

export const urgencyLevels: { level: UrgencyLevel; icon: LucideIcon; title: string; text: string }[] = [
  { level: "urgence", icon: Siren, title: "Urgence", text: "Appelez immédiatement les urgences (190, SAMU). Aucune réservation n'est proposée." },
  { level: "urgent", icon: AlertTriangle, title: "Urgent", text: "Consultation recommandée dans les 24 heures avec un créneau prioritaire." },
  { level: "courant", icon: HeartPulse, title: "Courant", text: "Prenez rendez-vous avec un médecin dans les prochains jours." },
  { level: "conseil", icon: Leaf, title: "Conseil général", text: "Conseils de prévention et d'auto-soin, à surveiller." },
];

export const security: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: UserCheck, title: "Consentement du patient", text: "Rien n'est partagé avec un médecin sans votre accord explicite." },
  { icon: KeyRound, title: "Accès par rôle", text: "Patients, médecins et administrateurs ne voient que ce qui les concerne." },
  { icon: Cpu, title: "IA exécutée localement", text: "L'analyse des symptômes est traitée sans envoi à des services tiers." },
  { icon: Lock, title: "Données chiffrées", text: "Chiffrement en transit et au repos pour toutes vos informations." },
];

export const patientAppointments = [
  { doctor: "Dr. Karim Haddad", specialty: "Médecine générale", date: "Demain, 10:00" },
  { doctor: "Dr. Léa Martin", specialty: "Dermatologie", date: "Jeu. 24 oct., 14:30" },
];

export const doctorAgenda = [
  { time: "09:00", patient: "Sarah B.", reason: "Suivi", level: "courant" as UrgencyLevel },
  { time: "10:00", patient: "Yassine M.", reason: "Fièvre persistante", level: "urgent" as UrgencyLevel },
  { time: "11:30", patient: "Claire D.", reason: "Contrôle", level: "conseil" as UrgencyLevel },
];

export const doctorsList = [
  { name: "Dr. Karim Haddad", specialty: "Généraliste", rating: "4,9" },
  { name: "Dr. Léa Martin", specialty: "Dermatologue", rating: "4,8" },
  { name: "Dr. Omar Ben Ali", specialty: "Cardiologue", rating: "4,9" },
  { name: "Dr. Inès Roy", specialty: "Pédiatre", rating: "4,7" },
];
