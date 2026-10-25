export type Language = "Français" | "Arabe" | "Anglais";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  city: string;
  address: string;
  languages: Language[];
  verified: boolean;
  fee: number; // en dinars tunisiens
  bio: string;
  tone: "primary" | "info" | "accent";
  online: boolean;
};

export const specialtiesList = ["Médecin généraliste", "Pneumologue", "Cardiologue", "Pédiatre", "Dermatologue", "ORL"];
export const languagesList: Language[] = ["Français", "Arabe", "Anglais"];

export const doctors: Doctor[] = [
  { id: "d-benali", name: "Dr. Amine Ben Ali", specialty: "Médecin généraliste", rating: 4.9, reviewsCount: 128, distanceKm: 1.2, city: "El Menzah", address: "12 rue de Marseille, El Menzah, Tunis", languages: ["Français", "Arabe"], verified: true, fee: 50, bio: "Médecin généraliste depuis 15 ans, attentif au suivi global de ses patients et à la prévention.", tone: "primary", online: true },
  { id: "d-mansouri", name: "Dr. Leila Mansouri", specialty: "Pneumologue", rating: 4.8, reviewsCount: 94, distanceKm: 3.4, city: "Tunis", address: "45 avenue Habib Bourguiba, Tunis", languages: ["Français", "Arabe", "Anglais"], verified: true, fee: 80, bio: "Spécialiste de l'asthme et des troubles respiratoires du sommeil.", tone: "info", online: false },
  { id: "d-trabelsi", name: "Dr. Youssef Trabelsi", specialty: "Médecin généraliste", rating: 4.6, reviewsCount: 61, distanceKm: 5.1, city: "Les Berges du Lac", address: "8 rue du Lac Léman, Les Berges du Lac", languages: ["Français", "Arabe"], verified: true, fee: 45, bio: "Consultations de médecine générale, certificats et suivi des maladies chroniques.", tone: "accent", online: true },
  { id: "d-gharbi", name: "Dr. Sami Gharbi", specialty: "Cardiologue", rating: 4.9, reviewsCount: 203, distanceKm: 2.8, city: "Ariana", address: "3 avenue de la Liberté, Ariana", languages: ["Français", "Arabe", "Anglais"], verified: true, fee: 90, bio: "Cardiologue, spécialisé dans l'hypertension et la prévention cardiovasculaire.", tone: "primary", online: false },
  { id: "d-hammami", name: "Dr. Nour Hammami", specialty: "Pédiatre", rating: 4.7, reviewsCount: 156, distanceKm: 1.9, city: "El Menzah", address: "21 rue Ibn Khaldoun, El Menzah 6", languages: ["Français", "Arabe"], verified: true, fee: 60, bio: "Pédiatre bienveillante, suivi du nourrisson à l'adolescent.", tone: "info", online: true },
  { id: "d-jaziri", name: "Dr. Mehdi Jaziri", specialty: "Dermatologue", rating: 4.5, reviewsCount: 47, distanceKm: 6.3, city: "La Marsa", address: "17 rue du Maroc, La Marsa", languages: ["Français", "Anglais"], verified: false, fee: 70, bio: "Dermatologie médicale : eczéma, acné, suivi des grains de beauté.", tone: "accent", online: false },
  { id: "d-khelifi", name: "Dr. Rania Khelifi", specialty: "ORL", rating: 4.8, reviewsCount: 82, distanceKm: 4.0, city: "Tunis", address: "9 rue de Rome, Tunis", languages: ["Français", "Arabe", "Anglais"], verified: true, fee: 75, bio: "ORL, prise en charge des sinusites, otites et troubles de l'audition.", tone: "primary", online: true },
  { id: "d-bouazizi", name: "Dr. Karim Bouazizi", specialty: "Pneumologue", rating: 4.4, reviewsCount: 29, distanceKm: 8.7, city: "Ben Arous", address: "54 avenue de France, Ben Arous", languages: ["Français", "Arabe"], verified: false, fee: 70, bio: "Pneumologue, explorations fonctionnelles respiratoires et sevrage tabagique.", tone: "info", online: false },
];

export const sampleReviews = [
  { author: "Sonia B.", rating: 5, text: "Très à l'écoute, explications claires et rassurantes.", date: "Il y a 3 jours" },
  { author: "Hichem M.", rating: 4, text: "Ponctuel et professionnel. Cabinet facile d'accès.", date: "Il y a 2 semaines" },
  { author: "Amel K.", rating: 5, text: "Je recommande, prise en charge rapide et efficace.", date: "Il y a 1 mois" },
];

/** Créneaux déjà pris par d'autres patients (déterministe, ~30 %). Uniquement pour les médecins de l'annuaire. */
export function isPrebooked(doctorId: string, start: string) {
  if (!doctors.some((d) => d.id === doctorId)) return false;
  let h = 0;
  for (const c of doctorId + start) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 10 < 3;
}
