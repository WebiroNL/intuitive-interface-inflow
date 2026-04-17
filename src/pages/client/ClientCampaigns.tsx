import { useState } from "react";
import type { Client } from "@/hooks/useClient";
import { useMonthlyData, fmtEUR, fmtNum } from "@/hooks/useMonthlyData";
import { MonthSelector, MONTH_NAMES } from "@/components/client/MonthSelector";

interface Props { client: Client }
const now = new Date();

const PLATFORMS = [
  { key: "google", label: "Google Ads", color: "#4285F4" },
  { key: "meta", label: "Meta Ads", color: "#0866FF" },
  { key: "tiktok", label: "TikTok Ads", color: "#FE2C55" },
] as const;

export default function ClientCampaigns({ client }: Props) {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { current, loading } = useMonthlyData(client, year, month);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Campagnes</p>
          <h1 className="text-2xl font-semibold text-foreground">Performance per platform</h1>
          <p className="text-sm text-muted-foreground mt-1">{MONTH_NAMES[month - 1]} {year}</p>
        </div>
        <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({length:3}).map((_,i) => <div key={i} className="h-[200px] bg-muted/40 rounded-lg animate-pulse" />)}</div>
      ) : !current ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">Geen data beschikbaar.</div>
      ) : (
        <div className="space-y-4">
          {PLATFORMS.map((p) => {
            const spend = Number((current as any)[`${p.key}_spend`] ?? 0);
            const clicks = Number((current as any)[`${p.key}_clicks`] ?? 0);
            const conv = Number((current as any)[`${p.key}_conversions`] ?? 0);
            const ctr = Number((current as any)[`${p.key}_ctr`] ?? 0);
            const cpc = Number((current as any)[`${p.key}_cpc`] ?? 0);
            const cpa = conv > 0 ? spend / conv : 0;
            return (
              <div key={p.key} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <h2 className="text-base font-semibold text-foreground">{p.label}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Metric label="Spend" value={fmtEUR(spend)} />
                  <Metric label="Klikken" value={fmtNum(clicks)} />
                  <Metric label="Conversies" value={fmtNum(conv)} />
                  <Metric label="CTR" value={`${fmtNum(ctr, 2)}%`} />
                  <Metric label="CPC" value={fmtEUR(cpc)} />
                  <Metric label="CPA" value={fmtEUR(cpa)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground tabular-nums mt-0.5">{value}</p>
    </div>
  );
}
