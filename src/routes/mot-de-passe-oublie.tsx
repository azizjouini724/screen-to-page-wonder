import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié · Clinic Copilot" },
      { name: "description", content: "Réinitialisez le mot de passe de votre compte Clinic Copilot." },
      { property: "og:title", content: "Mot de passe oublié · Clinic Copilot" },
      { property: "og:description", content: "Réinitialisez le mot de passe de votre compte Clinic Copilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const schema = z.object({ email: z.string().trim().min(1, "Veuillez saisir votre e-mail.").email("Adresse e-mail invalide.").max(255) });

function Page() {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  if (sent) {
    return (
      <AuthLayout title="Vérifiez vos e-mails">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <MailCheck className="mx-auto h-12 w-12 text-success" />
          <p className="mt-4 text-muted-foreground">Si un compte existe, un lien a été envoyé.</p>
          <Button variant="hero" className="mt-6" asChild><Link to="/connexion">Retour à la connexion</Link></Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Mot de passe oublié" subtitle="Saisissez votre e-mail, nous vous enverrons un lien de réinitialisation.">
      <Form {...form}>
        <form noValidate className="space-y-5" onSubmit={form.handleSubmit(async () => { await new Promise((r) => setTimeout(r, 700)); setSent(true); })}>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" autoComplete="email" className="h-11 bg-card" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" variant="hero" size="lg" className="h-11 w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <><Loader2 className="animate-spin" />Envoi…</> : "Envoyer le lien"}
          </Button>
        </form>
      </Form>
      <Link to="/connexion" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Retour à la connexion</Link>
    </AuthLayout>
  );
}
