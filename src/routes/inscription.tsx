import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Info, Loader2, Stethoscope, UserRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput, PasswordStrength } from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { specialties } from "@/data/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Inscription · Clinic Copilot" },
      { name: "description", content: "Créez votre compte patient ou médecin sur Clinic Copilot." },
      { property: "og:title", content: "Inscription · Clinic Copilot" },
      { property: "og:description", content: "Créez votre compte patient ou médecin sur Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InscriptionPage,
});

const req = (m: string) => z.string().trim().min(1, m);
const schema = z.object({
  role: z.enum(["patient", "medecin"]),
  firstName: req("Veuillez saisir votre prénom.").max(60),
  lastName: req("Veuillez saisir votre nom.").max(60),
  email: req("Veuillez saisir votre e-mail.").email("Adresse e-mail invalide.").max(255),
  phone: req("Veuillez saisir votre téléphone.").regex(/^\+?[0-9 .-]{8,20}$/, "Numéro de téléphone invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.").max(128),
  confirm: z.string(),
  birthDate: z.string().optional(),
  consent: z.boolean().optional(),
  specialty: z.string().optional(),
  orderNumber: z.string().trim().max(30).optional(),
  address: z.string().trim().max(200).optional(),
  languages: z.string().trim().max(120).optional(),
}).superRefine((v, ctx) => {
  const add = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
  if (v.password !== v.confirm) add("confirm", "Les mots de passe ne correspondent pas.");
  if (v.role === "patient") {
    if (!v.birthDate) add("birthDate", "Veuillez saisir votre date de naissance.");
    else if (new Date(v.birthDate) > new Date()) add("birthDate", "Date de naissance invalide.");
    if (!v.consent) add("consent", "Votre consentement est nécessaire pour créer un compte patient.");
  } else {
    if (!v.specialty) add("specialty", "Veuillez choisir une spécialité.");
    if (!v.orderNumber) add("orderNumber", "Veuillez saisir votre numéro d'ordre.");
    if (!v.address) add("address", "Veuillez saisir l'adresse du cabinet.");
    if (!v.languages) add("languages", "Veuillez indiquer les langues parlées.");
  }
});
type Values = z.infer<typeof schema>;

function InscriptionPage() {
  const { register } = useAuth();
  const [done, setDone] = useState<null | { pending: boolean }>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { role: "patient", firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "", birthDate: "", consent: false, specialty: "", orderNumber: "", address: "", languages: "" },
  });
  const role = useWatch({ control: form.control, name: "role" });
  const pw = useWatch({ control: form.control, name: "password" });

  const onSubmit = async (v: Values) => {
    setError(null);
    const res = await register({ firstName: v.firstName, lastName: v.lastName, email: v.email, password: v.password, role: v.role });
    if (!res.ok) { setError(res.error); return; }
    setDone({ pending: v.role === "medecin" });
  };

  if (done) {
    return (
      <AuthLayout title="Compte créé">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <p className="mt-4 text-lg font-semibold text-deep">Votre compte a bien été créé.</p>
          <p className="mt-2 text-muted-foreground">Vous pouvez maintenant vous connecter.</p>
          {done.pending && <p className="mt-4 rounded-lg bg-warning/10 p-3 text-sm font-medium text-deep">Votre compte est en attente de vérification.</p>}
          <Button variant="hero" size="lg" className="mt-6" asChild><Link to="/connexion">Se connecter</Link></Button>
        </div>
      </AuthLayout>
    );
  }

  const inputCls = "h-11 bg-card";
  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez Clinic Copilot en quelques minutes.">
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Type de compte</FormLabel>
              <div role="radiogroup" aria-label="Type de compte" className="grid grid-cols-2 gap-3">
                {([["patient", "Patient", "Orientation et rendez-vous", UserRound], ["medecin", "Médecin", "Agenda et patients", Stethoscope]] as const).map(([val, label, desc, Icon]) => (
                  <button key={val} type="button" role="radio" aria-checked={field.value === val} onClick={() => field.onChange(val)}
                    className={cn("rounded-2xl border-2 bg-card p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      field.value === val ? "border-primary shadow-soft" : "border-border hover:border-primary/40")}>
                    <span className={cn("mb-2 grid h-10 w-10 place-items-center rounded-xl", field.value === val ? "bg-gradient-primary text-primary-foreground" : "bg-soft text-primary")}><Icon className="h-5 w-5" /></span>
                    <span className="block font-semibold text-deep">{label}</span>
                    <span className="block text-xs text-muted-foreground">{desc}</span>
                  </button>
                ))}
              </div>
            </FormItem>
          )} />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Prénom</FormLabel><FormControl><Input autoComplete="given-name" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Nom</FormLabel><FormControl><Input autoComplete="family-name" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" autoComplete="email" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input type="tel" autoComplete="tel" placeholder="+33 6 12 34 56 78" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Mot de passe</FormLabel><FormControl><PasswordInput autoComplete="new-password" className={inputCls} {...field} /></FormControl><PasswordStrength value={pw} /><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="confirm" render={({ field }) => (<FormItem><FormLabel>Confirmation</FormLabel><FormControl><PasswordInput autoComplete="new-password" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>

          {role === "patient" ? (
            <>
              <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem><FormLabel>Date de naissance</FormLabel><FormControl><Input type="date" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="consent" render={({ field }) => (
                <FormItem className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <FormControl><Checkbox className="mt-0.5" checked={field.value ?? false} onCheckedChange={(c) => field.onChange(c === true)} /></FormControl>
                    <FormLabel className="font-normal leading-relaxed">
                      J'accepte le traitement de mes données de santé pour recevoir une orientation et gérer mes rendez-vous.{" "}
                      <a href="/#securite" className="font-semibold text-primary hover:underline">En savoir plus</a>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField control={form.control} name="specialty" render={({ field }) => (
                  <FormItem><FormLabel>Spécialité</FormLabel>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className="h-11 bg-card"><SelectValue placeholder="Choisir une spécialité" /></SelectTrigger></FormControl>
                      <SelectContent>{specialties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="orderNumber" render={({ field }) => (<FormItem><FormLabel>Numéro d'ordre</FormLabel><FormControl><Input className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Adresse du cabinet</FormLabel><FormControl><Input autoComplete="street-address" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="languages" render={({ field }) => (<FormItem><FormLabel>Langues parlées</FormLabel><FormControl><Input placeholder="Français, arabe, anglais" className={inputCls} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <p className="flex gap-2 rounded-xl bg-info/10 p-3 text-sm text-deep"><Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />Votre compte sera vérifié par un administrateur avant d'apparaître dans l'annuaire.</p>
            </>
          )}

          {error && <p role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
          <Button type="submit" variant="hero" size="lg" className="h-11 w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <><Loader2 className="animate-spin" />Création…</> : "Créer mon compte"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">Déjà un compte ? <Link to="/connexion" className="font-semibold text-primary hover:underline">Se connecter</Link></p>
        </form>
      </Form>
    </AuthLayout>
  );
}
