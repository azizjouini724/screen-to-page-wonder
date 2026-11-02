import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { SettingSwitch } from "./NotificationSettings";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentsContext";
import { useReminders } from "@/context/RemindersContext";
import { useSettings } from "@/context/SettingsContext";
import { canDeleteAccount, type Settings } from "@/lib/settings";

export function PrivacySettings({ value, onChange }: { value: Settings["privacy"]; onChange: (v: Settings["privacy"]) => void }) {
  const { user, deleteAccount } = useAuth();
  const { appointments } = useAppointments();
  const { reminders } = useReminders();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [word, setWord] = useState("");
  const download = () => {
    if (!user) return;
    try {
      const data: Record<string, unknown> = {};
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("cc_") && key.endsWith(`_${user.id}`) && !key.startsWith("cc_password_")) {
          const raw = localStorage.getItem(key);
          if (raw) { try { data[key] = JSON.parse(raw); } catch { data[key] = raw; } }
        }
      }
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), user, appointments, reminders, settings, data }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "clinic-copilot-mes-donnees.json"; link.click(); URL.revokeObjectURL(url);
      toast.success("Vos données ont été téléchargées.");
    } catch { toast.error("Impossible de télécharger vos données."); }
  };
  return <div className="space-y-8">
    <section><h2 className="mb-2 text-lg font-semibold text-deep">Mes consentements</h2>{([{ key: "assessments", label: "Enregistrement des évaluations de symptômes" }, { key: "reminders", label: "Rappels" }, { key: "share", label: "Partage avec les médecins" }] as const).map(item => <SettingSwitch key={item.key} id={`consent-${item.key}`} label={item.label} checked={value[item.key]} onChange={v => onChange({ ...value, [item.key]: v })} />)}<p className="mt-3 text-sm text-muted-foreground">Vous pouvez retirer votre consentement à tout moment.</p></section>
    <section className="border-t border-border pt-6"><h2 className="mb-4 text-lg font-semibold text-deep">Mes données</h2><Button variant="outline" onClick={download}><Download />Télécharger mes données</Button></section>
    <section className="border-t border-border pt-6"><h2 className="text-lg font-semibold text-destructive">Supprimer mon compte</h2><p className="my-3 text-sm text-muted-foreground">Supprime le compte et ses données de démonstration sur cet appareil uniquement. Cette action est irréversible.</p><Button variant="destructive" onClick={() => { setStep(1); setWord(""); }}><Trash2 />Supprimer mon compte</Button></section>
    <Dialog open={step > 0} onOpenChange={open => { if (!open) { setStep(0); setWord(""); } }}><DialogContent><DialogHeader><DialogTitle>{step === 1 ? "Supprimer votre compte ?" : "Confirmer la suppression"}</DialogTitle><DialogDescription>{step === 1 ? "Vos rendez-vous, rappels et préférences seront effacés sur cet appareil. Téléchargez vos données avant de continuer." : "Saisissez SUPPRIMER pour confirmer cette action irréversible."}</DialogDescription></DialogHeader>{step === 2 && <div><Label htmlFor="delete-word">Mot de confirmation</Label><Input id="delete-word" className="mt-2" autoComplete="off" value={word} onChange={e => setWord(e.target.value)} /></div>}<DialogFooter><Button variant="outline" onClick={() => setStep(0)}>Annuler</Button>{step === 1 ? <Button variant="destructive" onClick={() => setStep(2)}>Continuer</Button> : <Button variant="destructive" disabled={!canDeleteAccount(step, word)} onClick={() => { try { deleteAccount(); setStep(0); navigate({ to: "/" }); toast.success("Compte supprimé sur cet appareil."); } catch { toast.error("Impossible de supprimer le compte."); } }}>Supprimer définitivement</Button>}</DialogFooter></DialogContent></Dialog>
  </div>;
}