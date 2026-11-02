import { useEffect, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { Bell, Shield, LockKeyhole, Languages, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { NotificationSettings } from "./NotificationSettings";
import { PrivacySettings } from "./PrivacySettings";
import { SecuritySettings, emptyPassword } from "./SecuritySettings";
import type { Settings } from "@/lib/settings";

type Tab = keyof Settings;
const tabs = [{ id: "notifications", label: "Notifications", icon: Bell }, { id: "privacy", label: "Confidentialité", icon: Shield }, { id: "security", label: "Sécurité", icon: LockKeyhole }, { id: "display", label: "Langue et affichage", icon: Languages }] as const;
export function SettingsTabs() {
  const { settings, ready, save } = useSettings();
  const { user, changePassword } = useAuth();
  const [draft, setDraft] = useState(settings);
  const [tab, setTab] = useState<Tab>("notifications");
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);
  const [password, setPassword] = useState(emptyPassword);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (ready) setDraft(settings); }, [ready]);
  const passwordDirty = Object.values(password).some(Boolean);
  const dirty = ready && (JSON.stringify(draft) !== JSON.stringify(settings) || passwordDirty);
  const blocker = useBlocker({ shouldBlockFn: () => dirty && !!user, enableBeforeUnload: dirty && !!user, withResolver: true });
  const isTabDirty = (id: Tab) => JSON.stringify(draft[id]) !== JSON.stringify(settings[id]) || (id === "security" && passwordDirty);
  const changeTab = (next: string) => {
    const target = tabs.find(t => t.id === next)?.id;
    if (!target) return;
    if (isTabDirty(tab)) setPendingTab(target); else setTab(target);
  };
  const submit = async () => {
    setSaving(true);
    try {
      if (tab === "security" && passwordDirty && !await changePassword(password.old, password.next, password.confirmation)) { toast.error("Vérifiez l'ancien mot de passe, les 8 caractères minimum et la confirmation."); return; }
      if (!save({ ...settings, [tab]: draft[tab] })) { toast.error("Impossible d'enregistrer vos paramètres."); return; }
      if (tab === "security") setPassword(emptyPassword);
      toast.success("Paramètres enregistrés.");
    } catch { toast.error("Impossible d'enregistrer vos paramètres."); }
    finally { setSaving(false); }
  };
  if (!ready) return <p role="status">Chargement des paramètres…</p>;
  return <div>
    <h1 className="text-3xl font-bold text-deep">Paramètres</h1><p className="mt-2 text-muted-foreground">Votre compte, vos préférences et votre confidentialité.</p>
    <Tabs value={tab} onValueChange={changeTab} className="mt-7">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">{tabs.map(({ id, label, icon: Icon }) => <TabsTrigger key={id} value={id} className="min-h-11 gap-2 whitespace-normal px-2 text-center"><Icon className="h-4 w-4 shrink-0" /><span>{label}</span></TabsTrigger>)}</TabsList>
      {dirty && <p role="status" className="mt-4 flex items-center gap-2 text-sm text-accent-foreground"><AlertTriangle className="h-4 w-4 shrink-0" />Des modifications ne sont pas enregistrées.</p>}
      {tabs.map(({ id }) => <TabsContent key={id} value={id} className="mt-6"><form onSubmit={e => { e.preventDefault(); void submit(); }} className="max-w-3xl">
        {id === "notifications" && <NotificationSettings value={draft.notifications} onChange={notifications => setDraft({ ...draft, notifications })} />}
        {id === "privacy" && <PrivacySettings value={draft.privacy} onChange={privacy => setDraft({ ...draft, privacy })} />}
        {id === "security" && <SecuritySettings value={draft.security} onChange={security => setDraft({ ...draft, security })} password={password} onPasswordChange={setPassword} />}
        {id === "display" && <div className="space-y-8"><section><h2 className="mb-4 text-lg font-semibold text-deep">Langue</h2><Label htmlFor="settings-language">Langue de l'application</Label><Select value="fr"><SelectTrigger id="settings-language" className="mt-2 max-w-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fr">Français</SelectItem><SelectItem value="ar" disabled>Arabe · Bientôt</SelectItem><SelectItem value="en" disabled>Anglais · Bientôt</SelectItem></SelectContent></Select></section><section className="border-t border-border pt-6"><h2 className="mb-4 text-lg font-semibold text-deep">Affichage</h2><Label htmlFor="text-size">Taille du texte</Label><Select value={draft.display.textSize} onValueChange={size => { if (size === "normal" || size === "large") setDraft({ ...draft, display: { language: "fr", textSize: size } }); }}><SelectTrigger id="text-size" className="mt-2 max-w-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normale</SelectItem><SelectItem value="large">Grande</SelectItem></SelectContent></Select></section></div>}
        <div className="mt-8 border-t border-border pt-5"><Button type="submit" variant="hero" disabled={saving}><Save />{saving ? "Enregistrement…" : "Enregistrer"}</Button></div>
      </form></TabsContent>)}
    </Tabs>
    <Dialog open={pendingTab !== null || blocker.status === "blocked"} onOpenChange={open => { if (!open) { setPendingTab(null); blocker.reset?.(); } }}><DialogContent><DialogHeader><DialogTitle>Modifications non enregistrées</DialogTitle><DialogDescription>Vos modifications seront perdues si vous continuez sans les enregistrer.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => { setPendingTab(null); blocker.reset?.(); }}>Rester</Button><Button onClick={() => { if (pendingTab) { setDraft({ ...draft, [tab]: settings[tab] }); if (tab === "security") setPassword(emptyPassword); setTab(pendingTab); setPendingTab(null); } else blocker.proceed?.(); }}>Quitter sans enregistrer</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}