import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Zap, Palette, Headphones, TrendingUp, Clock, Shield } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";
import { SilkWaves } from "@/components/SilkWaves";

/* ─── Fake website mockup for bento cards ─── */
const WebsiteMockup = ({ accent }: { accent: "primary" | "accent" }) => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card" style={{ aspectRatio: "16/10" }}>
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-[hsl(44,90%,60%)]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    <div className={`absolute inset-0 top-9 ${accent === "primary" ? "bg-gradient-to-br from-primary/5 via-background to-primary/10" : "bg-gradient-to-br from-accent/5 via-background to-accent/10"}`}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <div className={`w-12 h-3 rounded-sm ${accent === "primary" ? "bg-primary/40" : "bg-accent/40"}`} />
        <div className="flex gap-2 ml-auto">
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className={`w-14 h-5 rounded-sm ${accent === "primary" ? "bg-primary/60" : "bg-accent/60"}`} />
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="w-3/4 h-4 rounded bg-foreground/15 mb-2" />
        <div className="w-1/2 h-3 rounded bg-foreground/10 mb-4" />
        <div className={`w-20 h-6 rounded ${accent === "primary" ? "bg-primary/50" : "bg-accent/50"}`} />
      </div>
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

const MarketingMockup = () => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card" style={{ aspectRatio: "16/10" }}>
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-[hsl(44,90%,60%)]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    <div className="absolute inset-0 top-9 bg-gradient-to-br from-accent/5 via-background to-accent/10 p-3">
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[["1.240", "Leads"], ["€4.20", "CPC"], ["34%", "Conv."]].map(([v, l]) => (
          <div key={l} className="rounded-lg border border-border/30 bg-background/60 px-2 py-1.5">
            <p className="text-[9px] font-bold text-accent">{v}</p>
            <p className="text-[7px] text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
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

const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

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

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-background pt-[60px]">

        {/* SVG silk waves — lightweight, mouse-interactive, white bg */}
        <SilkWaves />

        {/* Left fade so text stays crisp on white */}
        <div
          className="absolute inset-y-0 left-0 w-[65%] pointer-events-none"
          style={{ zIndex: 1, background: "linear-gradient(to right, hsl(var(--background)) 50%, hsl(var(--background)/0.6) 75%, transparent 100%)" }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-40" style={{ zIndex: 2 }}>
          <div className="max-w-[640px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
              Professionele websites voor ondernemers
            </p>

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

      {/* ══════ CLIENT STRIP ══════ */}
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

      {/* ══════ SOLUTIONS ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-6">
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

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden group">
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
              <div className="px-10 pb-10">
                <WebsiteMockup accent="primary" />
              </div>
            </div>

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
                  {["Google & Meta advertenties", "E-mail automation", "AI chatbot & leads"].map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link to="/marketing" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:gap-3 transition-all">
                  Bekijk marketingpakketten <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="px-10 pb-10">
                <MarketingMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map(({ number, label }) => (
              <div key={label} className="px-8 first:pl-0 last:pr-0 py-4">
                <p className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-1">{number}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHY US ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-2xl mb-14">
            <h2 className="font-bold tracking-[-0.025em] leading-[1.08] mb-4" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}>
              Waarom kiezen voor Webiro?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              We bouwen niet alleen websites — we bouwen de digitale basis van jouw bedrijf.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyItems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SHOWCASE ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex items-end justify-between mb-12">
            <div className="max-w-xl">
              <h2 className="font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}>
                Recent werk
              </h2>
            </div>
            <Link to="/contact" className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all">
              Bekijk meer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {showcase.map(({ title, cat, url, emoji }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl border border-border bg-card hover:border-primary/30 transition-all overflow-hidden p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <span className="text-3xl mb-4 block">{emoji}</span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">{cat}</p>
                  <h3 className="text-[18px] font-bold text-foreground mb-3">{title}</h3>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary group-hover:gap-3 transition-all">
                    Bekijk website <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ REVIEWS ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="mb-12">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              <span className="text-[13px] font-semibold text-muted-foreground ml-2">5.0 — gebaseerd op klantreviews</span>
            </div>
            <h2 className="font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}>
              Wat klanten zeggen
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map(({ name, role, text, initials }) => (
              <div key={name} className="rounded-2xl border border-border bg-card p-8">
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-[12px] font-bold text-primary">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{name}</p>
                    <p className="text-[12px] text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ MARQUEE ══════ */}
      <section className="border-t border-border overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-12 py-5 overflow-x-hidden whitespace-nowrap"
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
          style={{ scrollbarWidth: "none" }}
        >
          {[...clientNames, ...clientNames].map((n, i) => (
            <span key={i} className="text-[13px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] flex-shrink-0">
              {n}
            </span>
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Home;
