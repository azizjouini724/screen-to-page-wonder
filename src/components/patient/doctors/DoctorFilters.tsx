import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languagesList, specialtiesList } from "@/data/doctors";

export type SortKey = "proximite" | "note" | "disponibilite";
export type Filters = { q: string; specialty: string; today: boolean; language: string; sort: SortKey };
export const defaultFilters: Filters = { q: "", specialty: "all", today: false, language: "all", sort: "proximite" };

export function DoctorFilters({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const set = (p: Partial<Filters>) => onChange({ ...value, ...p });
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Label htmlFor="doc-q" className="sr-only">Rechercher un médecin</Label>
        <Input id="doc-q" type="search" value={value.q} onChange={(e) => set({ q: e.target.value })} placeholder="Nom ou spécialité" className="h-11 rounded-full bg-background pl-9" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="f-spec" className="mb-1.5 block text-xs text-muted-foreground">Spécialité</Label>
          <Select value={value.specialty} onValueChange={(v) => set({ specialty: v })}>
            <SelectTrigger id="f-spec" className="h-10 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Toutes les spécialités</SelectItem>{specialtiesList.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="f-lang" className="mb-1.5 block text-xs text-muted-foreground">Langue</Label>
          <Select value={value.language} onValueChange={(v) => set({ language: v })}>
            <SelectTrigger id="f-lang" className="h-10 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">Toutes les langues</SelectItem>{languagesList.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="f-sort" className="mb-1.5 block text-xs text-muted-foreground">Trier par</Label>
          <Select value={value.sort} onValueChange={(v) => set({ sort: v as SortKey })}>
            <SelectTrigger id="f-sort" className="h-10 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="proximite">Proximité</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="disponibilite">Disponibilité</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Label htmlFor="f-today" className="flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-input bg-background px-3 font-normal">
            Disponible aujourd'hui
            <Switch id="f-today" checked={value.today} onCheckedChange={(v) => set({ today: v })} />
          </Label>
        </div>
      </div>
    </div>
  );
}
