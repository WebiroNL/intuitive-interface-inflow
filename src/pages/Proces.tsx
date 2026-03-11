import { useEffect } from "react";
import { Link } from "react-router-dom";
import { updatePageMeta } from "@/utils/seo";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Handshake01Icon,
  PaintBrushIcon,
  RocketIcon,
  MessageMultiple01Icon,
  Search01Icon,
  BarChart01Icon,
  AiBrainIcon,
  Mail01Icon,
  Megaphone01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";

/* ─── Shared step data ─── */
const websiteSteps = [
  {
    number: "01",
    icon: Handshake01Icon,
    title: "Kennismaking & briefing",
    duration: "Dag 1",
    description:
      "We starten met een gratis strategiegesprek. We bespreken je doelen, doelgroep, stijlvoorkeur en concurrenten. Je ontvangt een heldere offerte zonder verplichtingen.",
    deliverables: ["Gratis intake gesprek", "Doelgroep- en concurrentie-analyse", "Offerte met vaste prijs", "Projectplanning"],
  },
  {
    number: "02",
    icon: PaintBrushIcon,
    title: "Design & revisies",
    duration: "Dag 2–5",
    description:
      "Op basis van de briefing ontwerpen we jouw website. Je ontvangt een eerste designvoorstel en we verfijnen totdat je 100% tevreden bent.",
    deliverables: ["Designvoorstel binnen 3 dagen", "Tot 3 revisierondes", "Eigen branding integratie", "Directe feedback via WhatsApp"],
  },
  {
    number: "03",
    icon: RocketIcon,
    title: "Development & lancering",
    duration: "Dag 5–7",
    description:
      "Je website wordt gebouwd, getest op alle apparaten en geoptimaliseerd voor zoekmachines. Daarna gaat hij live.",
    deliverables: ["Responsive op alle apparaten", "SEO-optimalisatie", "Domein & hosting configuratie", "CMS training (indien van toepassing)"],
  },
  {
    number: "04",
    icon: MessageMultiple01Icon,
    title: "Support & groei",
    duration: "Doorlopend",
    description:
      "Na lancering blijven we beschikbaar. We monitoren, optimaliseren en helpen je groeien met doorlopende support.",
    deliverables: ["Supportperiode bij elk pakket", "Snelle reactie via e-mail/WhatsApp", "Optioneel onderhoudspakket", "Maandelijkse rapportages"],
  },
];

const marketingSteps = [
  {
    number: "01",
    icon: Search01Icon,
    title: "Analyse & strategie",
    duration: "Week 1",
    description:
      "We analyseren je huidige situatie, markt en concurrenten. Op basis daarvan stellen we een concrete groeistrategie op met duidelijke KPI's.",
    deliverables: ["Markt- en concurrentieanalyse", "Doelgroep segmentatie", "KPI-definitie", "Kanaalstrategie"],
  },
  {
    number: "02",
    icon: Megaphone01Icon,
    title: "Setup & lancering",
    duration: "Week 2",
    description:
      "We richten alle campagnes en tools in: advertentieplatforms, tracking, landingspagina's en automatiseringen.",
    deliverables: ["Google & Meta Ads setup", "Conversion tracking", "Landingspagina optimalisatie", "E-mail automation flows"],
  },
  {
    number: "03",
    icon: BarChart01Icon,
    title: "Optimalisatie & schaling",
    duration: "Maand 1–3",
    description:
      "Op basis van data optimaliseren we continu. A/B-testen, budgetverdeling aanpassen en de best presterende kanalen opschalen.",
    deliverables: ["Wekelijkse optimalisatierondes", "A/B testing", "Budgetoptimalisatie", "Conversie-verbetering"],
  },
  {
    number: "04",
    icon: AiBrainIcon,
    title: "Automatiseren & opschalen",
    duration: "Doorlopend",
    description:
      "We bouwen systemen die automatisch leads genereren en opvolgen. Chatbots, e-mailflows en rapportages op autopilot.",
    deliverables: ["AI chatbot implementatie", "Lead nurturing automation", "Maandelijkse performance rapportage", "Schaalstrategie"],
  },
];

const faqs = [
  {
    q: "Hoe snel kan mijn website live staan?",
    a: "Afhankelijk van het pakket is je website binnen 7 tot 21 dagen live. Een one-pager kan al binnen 1 week online staan.",
  },
  {
    q: "Wat heb ik nodig om te starten?",
    a: "Alleen je bedrijfsgegevens, logo (indien aanwezig) en eventuele foto's. Wij helpen je met de rest, inclusief teksten en domeinnaam.",
  },
  {
    q: "Kan ik later zelf aanpassingen maken?",
    a: "Ja! Alle pakketten komen met een gebruiksvriendelijk CMS waarmee je zelf content, teksten en afbeeldingen kunt aanpassen.",
  },
  {
    q: "Hoe meten jullie het succes van marketing?",
    a: "We werken met duidelijke KPI's: leads, conversiepercentage, kosten per lead en ROI. Je ontvangt maandelijks een transparant rapport.",
  },
  {
    q: "Kan ik marketing afnemen zonder website?",
    a: "Ja, als je al een website hebt kunnen we direct starten met marketing. We analyseren je huidige site en optimaliseren waar nodig.",
  },
  {
    q: "Wat als ik niet tevreden ben?",
    a: "We werken met revisierondes zodat je bij elke stap controle hebt. Je betaalt pas bij akkoord op het eindresultaat.",
  },
];

const Proces = () => {
  useEffect(() => {
    updatePageMeta(
      "Proces – Hoe wij werken | Webiro",
      "Van eerste gesprek tot lancering in 4 heldere stappen. Transparant, efficiënt en zonder gedoe. Ontdek ons proces voor websites en marketing."
    );
  }, []);

  return (
    <main className="bg-background pt-[60px]">
      <StructuredData type="Service" />

      {/* ══════ HERO ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">
              Ons werkproces
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
            >
              <span className="text-foreground">Van idee naar resultaat.</span>{" "}
              <span className="text-muted-foreground font-bold">In 4 heldere stappen.</span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl mb-8">
              Of je nu een website nodig hebt of meer klanten wilt genereren — ons proces is
              transparant, efficiënt en gericht op resultaat.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/intake"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Start je project <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
              <Link
                to="/pakketten"
                className="inline-flex items-center gap-2 px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
              >
                Bekijk pakketten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ WEBSITE PROCESS ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={Globe02Icon} size={16} className="text-primary" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Website traject
            </span>
          </div>
          <h2
            className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
          >
            Website binnen 7 dagen live
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-14">
            Van briefing naar professionele website in 4 stappen. Elk project krijgt persoonlijke
            aandacht en transparante communicatie.
          </p>

          <div className="space-y-6">
            {websiteSteps.map((step) => (
              <div
                key={step.number}
                className="grid lg:grid-cols-[200px_1fr] gap-6 p-6 lg:p-8 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors"
              >
                <div className="flex lg:flex-col items-center lg:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={step.icon} size={22} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-primary tracking-wide">STAP {step.number}</span>
                    <p className="text-[12px] text-muted-foreground">{step.duration}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.deliverables.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-primary flex-shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ MARKETING PROCESS ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <HugeiconsIcon icon={BarChart01Icon} size={16} className="text-accent" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Marketing traject
            </span>
          </div>
          <h2
            className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
          >
            Structureel meer klanten genereren
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl mb-14">
            Van analyse tot schaalbare groei. We bouwen een marketing-machine die elke maand meer
            leads en klanten oplevert.
          </p>

          <div className="space-y-6">
            {marketingSteps.map((step) => (
              <div
                key={step.number}
                className="grid lg:grid-cols-[200px_1fr] gap-6 p-6 lg:p-8 rounded-2xl border border-border bg-card hover:border-accent/20 transition-colors"
              >
                <div className="flex lg:flex-col items-center lg:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/8 flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={step.icon} size={22} className="text-accent" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-accent tracking-wide">STAP {step.number}</span>
                    <p className="text-[12px] text-muted-foreground">{step.duration}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.deliverables.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-accent flex-shrink-0" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
            <div>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
              >
                Veelgestelde vragen
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Nog vragen? Neem gerust contact met ons op voor een vrijblijvend gesprek.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all"
              >
                Contact opnemen <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="text-[15px] font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Proces;
