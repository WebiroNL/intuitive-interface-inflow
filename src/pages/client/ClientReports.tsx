import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartLineData01Icon, Target02Icon, UserGroup02Icon, ViewIcon,
  CursorPointer02Icon, RocketIcon, CheckmarkCircle02Icon,
  InstagramIcon, Coins01Icon, ChartBarLineIcon, Megaphone02Icon, IdeaIcon,
} from "@hugeicons/core-free-icons";
import type { Client } from "@/hooks/useClient";
import {
  useMonthlyData, totalSpend, totalPaid, sumPlatform, weightedRate, fmtEUR, fmtNum,
} from "@/hooks/useMonthlyData";
import { MonthSelector, MONTH_NAMES } from "@/components/client/MonthSelector";

interface Props { client: Client }
const now = new Date();

const CHART = {
  primary: "hsl(234, 82%, 57%)",
  accent: "hsl(259, 79%, 61%)",
  muted: "hsl(240, 4%, 60%)",
  border: "hsl(0, 0%, 90%)",
  text: "hsl(270, 6%, 7%)",
  card: "hsl(0, 0%, 100%)",
};

/* Smooth count-up hook */
function useCountUp(target: number, duration = 1400, decimals = 0, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) { setValue(0); return; }
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

interface Kpi {
  label: string; value: number; prefix?: string; suffix?: string; decimals?: number;
  sub: string; icon: any; highlight?: boolean;
}

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const display = useCountUp(kpi.value, 1100 + index * 50, kpi.decimals ?? 0, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={`group relative p-5 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${
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
      <div className="relative text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1 tabular-nums">
        {kpi.prefix}{display}{kpi.suffix}
      </div>
      <div className="relative text-xs font-medium text-foreground/80">{kpi.label}</div>
      <div className="relative text-xs mt-1 text-muted-foreground">{kpi.sub}</div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-8 md:mb-10 max-w-3xl">
      <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
        <span className="w-6 h-px bg-primary" />
        {eyebrow}
      </div>
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.1]">{title}</h2>
      {description && <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

export default function ClientReports({ client }: Props) {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { current, loading } = useMonthlyData(client, year, month);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Maandrapport</p>
          <h1 className="text-3xl font-semibold text-foreground">{client.company_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Periode: {MONTH_NAMES[month - 1]} {year}
          </p>
        </div>
        <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[140px] bg-muted/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : !current ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <p className="text-muted-foreground">Nog geen rapport beschikbaar voor deze maand.</p>
        </div>
      ) : (
        <ReportContent current={current} />
      )}
    </div>
  );
}

function ReportContent({ current }: { current: NonNullable<ReturnType<typeof useMonthlyData>["current"]> }) {
  const spend = totalSpend(current);
  const paid = totalPaid(current);
  const impressions = sumPlatform(current, "impressions");
  const reach = sumPlatform(current, "reach");
  const frequency = reach > 0 ? impressions / reach : weightedRate(current, "frequency");
  const linkClicks = sumPlatform(current, "link_clicks");
  const lpv = sumPlatform(current, "lpv");
  const ctr = impressions > 0 ? (linkClicks / impressions) * 100 : weightedRate(current, "ctr");
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const costPerLpv = lpv > 0 ? spend / lpv : 0;
  const cpc = linkClicks > 0 ? spend / linkClicks : 0;
  const leads = Number(current.total_leads);
  const cpa = leads > 0 ? spend / leads : Number(current.cpa);
  const igGrowth = Number(current.instagram_growth);
  const fbGrowth = Number(current.facebook_growth);

  const benchLpv = Number(current.benchmark_lpv_cost);
  const benchCtr = Number(current.benchmark_ctr);
  const lpvSavingsPct = benchLpv > 0 && costPerLpv > 0 ? ((benchLpv - costPerLpv) / benchLpv) * 100 : 0;

  const summaryBullets = current.summary_bullets ?? [];
  const recommendationBullets = current.recommendation_bullets ?? [];

  const kpis: Kpi[] = [
    { label: "Uitgegeven", value: spend, prefix: "€", decimals: 2, sub: "Totaal mediabudget", icon: Coins01Icon },
    { label: "Impressies", value: impressions, sub: "Totale weergaven", icon: ViewIcon },
    { label: "Bereik", value: reach, sub: "Unieke personen", icon: UserGroup02Icon },
    { label: "Frequentie", value: frequency, decimals: 2, sub: "Vertoningen / persoon", icon: Target02Icon },
    { label: "Link clicks", value: linkClicks, sub: "Klikken naar website", icon: CursorPointer02Icon },
    { label: "CTR (all)", value: ctr, decimals: 2, suffix: "%", sub: "Klikratio", icon: ChartLineData01Icon },
    { label: "Landing page views", value: lpv, sub: "Daadwerkelijk geladen", icon: RocketIcon },
    {
      label: "Kosten per LPV", value: costPerLpv, prefix: "€", decimals: 2,
      sub: lpvSavingsPct > 0 ? `${lpvSavingsPct.toFixed(0)}% onder benchmark` : "Per landing page view",
      icon: CheckmarkCircle02Icon, highlight: lpvSavingsPct > 0,
    },
    { label: "Leads", value: leads, sub: "Aanmeldingen", icon: Megaphone02Icon },
    { label: "Kosten per lead", value: cpa, prefix: "€", decimals: 2, sub: "Cost per acquisition", icon: Target02Icon },
    { label: "Instagram groei", value: igGrowth, prefix: "+", sub: "Nieuwe volgers", icon: InstagramIcon },
    { label: "CPM", value: cpm, prefix: "€", decimals: 2, sub: "Per 1.000 impressies", icon: ChartBarLineIcon },
  ];

  const funnelData = [
    { stage: "Impressies", value: impressions },
    { stage: "Link clicks", value: linkClicks },
    { stage: "Landing page views", value: lpv },
    { stage: "Leads", value: leads },
  ].filter((s) => s.value > 0);

  const benchmarkData = benchLpv > 0 ? [
    { name: "Markt gemiddelde", value: benchLpv },
    { name: "Jouw campagne", value: costPerLpv },
  ] : [];

  return (
    <>
      {/* 01 — Samenvatting */}
      {summaryBullets.length > 0 && (
        <section className="mb-20">
          <SectionHeader eyebrow="Samenvatting" title="Management samenvatting" />
          <div className="grid md:grid-cols-2 gap-3">
            {summaryBullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
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
      )}

      {/* 02 — KPI grid */}
      <section className="mb-20">
        <SectionHeader
          eyebrow="Kerncijfers"
          title="Alle KPI's in één oogopslag"
          description="Twaalf metrics die samen het verhaal van deze maand vertellen."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {kpis.map((kpi, i) => <KpiCard key={kpi.label} kpi={kpi} index={i} />)}
        </div>
      </section>

      {/* 03 — Funnel */}
      {funnelData.length >= 2 && (
        <section className="mb-20">
          <SectionHeader eyebrow="Funnel" title="Van impressie naar lead" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <ResponsiveContainer width="100%" height={340}>
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
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="p-5 rounded-xl border border-border bg-card"
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                      <span className="text-xs text-muted-foreground">{pct.toFixed(2)}%</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground tabular-nums">{stage.value.toLocaleString("nl-NL")}</div>
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
      )}

      {/* 04a — Bereik & impressies (AI uitleg) */}
      {(reach > 0 || impressions > 0) && current.ai_reach_text && (
        <section className="mb-20">
          <SectionHeader eyebrow="Bereik" title="Bereik & impressies" />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: "Impressies", value: impressions },
                    { name: "Bereik", value: reach },
                  ]}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="barReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART.primary} />
                      <stop offset="100%" stopColor={CHART.accent} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.border} vertical={false} />
                  <XAxis dataKey="name" stroke={CHART.muted} fontSize={12} />
                  <YAxis stroke={CHART.muted} fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: CHART.card, border: `1px solid ${CHART.border}`, borderRadius: 8, color: CHART.text, fontSize: 12 }}
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                    cursor={{ fill: "hsl(240, 5%, 96%)" }}
                  />
                  <Bar dataKey="value" fill="url(#barReach)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Wat betekent dit?</h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{current.ai_reach_text}</p>
            </div>
          </div>
        </section>
      )}
      <section className="mb-20">
        <SectionHeader eyebrow="Efficiency" title="Kostenoverzicht" />
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { name: "CPM", label: fmtEUR(cpm, 2), sub: "Per 1.000 impressies" },
            { name: "CPC", label: fmtEUR(cpc, 2), sub: "Per linkklik" },
            { name: "Kosten / LPV", label: fmtEUR(costPerLpv, 2), sub: "Per landing page view" },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="text-xs uppercase tracking-wider mb-3 text-muted-foreground font-medium">{c.name}</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tabular-nums">
                {c.label}
              </div>
              <div className="text-xs mt-2 text-muted-foreground">{c.sub}</div>
            </motion.div>
          ))}
        </div>
        {leads > 0 && (
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-1 text-foreground">Kosten per lead</h3>
            <p className="text-sm mb-4 text-muted-foreground">Met {leads} {leads === 1 ? "lead" : "leads"} à {fmtEUR(cpa, 2)} per stuk.</p>
            <div className="text-5xl font-bold text-foreground tabular-nums">
              {fmtEUR(cpa, 2)} <span className="text-sm font-normal text-muted-foreground">/ lead</span>
            </div>
          </div>
        )}
      </section>

      {/* 05 — Benchmark */}
      {benchmarkData.length > 0 && (
        <section className="mb-20">
          <SectionHeader
            eyebrow="Benchmark"
            title={lpvSavingsPct > 0 ? `${lpvSavingsPct.toFixed(0)}% goedkoper dan de markt` : "Vergelijking met markt"}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm">
              <ResponsiveContainer width="100%" height={260}>
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
              {lpvSavingsPct > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit bg-primary/10 text-primary">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-primary" /> {lpvSavingsPct.toFixed(0)}% onder benchmark
                </div>
              )}
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                {lpvSavingsPct > 0 ? "Bovengemiddeld efficiënt" : "Markt vergelijking"}
              </h3>
              {current.ai_benchmark_text ? (
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{current.ai_benchmark_text}</p>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Vergelijkbare adverteerders betalen gemiddeld <span className="text-foreground font-semibold">{fmtEUR(benchLpv, 2)}</span> per landing page view.
                    Jouw campagne realiseerde <span className="text-foreground font-semibold">{fmtEUR(costPerLpv, 2)}</span>
                    {lpvSavingsPct > 0 ? `, een besparing van ${lpvSavingsPct.toFixed(0)}%.` : "."}
                  </p>
                  {benchCtr > 0 && (
                    <p className="text-sm leading-relaxed text-muted-foreground mt-3">
                      Klikratio: <span className="text-foreground font-semibold">{ctr.toFixed(2)}%</span> (markt gemiddelde {benchCtr.toFixed(2)}%).
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 07 — In gewone taal */}
      {current.ai_plain_language && current.ai_plain_language.length > 0 && (
        <section className="mb-20">
          <SectionHeader eyebrow="Wat betekent dit?" title="In gewone taal" />
          <div className="grid md:grid-cols-3 gap-4">
            {current.ai_plain_language.map((item, i) => {
              const icons = [ViewIcon, CursorPointer02Icon, RocketIcon];
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary to-accent">
                    <HugeiconsIcon icon={Icon} size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 06 — Social groei */}
      {(igGrowth > 0 || fbGrowth > 0) && (
        <section className="mb-20">
          <SectionHeader eyebrow="Social" title="Organische groei" />
          <div className="grid md:grid-cols-2 gap-4">
            {igGrowth > 0 && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary to-accent">
                  <HugeiconsIcon icon={InstagramIcon} size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Instagram</h3>
                <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">+{fmtNum(igGrowth)}</p>
                <p className="text-sm text-muted-foreground">Nieuwe volgers</p>
              </div>
            )}
            {fbGrowth > 0 && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary to-accent">
                  <HugeiconsIcon icon={UserGroup02Icon} size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Facebook</h3>
                <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">+{fmtNum(fbGrowth)}</p>
                <p className="text-sm text-muted-foreground">Nieuwe volgers</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 07 — Aanbevelingen */}
      {recommendationBullets.length > 0 && (
        <section className="mb-20">
          <SectionHeader eyebrow="Volgende stap" title="Aanbevelingen voor de volgende maand" />
          <div className="grid md:grid-cols-2 gap-4">
            {recommendationBullets.map((rec, i) => {
              const icons = [Coins01Icon, Target02Icon, Megaphone02Icon, IdeaIcon];
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                      <HugeiconsIcon icon={Icon} size={20} className="text-white" />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85 pt-1.5">{rec}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 08 — Inzichten (vrije tekst) */}
      {current.insights && (
        <section className="mb-20">
          <SectionHeader eyebrow="Notities" title="Toelichting van Webiro" />
          <div className="p-6 md:p-8 rounded-2xl border border-border bg-card">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{current.insights}</p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <span className="text-foreground font-semibold">Webiro</span> · Performance marketing
          </div>
          <div>
            Totaal betaald deze maand: <span className="text-foreground font-semibold tabular-nums">{fmtEUR(paid, 2)}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
