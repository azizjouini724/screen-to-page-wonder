import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Bot, ShieldAlert, ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal, SectionTitle } from "@/components/site/Reveal";
import { FeatureCard, StepCard, UrgencyCard, RoleCard } from "@/components/site/Cards";
import {
  PhoneMockup, LaptopMockup, DashboardPreview, PhonePatientHome, PhoneLogin, PhoneChat, PhoneDoctors,
  PatientMini, DoctorMini, AdminMini,
} from "@/components/site/Mockups";
import { features, steps, urgencyLevels, security } from "@/data/landing";
import soignante from "@/assets/soignante.jpg";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { invite?: boolean } => (s["invite"] === true || s["invite"] === "true" ? { invite: true } : {}),
  head: () => ({
    meta: [
      { title: "Clinic Copilot · De vos symptômes, vers les bons soins" },
      { name: "description", content: "Plateforme intelligente d'orientation et de gestion des rendez-vous médicaux, assistée par l'IA." },
      { property: "og:title", content: "Clinic Copilot · De vos symptômes, vers les bons soins" },
      { property: "og:description", content: "Orientation médicale prudente et prise de rendez-vous assistées par l'IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { invite } = Route.useSearch();
  const navigate = useNavigate();
  useEffect(() => {
    if (invite) {
      toast.info("Vous naviguez en tant qu'invité", { description: "Créez un compte pour réserver un rendez-vous : l'invité ne peut pas réserver." });
      navigate({ to: "/", search: {}, replace: true });
    }
  }, [invite, navigate]);
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-soft">
          <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-tertiary/15 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-sm font-medium text-primary"><Bot className="h-4 w-4" />Orientation médicale assistée par l'IA</span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-deep sm:text-5xl lg:text-6xl">
                De vos symptômes, <span className="text-gradient">vers les bons soins.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">Une plateforme intelligente d'orientation et de gestion des rendez-vous médicaux, assistée par l'IA.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild><Link to="/inscription">Commencer <ArrowRight /></Link></Button>
                <Button variant="soft" size="lg" asChild><a href="#fonctionnalites">En savoir plus</a></Button>
              </div>
            </Reveal>
            <Reveal delay={150} className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-6 rotate-6 rounded-[3rem] bg-gradient-primary opacity-20" />
              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-tertiary/25" />
              <img src={soignante} alt="Soignante souriante en tenue médicale avec un stéthoscope" width={896} height={1120} className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft" />
              <div className="absolute -left-4 top-10 max-w-[230px] rounded-2xl rounded-tl-sm bg-card p-4 shadow-soft sm:-left-12">
                <p className="text-sm font-medium text-deep">Bonjour ! Comment puis-je vous aider aujourd'hui ?</p>
              </div>
              <div className="absolute -right-2 bottom-10 flex items-center gap-2 rounded-full bg-deep px-4 py-2 text-sm font-semibold text-deep-foreground shadow-soft sm:-right-6">
                <Bot className="h-4 w-4 text-tertiary" /> IA Assistant
              </div>
            </Reveal>
          </div>
        </section>

        {/* Aperçu */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="Aperçu" title="Votre tableau de bord santé" text="Tout ce dont vous avez besoin, sur ordinateur comme sur mobile." />
          <Reveal className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 lg:block">
            <LaptopMockup className="lg:w-[82%]"><DashboardPreview /></LaptopMockup>
            <PhoneMockup className="lg:absolute lg:-bottom-6 lg:right-0"><PhonePatientHome /></PhoneMockup>
          </Reveal>
        </section>

        {/* Features */}
        <section id="fonctionnalites" className="scroll-mt-20 bg-soft/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle eyebrow="Fonctionnalités" title="Une seule plateforme, tout votre parcours santé" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {features.map((f, i) => <Reveal key={f.title} delay={i * 70}><FeatureCard {...f} /></Reveal>)}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="comment-ca-marche" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="Comment ça marche" title="Six étapes, en toute simplicité" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => <Reveal key={s.title} delay={i * 70}><StepCard n={i + 1} {...s} /></Reveal>)}
          </div>
        </section>

        {/* Urgency */}
        <section className="bg-gradient-soft py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle eyebrow="Orientation" title="Quatre niveaux d'orientation" text="Chaque situation reçoit une réponse adaptée et prudente." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {urgencyLevels.map((u, i) => <Reveal key={u.level} delay={i * 70}><UrgencyCard {...u} /></Reveal>)}
            </div>
            <Reveal className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border-2 border-destructive/30 bg-card p-5 shadow-soft">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
              <p className="font-semibold text-deep">Orientation, pas un diagnostic. <span className="font-normal text-muted-foreground">Clinic Copilot ne remplace ni un médecin ni les services d'urgence.</span></p>
            </Reveal>
          </div>
        </section>

        {/* Espaces */}
        <section id="espaces" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="Espaces" title="Un espace adapté à chaque rôle" />
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal><RoleCard title="Espace Patient" tagline="Simple, rapide et rassurant."><PatientMini /></RoleCard></Reveal>
            <Reveal delay={100}><RoleCard title="Espace Médecin" tagline="Gérez votre agenda et vos patients."><DoctorMini /></RoleCard></Reveal>
            <Reveal delay={200}><RoleCard title="Espace Administrateur" tagline="Supervisez, sécurisez, organisez."><AdminMini /></RoleCard></Reveal>
          </div>
        </section>

        {/* Android */}
        <section className="overflow-hidden bg-deep py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle light eyebrow="Application Android" title="Votre santé, toujours avec vous." text="Retrouvez l'assistant, vos médecins et vos rendez-vous dans votre poche." />
            <Reveal className="flex flex-wrap justify-center gap-8">
              <PhoneMockup><PhoneLogin /></PhoneMockup>
              <PhoneMockup className="lg:-translate-y-6"><PhoneChat /></PhoneMockup>
              <PhoneMockup><PhoneDoctors /></PhoneMockup>
            </Reveal>
            <div className="mt-10 flex justify-center"><Button variant="light" size="lg"><Smartphone />Bientôt sur Google Play</Button></div>
          </div>
        </section>

        {/* Sécurité */}
        <section id="securite" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="Sécurité" title="Sécurité et confidentialité" text="Vos données de santé méritent la plus grande protection." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {security.map((s, i) => <Reveal key={s.title} delay={i * 70}><FeatureCard {...s} /></Reveal>)}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <Reveal className="mx-auto max-w-5xl rounded-3xl bg-gradient-primary p-10 text-center shadow-soft sm:p-14">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">Prêt à être bien orienté ?</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">Créez votre compte gratuitement et laissez l'IA vous guider vers les bons soins.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="light" size="lg" asChild><Link to="/inscription">Commencer</Link></Button>
              <Button variant="ghost" size="lg" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild><Link to="/connexion">Se connecter</Link></Button>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
