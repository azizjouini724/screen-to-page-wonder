export type Role = "patient" | "medecin" | "admin";

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  pending?: boolean;
};

export type StoredAccount = AppUser & { password: string };

export const DEMO_PASSWORD = "Demo1234";

export const demoAccounts: StoredAccount[] = [
  { id: "demo-patient", firstName: "Sarah", lastName: "Benali", email: "sarah@demo.com", role: "patient", password: DEMO_PASSWORD },
  { id: "demo-medecin", firstName: "Omar", lastName: "Ben Ali", email: "dr.benali@demo.com", role: "medecin", password: DEMO_PASSWORD },
  { id: "demo-admin", firstName: "Nadia", lastName: "Admin", email: "admin@demo.com", role: "admin", password: DEMO_PASSWORD },
];

export const roleLabels: Record<Role, string> = {
  patient: "Patient",
  medecin: "Médecin",
  admin: "Administrateur",
};

export const specialties = [
  "Médecine générale", "Cardiologie", "Dermatologie", "Pédiatrie", "Gynécologie",
  "Ophtalmologie", "ORL", "Psychiatrie", "Neurologie", "Rhumatologie",
];
