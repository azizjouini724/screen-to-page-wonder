import { describe, expect, it } from "vitest";
import { demoAccounts } from "@/data/auth";
import { findAccount, roleHome } from "@/lib/auth";

describe("connexion simulée", () => {
  it("connecte le médecin de démo avec Demo1234 et l'envoie vers /espace-medecin", () => {
    const u = findAccount(demoAccounts, "dr.benali@demo.com", "Demo1234");
    expect(u?.role).toBe("medecin");
    expect(roleHome[u!.role]).toBe("/espace-medecin");
  });
  it("refuse un mauvais mot de passe", () => {
    expect(findAccount(demoAccounts, "sarah@demo.com", "mauvais1")).toBeNull();
  });
  it("aucun compte administrateur ne s'inscrit : seul admin@demo.com existe", () => {
    expect(findAccount(demoAccounts, "admin@demo.com", "Demo1234")?.role).toBe("admin");
  });
});
