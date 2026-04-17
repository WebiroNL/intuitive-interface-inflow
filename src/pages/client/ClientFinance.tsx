import { useState } from "react";
import type { Client } from "@/hooks/useClient";
import { useMonthlyData, totalSpend, totalPaid, fmtEUR } from "@/hooks/useMonthlyData";
import { MonthSelector, MONTH_NAMES } from "@/components/client/MonthSelector";

interface Props { client: Client }
const now = new Date();

export default function ClientFinance({ client }: Props) {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { current, loading } = useMonthlyData(client, year, month);

  const fee = Number(current?.webiro_fee ?? 0);
  const spend = totalSpend(current);
  const paid = totalPaid(current);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Financieel</p>
          <h1 className="text-2xl font-semibold text-foreground">Maandelijkse kosten</h1>
          <p className="text-sm text-muted-foreground mt-1">{MONTH_NAMES[month - 1]} {year}</p>
        </div>
        <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      {loading ? (
        <div className="h-[300px] bg-muted/40 rounded-lg animate-pulse" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Block label="Google Ads" value={fmtEUR(Number(current?.google_spend ?? 0))} />
            <Block label="Meta Ads" value={fmtEUR(Number(current?.meta_spend ?? 0))} />
            <Block label="TikTok Ads" value={fmtEUR(Number(current?.tiktok_spend ?? 0))} />
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Kostenoverzicht</h2>
            </div>
            <div className="divide-y divide-border">
              <Row label="Totaal advertentiebudget" value={fmtEUR(spend)} />
              <Row label="Webiro fee" value={fmtEUR(fee)} />
              <Row label="Totaal betaald" value={fmtEUR(paid)} bold />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <p className={`text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</p>
      <p className={`tabular-nums ${bold ? "text-lg font-semibold text-foreground" : "text-sm text-foreground"}`}>{value}</p>
    </div>
  );
}
