export type Settings = {
  notifications: { push: boolean; email: boolean; sms: boolean; appointments: boolean; messages: boolean; medications: boolean; quietStart: string; quietEnd: string };
  privacy: { assessments: boolean; reminders: boolean; share: boolean };
  security: { devices: string[] };
  display: { language: "fr"; textSize: "normal" | "large" };
};
export const defaultSettings: Settings = {
  notifications: { push: true, email: true, sms: false, appointments: true, messages: true, medications: true, quietStart: "22:00", quietEnd: "07:00" },
  privacy: { assessments: true, reminders: true, share: false },
  security: { devices: ["current", "phone", "tablet"] },
  display: { language: "fr", textSize: "normal" },
};
export const canDeleteAccount = (step: number, word: string) => step === 2 && word === "SUPPRIMER";
export const validNewPassword = (old: string, next: string, confirmation: string) => next.length >= 8 && next !== old && next === confirmation;
export async function passwordDigest(password: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, "0")).join("");
}