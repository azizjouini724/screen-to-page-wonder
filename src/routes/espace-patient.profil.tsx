import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal } from "@/components/site/Reveal";
import { Panel } from "@/components/patient/PatientCards";
import { initials } from "@/components/patient/PatientLayout";
import { useAuth } from "@/context/AuthContext";
import { defaultProfile, languages } from "@/data/patient";

export const Route = createFileRoute("/espace-patient/profil")({
  head: () => ({ meta: [{ title: "Mon profil · Espace Patient" }, { name: "description", content: "Gérez votre profil, vos informations de santé et vos consentements." }, { property: "og:title", content: "Mon profil · Espace Patient" }, { property: "og:description", content: "Gérez votre profil patient." }] }),
  component: ProfilePage,
});

type Profile = typeof defaultProfile & { firstName: string; lastName: string; email: string };
const KEY = "cc_patient_profile";

function ChipEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const id = `chip-${label}`;
  const add = () => {
    const v = draft.trim().slice(0, 60);
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft("");
  };
  return (
    <div>
      <Label htmlFor={id} className="text-deep">{label}</Label>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.length === 0 && <li className="text-sm text-muted-foreground">Aucun élément</li>}
        {items.map((it) => (
          <li key={it} className="inline-flex items-center gap-1 rounded-full bg-soft py-1 pl-3 pr-1 text-sm font-medium text-primary">
            {it}
            <button type="button" onClick={() => onChange(items.filter((x) => x !== it))} aria-label={`Retirer ${it}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-ring"><X className="h-3 w-3" /></button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <Input id={id} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Ajouter…" className="h-9 bg-card" />
        <Button type="button" variant="soft" size="sm" className="h-9" onClick={add}><Plus />Ajouter</Button>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    let saved: Partial<Profile> = {};
    try { saved = JSON.parse(localStorage.getItem(`${KEY}_${user.id}`) || "{}"); } catch { /* ignore */ }
    const p = { ...defaultProfile, firstName: user.firstName, lastName: user.lastName, email: user.email, ...saved };
    setProfile(p); setForm(p);
  }, [user]);

  if (!profile || !form) return null;

  const persist = (p: Profile) => { setProfile(p); localStorage.setItem(`${KEY}_${user!.id}`, JSON.stringify(p)); };
  const update = (patch: Partial<Profile>) => persist({ ...profile, ...patch });

  const save = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) { toast.error("Le prénom et le nom sont obligatoires."); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { toast.error("Adresse e-mail invalide."); return; }
    persist({ ...profile, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone.trim(), birthDate: form.birthDate });
    setEditing(false);
    toast.success("Vos informations ont été enregistrées.");
  };

  const fields: { key: "firstName" | "lastName" | "email" | "phone" | "birthDate"; label: string; type?: string }[] = [
    { key: "firstName", label: "Prénom" }, { key: "lastName", label: "Nom" },
    { key: "email", label: "E-mail", type: "email" }, { key: "phone", label: "Téléphone", type: "tel" },
    { key: "birthDate", label: "Date de naissance", type: "date" },
  ];
  const fmt = (k: string, v: string) => (k === "birthDate" && v ? new Date(v).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : v || "—");

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-bold text-deep sm:text-3xl">Mon profil</h1>
        <p className="mt-1 text-muted-foreground">Vos informations personnelles et vos préférences.</p>
      </Reveal>

      <Reveal>
        <Panel title="Carte d'identité" action={editing ? (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setForm(profile); setEditing(false); }}>Annuler</Button>
            <Button variant="hero" size="sm" onClick={save}><Save />Enregistrer</Button>
          </div>
        ) : <Button variant="soft" size="sm" onClick={() => { setForm(profile); setEditing(true); }}><Pencil />Modifier</Button>}>
          <div className="flex flex-col gap-6 sm:flex-row">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-primary text-2xl font-bold text-primary-foreground">{initials(profile.firstName, profile.lastName)}</span>
            <dl className="grid flex-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key}>
                  {editing ? (
                    <>
                      <Label htmlFor={`f-${f.key}`}>{f.label}</Label>
                      <Input id={`f-${f.key}`} type={f.type ?? "text"} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-1.5 h-10 bg-card" />
                    </>
                  ) : (
                    <>
                      <dt className="text-sm text-muted-foreground">{f.label}</dt>
                      <dd className="mt-0.5 font-semibold text-deep">{fmt(f.key, profile[f.key])}</dd>
                    </>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </Panel>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Panel title="Informations de santé" className="h-full">
            <div className="space-y-5">
              <ChipEditor label="Allergies" items={profile.allergies} onChange={(v) => update({ allergies: v })} />
              <ChipEditor label="Antécédents" items={profile.history} onChange={(v) => update({ history: v })} />
              <ChipEditor label="Traitements en cours" items={profile.treatments} onChange={(v) => update({ treatments: v })} />
            </div>
          </Panel>
        </Reveal>
        <div className="space-y-6">
          <Reveal delay={80}>
            <Panel title="Consentement">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="c-assess" className="font-normal leading-snug">Autoriser l'enregistrement de mes évaluations de symptômes</Label>
                  <Switch id="c-assess" checked={profile.consentAssessments} onCheckedChange={(v) => update({ consentAssessments: v })} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="c-rem" className="font-normal leading-snug">Autoriser les rappels</Label>
                  <Switch id="c-rem" checked={profile.consentReminders} onCheckedChange={(v) => update({ consentReminders: v })} />
                </div>
                <p className="text-sm text-muted-foreground">Vous pouvez retirer votre consentement à tout moment.</p>
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={160}>
            <Panel title="Langue">
              <Label htmlFor="lang" className="sr-only">Langue de l'application</Label>
              <Select value={profile.language} onValueChange={(v) => update({ language: v })}>
                <SelectTrigger id="lang" className="h-10 bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {languages.map((l) => <SelectItem key={l.value} value={l.value} disabled={!l.enabled}>{l.label}{!l.enabled && " (bientôt)"}</SelectItem>)}
                </SelectContent>
              </Select>
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
