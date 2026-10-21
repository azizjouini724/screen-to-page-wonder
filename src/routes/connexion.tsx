import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { demoAccounts, DEMO_PASSWORD, roleLabels } from "@/data/auth";
import { roleHome } from "@/lib/auth";

const searchSchema = z.object({ raison: z.enum(["auth", "role"]).optional() });

export const Route = createFileRoute("/connexion")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Connexion · Clinic Copilot" },
      { name: "description", content: "Connectez-vous à votre compte Clinic Copilot." },
      { property: "og:title", content: "Connexion · Clinic Copilot" },
      { property: "og:description", content: "Connectez-vous à votre compte Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ConnexionPage,
});

const schema = z.object({
  email: z.string().trim().min(1, "Veuillez saisir votre e-mail.").email("Adresse e-mail invalide.").max(255),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.").max(128),
  remember: z.boolean(),
});
type Values = z.infer<typeof schema>;

function ConnexionPage() {
  const { raison } = Route.useSearch();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", remember: true } });
  const loading = form.formState.isSubmitting;

  const onSubmit = async (v: Values) => {
    setError(null);
    const u = await login(v.email, v.password, v.remember);
    if (!u) { setError("E-mail ou mot de passe incorrect."); return; }
    navigate({ to: roleHome[u.role] });
  };

  return (
    <AuthLayout title="Connexion" subtitle="Heureux de vous revoir. Connectez-vous à votre espace.">
      {raison && (
        <Alert className="mb-6 border-warning/40 bg-warning/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{raison === "role" ? "Vous n'avez pas accès à cet espace avec votre compte." : "Veuillez vous connecter pour accéder à votre espace."}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" autoComplete="email" placeholder="vous@exemple.fr" className="h-11 bg-card" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Mot de passe</FormLabel><FormControl><PasswordInput autoComplete="current-password" className="h-11 bg-card" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="flex items-center justify-between gap-4">
            <FormField control={form.control} name="remember" render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} /></FormControl>
                <FormLabel className="font-normal">Se souvenir de moi</FormLabel>
              </FormItem>
            )} />
            <Link to="/mot-de-passe-oublie" className="text-sm font-medium text-primary hover:underline">Mot de passe oublié ?</Link>
          </div>
          {error && <p role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
          <Button type="submit" variant="hero" size="lg" className="h-11 w-full" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" />Connexion…</> : "Se connecter"}
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-3 text-sm text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
      <Button variant="soft" size="lg" className="h-11 w-full" asChild>
        <Link to="/" search={{ invite: true }}><UserRound />Continuer en tant qu'invité</Link>
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">Pas encore de compte ? <Link to="/inscription" className="font-semibold text-primary hover:underline">Créer un compte</Link></p>

      <div className="mt-8 rounded-2xl border border-border bg-card/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comptes de démonstration</p>
        <p className="mt-1 text-xs text-muted-foreground">Mot de passe : <span className="font-mono font-semibold text-foreground">{DEMO_PASSWORD}</span></p>
        <ul className="mt-3 space-y-2">
          {demoAccounts.map((a) => (
            <li key={a.email} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate"><span className="font-semibold text-deep">{roleLabels[a.role]}</span> <span className="text-muted-foreground">· {a.email}</span></span>
              <Button type="button" size="sm" variant="ghost" className="shrink-0 text-primary"
                onClick={() => { form.setValue("email", a.email, { shouldValidate: true }); form.setValue("password", DEMO_PASSWORD, { shouldValidate: true }); setError(null); }}>
                Utiliser
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
}
