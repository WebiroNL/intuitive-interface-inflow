import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";
import { useTheme } from "@/contexts/ThemeContext";

/* ─── Animated flowing wave ribbons – exact Stripe positioning ─── */
const StripeWave = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
      style={{ zIndex: 0 }}
    >
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
          <filter id="wblur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Blue/purple wide ribbon */}
        <path
          d="M 1200 -100 C 1000 80, 820 220, 620 920 L 820 920 C 1000 240, 1180 90, 1400 -100 Z"
          fill="url(#wg1)"
          filter="url(#wblur)"
        />
        {/* Orange/pink ribbon – overlaps */}
        <path
          d="M 1380 -140 C 1200 40, 1020 200, 800 920 L 960 920 C 1160 210, 1340 50, 1540 -140 Z"
          fill="url(#wg2)"
          filter="url(#wblur)"
        />
        {/* Pink/purple thin ribbon */}
        <path
          d="M 1100 -80 C 940 100, 780 280, 580 920 L 680 920 C 860 285, 1020 105, 1200 -80 Z"
          fill="url(#wg3)"
          filter="url(#wblur)"
        />
        {/* Yellow/orange edge ribbon */}
        <path
          d="M 1300 -50 C 1160 90, 1060 230, 940 920 L 1050 920 C 1160 240, 1260 100, 1420 -50 Z"
          fill="url(#wg4)"
          filter="url(#wblur)"
        />
        {/* Light blue far-right */}
        <path
          d="M 1440 -120 C 1360 60, 1280 260, 1180 920 L 1260 920 C 1360 264, 1440 64, 1540 -120 Z"
          fill="url(#wg5)"
          filter="url(#wblur)"
        />
      </svg>
    </div>
  );
};

/* ─── Animated stat ticker ─── */
const StatTicker = () => {
  const [val, setVal] = useState(30.4712);
  useEffect(() => {
    const t = setInterval(() => {
      setVal((v) => parseFloat((v + Math.random() * 0.0003).toFixed(4)));
    }, 900);
    return () => clearInterval(t);
  }, []);
  return (
    <p className="text-[13px] font-medium text-muted-foreground mb-10 tracking-tight">
      Ondernemers geholpen via Webiro:{" "}
      <span className="text-foreground tabular-nums font-semibold">{val.toFixed(4)}%</span>
    </p>
  );
};

/* ─── Data ─── */
const clientNames = ["Matrix City", "CKN Legal", "Elektroza", "Coco De Rio", "Prokick Academie"];

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
  { title: "Live binnen 7 dagen", desc: "Van briefing naar live website in één week. Geen maanden wachten of vage planning." },
  { title: "Volledig op maat", desc: "Elk design is uniek voor jouw merk. Geen templates of standaard thema's." },
  { title: "Conversiegericht", desc: "Gebouwd om bezoekers te overtuigen. Meer leads, meer klanten, meer omzet." },
  { title: "Persoonlijk contact", desc: "Direct met je designer. Snelle antwoorden, geen tussenlagen of account managers." },
  { title: "Doorlopende support", desc: "Na oplevering blijven we beschikbaar voor updates, vragen en doorontwikkeling." },
  { title: "Betaalbaar & transparant", desc: "Vaste prijzen zonder verrassingen. Je weet altijd precies waar je aan toe bent." },
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

/* ─── Page ─── */
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

  /* Infinite auto-scroll for showcase */
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

      {/* ═══════════════════════════════════════
          HERO — Stripe layout with column guide lines
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden bg-background pt-16">

        {/* ── Vertical column guide lines – the Stripe signature ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ zIndex: 2 }}>
          <div className="h-full max-w-7xl mx-auto relative">
            <div className="absolute top-0 bottom-0 left-6 lg:left-12 w-px bg-border/50" />
            <div className="absolute top-0 bottom-0 right-6 lg:right-12 w-px bg-border/50" />
          </div>
        </div>

        {/* Spline 3D background — right half */}
        <div className="absolute inset-y-0 right-0 w-[55%] pointer-events-none" aria-hidden style={{ zIndex: 0 }}>
          <iframe
            key={splineSrc}
            src={splineSrc}
            frameBorder="0"
            width="100%"
            height="100%"
            title="Webiro 3D background"
            className="w-full h-full"
            loading="eager"
          />
        </div>
        {/* Left-to-right fade so text stays readable over 3D */}
        <div
          className="absolute inset-y-0 left-0 w-[60%] pointer-events-none"
          aria-hidden
          style={{ zIndex: 1, background: "linear-gradient(to right, hsl(var(--background)) 55%, hsl(var(--background)/0.6) 75%, transparent 100%)" }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-28 lg:py-40" style={{ zIndex: 3 }}>
          <div className="max-w-[580px]">
            <StatTicker />

            {/* 72–80px bold headline */}
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.04] mb-8 text-foreground"
              style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)" }}
            >
              De website-infrastructuur{" "}
              <span className="text-primary">om jouw bedrijf te laten groeien.</span>
            </h1>

            <p
              className="text-muted-foreground leading-relaxed mb-10"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
            >
              Professionele websites, marketing en automation — van je eerste klant tot duizenden. Binnen 7 dagen live.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/pakketten"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[15px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Start nu <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-[11px] border border-border bg-transparent text-foreground text-[15px] font-semibold rounded-[6px] hover:bg-muted/40 transition-colors"
              >
                Contact sales <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom border line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" aria-hidden />
      </section>

      {/* ═══════════════════════════════════════
          CLIENT LOGO STRIP
      ═══════════════════════════════════════ */}
      <div className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <span className="text-[13px] text-muted-foreground/50 font-medium whitespace-nowrap">
              Vertrouwd door ondernemers zoals:
            </span>
            {clientNames.map((n) => (
              <span
                key={n}
                className="text-[15px] font-semibold text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FLEXIBLE SOLUTIONS — Stripe "Flexible solutions for every business model"
      ═══════════════════════════════════════ */}
      <section className="py-28 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Left-aligned big text intro */}
          <div className="max-w-4xl mb-16">
            <h2
              className="font-bold tracking-[-0.02em] leading-[1.1] text-foreground"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Flexibele oplossingen voor elk bedrijf.{" "}
              <span className="text-primary/60 font-bold">
                Groei met een aanpak die aansluit op waar jij nu staat.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((s) => (
              <div
                key={s.href}
                className="relative rounded-2xl border border-border bg-card p-10 hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden group"
              >
                {/* Subtle glow */}
                <div className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${s.accent === "primary" ? "bg-primary/8" : "bg-accent/8"}`} />

                <p className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-5 ${s.accent === "primary" ? "text-primary" : "text-accent"}`}>
                  {s.label}
                </p>
                <h3 className="text-[22px] font-bold text-foreground leading-snug mb-4">
                  {s.title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
                  {s.desc}
                </p>
                <ul className="space-y-2.5 mb-9">
                  {s.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${s.accent === "primary" ? "text-primary" : "text-accent"}`} />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link
                  to={s.href}
                  className={`inline-flex items-center gap-1.5 text-[14px] font-semibold transition-all hover:gap-2.5 ${s.accent === "primary" ? "text-primary" : "text-accent"}`}
                >
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY WEBIRO — Stripe-style feature grid with dividers
      ═══════════════════════════════════════ */}
      <section className="py-28 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-4">
              Waarom Webiro
            </p>
            <h2
              className="font-bold tracking-[-0.02em] leading-tight text-foreground max-w-lg"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.75rem)" }}
            >
              Alles wat je nodig hebt, niets meer en niets minder.
            </h2>
          </div>

          {/* Grid with border dividers – exact Stripe feature layout */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-border">
            {whyItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className={`py-10 px-8 ${i % 3 !== 2 ? "lg:border-r border-border" : ""} ${i % 2 !== 1 ? "sm:border-r lg:border-r-0 border-border" : ""}`}
              >
                {/* Number */}
                <span className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mb-5 block">
                  0{i + 1}
                </span>
                <h3 className="text-[17px] font-bold text-foreground mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PORTFOLIO SHOWCASE — auto-scroll
      ═══════════════════════════════════════ */}
      <section className="py-28 border-t border-border bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-4">Portfolio</p>
          <h2
            className="font-bold tracking-[-0.02em] text-foreground"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.75rem)" }}
          >
            Bekijk ons werk.
          </h2>
          <p className="text-[15px] text-muted-foreground mt-3 max-w-md">
            Een selectie van websites die we gebouwd hebben voor ondernemers.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden pl-6 lg:pl-12"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
        >
          {[...showcase, ...showcase].map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[240px] border border-border bg-card rounded-xl p-7 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/25 transition-all duration-200 group"
            >
              <div className="text-3xl mb-5">{item.emoji}</div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary mb-1">
                {item.cat}
              </p>
              <p className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-28 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-4">Reviews</p>
            <h2
              className="font-bold tracking-[-0.02em] text-foreground"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.75rem)" }}
            >
              Wat onze klanten zeggen.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-border bg-card rounded-xl p-8 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
                  ))}
                </div>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-7">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{r.name}</p>
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
