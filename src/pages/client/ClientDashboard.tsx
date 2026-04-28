import { useState } from "react";
import type { Client } from "@/hooks/useClient";
import { useMonthlyData, totalSpend, totalPaid, pctChange, fmtEUR, fmtNum } from "@/hooks/useMonthlyData";
import { MonthSelector, MONTH_NAMES } from "@/components/client/MonthSelector";
import { getDiscountInfo, getContractInfo, formatDate, discountLastDay, contractLastDay } from "@/lib/discount";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Money02Icon,
  WorkflowSquare01Icon,
  ChartBarLineIcon,
  UserGroup02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Target02Icon,
  Tag01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

interface Props {
  client: Client;
}

const now = new Date();

export default function ClientDashboard({ client }: Props) {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { current, previous, loading } = useMonthlyData(client, year, month);

  const curSpend = totalSpend(current);
  const prevSpend = totalSpend(previous);
  const curFee = Number(current?.webiro_fee ?? 0);
  const prevFee = Number(previous?.webiro_fee ?? 0);
  const curPaid = totalPaid(current);
  const prevPaid = totalPaid(previous);
  const curLeads = Number(current?.total_leads ?? 0);
  const prevLeads = Number(previous?.total_leads ?? 0);
  const curCpa = Number(current?.cpa ?? 0);
  const prevCpa = Number(previous?.cpa ?? 0);
  const curRoas = Number(current?.roas ?? 0);
  const prevRoas = Number(previous?.roas ?? 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Hallo {client.contact_person ?? client.company_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overzicht voor {MONTH_NAMES[month - 1]} {year}
          </p>
        </div>
        <MonthSelector month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y); }} />
      </div>

      <ContractCard client={client} year={year} month={month} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[120px] bg-muted/40 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !current ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">Nog geen data beschikbaar voor deze maand.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <KpiCard icon={Money02Icon} label="Advertentiebudget" value={fmtEUR(curSpend)} change={pctChange(curSpend, prevSpend)} />
            <KpiCard icon={Tag01Icon} label="Webiro fee" value={fmtEUR(curFee)} change={pctChange(curFee, prevFee)} />
            <KpiCard icon={WorkflowSquare01Icon} label="Totaal betaald" value={fmtEUR(curPaid)} change={pctChange(curPaid, prevPaid)} highlight />
            <KpiCard icon={UserGroup02Icon} label="Leads" value={fmtNum(curLeads)} change={pctChange(curLeads, prevLeads)} />
            <KpiCard icon={Target02Icon} label="CPA" value={fmtEUR(curCpa)} change={pctChange(curCpa, prevCpa)} invert />
            <KpiCard icon={ChartBarLineIcon} label="ROAS" value={`${fmtNum(curRoas, 2)}x`} change={pctChange(curRoas, prevRoas)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PlatformBlock label="Google Ads" spend={Number(current.google_spend)} conv={current.google_conversions} />
            <PlatformBlock label="Meta Ads" spend={Number(current.meta_spend)} conv={current.meta_conversions} />
            <PlatformBlock label="TikTok Ads" spend={Number(current.tiktok_spend)} conv={current.tiktok_conversions} />
          </div>

          {current.insights && (
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h2 className="text-sm font-semibold text-foreground mb-2">Inzichten van Webiro</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{current.insights}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function KpiCard({
  icon, label, value, change, invert, highlight,
}: { icon: any; label: string; value: string; change: number | null; invert?: boolean; highlight?: boolean }) {
  const positive = change !== null && (invert ? change < 0 : change > 0);
  const negative = change !== null && (invert ? change > 0 : change < 0);
  return (
    <div className={`rounded-lg border p-5 ${highlight ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}>
      <div className="flex items-center gap-2 mb-3">
        <HugeiconsIcon icon={icon} size={16} className="text-muted-foreground" />
        <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
      {change !== null && (
        <div className={`flex items-center gap-1 mt-2 text-[12px] font-medium ${positive ? "text-emerald-600" : negative ? "text-red-600" : "text-muted-foreground"}`}>
          <HugeiconsIcon icon={change >= 0 ? ArrowUp01Icon : ArrowDown01Icon} size={12} />
          {Math.abs(change).toFixed(1)}% vs vorige maand
        </div>
      )}
    </div>
  );
}

function PlatformBlock({ label, spend, conv }: { label: string; spend: number; conv: number }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
      <div className="flex items-baseline justify-between">
        <p className="text-xl font-semibold text-foreground tabular-nums">{fmtEUR(spend)}</p>
        <p className="text-[12px] text-muted-foreground">{fmtNum(conv)} conversies</p>
      </div>
    </div>
  );
}

function ContractCard({ client, year, month }: { client: Client; year: number; month: number }) {
  const refDate = new Date(year, month - 1, 1);
  const discount = getDiscountInfo(client, refDate);
  const contract = getContractInfo(client);
  const lastDiscountDay = discountLastDay(discount);
  const lastContractDay = contractLastDay(contract);
  const baseFee = Number(client.monthly_fee ?? 0);
  if (baseFee <= 0 && !client.contract_start_date && !discount.hasDiscount) return null;

  const feeNow = discount.isActiveNow ? discount.discountedFee : baseFee;

  const items: { label: string; value: string }[] = [];
  if (contract.startDate) items.push({ label: "Start", value: formatDate(contract.startDate) });
  if (lastContractDay) items.push({ label: "Einddatum", value: formatDate(lastContractDay) });
  if (client.contract_duration) items.push({ label: "Duur", value: client.contract_duration });
  if (discount.hasDiscount && discount.startDate && lastDiscountDay) {
    items.push({
      label: "Kortingsperiode",
      value: `${formatDate(discount.startDate)} t/m ${formatDate(lastDiscountDay)}`,
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg mb-8 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-muted-foreground shrink-0" />
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Contract</p>
        </div>
        {baseFee > 0 && (
          <div className="flex items-baseline gap-2 tabular-nums shrink-0">
            {discount.isActiveNow ? (
              <>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider mr-1">
                  Fee {MONTH_NAMES[month - 1]}
                </span>
                <span className="line-through text-muted-foreground text-[12px]">{fmtEUR(baseFee)}</span>
                <span className="text-base font-semibold text-foreground">{fmtEUR(feeNow)}</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  −{discount.percentage}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider mr-1">Fee /mnd</span>
                <span className="text-base font-semibold text-foreground">{fmtEUR(baseFee)}</span>
              </>
            )}
          </div>
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t border-border px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{it.label}</span>
              <span className="text-foreground font-medium">{it.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

