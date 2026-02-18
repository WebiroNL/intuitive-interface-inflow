import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Zap, Palette, Headphones, TrendingUp, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";
import { useTheme } from "@/contexts/ThemeContext";

/* ─── Stripe-style flowing wave ribbons ─── */
const StripeWave = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 0 }}>
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid slice"
      className="absolute top-0 right-0 h-full w-auto max-w-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: "65%" }}
    >
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="hsl(234,82%,57%)" stopOpacity="0.88" />
          <stop offset="40%" stopColor="hsl(259,79%,61%)" stopOpacity="0.82" />
          <stop offset="100%" stopColor="hsl(280,70%,55%)" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="wg2" x1="10%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="hsl(28,100%,58%)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(5,90%,63%)" stopOpacity="0.82" />
          <stop offset="100%" stopColor="hsl(330,80%,58%)" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="hsl(320,75%,62%)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="hsl(259,79%,61%)" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="wg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(44,100%,62%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(18,100%,58%)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="wg5" x1="0%" y1="20%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200,100%,72%)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(234,82%,57%)" stopOpacity="0.4" />
        </linearGradient>
        <filter id="wblur"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <path d="M 1200 -100 C 1000 80, 820 220, 620 920 L 820 920 C 1000 240, 1180 90, 1400 -100 Z" fill="url(#wg1)" filter="url(#wblur)" />
      <path d="M 1380 -140 C 1200 40, 1020 200, 800 920 L 960 920 C 1160 210, 1340 50, 1540 -140 Z" fill="url(#wg2)" filter="url(#wblur)" />
      <path d="M 1100 -80 C 940 100, 780 280, 580 920 L 680 920 C 860 285, 1020 105, 1200 -80 Z" fill="url(#wg3)" filter="url(#wblur)" />
      <path d="M 1300 -50 C 1160 90, 1060 230, 940 920 L 1050 920 C 1160 240, 1260 100, 1420 -50 Z" fill="url(#wg4)" filter="url(#wblur)" />
      <path d="M 1440 -120 C 1360 60, 1280 260, 1180 920 L 1260 920 C 1360 264, 1440 64, 1540 -120 Z" fill="url(#wg5)" filter="url(#wblur)" />
    </svg>
  </div>
);

/* ─── Fake website mockup for bento cards ─── */
const WebsiteMockup = ({ accent }: { accent: "primary" | "accent" }) => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card" style={{ aspectRatio: "16/10" }}>
    {/* Browser chrome */}
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-[hsl(44,90%,60%)]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    {/* Page content preview */}
    <div className={`absolute inset-0 top-9 ${accent === "primary" ? "bg-gradient-to-br from-primary/5 via-background to-primary/10" : "bg-gradient-to-br from-accent/5 via-background to-accent/10"}`}>
      {/* Nav */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <div className={`w-12 h-3 rounded-sm ${accent === "primary" ? "bg-primary/40" : "bg-accent/40"}`} />
        <div className="flex gap-2 ml-auto">
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className={`w-14 h-5 rounded-sm ${accent === "primary" ? "bg-primary/60" : "bg-accent/60"}`} />
        </div>
      </div>
      {/* Hero area */}
      <div className="px-4 py-4">
        <div className="w-3/4 h-4 rounded bg-foreground/15 mb-2" />
        <div className="w-1/2 h-3 rounded bg-foreground/10 mb-4" />
        <div className={`w-20 h-6 rounded ${accent === "primary" ? "bg-primary/50" : "bg-accent/50"}`} />
      </div>
      {/* Cards row */}
      <div className="absolute bottom-3 left-4 right-4 grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/30 bg-background/60 p-2">
            <div className={`w-6 h-6 rounded mb-1.5 ${accent === "primary" ? "bg-primary/30" : "bg-accent/30"}`} />
            <div className="w-full h-2 rounded bg-foreground/10 mb-1" />
            <div className="w-2/3 h-1.5 rounded bg-foreground/8" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Marketing dashboard mockup ─── */
const MarketingMockup = () => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card" style={{ aspectRatio: "16/10" }}>
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-[hsl(44,90%,60%)]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    <div className="absolute inset-0 top-9 bg-gradient-to-br from-accent/5 via-background to-accent/10 p-3">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[["1.240", "Leads"], ["€4.20", "CPC"], ["34%", "Conv."]].map(([v, l]) => (
          <div key={l} className="rounded-lg border border-border/30 bg-background/60 px-2 py-1.5">
            <p className="text-[9px] font-bold text-accent">{v}</p>
            <p className="text-[7px] text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div className="rounded-lg border border-border/30 bg-background/60 p-2">
        <div className="text-[7px] text-muted-foreground mb-1.5">Leads per week</div>
        <div className="flex items-end gap-1 h-8">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-accent/40" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Data ─── */
const clientNames = ["Matrix City", "CKN Legal", "Elektroza", "Coco De Rio", "Prokick Academie"];

const stats = [
  { number: "7 dagen", label: "gemiddelde levertijd" },
  { number: "50+", label: "websites opgeleverd" },
  { number: "98%", label: "klanttevredenheid" },
  { number: "€449", label: "instapprijs" },
];

const whyItems = [
  { icon: Clock, title: "Live binnen 7 dagen", desc: "Van briefing naar live website in één week. Geen maanden wachten of vage planning." },
  { icon: Palette, title: "Volledig op maat", desc: "Elk design is uniek voor jouw merk. Geen templates of standaard thema's." },
  { icon: TrendingUp, title: "Conversiegericht", desc: "Gebouwd om bezoekers te overtuigen. Meer leads, meer klanten, meer omzet." },
  { icon: Headphones, title: "Persoonlijk contact", desc: "Direct met je designer. Snelle antwoorden, geen tussenlagen of account managers." },
  { icon: Zap, title: "Doorlopende support", desc: "Na oplevering blijven we beschikbaar voor updates, vragen en doorontwikkeling." },
  { icon: Shield, title: "Betaalbaar & transparant", desc: "Vaste prijzen zonder verrassingen. Je weet altijd precies waar je aan toe bent." },
];

const showcase = [
  { title: "Matrix City", cat: "Fitness", url: "https://www.matrixcity.nl", emoji: "💪" },
  { title: "CKN Legal", cat: "Juridisch", url: "https://www.cknlegal.com", emoji: "⚖️" },
  { title: "Elektroza", cat: "Techniek", url: "https://www.elektroza.nl", emoji: "⚡" },
  { title: "Coco De Rio", cat: "Fashion", url: "https://cocoderio.com", emoji: "🏖️" },
  { title: "Prokick Academie", cat: "Sport", url: "https://www.prokickacademie.nl", emoji: "⚽" },
];

const reviews = [
  { name: "Christina N.", role: "CKN Legal", text: "Professionele website die perfect aansluit bij mijn juridische diensten. De samenwerking verliep uitstekend.", initials: "CN" },
  { name: "Nawid Z.", role: "Prokick Academie", text: "Onze voetbalschool heeft nu een website waar we echt trots op zijn! Professioneel en modern.", initials: "NZ" },
  { name: "Rian M.", role: "Elektroza", text: "Helder en overzichtelijk, precies wat ik nodig had voor mijn elektriciensbedrijf.", initials: "RM" },
];

const SPLINE_LIGHT = "https://my.spline.design/glassmorphlandingpagecopy-WQe0ukjPWyKibLiUv1pBNkXX/";
const SPLINE_DARK  = "https://my.spline.design/glassmorphlandingpagecopycopy-AwnDMbfEajcUOlYhoFpXNQxR/";

const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const { theme } = useTheme();
  const splineSrc = theme === "dark" ? SPLINE_DARK : SPLINE_LIGHT;

  useEffect(() => {
    updatePageMeta(
      "Webiro – Moderne websites binnen 7 dagen",
      "Binnen 7 dagen online met jouw droomsite. Professionele websites voor ondernemers. Betaalbaar vanaf €449."
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    const tick = () => {
      if (!paused.current) {
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft = 0;
        else el.scrollLeft += 0.7;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main className="bg-background">
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="Service" />

      {/* ══════════════════════════════════════
          HERO — Stripe exact pattern
          • Small label top
          • Massive two-color H1 (dark + primary)
          • Muted subtext
          • Two CTAs
          • Wave ribbons right side
      ══════════════════════════════════════ */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-background pt-[60px]">
        <StripeWave />
        {/* Fade gradient over wave so text stays crisp */}
        <div
          className="absolute inset-y-0 left-0 w-[70%] pointer-events-none"
          aria-hidden
          style={{ zIndex: 1, background: "linear-gradient(to right, hsl(var(--background)) 52%, hsl(var(--background)/0.55) 75%, transparent 100%)" }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-40" style={{ zIndex: 2 }}>
          <div className="max-w-[640px]">
            {/* Stripe-style small label */}
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
              Professionele websites voor ondernemers
            </p>

            {/* Two-color H1 — exact Stripe pattern:
                first sentence bold dark, rest colored/muted */}
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.05] mb-8"
              style={{ fontSize: "clamp(2.6rem, 5.2vw, 4.5rem)" }}
            >
              <span className="text-foreground">De website-infrastructuur</span>
              <br />
              <span className="text-primary/70">om jouw bedrijf te laten groeien.</span>
            </h1>

            <p className="text-[16px] text-muted-foreground leading-relaxed mb-10 max-w-[480px]">
              Professionele websites, marketing en automation — van je eerste klant tot duizenden. Binnen 7 dagen live.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/intake"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Gratis gesprek <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLIENT STRIP — logo row like Stripe
      ══════════════════════════════════════ */}
      <div className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <span className="text-[11px] text-muted-foreground/40 font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
              Vertrouwd door
            </span>
            {clientNames.map((n) => (
              <span key={n} className="text-[14px] font-semibold text-muted-foreground/55 hover:text-foreground transition-colors cursor-default">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SOLUTIONS — "Flexible solutions" exact Stripe layout
          Heading above, two big bento cards below with mockups
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-6">
          {/* Stripe heading pattern: bold dark + muted extension */}
          <div className="max-w-3xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">Flexibele oplossingen voor elk bedrijf.</span>{" "}
              <span className="text-muted-foreground font-bold">Groei met een aanpak die aansluit op waar jij nu staat.</span>
            </h2>
          </div>
        </div>

        {/* Two bento cards — exact Stripe 2-col grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
          <div className="grid md:grid-cols-2 gap-4">

            {/* Card 1 — Website bouwen */}
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden group">
              {/* Gradient bg inside card — like Stripe */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-primary/8 pointer-events-none" />

              <div className="relative p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">Website bouwen</p>
                <h3 className="text-[22px] font-bold text-foreground leading-snug mb-3 max-w-[300px]">
                  Geen website? Wij bouwen hem voor je.
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 max-w-[320px]">
                  Van briefing naar live website in 7 dagen. Modern, mobielvriendelijk en gebouwd om te converteren.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Modern & mobielvriendelijk", "Conversiegericht design", "Eenvoudig te beheren"].map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link to="/pakketten" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all">
                  Bekijk websitepakketten <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mockup visual at bottom of card */}
              <div className="px-10 pb-10">
                <WebsiteMockup accent="primary" />
              </div>
            </div>

            {/* Card 2 — Marketing */}
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-accent/8 pointer-events-none" />

              <div className="relative p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent mb-5">Marketing & Groei</p>
                <h3 className="text-[22px] font-bold text-foreground leading-snug mb-3 max-w-[300px]">
                  Al een website? Laat hem harder werken.
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 max-w-[320px]">
                  Google Ads, Meta Ads, e-mail automation en AI chatbots die elke maand meer leads genereren.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Google & Meta Ads", "E-mail & WhatsApp automation", "AI chatbots voor leads"].map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link to="/marketing" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:gap-3 transition-all">
                  Bekijk marketingdiensten <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="px-10 pb-10">
                <MarketingMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — "The backbone of global commerce"
          Centered big H2 → then stats with divide-x borders
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 text-center">
          <h2
            className="font-bold tracking-[-0.03em] leading-[1.06] text-foreground"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)" }}
          >
            De basis van jouw<br />online groei.
          </h2>
        </div>

        {/* Stats row with divide-x — exact Stripe "backbone" section */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
              {stats.map((s, i) => (
                <motion.div
                  key={s.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="py-12 px-6 lg:px-10"
                >
                  <p
                    className="font-bold tracking-[-0.03em] text-foreground leading-none mb-2.5"
                    style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                  >
                    {s.number}
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-snug">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY WEBIRO — 2-col heading + 3x2 feature grid
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">

          {/* Two-column heading — exact Stripe "startups" pattern */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-5">Waarom Webiro</p>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.1] text-foreground"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)" }}
              >
                Alles wat je nodig hebt. Niets meer, niets minder.
              </h2>
            </div>
            <div className="self-end">
              <p className="text-[16px] text-muted-foreground leading-relaxed">
                We werken met een scherp proces en heldere verwachtingen zodat jij je kunt focussen op je bedrijf, niet op de techniek.
              </p>
              <Link to="/pakketten" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary mt-6 hover:gap-3 transition-all">
                Bekijk pakketten <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3×2 feature grid with outer border + inner dividers */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden divide-y divide-border sm:divide-y-0">
            {whyItems.map((item, i) => {
              const Icon = item.icon;
              const isLastRow = i >= 3;
              const isRightCol = i % 3 === 2;
              const isRightColSm = i % 2 === 1;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={[
                    "p-8 lg:p-10",
                    !isLastRow ? "border-b border-border" : "",
                    !isRightCol ? "lg:border-r lg:border-border" : "",
                    !isRightColSm ? "sm:border-r sm:border-border lg:border-r-0" : "",
                    !isRightCol && !isRightColSm ? "lg:border-r lg:border-border" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground mb-2.5 leading-snug">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PORTFOLIO — auto-scroll showcase
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-5">Portfolio</p>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.1] text-foreground"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)" }}
              >
                Bekijk ons werk.
              </h2>
            </div>
            <p className="text-[16px] text-muted-foreground leading-relaxed self-end">
              Van juridische kantoren tot sportacademies. Een selectie van websites die we gebouwd hebben voor ondernemers in verschillende sectoren.
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden pl-6 lg:pl-12 pb-20 lg:pb-28"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {[...showcase, ...showcase].map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[220px] border border-border bg-card rounded-xl p-7 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200 group"
            >
              <div className="text-3xl mb-5">{item.emoji}</div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary mb-1.5">{item.cat}</p>
              <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-5">Reviews</p>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.1] text-foreground"
                style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)" }}
              >
                Wat onze klanten zeggen.
              </h2>
            </div>
            <p className="text-[16px] text-muted-foreground leading-relaxed self-end">
              Ondernemers die we geholpen hebben met hun online aanwezigheid. Lees hun ervaringen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-border bg-card rounded-xl p-8 hover:shadow-sm hover:border-primary/20 transition-all"
              >
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[hsl(44,100%,67%)] text-[hsl(44,100%,67%)]" />
                  ))}
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-8">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-bold flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{r.name}</p>
                    <p className="text-[12px] text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Home;
