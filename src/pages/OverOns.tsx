import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  FlashIcon,
  ChartIncreaseIcon,
  PaintBrushIcon,
  HeadsetIcon,
  Clock01Icon,
  ShieldKeyIcon,
  RocketIcon,
  Target02Icon,
  HeartCheckIcon,
} from "@hugeicons/core-free-icons";
import { SilkWaves } from "@/components/SilkWaves";
import { ReviewsSection } from "@/components/ReviewsSection";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";

const stats = [
  { value: "120+", label: "Projecten gelanceerd" },
  { value: "8 jr", label: "Ervaring online" },
  { value: "98%", label: "Klanttevredenheid" },
  { value: "7 dgn", label: "Gem. live-tijd" },
];

const values = [
  {
    icon: FlashIcon,
    title: "Alles onder één dak",
    desc: "Website, advertenties, SEO en automatisering. Eén team dat alles voor je regelt.",
  },
  {
    icon: ChartIncreaseIcon,
    title: "Resultaatgericht",
    desc: "Elke euro die je investeert moet renderen. Wij sturen op conversies en groei.",
  },
  {
    icon: PaintBrushIcon,
    title: "Volledig op maat",
    desc: "Geen templates. Jouw merk verdient een unieke uitstraling en aanpak.",
  },
  {
    icon: HeadsetIcon,
    title: "Persoonlijk contact",
    desc: "Eén vast aanspreekpunt. Korte lijnen, snelle antwoorden, geen tussenlagen.",
  },
  {
    icon: Clock01Icon,
    title: "Snel live",
    desc: "Website binnen 7 dagen. Campagnes draaien binnen 48 uur. Geen maanden wachten.",
  },
  {
    icon: ShieldKeyIcon,
    title: "Transparante prijzen",
    desc: "Vaste tarieven zonder verrassingen. Je weet altijd waar je aan toe bent.",
  },
];

const principles = [
  {
    icon: Target02Icon,
    title: "Focus op groei",
    desc: "We werken alleen aan zaken die meetbaar bijdragen aan jouw omzet en bereik.",
  },
  {
    icon: HeartCheckIcon,
    title: "Eerlijk advies",
    desc: "We adviseren wat het beste voor jou is, ook als dat betekent dat je minder bij ons afneemt.",
  },
  {
    icon: RocketIcon,
    title: "Continu verbeteren",
    desc: "Een website of campagne is nooit klaar. We blijven testen, leren en optimaliseren.",
  },
];

export default function OverOns() {
  useEffect(() => {
    updatePageMeta(
      "Over ons - Webiro",
      "Webiro is een digitaal bureau dat ondernemers helpt online te groeien met websites, marketing en automatisering."
    );
  }, []);

  return (
    <main className="bg-background">
      <StructuredData type="Organization" />

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden bg-background pt-[60px]">
        <SilkWaves />
        <div
          className="absolute inset-y-0 left-0 w-[65%] pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to right, hsl(var(--background)) 50%, hsl(var(--background)/0.6) 75%, transparent 100%)",
          }}
        />
        <div
          className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36"
          style={{ zIndex: 2 }}
        >
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
              Over Webiro
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.05] mb-8"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
            >
              <span className="text-foreground">De digitale motor</span>
              <br />
              <span className="text-primary">achter ondernemers.</span>
            </h1>
            <p className="text-[16px] lg:text-[17px] text-muted-foreground leading-relaxed mb-10 max-w-[560px]">
              Webiro helpt ondernemers verder te groeien met strakke websites,
              doordachte marketing en een proces dat altijd transparant blijft.
              Geen jargon, geen verrassingen, wel groei.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Plan een kennismaking{" "}
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
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

      {/* ══════ STATS STRIP ══════ */}
      <div className="border-t border-border/60 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/60">
            {stats.map((s) => (
              <div key={s.label} className="py-10 lg:py-12 px-6 first:pl-0">
                <div className="text-[36px] lg:text-[44px] leading-none font-bold tracking-[-0.025em] text-foreground mb-3">
                  {s.value}
                </div>
                <div className="text-[12px] uppercase tracking-[0.14em] font-semibold text-muted-foreground/80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ MISSIE ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">
              Onze missie
            </p>
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">
                Elke ondernemer verdient een professionele online aanwezigheid.
              </span>{" "}
              <span className="text-muted-foreground font-bold">
                Daar werken wij elke dag aan.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="relative rounded-2xl border border-border bg-card overflow-hidden p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-primary/8 pointer-events-none" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <HugeiconsIcon
                      icon={p.icon}
                      className="w-5 h-5 text-primary"
                    />
                  </div>
                  <h3 className="text-[17px] font-bold text-foreground mb-2.5 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WAAROM WEBIRO ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">
              Waarom Webiro
            </p>
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">Wat ons anders maakt.</span>{" "}
              <span className="text-muted-foreground font-bold">
                En wat jij ervan merkt.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
            {values.map((v) => (
              <div key={v.title} className="bg-background p-8 group">
                <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <HugeiconsIcon
                    icon={v.icon}
                    className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="text-[16px] font-bold text-foreground mb-2 tracking-tight">
                  {v.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STORY / WIE WIJ ZIJN ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">
                Ons verhaal
              </p>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)" }}
              >
                <span className="text-foreground">Gebouwd op</span>{" "}
                <span className="text-muted-foreground font-bold">resultaat.</span>
              </h2>
            </div>
            <div className="space-y-6 text-[15.5px] leading-[1.78] text-muted-foreground max-w-[620px]">
              <p>
                Webiro is ontstaan vanuit één observatie: ondernemers betalen vaak
                veel te veel voor digitale diensten die ze niet helemaal begrijpen.
                Websites die te traag zijn, advertenties zonder duidelijk resultaat,
                facturen vol vakjargon.
              </p>
              <p>
                Daarom hebben we Webiro opgezet als een bureau dat <strong className="text-foreground font-semibold">alles
                onder één dak</strong> aanbiedt, van strategie en design tot ontwikkeling, marketing
                en automatisering. Met heldere pakketten, vaste tarieven en een dashboard
                waarin je 24/7 ziet wat er gebeurt.
              </p>
              <p>
                Vandaag werken we voor groeiende bedrijven door heel Nederland, van fitnessclubs
                en advocatenkantoren tot webshops en techniekbedrijven. Wat ze gemeen hebben?
                De ambitie om online verder te komen, en het vertrouwen dat wij dat samen met
                hen kunnen waarmaken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ REVIEWS ══════ */}
      <ReviewsSection />

      {/* ══════ CTA ══════ */}
      <CTASection />
    </main>
  );
}
