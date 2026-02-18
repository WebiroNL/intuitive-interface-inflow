import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Globe, TrendingUp, Zap, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";

/* ─────────────────────────────────────────────
   Stripe-style flowing wave – SVG ribbons
───────────────────────────────────────────── */
const StripeWave = () => (
  <div className="absolute inset-y-0 right-0 w-[55%] overflow-hidden pointer-events-none" aria-hidden>
    <svg
      viewBox="0 0 700 600"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Blue-purple ribbon */}
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(234 82% 57%)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(259 79% 61%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(280 70% 55%)" stopOpacity="0.7" />
        </linearGradient>
        {/* Orange-pink ribbon */}
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(30 100% 60%)" stopOpacity="0.85" />
          <stop offset="50%" stopColor="hsl(0 90% 65%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(320 80% 60%)" stopOpacity="0.7" />
        </linearGradient>
        {/* Pink-purple ribbon */}
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(320 80% 65%)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="hsl(259 79% 61%)" stopOpacity="0.6" />
        </linearGradient>
        {/* Yellow-orange */}
        <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(44 100% 60%)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="hsl(20 100% 60%)" stopOpacity="0.5" />
        </linearGradient>
        {/* Light blue */}
        <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200 100% 70%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(234 82% 57%)" stopOpacity="0.4" />
        </linearGradient>

        <filter id="blur1">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Ribbon 1 – blue/purple – wide diagonal */}
      <path
        d="M 650 -80 C 500 100, 350 200, 200 600 L 350 600 C 480 220, 620 110, 760 -80 Z"
        fill="url(#g1)"
        filter="url(#blur1)"
      />
      {/* Ribbon 2 – orange/pink – overlapping */}
      <path
        d="M 700 -120 C 600 50, 480 180, 300 600 L 420 600 C 580 190, 690 60, 800 -120 Z"
        fill="url(#g2)"
        filter="url(#blur1)"
      />
      {/* Ribbon 3 – pink/purple – thin */}
      <path
        d="M 560 -60 C 440 120, 320 260, 180 600 L 240 600 C 360 270, 490 130, 620 -60 Z"
        fill="url(#g3)"
        filter="url(#blur1)"
      />
      {/* Ribbon 4 – yellow/orange – edge */}
      <path
        d="M 680 -40 C 580 80, 500 200, 420 600 L 490 600 C 560 210, 640 90, 750 -40 Z"
        fill="url(#g4)"
        filter="url(#blur1)"
      />
      {/* Ribbon 5 – light blue – far right */}
      <path
        d="M 620 -100 C 540 60, 460 240, 380 600 L 420 600 C 510 244, 590 64, 680 -100 Z"
        fill="url(#g5)"
        filter="url(#blur1)"
      />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────
   Animated stat ticker (Stripe GDP style)
───────────────────────────────────────────── */
const StatTicker = () => {
  const [val, setVal] = useState(30.4712);
  useEffect(() => {
    const t = setInterval(() => {
      setVal(v => parseFloat((v + Math.random() * 0.0003).toFixed(4)));
    }, 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-sm text-muted-foreground mb-8 font-medium">
      Ondernemers geholpen via Webiro:{" "}
      <span className="text-foreground tabular-nums">{val.toFixed(4)}%</span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const clientLogos = [
  "Matrix City", "CKN Legal", "Elektroza", "Coco De Rio", "Prokick Academie"
];

const showcaseItems = [
  { title: "Matrix City", category: "Fitness", url: "https://www.matrixcity.nl", icon: "💪", color: "hsl(234 82% 57%)" },
  { title: "CKN Legal", category: "Legal", url: "https://www.cknlegal.com", icon: "⚖️", color: "hsl(259 79% 61%)" },
  { title: "Elektroza", category: "Techniek", url: "https://www.elektroza.nl", icon: "⚡", color: "hsl(44 100% 55%)" },
  { title: "Coco De Rio", category: "Fashion", url: "https://cocoderio.com", icon: "🏖️", color: "hsl(234 82% 57%)" },
  { title: "Prokick Academie", category: "Sport", url: "https://www.prokickacademie.nl", icon: "⚽", color: "hsl(259 79% 61%)" },
];

const testimonials = [
  { name: "Christina N.", role: "CKN Legal", rating: 5, text: "Professionele website die perfect aansluit bij mijn juridische diensten. De samenwerking verliep uitstekend.", avatar: "CN" },
  { name: "Nawid Z.", role: "Prokick Academie", rating: 5, text: "Onze voetbalschool heeft nu een website waar we echt trots op zijn! Professioneel, modern.", avatar: "NZ" },
  { name: "Rian M.", role: "Elektroza", rating: 5, text: "Helder en overzichtelijk, precies wat ik nodig had voor mijn elektriciensbedrijf.", avatar: "RM" },
];

const bentoItems = [
  { icon: <Zap className="w-6 h-6 text-primary" />, title: "Live binnen 7 dagen", desc: "Van briefing naar live website in één week. Geen maanden wachten." },
  { icon: <Globe className="w-6 h-6 text-primary" />, title: "Volledig op maat", desc: "Elk design is uniek voor jouw merk. Geen templates, geen compromissen." },
  { icon: <TrendingUp className="w-6 h-6 text-primary" />, title: "Conversiegericht", desc: "Gebouwd om bezoekers te overtuigen. Meer leads, meer klanten." },
  { icon: <Users className="w-6 h-6 text-primary" />, title: "Persoonlijk contact", desc: "Direct met je designer. Snelle antwoorden, geen tussenpersonen." },
  { icon: <Clock className="w-6 h-6 text-primary" />, title: "Doorlopende support", desc: "Na oplevering blijven we beschikbaar voor updates en vragen." },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const Home = () => {
  const showcaseScrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    updatePageMeta(
      "Home - Moderne websites binnen 7 dagen",
      "Binnen 7 dagen online met jouw droomsite. Webiro maakt moderne, professionele websites voor ondernemers, salons, kappers en zzp'ers. Betaalbaar vanaf €449."
    );
  }, []);

  useEffect(() => {
    const container = showcaseScrollRef.current;
    if (!container) return;
    let animationId: number;
    const autoScroll = () => {
      if (!container || isPausedRef.current) { animationId = requestAnimationFrame(autoScroll); return; }
      const maxScroll = container.scrollWidth / 2;
      if (container.scrollLeft >= maxScroll - 10) container.scrollLeft = 0;
      else container.scrollLeft += 0.8;
      animationId = requestAnimationFrame(autoScroll);
    };
    animationId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <main className="pt-16">
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="Service" />

      {/* ── HERO ── pure white, giant left text, wave right */}
      <section className="relative overflow-hidden bg-background min-h-[600px] flex items-center">
        <StripeWave />

        {/* Left content – max ~50% width so wave is always visible */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-[600px]">
            <StatTicker />

            {/* Massive headline – Stripe style: first line dark, rest muted blue */}
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.08] tracking-tight mb-6">
              <span className="text-foreground">Websites die groeien</span>{" "}
              <span className="text-foreground">voor jouw bedrijf.</span>
              <br />
              <span className="text-primary/70">Binnen 7 dagen online — van briefing naar live.</span>
            </h1>

            {/* Two CTA buttons – Stripe style */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/pakketten"
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-base"
              >
                Bekijk pakketten <span aria-hidden>›</span>
              </Link>
              <Link
                to="/marketing"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background text-foreground font-semibold rounded-md hover:border-foreground/40 transition-colors text-base"
              >
                Marketing diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT LOGO STRIP ── */}
      <div className="border-y border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {clientLogos.map((name) => (
              <span key={name} className="text-muted-foreground/60 font-semibold text-sm tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLEXIBLE SOLUTIONS ── Stripe "Flexible solutions" section */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground leading-tight mb-4">
              <span className="text-foreground">Oplossingen voor elk bedrijf. </span>
              <span className="text-primary/70">Groei met een aanpak die aansluit op waar jij nu staat en waar je naartoe wilt.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-14">
            {/* Card 1 */}
            <div className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/30 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Nog geen website</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Wij ontwerpen en bouwen binnen 7 dagen een moderne site die vertrouwen wekt en converteert.
              </p>
              <ul className="space-y-2 mb-8">
                {["Modern & mobielvriendelijk", "Conversiegericht", "Eenvoudig te beheren"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/pakketten" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                Bekijk websitepakketten <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-xl transition-all duration-300 hover:border-accent/30 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Al een website</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Je website levert nog niet genoeg op. Wij helpen met advertenties, automation en optimalisatie.
              </p>
              <ul className="space-y-2 mb-8">
                {["Google & Meta Ads", "E-mail & WhatsApp automation", "AI chatbots voor leads"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/marketing" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:gap-2 transition-all">
                Bekijk marketingdiensten <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY WEBIRO – clean feature grid ── */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Waarom Webiro</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-foreground leading-tight">
              Alles wat je nodig hebt, niets minder.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {bentoItems.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-background p-8 hover:bg-card transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
            {/* Empty cell to complete the grid */}
            <div className="bg-background p-8 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ── SHOWCASE STRIP ── */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Portfolio</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-foreground">Ons werk.</h2>
          <p className="text-muted-foreground mt-3 max-w-lg">
            Bekijk een selectie van websites die we voor ondernemers hebben gemaakt.
          </p>
        </div>

        <div
          ref={showcaseScrollRef}
          className="flex gap-4 overflow-x-hidden px-6 lg:px-8"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          {[...showcaseItems, ...showcaseItems].map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-64 border border-border bg-card rounded-xl p-6 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1 text-primary">
                {item.category}
              </div>
              <div className="font-semibold text-foreground">{item.title}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-foreground">Wat klanten zeggen.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border bg-card rounded-xl p-8 hover:shadow-md transition-all"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
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
