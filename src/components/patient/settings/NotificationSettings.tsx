import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import type { Settings } from "@/lib/settings";

export function SettingSwitch({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between gap-5 py-3"><Label htmlFor={id} className="font-normal leading-relaxed">{label}</Label><Switch id={id} checked={checked} onCheckedChange={onChange} /></div>;
}
export function NotificationSettings({ value, onChange }: { value: Settings["notifications"]; onChange: (v: Settings["notifications"]) => void }) {
  return <div className="space-y-8">
    <section><h2 className="mb-2 text-lg font-semibold text-deep">Canaux de notification</h2><p className="mb-2 text-sm text-muted-foreground">Préférences de démonstration · aucun SMS, e-mail ou push envoyé.</p>{([{ key: "push", label: "Notification push" }, { key: "email", label: "E-mail" }, { key: "sms", label: "SMS" }] as const).map(item => <SettingSwitch key={item.key} id={item.key} label={item.label} checked={value[item.key]} onChange={v => onChange({ ...value, [item.key]: v })} />)}</section>
    <section className="border-t border-border pt-6"><h2 className="mb-2 text-lg font-semibold text-deep">Types de notification</h2>{([{ key: "appointments", label: "Rappels de rendez-vous" }, { key: "messages", label: "Messages" }, { key: "medications", label: "Médicaments" }] as const).map(item => <SettingSwitch key={item.key} id={item.key} label={item.label} checked={value[item.key]} onChange={v => onChange({ ...value, [item.key]: v })} />)}</section>
    <section className="border-t border-border pt-6"><h2 className="text-lg font-semibold text-deep">Ne pas me déranger</h2><p className="mt-2 text-sm text-muted-foreground">Ne pas me déranger de {value.quietStart} à {value.quietEnd}</p><div className="mt-4 grid max-w-md grid-cols-2 gap-4"><div><Label htmlFor="quiet-start">Début</Label><Input className="mt-2" type="time" id="quiet-start" required value={value.quietStart} onChange={e => onChange({ ...value, quietStart: e.target.value })} /></div><div><Label htmlFor="quiet-end">Fin</Label><Input className="mt-2" type="time" id="quiet-end" required value={value.quietEnd} onChange={e => onChange({ ...value, quietEnd: e.target.value })} /></div></div></section>
  </div>;
}