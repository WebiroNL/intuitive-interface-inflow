import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Globe, TrendingUp, Zap, Clock, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";

/* ─────────────────────────────────────────────
   Animated mesh-gradient (Stripe-style)
───────────────────────────────────────────── */
const MeshGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
    {/* Animated blobs */}
    <div
      className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
      style={{
        background: "radial-gradient(circle, hsl(234 82% 57% / 0.8) 0%, hsl(259 79% 61% / 0.5) 50%, transparent 70%)",
        animation: "mesh1 8s ease-in-out infinite",
      }}
    />
    <div
      className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
      style={{
        background: "radial-gradient(circle, hsl(44 100% 67% / 0.7) 0%, hsl(259 79% 61% / 0.4) 60%, transparent 80%)",
        animation: "mesh2 10s ease-in-out infinite 2s",
      }}
    />
    <div
      className="absolute top-60 right-20 w-[300px] h-[300px] rounded-full opacity-25 blur-2xl"
      style={{
        background: "radial-gradient(circle, hsl(259 79% 61% / 0.9) 0%, hsl(234 82% 57% / 0.3) 70%, transparent 90%)",
        animation: "mesh1 6s ease-in-out infinite 1s",
      }}
    />
    <style>{`
      @keyframes mesh1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-30px, 20px) scale(1.05); }
        66% { transform: translate(20px, -30px) scale(0.97); }
      }
      @keyframes mesh2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(40px, -20px) scale(1.08); }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1500;
        const step = (end / duration) * 16;
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const stats = [
  { value: 30, suffix: "+", label: "Tevreden klanten" },
  { value: 7, suffix: " dagen", label: "Gemiddelde levertijd" },
  { value: 100, suffix: "%", label: "Op maat gemaakt" },
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
  {
    icon: <Zap className="w-7 h-7 text-primary" />,
    title: "Live binnen 7 dagen",
    desc: "Van briefing naar live website in één week. Geen maanden wachten.",
    span: "col-span-1",
    accent: "from-primary/10 to-primary/5",
  },
  {
    icon: <Globe className="w-7 h-7 text-accent" />,
    title: "Volledig op maat",
    desc: "Elk design is uniek voor jouw merk. Geen templates, geen compromissen.",
    span: "col-span-1",
    accent: "from-accent/10 to-accent/5",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-primary" />,
    title: "Conversiegericht",
    desc: "Gebouwd om bezoekers te overtuigen. Meer leads, meer klanten.",
    span: "col-span-2 md:col-span-1",
    accent: "from-primary/8 to-accent/8",
  },
  {
    icon: <Users className="w-7 h-7 text-accent" />,
    title: "Persoonlijk contact",
    desc: "Direct met je designer. Snelle antwoorden, geen tussenpersonen.",
    span: "col-span-1",
    accent: "from-accent/10 to-accent/5",
  },
  {
    icon: <Clock className="w-7 h-7 text-primary" />,
    title: "Doorlopende support",
    desc: "Na oplevering blijven we beschikbaar voor updates en vragen.",
    span: "col-span-1",
    accent: "from-primary/10 to-primary/5",
  },
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
    <main>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="Service" />

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-background overflow-hidden">
        <MeshGradient />

        <div className="container-webiro relative z-10 w-full py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                +30 ondernemers geholpen aan meer omzet
              </div>

              {/* Headline – Stripe-style: bold, left-aligned, mixed color */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-foreground">
                Websites die{" "}
                <span className="gradient-text">écht</span>{" "}
                voor je werken.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Binnen 7 dagen een moderne, conversiegerichte website. Of meer klanten uit je bestaande site — Webiro regelt het.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/pakketten"
                  className="group inline-flex items-center gap-2 px-7 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold text-base transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  Bekijk pakketten
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/marketing"
                  className="group inline-flex items-center gap-2 px-7 py-4 bg-transparent border border-border hover:border-foreground/40 text-foreground rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-0.5"
                >
                  Marketing diensten
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  {["CN", "NZ", "RM"].map((av) => (
                    <div key={av} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground ring-2 ring-background">
                      {av}
                    </div>
                  ))}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">5.0 gemiddeld</span>
              </div>
            </motion.div>

            {/* Right: product mockup cards (Stripe bento-style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <div className="relative rounded-3xl border border-border bg-card shadow-2xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-widest">Jouw nieuwe website</div>
                    <div className="text-2xl font-bold text-foreground">Live in 7 dagen</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-4 mb-6">
                  {[
                    { label: "Design", pct: 100, color: "bg-primary" },
                    { label: "Development", pct: 100, color: "bg-accent" },
                    { label: "SEO & Performance", pct: 100, color: "bg-primary" },
                    { label: "Live zetten", pct: 100, color: "bg-webiro-yellow" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground font-medium">{label}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">Website klaar & live!</span>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-xl border border-border p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-webiro-yellow/20 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-webiro-yellow text-webiro-yellow" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Beoordeling</div>
                  <div className="text-lg font-bold text-foreground">5.0 ★</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-6 bg-card rounded-2xl shadow-xl border border-border p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Meer bezoekers</div>
                  <div className="text-lg font-bold text-foreground">+127%</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────── */}
      <section className="border-y border-border bg-card/50">
        <div className="container-webiro py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map(({ value, suffix, label }) => (
              <div key={label}>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID "Waarom Webiro" ─────── */}
      <section className="section-padding bg-background">
        <div className="container-webiro">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Waarom Webiro</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground max-w-xl leading-tight">
              Alles wat je nodig hebt,{" "}
              <span className="gradient-text">niets minder.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bentoItems.map(({ icon, title, desc, span, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${span} group relative rounded-3xl border border-border bg-gradient-to-br ${accent} p-7 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden`}
              >
                <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center mb-5 shadow-sm">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO PATHS ─────────────────────── */}
      <section className="section-padding bg-secondary/20">
        <div className="container-webiro">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Jouw situatie</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Kies wat bij jou past<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
              Start je net of wil je meer uit wat je al hebt? We sluiten aan op waar jij nu staat.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl border border-border bg-card p-8 hover:border-primary/40 hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Nog geen website</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Wij ontwerpen en bouwen binnen 7 dagen een moderne site die vertrouwen wekt en converteert.
              </p>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {["Modern & mobielvriendelijk design", "Conversiegericht opgezet", "Eenvoudig zelf te beheren"].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/pakketten"
                className="group/btn inline-flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all"
              >
                Bekijk websitepakketten
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl border border-border bg-card p-8 hover:border-accent/40 hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Al een website</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Je website levert nog niet op wat je hoopt. Wij helpen met advertenties, automation en optimalisatie.
              </p>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {["Google en Meta Ads campagnes", "E-mail & WhatsApp automation", "AI chatbots voor leadgeneratie"].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/marketing"
                className="group/btn inline-flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-semibold transition-all"
              >
                Bekijk marketingdiensten
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE STRIP ────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-webiro mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ons werk<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-3 max-w-xl">
              Bekijk een selectie van websites die we voor ondernemers hebben gemaakt.
            </p>
          </motion.div>
        </div>

        <div
          ref={showcaseScrollRef}
          className="flex gap-5 overflow-x-hidden"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          {[...showcaseItems, ...showcaseItems].map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-72 group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-primary/30"
            >
              <div
                className="text-4xl w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: `${item.color}20` }}
              >
                {item.icon}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: item.color }}>
                {item.category}
              </div>
              <h3 className="text-foreground font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────── */}
      <section className="section-padding bg-secondary/20">
        <div className="container-webiro">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Wat klanten zeggen<span className="text-primary">.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl p-8 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{t.name}</div>
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
