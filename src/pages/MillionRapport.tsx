import { useEffect } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart02Icon,
  Coins01Icon,
  Target02Icon,
  ChartLineData01Icon,
  UserGroup02Icon,
  Facebook01Icon,
  GoogleIcon,
  InstagramIcon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  ArrowDown02Icon,
  ChartBarLineIcon,
  IdeaIcon,
  GlobalSearchIcon,
  StarIcon,
  CursorPointer02Icon,
} from "@hugeicons/core-free-icons";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";
import webiroLogo from "@/assets/logo-webiro.svg";

/* ────────────────────────── DATA ────────────────────────── */

const KPIS = [
  { label: "Online orders", value: "116", sub: "Shopify webshop", icon: ShoppingCart02Icon },
  { label: "Online omzet", value: "€8.827", sub: "Gem. €76 per order", icon: Coins01Icon },
  { label: "Totale ad spend", value: "€3.469", sub: "Meta + Google", icon: Target02Icon },
  { label: "Blended ROAS", value: "2.54x", sub: "Op online omzet", icon: ChartLineData01Icon },
  { label: "Totale sessies", value: "14.475", sub: "11.727 unieke bezoekers", icon: UserGroup02Icon, highlight: true },
];

const CHANNELS = [
  {
    name: "Meta Ads",
    sub: "Facebook & Instagram",
    icon: Facebook01Icon,
    iconColor: "text-[#1877F2]",
    roas: "3.80x",
    roasLabel: "ROAS",
    roasTone: "good" as const,
    metrics: [
      { label: "Spend", value: "€1.762" },
      { label: "Orders", value: "88" },
      { label: "CPP", value: "€20,03" },
    ],
  },
  {
    name: "Google Ads",
    sub: "Search & Display",
    icon: GoogleIcon,
    iconColor: "text-[#4285F4]",
    roas: "~0.89x",
    roasLabel: "Schatting",
    roasTone: "warn" as const,
    metrics: [
      { label: "Spend", value: "€1.706" },
      { label: "Orders (est.)", value: "~20", est: true },
      { label: "CPP (est.)", value: "~€85", est: true },
    ],
    note: "Schatting op basis van 116 totaal − 88 Meta = 28 resterende orders. Google Ads campagne data ontbreekt.",
  },
];

const META_CAMPAIGNS = [
  { name: "Nieuwe collectie — MILLION", spend: "€714,50", orders: "35", cpp: "€20,41", reach: "79.564", roas: "2.90x", tone: "good" as const, tag: "Beste" as const },
  { name: "WEBIRO: NOA LANG TRIADORO", spend: "€452,36", orders: "22", cpp: "€20,56", reach: "52.525", roas: "1.71x", tone: "good" as const },
  { name: "Pantalon x Filmpje van ander MEI / Adv+", spend: "€148,90", orders: "9", cpp: "€16,54", reach: "25.179", roas: "2.11x", tone: "good" as const },
  { name: "1ste Pantalon x Wide Leg / NEW maart '26", spend: "€148,77", orders: "11", cpp: "€13,52", reach: "18.743", roas: "1.09x", tone: "amber" as const },
  { name: "[TOF] ICON Jeans / conversions / NEW", spend: "€297,88", orders: "11", cpp: "€27,08", reach: "37.820", roas: "0.81x", tone: "bad" as const, tag: "Verlies" as const },
];

const META_TOTAL = { spend: "€1.762,41", orders: "88", cpp: "€20,03", reach: "213.831", roas: "3.80x" };

const TRAFFIC = [
  { source: "Google", sub: "Betaald + organisch", sessions: "5.317", pct: 36.7, color: "#4285F4" },
  { source: "Direct", sub: "Type-in / bookmark", sessions: "4.424", pct: 30.6, color: "hsl(var(--muted-foreground))" },
  { source: "Facebook", sub: "Organisch + betaald", sessions: "3.059", pct: 21.1, color: "#1877F2" },
  { source: "Instagram", sub: "Organisch + betaald", sessions: "1.591", pct: 11.0, color: "#E1306C" },
  { source: "Overig", sub: "Bing, Yandex, e.a.", sessions: "84", pct: 0.6, color: "hsl(var(--muted-foreground) / 0.6)" },
];

const INSIGHTS = [
  { tone: "ok" as const, icon: CheckmarkCircle02Icon, title: "Meta presteert sterk", body: "ROAS 3.80x overall. \"Nieuwe collectie / MILLION\" is de absolute topper: 35 orders bij ROAS 2.90x. Budget hier ophogen heeft direct effect." },
  { tone: "warn" as const, icon: Alert02Icon, title: "Google Ads verliesgevend", body: "Geschatte ROAS ~0.89x betekent verlies per euro spend. Campagnes doorlichten of budget tijdelijk overhevelen naar Meta tot Google geoptimaliseerd is." },
  { tone: "warn" as const, icon: ArrowDown02Icon, title: "ICON Jeans pauzeren of aanpassen", body: "€297,88 uitgegeven voor 11 orders bij ROAS 0.81x, verliesgevend. Doelgroep, bod of creatie aanpassen, of campagne pauzeren." },
  { tone: "note" as const, icon: GlobalSearchIcon, title: "UTM tracking instellen", body: "Google Ads traffic is nu niet onderscheidbaar van organisch in Shopify. UTM tags toevoegen (utm_medium=cpc) zodat Shopify betaald vs organisch splitst." },
  { tone: "note" as const, icon: ChartBarLineIcon, title: "Conversieratio: 1%", body: "116 orders op 11.727 bezoekers = 0,99% conversieratio. Optimalisatie van productpagina's en checkout kan dit direct verhogen zonder extra spend." },
  { tone: "ok" as const, icon: IdeaIcon, title: "Advantage+ werkt", body: "\"Pantalon x Filmpje\" draait op Advantage+ budgeting met ROAS 2.11x. Dit format verdient een breder test met meerdere producten." },
];

/* ────────────────────────── HELPERS ────────────────────────── */

const RoasPill = ({ value, tone }: { value: string; tone: "good" | "amber" | "bad" }) => {
  const tones = {
    good: "bg-primary/10 text-primary border-primary/20",
    amber: "bg-webiro-yellow/15 text-webiro-yellow border-webiro-yellow/30",
    bad: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium font-mono ${tones[tone]}`}>
      {value}
    </span>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-6 mt-16 first:mt-0">
    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
    <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">{children}</h2>
  </div>
);

/* ────────────────────────── PAGE ────────────────────────── */

const MillionRapport = () => {
  useEffect(() => {
    document.title = "Million Store — Ads Rapportage April 2026 | Webiro";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* HEADER */}
      <header className="bg-webiro-dark text-white border-b-2 border-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Million Store logo (white) */}
            <svg viewBox="0 0 355.44 167.25" className="h-10 w-auto" xmlns="http://www.w3.org/2000/svg">
              <g fill="#fff">
                <path d="M201.94,86.65v-8.45c0-1.92-1.66-3.44-3.64-3.44h-5.42v27.37h2.98v-11.77h1.57c.79,0,1.53.43,1.53,1.76v10.01h2.98v-10.48s.08-2.03-1.08-2.58c1.2-.27,1.08-2.42,1.08-2.42Zm-2.98-.51c0,1.25-.74,1.56-1.53,1.56h-1.57v-10.32h1.57c.79,0,1.53.39,1.53,1.41v7.35Z" />
                <path d="M218.5,89.86c0-.35.33-.67.7-.67h1.24c.95,0,1.36-.39,1.57-.74.12-.23.62-1.37.95-2.07h-4.47v-8.13c0-.39.29-.66.7-.66h2.4c.95,0,1.41-.43,1.57-.78l.99-2.03h-7.74c-.5,0-.87.35-.91.78v26.59h6.62c.95,0,1.41-.39,1.61-.74.12-.23.62-1.33.95-2.03h-6.21v-9.5Z" />
                <path d="M131.56,94.59c-.37.2-.83.63-.83,1.53v2.81c.04,1.88,1.61,3.4,3.6,3.48h1.86c2.07,0,3.72-1.56,3.72-3.48v-3.48s.13-1.84-1.32-4.34l-3.56-6.33s-1.28-2.07-1.28-3.68v-2.62c0-.86.7-1.53,1.57-1.53s1.57.66,1.57,1.53v3.17c.79-.31,1.94-.82,2.19-.94.37-.2.83-.63.83-1.52v-1.06c0-1.88-1.61-3.6-3.6-3.64h-1.86c-2.07,0-3.72,1.72-3.72,3.64v2.81s-.12,1.84,1.32,4.34l3.56,6.29s1.28,2.11,1.28,3.72v3.13c0,.86-.7,1.52-1.57,1.52s-1.57-.66-1.57-1.48v-4.77c-.74.31-1.94.82-2.19.9Z" />
                <path d="M177.27,102.41c1.99-.08,3.56-1.56,3.6-3.44v-20.99c0-1.88-1.61-3.4-3.6-3.48h-2.28c-2.07,0-3.72,1.56-3.72,3.48v20.99c.04,1.88,1.7,3.44,3.72,3.44h2.28Zm-3.02-3.99v-19.94c0-.82.7-1.49,1.57-1.53h.46c.87,0,1.57.66,1.57,1.53v19.94c0,.86-.7,1.52-1.57,1.52h-.46c-.87-.04-1.57-.7-1.57-1.52Z" />
                <path d="M149.82,75.63v1.92h4.18v24.01c0,.2.12.59.83.59h2.11v-23.93c.04-.35.33-.66.74-.66h2.32c.95,0,1.41-.39,1.57-.74l.99-2.03h-11.84c-.5,0-.91.39-.91.86Z" />
                <path d="M14.11.99H0v1.45c2.24,0,3.74,1.45,3.74,3.63v40.6c0,2.18-1.49,3.63-3.74,3.63v1.45h11.42v-1.45c-2.24,0-3.73-1.45-3.73-3.63V8.24l20.62,43.5h2.24l3.74-8.81-.82-1.77L14.11.99Z" />
                <path d="M63.05,50.29c-2.24,0-3.74-1.45-3.74-3.63V6.06c0-2.17,1.49-3.63,3.74-3.63V.99h-12.7l-.02,45.7.02-.02c0,2.18-1.49,3.63-3.74,3.63v1.45h16.44v-1.45Z" />
                <path d="M147.87,35.29h-1.49v.58c0,7.9-5.38,11.99-13.52,11.99h-13.6c-2.24,0-3.74-1.45-3.74-3.63V6.06c0-2.17,1.49-3.63,3.74-3.63V.99h-16.44v1.45c.45,0,.82.07,1.2.15,1.57.43,2.54,1.74,2.54,3.48v40.6c0,2.18-1.49,3.63-3.74,3.63v1.45h45.06v-16.44Z" />
                <path d="M203.76,35.29h-1.49v.58c0,7.9-5.38,11.99-13.52,11.99h-13.6c-2.24,0-3.74-1.45-3.74-3.63V6.06c0-2.17,1.49-3.63,3.74-3.63V.99h-16.44v1.45c.45,0,.82.07,1.2.15,1.57.43,2.54,1.74,2.54,3.48v40.6c0,2.18-1.49,3.63-3.74,3.63v1.45h45.06v-16.44Z" />
                <path d="M344.02.99v1.45c2.24,0,3.74,1.45,3.74,3.63v34.15L315.92.99h-14.41v1.45c1.2,0,2.17.43,2.84,1.16l.22.22c.45.65.67,1.38.67,2.25v40.6c0,2.18-1.49,3.63-3.74,3.63v1.45h11.42v-1.45c-2.24,0-3.74-1.45-3.74-3.63V6.5l36.69,45.24h5.82V6.06c0-2.17,1.49-3.63,3.74-3.63V.99h-11.42Z" />
                <path d="M214.59,2.44c2.24,0,3.74,1.45,3.74,3.63v40.6c0,2.18-1.49,3.63-3.74,3.63v1.45h16.44v-1.45c-2.24,0-3.74-1.45-3.74-3.63V6.06c0-2.17,1.49-3.63,3.74-3.63V.99h-16.44v1.45Z" />
                <path d="M74.79,2.44c2.24,0,3.74,1.45,3.74,3.63v40.6c0,2.18-1.49,3.63-3.74,3.63v1.45h16.44v-1.45c-2.24,0-3.74-1.45-3.74-3.63V6.06c0-2.17,1.49-3.63,3.74-3.63V.99h-16.44v1.45Z" />
                <path d="M273.38.01v2.04c15.6,6.55,15.6,42.08,0,48.63v2.04c27.92-4.83,27.92-47.88,0-52.71Z" />
                <path d="M262.9,50.69c-15.6-6.51-15.6-42.15,0-48.66V0c-27.92,4.8-27.92,47.93,0,52.73v-2.03Z" />
              </g>
            </svg>
            <div className="hidden md:block w-px h-10 bg-white/15" />
            <div>
              <h1 className="text-2xl font-sans font-bold tracking-tight">Ads Rapportage</h1>
              <p className="text-xs text-white/50 uppercase tracking-[0.2em] mt-1">Prepared by Webiro · Marketing Report</p>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <img src={webiroLogoDark} alt="Webiro" className="h-7 w-auto" />
            <div className="px-3 py-1 rounded-full border border-white/15 text-xs font-mono text-white/70">April 2026</div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {/* KPI OVERVIEW */}
        <SectionLabel>Overzicht april 2026</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {KPIS.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`p-6 ${kpi.highlight ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs uppercase tracking-wider ${kpi.highlight ? "text-white/70" : "text-muted-foreground"}`}>
                  {kpi.label}
                </span>
                <HugeiconsIcon icon={kpi.icon} size={16} className={kpi.highlight ? "text-white/70" : "text-muted-foreground"} />
              </div>
              <div className={`text-3xl font-sans font-bold tracking-tight mb-1 ${kpi.highlight ? "text-white" : "text-foreground"}`}>
                {kpi.value}
              </div>
              <div className={`text-xs ${kpi.highlight ? "text-white/60" : "text-muted-foreground"}`}>{kpi.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* CHANNELS */}
        <SectionLabel>Per kanaal</SectionLabel>
        <div className="grid md:grid-cols-2 gap-6">
          {CHANNELS.map((c) => (
            <div key={c.name} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <HugeiconsIcon icon={c.icon} size={22} className={c.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </div>
                <div className={`text-right px-3 py-2 rounded-lg border ${
                  c.roasTone === "good"
                    ? "border-primary/20 bg-primary/5"
                    : "border-webiro-yellow/30 bg-webiro-yellow/5"
                }`}>
                  <div className={`text-xl font-sans font-bold leading-none ${
                    c.roasTone === "good" ? "text-primary" : "text-webiro-yellow"
                  }`}>{c.roas}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{c.roasLabel}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border">
                {c.metrics.map((m) => (
                  <div key={m.label} className="bg-card p-4">
                    <div className="text-xs text-muted-foreground mb-1.5">{m.label}</div>
                    <div className={`text-lg font-sans font-semibold ${m.est ? "text-muted-foreground italic" : ""}`}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
              {c.note && (
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{c.note}</p>
              )}
            </div>
          ))}
        </div>



        {/* META CAMPAIGNS TABLE */}
        <SectionLabel>Meta campagnes — april 2026</SectionLabel>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="font-sans font-bold text-base">Campagne breakdown</h3>
            <p className="text-xs text-muted-foreground mt-1">7 day click + 1 day view attributie · alle conversies</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Campagne</th>
                  <th className="px-4 py-3 font-medium font-mono">Spend</th>
                  <th className="px-4 py-3 font-medium font-mono">Orders</th>
                  <th className="px-4 py-3 font-medium font-mono">CPP</th>
                  <th className="px-4 py-3 font-medium font-mono">Reach</th>
                  <th className="px-4 py-3 font-medium font-mono">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {META_CAMPAIGNS.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{row.name}</span>
                        {row.tag === "Beste" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-wider">
                            <HugeiconsIcon icon={StarIcon} size={10} /> Beste
                          </span>
                        )}
                        {row.tag === "Verlies" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-destructive/10 text-destructive text-[10px] font-medium uppercase tracking-wider">
                            Verlies
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-foreground/80">{row.spend}</td>
                    <td className="px-4 py-4 font-mono text-foreground/80">{row.orders}</td>
                    <td className="px-4 py-4 font-mono text-foreground/80">{row.cpp}</td>
                    <td className="px-4 py-4 font-mono text-foreground/80">{row.reach}</td>
                    <td className="px-4 py-4"><RoasPill value={row.roas} tone={row.tone} /></td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                  <td className="px-6 py-4">Totaal Meta Ads</td>
                  <td className="px-4 py-4 font-mono">{META_TOTAL.spend}</td>
                  <td className="px-4 py-4 font-mono">{META_TOTAL.orders}</td>
                  <td className="px-4 py-4 font-mono">{META_TOTAL.cpp}</td>
                  <td className="px-4 py-4 font-mono">{META_TOTAL.reach}</td>
                  <td className="px-4 py-4"><RoasPill value={META_TOTAL.roas} tone="good" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TRAFFIC */}
        <SectionLabel>Traffic — Shopify sessies per bron</SectionLabel>
        <div className="bg-card border border-border rounded-xl">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-sans font-bold text-base">Sessies per verwijzer</h3>
            <span className="text-xs text-muted-foreground font-mono">Totaal: 14.475 sessies · 11.727 bezoekers</span>
          </div>
          <div className="p-6 space-y-5">
            {TRAFFIC.map((t, i) => (
              <motion.div
                key={t.source}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="grid grid-cols-[140px_1fr_80px_60px] gap-4 items-center"
              >
                <div>
                  <div className="font-medium text-sm">{t.source}</div>
                  <div className="text-xs text-muted-foreground">{t.sub}</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${t.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: t.color }}
                  />
                </div>
                <div className="text-right font-mono text-sm font-semibold">{t.sessions}</div>
                <div className="text-right font-mono text-xs text-muted-foreground">{t.pct}%</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* INSIGHTS */}
        <SectionLabel>Aanbevelingen</SectionLabel>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INSIGHTS.map((ins, i) => {
            const tones = {
              ok: "border-primary/20 bg-primary/[0.03]",
              warn: "border-webiro-yellow/30 bg-webiro-yellow/[0.04]",
              note: "border-border bg-card",
            };
            const iconBg = {
              ok: "bg-primary/10 text-primary",
              warn: "bg-webiro-yellow/15 text-webiro-yellow",
              note: "bg-muted text-muted-foreground",
            };
            return (
              <motion.div
                key={ins.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-xl border p-5 ${tones[ins.tone]}`}
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-4 ${iconBg[ins.tone]}`}>
                  <HugeiconsIcon icon={ins.icon} size={18} />
                </div>
                <h4 className="font-sans font-semibold text-sm mb-2">{ins.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{ins.body}</p>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Rapportage opgesteld door Webiro · April 2026 · Vertrouwelijk, alleen voor Million Store
          </p>
          <img src={webiroLogo} alt="Webiro" className="h-6 w-auto opacity-70" />
        </div>
      </footer>
    </div>
  );
};

export default MillionRapport;
