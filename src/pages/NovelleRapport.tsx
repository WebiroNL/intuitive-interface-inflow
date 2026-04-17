import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
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
const STORAGE_KEY = "novelle_rapport_auth_v2";

// Webiro brand palette (HSL → hex equivalents for chart libs)
const BRAND = {
  blue: "#3A4DEA",
  purple: "#8A4FE8",
  yellow: "#FFD75C",
  bg: "#0A0A0F",
  card: "#0F1018",
  border: "rgba(255,255,255,0.08)",
  text: "#FFFFFF",
  muted: "#8A8FA3",
};

const KPIS = [
  { label: "Uitgegeven", value: "€154,31", sub: "Totaal mediabudget", icon: Coins01Icon },
  { label: "Impressies", value: "34.411", sub: "Totale weergaven", icon: ViewIcon },
  { label: "Bereik", value: "16.730", sub: "Unieke personen", icon: UserGroup02Icon },
  { label: "Frequentie", value: "2,06", sub: "Vertoningen per persoon", icon: Target02Icon },
  { label: "Link clicks", value: "1.989", sub: "Klikken naar website", icon: CursorPointer02Icon },
  { label: "CTR (all)", value: "10,22%", sub: "Klikratio", icon: ChartLineData01Icon },
  { label: "Landing page views", value: "1.583", sub: "Daadwerkelijk geladen", icon: RocketIcon },
  { label: "Kosten per LPV", value: "€0,10", sub: "36% onder benchmark", icon: CheckmarkCircle02Icon },
  { label: "Leads", value: "3", sub: "Aanmeldingen", icon: Megaphone02Icon },
  { label: "Kosten per lead", value: "€51,44", sub: "Cost per acquisition", icon: Target02Icon },
  { label: "Instagram groei", value: "+131", sub: "Nieuwe volgers", icon: InstagramIcon },
  { label: "CPM", value: "€4,48", sub: "Per 1.000 impressies", icon: ChartBarLineIcon },
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

const costData = [
  { name: "CPM", value: 4.48, label: "€4,48" },
  { name: "CPC", value: 0.08, label: "€0,08" },
  { name: "Kosten / LPV", value: 0.10, label: "€0,10" },
];

const benchmarkData = [
  { name: "Markt gemiddelde", value: 0.15, fill: BRAND.muted },
  { name: "Novelle Events", value: 0.10, fill: BRAND.blue },
];

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
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: BRAND.bg }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${BRAND.blue}40 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${BRAND.purple}40 0%, transparent 50%)`,
        }} />
        <form onSubmit={handleSubmit} className="relative w-full max-w-md p-8 rounded-2xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.purple})` }}>
              <HugeiconsIcon icon={LockIcon} size={20} color="white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: BRAND.muted }}>Beveiligd rapport</div>
              <h1 className="text-xl font-semibold text-white">Novelle Events</h1>
            </div>
          </div>
          <label className="block text-sm font-medium text-white/80 mb-2">Wachtwoord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="w-full px-4 py-3 rounded-lg border bg-black/40 text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
            style={{ borderColor: BRAND.border, ['--tw-ring-color' as any]: BRAND.blue }}
            placeholder="••••••••••"
            autoFocus
          />
          {error && <p className="mt-2 text-sm" style={{ color: "#FF6B6B" }}>{error}</p>}
          <button
            type="submit"
            className="mt-5 w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.purple})` }}
          >
            Toegang krijgen <HugeiconsIcon icon={ArrowRight02Icon} size={16} color="white" />
          </button>
          <p className="mt-6 text-xs text-center" style={{ color: BRAND.muted }}>
            Rapport opgesteld door <span className="text-white">Webiro</span>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: BRAND.bg, color: BRAND.text }} className="min-h-screen">
      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: `radial-gradient(ellipse at 10% 0%, ${BRAND.blue}30 0%, transparent 50%), radial-gradient(ellipse at 90% 20%, ${BRAND.purple}30 0%, transparent 50%)`,
      }} />

      {/* Vertical grid lines (Stripe-style) */}
      <div className="fixed inset-0 pointer-events-none z-10 hidden lg:block">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-12 gap-0">
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="border-l h-full" style={{ borderColor: BRAND.border }} />
          ))}
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20">
        {/* Header */}
        <header className="mb-16 md:mb-24">
          <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.2em]" style={{ color: BRAND.muted }}>
            <span className="w-8 h-px" style={{ background: BRAND.blue }} />
            Campagnerapport · Meta Ads
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Novelle Events.
            <br />
            <span style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Resultaten campagne maart–april 2026.
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: BRAND.muted }}>
            Een overzicht van de zichtbaarheid, prestaties en leadgeneratie van de Meta Ads campagne voor de nieuwe evenementen- en trouwlocatie in Sneek. Periode: 17 maart t/m 17 april 2026.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Doel: websitebezoekers", "Doel: leads", "Platform: Meta Ads", "Regio: Sneek e.o."].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: BRAND.border, color: BRAND.muted, background: "rgba(255,255,255,0.02)" }}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Management samenvatting */}
        <section className="mb-20">
          <SectionHeader eyebrow="01 — Samenvatting" title="Management samenvatting" />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Sterke zichtbaarheid: 16.730 unieke personen bereikt in de regio Sneek met een totale uitgave van slechts €154,31.",
              "Uitstekende klikratio van 10,22% — ruim 5× hoger dan het gangbare benchmark gemiddelde van ~2% op Meta Ads.",
              "1.583 landing page views à €0,10 per stuk — dat is 36% goedkoper dan de markt benchmark van €0,15.",
              "Instagram-account groeide organisch met 131 nieuwe volgers tijdens de looptijd van de campagne.",
              "3 concrete leads gegenereerd à €51,44 per lead — voldoende basis om de leadflow in de volgende campagne te optimaliseren.",
              "Conclusie: de awareness- en traffic-doelstellingen zijn ruim behaald; de focus voor de volgende campagne ligt op lead-conversie.",
            ].map((bullet, i) => (
              <div key={i} className="flex gap-3 p-5 rounded-xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
                <div className="flex-shrink-0 mt-0.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={BRAND.blue} />
                </div>
                <p className="text-sm leading-relaxed text-white/85">{bullet}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KPI Grid */}
        <section className="mb-20">
          <SectionHeader eyebrow="02 — Kerncijfers" title="Alle KPI's in één oogopslag" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="p-5 rounded-xl border hover:border-white/20 transition-colors" style={{ background: BRAND.card, borderColor: BRAND.border }}>
                <div className="flex items-center justify-between mb-4">
                  <HugeiconsIcon icon={kpi.icon} size={18} color={BRAND.muted} />
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.blue }} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: BRAND.text }}>{kpi.value}</div>
                <div className="text-xs font-medium text-white/70">{kpi.label}</div>
                <div className="text-xs mt-1" style={{ color: BRAND.muted }}>{kpi.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Funnel chart */}
        <section className="mb-20">
          <SectionHeader eyebrow="03 — Funnel" title="Van impressie naar lead" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 60, left: 20, bottom: 10 }}>
                  <defs>
                    <linearGradient id="barFunnel" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={BRAND.blue} />
                      <stop offset="100%" stopColor={BRAND.purple} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} horizontal={false} />
                  <XAxis type="number" stroke={BRAND.muted} fontSize={12} />
                  <YAxis dataKey="stage" type="category" stroke={BRAND.muted} fontSize={12} width={140} />
                  <Tooltip
                    contentStyle={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.text }}
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                  />
                  <Bar dataKey="value" fill="url(#barFunnel)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {funnelData.map((stage, i) => {
                const pct = i === 0 ? 100 : (stage.value / funnelData[0].value) * 100;
                return (
                  <div key={stage.stage} className="p-5 rounded-xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-medium text-white/80">{stage.stage}</span>
                      <span className="text-xs" style={{ color: BRAND.muted }}>{pct.toFixed(2)}%</span>
                    </div>
                    <div className="text-2xl font-bold">{stage.value.toLocaleString("nl-NL")}</div>
                    <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 1)}%`, background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.purple})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bereik & Impressies */}
        <section className="mb-20">
          <SectionHeader eyebrow="04 — Bereik" title="Bereik & impressies" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-2xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reachData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND.blue} />
                      <stop offset="100%" stopColor={BRAND.purple} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} vertical={false} />
                  <XAxis dataKey="name" stroke={BRAND.muted} fontSize={12} />
                  <YAxis stroke={BRAND.muted} fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.text }}
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                  />
                  <Bar dataKey="value" fill="url(#reachGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border flex flex-col justify-center" style={{ background: BRAND.card, borderColor: BRAND.border }}>
              <h3 className="text-xl font-semibold mb-3 text-white">Wat betekent dit?</h3>
              <p className="text-sm leading-relaxed text-white/70 mb-4">
                De campagne werd in totaal <span className="text-white font-semibold">34.411 keer</span> getoond aan <span className="text-white font-semibold">16.730 unieke personen</span>. Dat betekent dat elk persoon de advertentie gemiddeld <span className="text-white font-semibold">2,06 keer</span> heeft gezien — exact het sweet spot voor naamsbekendheid zonder ad fatigue.
              </p>
              <p className="text-sm leading-relaxed text-white/70">
                Voor een lokale locatie in Sneek is dit een sterk regionaal bereik dat bijdraagt aan de top-of-mind awareness van Novelle Events.
              </p>
            </div>
          </div>
        </section>

        {/* Kosten overzicht */}
        <section className="mb-20">
          <SectionHeader eyebrow="05 — Efficiency" title="Kostenoverzicht" />
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {costData.map((c) => (
              <div key={c.name} className="p-6 rounded-xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.muted }}>{c.name}</div>
                <div className="text-4xl font-bold" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {c.label}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 md:p-8 rounded-2xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
            <h3 className="text-lg font-semibold mb-1 text-white">Kosten per lead</h3>
            <p className="text-sm mb-4" style={{ color: BRAND.muted }}>Met 3 leads à €51,44 per stuk hebben we waardevolle data verzameld om de campagne in de volgende ronde verder te optimaliseren.</p>
            <div className="text-5xl font-bold" style={{ color: BRAND.text }}>€51,44 <span className="text-sm font-normal" style={{ color: BRAND.muted }}>/ lead</span></div>
          </div>
        </section>

        {/* Benchmark */}
        <section className="mb-20">
          <SectionHeader eyebrow="06 — Benchmark" title="36% goedkoper dan de markt" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-2xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={benchmarkData} layout="vertical" margin={{ top: 10, right: 40, left: 60, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} horizontal={false} />
                  <XAxis type="number" stroke={BRAND.muted} fontSize={12} tickFormatter={(v) => `€${v.toFixed(2)}`} />
                  <YAxis dataKey="name" type="category" stroke={BRAND.muted} fontSize={12} width={120} />
                  <Tooltip
                    contentStyle={{ background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 8, color: BRAND.text }}
                    formatter={(v: number) => `€${v.toFixed(2)}`}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {benchmarkData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border flex flex-col justify-center" style={{ background: `linear-gradient(135deg, ${BRAND.blue}15, ${BRAND.purple}15)`, borderColor: BRAND.blue + "40" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit" style={{ background: BRAND.blue + "20", color: BRAND.blue }}>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color={BRAND.blue} /> 36% onder benchmark
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Bovengemiddeld efficiënt</h3>
              <p className="text-sm leading-relaxed text-white/75">
                Vergelijkbare adverteerders binnen de events- en hospitality-branche betalen gemiddeld <span className="text-white font-semibold">€0,15 per landing page view</span>. Novelle Events betaalde <span className="text-white font-semibold">€0,10</span> — een besparing van 36% op het meest cruciale efficiency-cijfer van de campagne.
              </p>
            </div>
          </div>
        </section>

        {/* Uitleg in simpele taal */}
        <section className="mb-20">
          <SectionHeader eyebrow="07 — Wat betekent dit?" title="In gewone taal" />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: ViewIcon,
                title: "Zichtbaarheid",
                text: "Bijna 17.000 mensen in en rond Sneek hebben Novelle Events voorbij zien komen. Dat is fundament voor naamsbekendheid in de regio.",
              },
              {
                icon: CursorPointer02Icon,
                title: "Interesse",
                text: "Met een klikratio van 10,22% (vs. ~2% gemiddeld) is duidelijk dat de boodschap en visuals raak zijn — mensen willen meer weten.",
              },
              {
                icon: RocketIcon,
                title: "Bezoek",
                text: "1.583 mensen hebben de website daadwerkelijk bezocht. Dat is een serieuze stroom potentiële klanten naar de digitale etalage.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border" style={{ background: BRAND.card, borderColor: BRAND.border }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.purple})` }}>
                  <HugeiconsIcon icon={item.icon} size={20} color="white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Aanbevelingen */}
        <section className="mb-20">
          <SectionHeader eyebrow="08 — Volgende stap" title="Aanbevelingen voor de volgende campagne" />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: Coins01Icon,
                title: "Budget verhogen",
                text: "Verhoog het maandbudget naar €400–600. De huidige efficiency (€0,10 per LPV) toont aan dat extra budget rechtstreeks meer kwaliteitsverkeer oplevert.",
              },
              {
                icon: Target02Icon,
                title: "Targeting verfijnen",
                text: "Bouw een lookalike-doelgroep op basis van de huidige website-bezoekers en focus zwaarder op koppels (25–45 jr) en bedrijven in een straal van 30 km rond Sneek.",
              },
              {
                icon: Megaphone02Icon,
                title: "Creatives uitbreiden",
                text: "Test 3–5 nieuwe video-creatives (15s reels) met sfeerbeelden van de locatie. Video heeft op Meta gemiddeld 30% lagere CPC dan statische beelden.",
              },
              {
                icon: IdeaIcon,
                title: "Lead-conversie verbeteren",
                text: "Vervang het generieke contactformulier door een korte 'check beschikbaarheid'-flow met datumkiezer. Verwacht effect: kosten per lead van €51 → €15–25.",
              },
            ].map((rec) => (
              <div key={rec.title} className="p-6 rounded-xl border hover:border-white/20 transition-colors" style={{ background: BRAND.card, borderColor: BRAND.border }}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.purple})` }}>
                    <HugeiconsIcon icon={rec.icon} size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5 text-white">{rec.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70">{rec.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer / CTA */}
        <footer className="mt-24 pt-10 border-t" style={{ borderColor: BRAND.border }}>
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: BRAND.muted }}>Rapport door</div>
              <div className="text-3xl font-bold text-white">Webiro</div>
              <p className="text-sm mt-2" style={{ color: BRAND.muted }}>Strategie, design en performance marketing voor merken die willen groeien.</p>
            </div>
            <div className="md:text-right text-sm" style={{ color: BRAND.muted }}>
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

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em]" style={{ color: BRAND.muted }}>
        <span className="w-6 h-px" style={{ background: BRAND.blue }} />
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
    </div>
  );
}
