import { useState } from "react";
import type { Client } from "@/hooks/useClient";
import { useMonthlyData, fmtEUR, fmtNum, totalSpend, totalPaid } from "@/hooks/useMonthlyData";
import { MonthSelector, MONTH_NAMES } from "@/components/client/MonthSelector";

interface Props { client: Client }
const now = new Date();

const PLATFORMS = [
  { key: "google", label: "Google Ads", icon: "/images/tools/googleads.svg" },
  { key: "meta", label: "Meta Ads", icon: "/images/tools/meta.svg" },
  { key: "tiktok", label: "TikTok Ads", icon: "/images/tools/tiktok.svg" },
  { key: "linkedin", label: "LinkedIn Ads", icon: "/images/tools/linkedin.svg" },
  { key: "pinterest", label: "Pinterest Ads", icon: "/images/tools/pinterest.svg" },
  { key: "youtube", label: "YouTube Ads", icon: "/images/tools/youtube.svg" },
  { key: "snapchat", label: "Snapchat Ads", icon: "/images/tools/snapchat.svg" },
] as const;

export default function ClientCampaigns({ client }: Props) {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { current, loading } = useMonthlyData(client, year, month);

  const rows = (current ? PLATFORMS : []).map((p) => {
    const spend = Number((current as any)[`${p.key}_spend`] ?? 0);
    const clicks = Number((current as any)[`${p.key}_clicks`] ?? 0);
    const conv = Number((current as any)[`${p.key}_conversions`] ?? 0);
    const ctr = Number((current as any)[`${p.key}_ctr`] ?? 0);
    const cpc = Number((current as any)[`${p.key}_cpc`] ?? 0);
    const cpa = conv > 0 ? spend / conv : 0;
    return { ...p, spend, clicks, conv, ctr, cpc, cpa, active: spend > 0 || clicks > 0 };
  }).filter((r) => r.active);

  const totals = rows.reduce(
    (acc, r) => ({
      spend: acc.spend + r.spend,
      clicks: acc.clicks + r.clicks,
      conv: acc.conv + r.conv,
    }),
    { spend: 0, clicks: 0, conv: 0 }
  );
  const totalCtr = totals.clicks > 0 && rows.length > 0
    ? rows.reduce((a, r) => a + r.ctr * r.clicks, 0) / totals.clicks
    : 0;
  const totalCpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
  const totalCpa = totals.conv > 0 ? totals.spend / totals.conv : 0;

  const fee = Number(current?.webiro_fee ?? 0);
  const spendAll = totalSpend(current);
  const paid = totalPaid(current);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] sm:text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Campagnes</p>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Performance & kosten</h1>
          <p className="text-sm text-muted-foreground mt-1">{MONTH_NAMES[month - 1]} {year}</p>
        </div>
        <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      {loading ? (
        <div className="h-[300px] bg-muted/40 rounded-lg animate-pulse" />
      ) : !current ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
          Geen data beschikbaar voor deze maand.
        </div>
      ) : (
        <>
          {/* Kosten samenvatting */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Maandelijkse kosten</h2>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Totaal {fmtEUR(paid)}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <CostCell label="Advertentiebudget" value={fmtEUR(spendAll)} hint="Som van alle platforms" />
              <CostCell label="Webiro fee" value={fmtEUR(fee)} hint="Beheer & optimalisatie" />
              <CostCell label="Totaal betaald" value={fmtEUR(paid)} hint="Budget + fee" bold />
            </div>
          </div>

          {/* Performance per platform */}
          {rows.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
              Geen platformcijfers ingevuld voor deze maand.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <SummaryCard label="Totaal spend" value={fmtEUR(totals.spend)} />
                <SummaryCard label="Totaal klikken" value={fmtNum(totals.clicks)} />
                <SummaryCard label="Totaal conversies" value={fmtNum(totals.conv)} />
                <SummaryCard label="Gem. CPA" value={totalCpa > 0 ? fmtEUR(totalCpa) : "—"} />
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Per platform</h2>
                </div>

                {/* Mobile: card list */}
                <div className="sm:hidden divide-y divide-border">
                  {rows.map((r) => (
                    <div key={r.key} className="p-4">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-7 h-7 rounded-md bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                          <img src={r.icon} alt={r.label} className="w-4 h-4 object-contain" />
                        </div>
                        <span className="font-medium text-foreground text-sm">{r.label}</span>
                        <span className="ml-auto text-sm font-semibold text-foreground tabular-nums">{fmtEUR(r.spend)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[12px]">
                        <MobileStat label="Klikken" value={fmtNum(r.clicks)} />
                        <MobileStat label="Conv." value={fmtNum(r.conv)} />
                        <MobileStat label="CTR" value={`${fmtNum(r.ctr, 2)}%`} />
                        <MobileStat label="CPC" value={fmtEUR(r.cpc)} />
                        <MobileStat label="CPA" value={r.cpa > 0 ? fmtEUR(r.cpa) : "—"} />
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-foreground text-sm">Totaal</span>
                      <span className="text-sm font-semibold text-foreground tabular-nums">{fmtEUR(totals.spend)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[12px]">
                      <MobileStat label="Klikken" value={fmtNum(totals.clicks)} />
                      <MobileStat label="Conv." value={fmtNum(totals.conv)} />
                      <MobileStat label="CTR" value={`${fmtNum(totalCtr, 2)}%`} />
                      <MobileStat label="CPC" value={fmtEUR(totalCpc)} />
                      <MobileStat label="CPA" value={totalCpa > 0 ? fmtEUR(totalCpa) : "—"} />
                    </div>
                  </div>
                </div>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-3 font-medium">Platform</th>
                        <th className="px-4 py-3 font-medium text-right">Spend</th>
                        <th className="px-4 py-3 font-medium text-right">Klikken</th>
                        <th className="px-4 py-3 font-medium text-right">Conversies</th>
                        <th className="px-4 py-3 font-medium text-right">CTR</th>
                        <th className="px-4 py-3 font-medium text-right">CPC</th>
                        <th className="px-6 py-3 font-medium text-right">CPA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((r) => (
                        <tr key={r.key} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                                <img src={r.icon} alt={r.label} className="w-4 h-4 object-contain" />
                              </div>
                              <span className="font-medium text-foreground">{r.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtEUR(r.spend)}</td>
                          <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtNum(r.clicks)}</td>
                          <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtNum(r.conv)}</td>
                          <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">{fmtNum(r.ctr, 2)}%</td>
                          <td className="px-4 py-3.5 text-right tabular-nums text-muted-foreground">{fmtEUR(r.cpc)}</td>
                          <td className="px-6 py-3.5 text-right tabular-nums text-muted-foreground">{r.cpa > 0 ? fmtEUR(r.cpa) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/30 border-t border-border font-semibold">
                        <td className="px-6 py-3.5 text-foreground">Totaal</td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtEUR(totals.spend)}</td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtNum(totals.clicks)}</td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtNum(totals.conv)}</td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtNum(totalCtr, 2)}%</td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-foreground">{fmtEUR(totalCpc)}</td>
                        <td className="px-6 py-3.5 text-right tabular-nums text-foreground">{totalCpa > 0 ? fmtEUR(totalCpa) : "—"}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
      <p className="text-[11px] sm:text-[12px] uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2">{label}</p>
      <p className="text-lg sm:text-2xl font-semibold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function CostCell({ label, value, hint, bold }: { label: string; value: string; hint?: string; bold?: boolean }) {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-5">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
      <p className={`tabular-nums ${bold ? "text-xl sm:text-2xl font-semibold text-foreground" : "text-lg sm:text-xl font-semibold text-foreground"}`}>{value}</p>
      {hint && <p className="text-[12px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function MobileStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
      <p className="text-foreground font-medium tabular-nums">{value}</p>
    </div>
  );
}
