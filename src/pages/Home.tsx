import { useEffect, useRef, useState } from "react";
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
      style={{ minWidth: "60%" }}
    >
      <defs>
        <linearGradient id="wg1" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="hsl(234,82%,57%)" stopOpacity="0.92" />
          <stop offset="40%" stopColor="hsl(259,79%,61%)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(280,70%,55%)" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="wg2" x1="10%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="hsl(28,100%,58%)" stopOpacity="0.95" />
          <stop offset="50%" stopColor="hsl(5,90%,63%)" stopOpacity="0.88" />
          <stop offset="100%" stopColor="hsl(330,80%,58%)" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="hsl(320,75%,62%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(259,79%,61%)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="wg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(44,100%,62%)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="hsl(18,100%,58%)" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="wg5" x1="0%" y1="20%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200,100%,72%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(234,82%,57%)" stopOpacity="0.45" />
        </linearGradient>
        <filter id="wblur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <path d="M 1200 -100 C 1000 80, 820 220, 620 920 L 820 920 C 1000 240, 1180 90, 1400 -100 Z" fill="url(#wg1)" filter="url(#wblur)" />
      <path d="M 1380 -140 C 1200 40, 1020 200, 800 920 L 960 920 C 1160 210, 1340 50, 1540 -140 Z" fill="url(#wg2)" filter="url(#wblur)" />
      <path d="M 1100 -80 C 940 100, 780 280, 580 920 L 680 920 C 860 285, 1020 105, 1200 -80 Z" fill="url(#wg3)" filter="url(#wblur)" />
      <path d="M 1300 -50 C 1160 90, 1060 230, 940 920 L 1050 920 C 1160 240, 1260 100, 1420 -50 Z" fill="url(#wg4)" filter="url(#wblur)" />
      <path d="M 1440 -120 C 1360 60, 1280 260, 1180 920 L 1260 920 C 1360 264, 1440 64, 1540 -120 Z" fill="url(#wg5)" filter="url(#wblur)" />
    </svg>
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

const solutions = [
  {
    label: "Website bouwen",
    title: "Geen website? Wij bouwen hem voor je.",
    desc: "Van briefing naar live website in 7 dagen. Modern, mobielvriendelijk en gebouwd om te converteren.",
    href: "/pakketten",
    cta: "Bekijk websitepakketten",
    checks: ["Modern & mobielvriendelijk", "Conversiegericht design", "Eenvoudig te beheren"],
    accent: "primary" as const,
  },
  {
    label: "Marketing & Groei",
    title: "Al een website? Laat hem harder werken.",
    desc: "Google Ads, Meta Ads, e-mail automation en AI chatbots die elke maand meer leads genereren.",
    href: "/marketing",
    cta: "Bekijk marketingdiensten",
    checks: ["Google & Meta Ads", "E-mail & WhatsApp automation", "AI chatbots voor leads"],
    accent: "accent" as const,
  },
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
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-background pt-[60px]">
        <StripeWave />
        {/* Left fade over wave */}
        <div
          className="absolute inset-y-0 left-0 w-[65%] pointer-events-none"
          aria-hidden
          style={{ zIndex: 1, background: "linear-gradient(to right, hsl(var(--background)) 55%, hsl(var(--background)/0.5) 78%, transparent 100%)" }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36" style={{ zIndex: 2 }}>
          <div className="max-w-[600px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-primary mb-6">
              Professionele websites voor ondernemers
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.04] mb-7 text-foreground"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.75rem)" }}
            >
              De website-infrastructuur om jouw bedrijf te laten groeien.
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-[480px]" style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}>
              Professionele websites, marketing en automation — van je eerste klant tot duizenden. Binnen 7 dagen live.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/pakketten"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Start nu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-[11px] border border-border text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLIENT STRIP
      ══════════════════════════════════════ */}
      <div className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <span className="text-[12px] text-muted-foreground/50 font-medium whitespace-nowrap uppercase tracking-[0.1em]">
              Vertrouwd door
            </span>
            {clientNames.map((n) => (
              <span key={n} className="text-[14px] font-semibold text-muted-foreground/60 hover:text-foreground transition-colors cursor-default">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STATS — Stripe "backbone of commerce" style
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        {/* Big centred heading */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 text-center">
          <h2
            className="font-bold tracking-[-0.03em] leading-[1.05] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            De basis van jouw<br />online groei.
          </h2>
        </div>

        {/* Stats row with vertical dividers */}
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
                  className="py-10 px-6 lg:px-10"
                >
                  <p
                    className="font-bold tracking-[-0.03em] text-foreground leading-none mb-2"
                    style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                  >
                    {s.number}
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-snug max-w-[140px]">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FLEXIBLE SOLUTIONS — two bento cards
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        {/* Two-column intro: heading left, subtitle right — exact Stripe pattern */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
            <h2
              className="font-bold tracking-[-0.02em] leading-[1.08] text-foreground"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              Flexibele oplossingen voor elk bedrijf.
            </h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed self-end">
              Of je nu een gloednieuwe website nodig hebt of jouw bestaande site wil laten groeien — we hebben een aanpak die aansluit op waar jij nu staat.
            </p>
          </div>

          {/* Bento cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((s) => (
              <div
                key={s.href}
                className="relative rounded-2xl border border-border bg-card p-10 overflow-hidden group hover:border-primary/20 transition-all duration-300"
              >
                {/* Subtle gradient glow in top-right corner */}
                <div
                  className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    s.accent === "primary" ? "bg-primary/10" : "bg-accent/10"
                  }`}
                />

                <p className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-6 ${s.accent === "primary" ? "text-primary" : "text-accent"}`}>
                  {s.label}
                </p>
                <h3 className="text-[22px] font-bold text-foreground leading-snug mb-4 max-w-sm">
                  {s.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-7 max-w-sm">
                  {s.desc}
                </p>
                <ul className="space-y-2.5 mb-10">
                  {s.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${s.accent === "primary" ? "text-primary" : "text-accent"}`} />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link
                  to={s.href}
                  className={`inline-flex items-center gap-1.5 text-[14px] font-semibold transition-all hover:gap-3 ${s.accent === "primary" ? "text-primary" : "text-accent"}`}
                >
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY WEBIRO — feature grid with dividers
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background">
        {/* Two-column heading */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">Waarom Webiro</p>
              <h2
                className="font-bold tracking-[-0.02em] leading-[1.1] text-foreground"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                Alles wat je nodig hebt. Niets meer, niets minder.
              </h2>
            </div>
            <p className="text-[16px] text-muted-foreground leading-relaxed self-end">
              We werken met een scherp proces en heldere verwachtingen zodat jij je kunt focussen op je bedrijf, niet op de techniek.
            </p>
          </div>

          {/* 3-column feature grid with border dividers — Stripe pattern */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden">
            {whyItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className={`p-8 lg:p-10 ${
                    i < 3 ? "border-b border-border" : ""
                  } ${
                    (i % 3 !== 2) ? "lg:border-r border-border" : ""
                  } ${
                    (i % 2 === 0) ? "sm:border-r lg:border-r-0 border-border" : ""
                  } ${
                    (i % 2 === 0 && i % 3 !== 2) ? "lg:border-r border-border" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PORTFOLIO SHOWCASE — auto-scroll
      ══════════════════════════════════════ */}
      <section className="border-t border-border bg-background overflow-hidden">
        {/* Two-column heading */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">Portfolio</p>
              <h2
                className="font-bold tracking-[-0.02em] leading-[1.1] text-foreground"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                Bekijk ons werk.
              </h2>
            </div>
            <p className="text-[16px] text-muted-foreground leading-relaxed self-end">
              Van juridische kantoren tot sportacademies — we bouwen voor elke branche. Bekijk een selectie van websites die we gebouwd hebben.
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
          {/* Two-column heading */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">Reviews</p>
              <h2
                className="font-bold tracking-[-0.02em] leading-[1.1] text-foreground"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
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
                    <Star key={j} className="w-3.5 h-3.5 fill-[hsl(var(--webiro-yellow))] text-[hsl(var(--webiro-yellow))]" />
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
