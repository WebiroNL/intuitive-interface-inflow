import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartLineData01Icon,
  Target02Icon,
  UserGroup02Icon,
  ViewIcon,
  CursorPointer02Icon,
  RocketIcon,
  CheckmarkCircle02Icon,
  ArrowRight02Icon,
  LockIcon,
  InstagramIcon,
  Coins01Icon,
  ChartBarLineIcon,
  Megaphone02Icon,
  IdeaIcon,
} from "@hugeicons/core-free-icons";

const PASSWORD = "novelle2026!";
const STORAGE_KEY = "novelle_rapport_auth_v3";

/* Recharts can't read CSS variables — map our brand to hex equivalents */
const CHART = {
  primary: "hsl(234, 82%, 57%)",
  accent: "hsl(259, 79%, 61%)",
  yellow: "hsl(44, 100%, 67%)",
  muted: "hsl(240, 4%, 60%)",
  border: "hsl(0, 0%, 90%)",
  text: "hsl(270, 6%, 7%)",
  card: "hsl(0, 0%, 100%)",
};

const KPIS = [
  { label: "Uitgegeven", value: 154.31, prefix: "€", decimals: 2, sub: "Totaal mediabudget", icon: Coins01Icon },
  { label: "Impressies", value: 34411, sub: "Totale weergaven", icon: ViewIcon },
  { label: "Bereik", value: 16730, sub: "Unieke personen", icon: UserGroup02Icon },
  { label: "Frequentie", value: 2.06, decimals: 2, sub: "Vertoningen / persoon", icon: Target02Icon },
  { label: "Link clicks", value: 1989, sub: "Klikken naar website", icon: CursorPointer02Icon },
  { label: "CTR (all)", value: 10.22, decimals: 2, suffix: "%", sub: "Klikratio", icon: ChartLineData01Icon },
  { label: "Landing page views", value: 1583, sub: "Daadwerkelijk geladen", icon: RocketIcon },
  { label: "Kosten per LPV", value: 0.10, prefix: "€", decimals: 2, sub: "36% onder benchmark", icon: CheckmarkCircle02Icon, highlight: true },
  { label: "Leads", value: 3, sub: "Aanmeldingen", icon: Megaphone02Icon },
  { label: "Kosten per lead", value: 51.44, prefix: "€", decimals: 2, sub: "Cost per acquisition", icon: Target02Icon },
  { label: "Instagram groei", value: 131, prefix: "+", sub: "Nieuwe volgers", icon: InstagramIcon },
  { label: "CPM", value: 4.48, prefix: "€", decimals: 2, sub: "Per 1.000 impressies", icon: ChartBarLineIcon },
];

const funnelData = [
  { stage: "Impressies", value: 34411 },
  { stage: "Link clicks", value: 1989 },
  { stage: "Landing page views", value: 1583 },
  { stage: "Leads", value: 3 },
];

const reachData = [
  { name: "Impressies", value: 34411 },
  { name: "Bereik", value: 16730 },
];

const benchmarkData = [
  { name: "Markt gemiddelde", value: 0.15 },
  { name: "Novelle Events", value: 0.10 },
];

/* Smooth count-up hook */
function useCountUp(target: number, duration = 1400, decimals = 0, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value.toLocaleString("nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function KpiCard({ kpi, index }: { kpi: typeof KPIS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const display = useCountUp(kpi.value, 1200 + index * 50, kpi.decimals ?? 0, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className={`group relative p-5 md:p-6 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${
        kpi.highlight ? "ring-1 ring-primary/20" : ""
      }`}
    >
      {kpi.highlight && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      )}
      <div className="relative flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent transition-all duration-300">
          <HugeiconsIcon icon={kpi.icon} size={18} className="text-primary group-hover:text-white transition-colors" />
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      </div>
      <div className="relative text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
        {kpi.prefix}{display}{kpi.suffix}
      </div>
      <div className="relative text-xs font-medium text-foreground/80">{kpi.label}</div>
      <div className="relative text-xs mt-1 text-muted-foreground">{kpi.sub}</div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-10 md:mb-14 max-w-3xl">
      <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
        <span className="w-6 h-px bg-primary" />
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">{title}</h2>
      {description && <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

export default function NovelleRapport() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") setAuthenticated(true);
    document.title = "Campagnerapport — Novelle Events | Webiro";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
    } else {
      setError("Onjuist wachtwoord");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
        {/* Soft gradient blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <form onSubmit={handleSubmit} className="relative w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
              <HugeiconsIcon icon={LockIcon} size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Beveiligd rapport</div>
              <h1 className="text-xl font-semibold text-foreground">Novelle Events</h1>
            </div>
          </div>
          <label className="block text-sm font-medium text-foreground mb-2">Wachtwoord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••••"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="mt-5 w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Toegang krijgen <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="text-white" />
          </button>
          <p className="mt-6 text-xs text-center text-muted-foreground">
            Rapport opgesteld door <span className="text-foreground font-medium">Webiro</span>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">

      {/* Soft hero gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 md:py-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 md:mb-28"
        >
          <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            <span className="w-8 h-px bg-primary" />
            Campagnerapport · Meta Ads
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 text-foreground">
            Novelle Events.
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Resultaten campagne maart–april 2026.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed text-muted-foreground">
            Een overzicht van de zichtbaarheid, prestaties en leadgeneratie van de Meta Ads campagne voor de nieuwe evenementen- en trouwlocatie in Sneek. Periode: 17 maart t/m 17 april 2026.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Doel: websitebezoekers", "Doel: leads", "Platform: Meta Ads", "Regio: Sneek e.o."].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Management samenvatting */}
        <section className="mb-24">
          <SectionHeader eyebrow="01 — Samenvatting" title="Management samenvatting" />
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Sterke zichtbaarheid: 16.730 unieke personen bereikt in de regio Sneek met een totale uitgave van slechts €154,31.",
              "Uitstekende klikratio van 10,22% — ruim 5× hoger dan het gangbare benchmark gemiddelde van ~2% op Meta Ads.",
              "1.583 landing page views à €0,10 per stuk — dat is 36% goedkoper dan de markt benchmark van €0,15.",
              "Instagram-account groeide organisch met 131 nieuwe volgers tijdens de looptijd van de campagne.",
              "3 concrete leads gegenereerd à €51,44 per lead — voldoende basis om de leadflow in de volgende campagne te optimaliseren.",
              "Conclusie: de awareness- en traffic-doelstellingen zijn ruim behaald; de focus voor de volgende campagne ligt op lead-conversie.",
            ].map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-3 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{bullet}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* KPI Grid */}
        <section className="mb-24">
          <SectionHeader
            eyebrow="02 — Kerncijfers"
            title="Alle KPI's in één oogopslag"
            description="Twaalf metrics die samen het verhaal van deze campagne vertellen."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {KPIS.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} index={i} />
            ))}
          </div>
        </section>

        {/* Funnel */}
        <section className="mb-24">
          <SectionHeader eyebrow="03 — Funnel" title="Van impressie naar lead" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 60, left: 20, bottom: 10 }}>
                  <defs>
                    <linearGradient id="barFunnel" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={CHART.primary} />
                      <stop offset="100%" stopColor={CHART.accent} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.border} horizontal={false} />
                  <XAxis type="number" stroke={CHART.muted} fontSize={12} />
                  <YAxis dataKey="stage" type="category" stroke={CHART.muted} fontSize={12} width={140} />
                  <Tooltip
                    contentStyle={{ background: CHART.card, border: `1px solid ${CHART.border}`, borderRadius: 8, color: CHART.text, fontSize: 12 }}
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                    cursor={{ fill: "hsl(240, 5%, 96%)" }}
                  />
                  <Bar dataKey="value" fill="url(#barFunnel)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {funnelData.map((stage, i) => {
                const pct = i === 0 ? 100 : (stage.value / funnelData[0].value) * 100;
                return (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="p-5 rounded-xl border border-border bg-card"
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                      <span className="text-xs text-muted-foreground">{pct.toFixed(2)}%</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stage.value.toLocaleString("nl-NL")}</div>
                    <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max(pct, 1)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bereik & Impressies */}
        <section className="mb-24">
          <SectionHeader eyebrow="04 — Bereik" title="Bereik & impressies" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={reachData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="reachArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={CHART.accent} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.border} vertical={false} />
                  <XAxis dataKey="name" stroke={CHART.muted} fontSize={12} />
                  <YAxis stroke={CHART.muted} fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: CHART.card, border: `1px solid ${CHART.border}`, borderRadius: 8, color: CHART.text, fontSize: 12 }}
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                  />
                  <Area type="monotone" dataKey="value" stroke={CHART.primary} strokeWidth={2.5} fill="url(#reachArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-card flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Wat betekent dit?</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                De campagne werd in totaal <span className="text-foreground font-semibold">34.411 keer</span> getoond aan <span className="text-foreground font-semibold">16.730 unieke personen</span>. Elk persoon heeft de advertentie gemiddeld <span className="text-foreground font-semibold">2,06 keer</span> gezien, exact het sweet spot voor naamsbekendheid zonder ad fatigue.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Voor een lokale locatie in Sneek is dit een sterk regionaal bereik dat bijdraagt aan de top-of-mind awareness van Novelle Events.
              </p>
            </div>
          </div>
        </section>

        {/* Kosten overzicht */}
        <section className="mb-24">
          <SectionHeader eyebrow="05 — Efficiency" title="Kostenoverzicht" />
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { name: "CPM", label: "€4,48", sub: "Per 1.000 impressies" },
              { name: "CPC", label: "€0,08", sub: "Per linkklik" },
              { name: "Kosten / LPV", label: "€0,10", sub: "Per landing page view" },
            ].map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="text-xs uppercase tracking-wider mb-3 text-muted-foreground font-medium">{c.name}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {c.label}
                </div>
                <div className="text-xs mt-2 text-muted-foreground">{c.sub}</div>
              </motion.div>
            ))}
          </div>
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-1 text-foreground">Kosten per lead</h3>
            <p className="text-sm mb-4 text-muted-foreground">Met 3 leads à €51,44 per stuk hebben we waardevolle data verzameld om de campagne in de volgende ronde verder te optimaliseren.</p>
            <div className="text-5xl font-bold text-foreground">€51,44 <span className="text-sm font-normal text-muted-foreground">/ lead</span></div>
          </div>
        </section>

        {/* Benchmark */}
        <section className="mb-24">
          <SectionHeader eyebrow="06 — Benchmark" title="36% goedkoper dan de markt" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={benchmarkData} layout="vertical" margin={{ top: 10, right: 40, left: 60, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.border} horizontal={false} />
                  <XAxis type="number" stroke={CHART.muted} fontSize={12} tickFormatter={(v) => `€${v.toFixed(2)}`} />
                  <YAxis dataKey="name" type="category" stroke={CHART.muted} fontSize={12} width={120} />
                  <Tooltip
                    contentStyle={{ background: CHART.card, border: `1px solid ${CHART.border}`, borderRadius: 8, color: CHART.text, fontSize: 12 }}
                    formatter={(v: number) => `€${v.toFixed(2)}`}
                    cursor={{ fill: "hsl(240, 5%, 96%)" }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {benchmarkData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? CHART.muted : CHART.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit bg-primary/10 text-primary">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-primary" /> 36% onder benchmark
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Bovengemiddeld efficiënt</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Vergelijkbare adverteerders binnen de events- en hospitality-branche betalen gemiddeld <span className="text-foreground font-semibold">€0,15 per landing page view</span>. Novelle Events betaalde <span className="text-foreground font-semibold">€0,10</span>, een besparing van 36% op het meest cruciale efficiency-cijfer van de campagne.
              </p>
            </div>
          </div>
        </section>

        {/* Uitleg in simpele taal */}
        <section className="mb-24">
          <SectionHeader eyebrow="07 — Wat betekent dit?" title="In gewone taal" />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: ViewIcon, title: "Zichtbaarheid", text: "Bijna 17.000 mensen in en rond Sneek hebben Novelle Events voorbij zien komen. Dat is fundament voor naamsbekendheid in de regio." },
              { icon: CursorPointer02Icon, title: "Interesse", text: "Met een klikratio van 10,22% (vs. ~2% gemiddeld) is duidelijk dat de boodschap en visuals raak zijn, mensen willen meer weten." },
              { icon: RocketIcon, title: "Bezoek", text: "1.583 mensen hebben de website daadwerkelijk bezocht. Dat is een serieuze stroom potentiële klanten naar de digitale etalage." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary to-accent">
                  <HugeiconsIcon icon={item.icon} size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Aanbevelingen */}
        <section className="mb-24">
          <SectionHeader eyebrow="08 — Volgende stap" title="Aanbevelingen voor de volgende campagne" />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Coins01Icon, title: "Budget verhogen", text: "Verhoog het maandbudget naar €400–600. De huidige efficiency (€0,10 per LPV) toont aan dat extra budget rechtstreeks meer kwaliteitsverkeer oplevert." },
              { icon: Target02Icon, title: "Targeting verfijnen", text: "Bouw een lookalike-doelgroep op basis van de huidige website-bezoekers en focus zwaarder op koppels (25–45 jr) en bedrijven in een straal van 30 km rond Sneek." },
              { icon: Megaphone02Icon, title: "Creatives uitbreiden", text: "Test 3–5 nieuwe video-creatives (15s reels) met sfeerbeelden van de locatie. Video heeft op Meta gemiddeld 30% lagere CPC dan statische beelden." },
              { icon: IdeaIcon, title: "Lead-conversie verbeteren", text: "Vervang het generieke contactformulier door een korte 'check beschikbaarheid'-flow met datumkiezer. Verwacht effect: kosten per lead van €51 → €15–25." },
            ].map((rec, i) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                    <HugeiconsIcon icon={rec.icon} size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5 text-foreground">{rec.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{rec.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-10 border-t border-border">
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] mb-3 text-muted-foreground font-medium">Rapport door</div>
              <div className="text-3xl font-bold text-foreground">Webiro</div>
              <p className="text-sm mt-2 text-muted-foreground">Strategie, design en performance marketing voor merken die willen groeien.</p>
            </div>
            <div className="md:text-right text-sm text-muted-foreground">
              <div>Campagneperiode: 17 maart – 17 april 2026</div>
              <div>Klant: Novelle Events, Sneek</div>
              <div className="mt-2">© {new Date().getFullYear()} Webiro · Vertrouwelijk</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
