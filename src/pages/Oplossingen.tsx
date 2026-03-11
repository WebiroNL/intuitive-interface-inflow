import { useEffect } from "react";
import { Link } from "react-router-dom";
import { updatePageMeta } from "@/utils/seo";
import { StructuredData } from "@/components/StructuredData";
import { CTASection } from "@/components/CTASection";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Globe02Icon,
  ChartIncreaseIcon,
  AiBrainIcon,
  Mail01Icon,
  Search01Icon,
  BarChartIcon,
  Megaphone01Icon,
  PaintBrushIcon,
  CheckmarkCircle02Icon,
  FlashIcon,
  Target01Icon,
  UserGroup02Icon,
  ChartLineData01Icon,
} from "@hugeicons/core-free-icons";

const solutions = [
  {
    icon: Globe02Icon,
    tag: "Websites",
    title: "Professionele websites",
    description: "Moderne, snelle websites die bezoekers omzetten in klanten. Op maat gebouwd voor jouw merk en doelgroep.",
    features: ["Responsive design", "SEO-geoptimaliseerd", "CMS-integratie", "Snelle laadtijden"],
    link: "/pakketten",
    linkText: "Bekijk websitepakketten",
    color: "primary",
  },
  {
    icon: Megaphone01Icon,
    tag: "Advertising",
    title: "Google & Meta Ads",
    description: "Gerichte advertentiecampagnes die de juiste klanten bereiken. Van setup tot optimalisatie en rapportage.",
    features: ["Google Ads beheer", "Meta/Facebook Ads", "Retargeting campagnes", "Maandelijkse rapportages"],
    link: "/pakketten",
    linkText: "Bekijk marketing diensten",
    color: "accent",
  },
  {
    icon: Mail01Icon,
    tag: "E-mail",
    title: "E-mail marketing & automation",
    description: "Automatische e-mailflows die leads opwarmen en klanten behouden. Van welkomstreeks tot re-engagement.",
    features: ["Geautomatiseerde flows", "Segmentatie", "A/B testing", "Performance analytics"],
    link: "/pakketten",
    linkText: "Meer over automation",
    color: "primary",
  },
  {
    icon: AiBrainIcon,
    tag: "AI",
    title: "AI chatbots & leadgeneratie",
    description: "Slimme chatbots die 24/7 vragen beantwoorden, afspraken inplannen en leads kwalificeren.",
    features: ["24/7 beschikbaar", "Lead-kwalificatie", "Agenda-integratie", "Meertalig"],
    link: "/pakketten",
    linkText: "Ontdek AI mogelijkheden",
    color: "accent",
  },
  {
    icon: Search01Icon,
    tag: "SEO",
    title: "Zoekmachine optimalisatie",
    description: "Hoger in Google verschijnen met een doordachte SEO-strategie. Meer organisch verkeer, minder advertentiekosten.",
    features: ["Keyword research", "On-page optimalisatie", "Technische SEO", "Content strategie"],
    link: "/pakketten",
    linkText: "SEO aanvragen",
    color: "primary",
  },
  {
    icon: PaintBrushIcon,
    tag: "Branding",
    title: "Branding & visuele identiteit",
    description: "Een herkenbaar merk dat vertrouwen wekt. Logo, huisstijl, typografie en brandguide voor consistente communicatie.",
    features: ["Logo ontwerp", "Huisstijl & kleuren", "Typografie", "Brand guidelines"],
    link: "/pakketten",
    linkText: "Branding aanvragen",
    color: "accent",
  },
];

const process = [
  { step: "01", title: "Analyse", desc: "We analyseren je markt, concurrenten en doelgroep om de beste strategie te bepalen." },
  { step: "02", title: "Strategie", desc: "Een concreet plan met doelen, KPI's en een tijdlijn voor maximaal resultaat." },
  { step: "03", title: "Uitvoering", desc: "We bouwen, lanceren en optimaliseren — jij focust op je bedrijf." },
  { step: "04", title: "Groei", desc: "Doorlopende optimalisatie en rapportage zorgen voor structurele groei." },
];

const results = [
  { number: "3x", label: "meer leads gemiddeld" },
  { number: "50+", label: "bedrijven geholpen" },
  { number: "7 dagen", label: "gemiddelde levertijd" },
  { number: "98%", label: "klanttevredenheid" },
];

const Oplossingen = () => {
  useEffect(() => {
    updatePageMeta(
      "Oplossingen – Groei je bedrijf met Webiro",
      "Ontdek hoe Webiro bedrijven helpt groeien met professionele websites, marketing, AI chatbots en branding. Alles onder één dak."
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
              Alles wat je nodig hebt om online te groeien
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
            >
              <span className="text-foreground">Één partner voor je </span>
              <span className="text-primary/70">volledige digitale groei.</span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl mb-8">
              Van een professionele website tot advertenties, automatisering en AI — wij helpen ondernemers en MKB-bedrijven om structureel meer klanten te genereren.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/intake"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Gratis strategiegesprek <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
              <Link
                to="/pakketten"
                className="inline-flex items-center gap-2 px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
              >
                Bekijk diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ RESULTS STATS ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {results.map(({ number, label }) => (
              <div key={label} className="px-8 first:pl-0 last:pr-0 py-4">
                <p className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-1">{number}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SOLUTIONS GRID ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-2xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              Onze oplossingen
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Wij bieden een compleet pakket aan digitale diensten. Of je nu een website nodig hebt, meer klanten wilt genereren, of je processen wilt automatiseren.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solutions.map((sol) => (
              <div
                key={sol.title}
                className="relative rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-all flex flex-col"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${sol.color === 'primary' ? 'from-primary/4 to-primary/8' : 'from-accent/4 to-accent/8'} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className="relative p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sol.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                      <HugeiconsIcon icon={sol.icon} size={20} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{sol.tag}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-foreground mb-2">{sol.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">{sol.description}</p>
                  <ul className="space-y-2 mb-6">
                    {sol.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className={`flex-shrink-0 ${sol.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Link
                      to={sol.link}
                      className={`inline-flex items-center gap-1.5 text-[14px] font-semibold ${sol.color === 'primary' ? 'text-primary' : 'text-accent'} hover:gap-3 transition-all`}
                    >
                      {sol.linkText} <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW WE WORK ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
              >
                Hoe wij bedrijven laten groeien
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                Geen vage beloftes, maar een bewezen aanpak. Wij combineren design, technologie en marketing tot één gestroomlijnde strategie die meetbaar resultaat oplevert.
              </p>
              <Link
                to="/proces"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:gap-3 transition-all"
              >
                Meer over ons proces <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
            </div>

            <div className="space-y-6">
              {process.map((p) => (
                <div key={p.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                    <span className="text-[14px] font-bold text-primary">{p.step}</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground mb-1">{p.title}</h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ WHY WEBIRO ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-2xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08] mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              Waarom bedrijven voor Webiro kiezen
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FlashIcon, title: "Snel geleverd", desc: "Geen maanden wachten. Jouw website of campagne is binnen 7 dagen live." },
              { icon: Target01Icon, title: "Resultaatgericht", desc: "Alles wat we doen is gericht op meetbaar resultaat: meer leads, meer omzet." },
              { icon: UserGroup02Icon, title: "Persoonlijk contact", desc: "Je werkt direct met de maker. Geen tussenlagen, geen verrassingen." },
              { icon: ChartLineData01Icon, title: "Data-gedreven", desc: "Beslissingen op basis van data, niet onderbuikgevoel. Transparante rapportages." },
              { icon: BarChartIcon, title: "Schaalbaar", desc: "Van je eerste website tot een volledige marketing-machine. Groei in je eigen tempo." },
              { icon: CheckmarkCircle02Icon, title: "Alles onder één dak", desc: "Website, marketing, branding en automation — je hoeft niet te shoppen bij 5 bureaus." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <HugeiconsIcon icon={icon} size={20} className="text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Oplossingen;
