import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { packages, cmsHostingTiers, addOns, addOnCategoryLabels, marketingServices } from "@/components/pakketten/data";
import { getContractInfo, getDiscountInfo, formatDate, contractLastDay, discountLastDay } from "@/lib/discount";
import type { Client } from "@/hooks/useClient";

interface ServiceLine {
  id: string;
  client_id: string;
  service_type: "package" | "cms" | "addon" | "marketing" | "custom";
  service_id: string | null;
  service_name: string;
  category: string | null;
  one_time_price: number;
  monthly_price: number;
  quantity: number;
  note: string | null;
}

interface CatalogItem {
  type: ServiceLine["service_type"];
  id: string;
  name: string;
  category: string | null;
  one_time: number;
  monthly: number;
  /** true if price not numeric (e.g. "Op aanvraag") */
  custom: boolean;
}

const numericPrice = (p: number | string | undefined): number =>
  typeof p === "number" ? p : 0;

const isCustom = (p: number | string | undefined) => typeof p !== "number";

function buildCatalog(): CatalogItem[] {
  const items: CatalogItem[] = [];

  packages.forEach((p) => items.push({
    type: "package", id: p.id, name: p.name, category: "Pakket",
    one_time: numericPrice(p.price), monthly: 0, custom: isCustom(p.price),
  }));

  cmsHostingTiers.forEach((c) => items.push({
    type: "cms", id: c.id, name: c.name, category: "CMS & Hosting",
    one_time: 0, monthly: numericPrice(c.price), custom: isCustom(c.price),
  }));

  addOns.forEach((a) => {
    const cat = addOnCategoryLabels[a.category] ?? a.category;
    const monthly = a.period?.includes("maand") ? numericPrice(a.price) : 0;
    const oneTime = a.period === "eenmalig" ? numericPrice(a.price) : 0;
    items.push({
      type: "addon", id: a.id, name: a.name, category: cat,
      one_time: oneTime, monthly, custom: isCustom(a.price),
    });
  });

  marketingServices.forEach((m) => items.push({
    type: "marketing", id: m.id, name: m.name, category: "Marketing",
    one_time: m.setupPrice ?? 0, monthly: m.monthlyPrice ?? 0, custom: false,
  }));

  return items;
}

interface Props {
  client: Client;
  /** Allow editing? Admin = true, client = false */
  editable: boolean;
}

export function ContractView({ client, editable }: Props) {
  const [lines, setLines] = useState<ServiceLine[]>([]);
  const [invoices, setInvoices] = useState<{ amount: number; status: string }[]>([]);
  const [contractStart, setContractStart] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const catalog = useMemo(() => buildCatalog(), []);

  const load = async () => {
    setLoading(true);
    const [{ data: ls }, { data: invs }, { data: ctrs }] = await Promise.all([
      supabase.from("client_services").select("*").eq("client_id", client.id).order("service_type").order("service_name"),
      supabase.from("invoices").select("amount,status").eq("client_id", client.id),
      supabase.from("contracts").select("start_date").eq("client_id", client.id).order("start_date", { ascending: true }).limit(1),
    ]);
    setLines((ls ?? []) as any);
    setInvoices((invs ?? []) as any);
    setContractStart((ctrs?.[0]?.start_date as string | undefined) ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [client.id]);

  const addLines = async (items: CatalogItem[]) => {
    if (items.length === 0) return;
    const payload = items.map((it) => ({
      client_id: client.id,
      service_type: it.type,
      service_id: it.id,
      service_name: it.name,
      category: it.category,
      one_time_price: it.one_time,
      monthly_price: it.monthly,
      quantity: 1,
    }));
    const { error } = await supabase.from("client_services").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(`${items.length} dienst(en) toegevoegd`);
    setPickerOpen(false);
    load();
  };

  const updateLine = async (id: string, patch: Partial<ServiceLine>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    const { error } = await supabase.from("client_services").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const deleteLine = async (id: string) => {
    if (!confirm("Verwijderen?")) return;
    const { error } = await supabase.from("client_services").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const addCustom = async () => {
    const { error } = await supabase.from("client_services").insert({
      client_id: client.id,
      service_type: "custom",
      service_name: "Maatwerk regel",
      category: "Maatwerk",
      one_time_price: 0,
      monthly_price: 0,
      quantity: 1,
    });
    if (error) { toast.error(error.message); return; }
    load();
  };

  // Totals
  const oneTimeTotal = lines.reduce((s, l) => s + Number(l.one_time_price) * Number(l.quantity), 0);
  const monthlyTotal = lines.reduce((s, l) => s + Number(l.monthly_price) * Number(l.quantity), 0);

  const discountPct = Number(client.discount_percentage ?? 0);
  const discountMonths = Number(client.discount_months ?? 0);
  const monthlyDiscount = monthlyTotal * (discountPct / 100);
  const monthlyAfterDiscount = monthlyTotal - monthlyDiscount;
  const totalDiscountAmount = monthlyDiscount * discountMonths;

  const depositPct = Number(client.deposit_percentage ?? 0);
  const depositAmount = oneTimeTotal * (depositPct / 100);

  const paid = invoices.filter((i) => i.status === "paid" || i.status === "betaald").reduce((s, i) => s + Number(i.amount), 0);
  const open = invoices.filter((i) => i.status !== "paid" && i.status !== "betaald").reduce((s, i) => s + Number(i.amount), 0);

  // Group lines for display
  const grouped = lines.reduce<Record<string, ServiceLine[]>>((acc, l) => {
    const cat = l.category ?? "Overig";
    (acc[cat] ??= []).push(l);
    return acc;
  }, {});

  // Canonical order matching the pakketten overview flow
  const CATEGORY_ORDER = [
    "Pakket",
    "CMS & Hosting",
    "Setup — Technisch",
    "Setup — Functionaliteit & Integraties",
    "Setup — Design & Branding",
    "Setup — Content & Compliance",
    "Webiro Widgets (Maandelijks)",
    "Onderhoud & Support",
    "Webiro Marketing",
    "Marketing",
    "Maatwerk",
    "Overig",
  ];
  const catIndex = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  const orderedCats = Object.keys(grouped).sort((a, b) => catIndex(a) - catIndex(b));

  if (loading) {
    return <div className="p-8 text-sm text-muted-foreground">Laden...</div>;
  }

  // Format helpers — gebruik dag-precisie via shared helpers
  const contractInfo = getContractInfo(client);
  const discountInfo = getDiscountInfo({
    monthly_fee: client.monthly_fee,
    discount_months: client.discount_months,
    discount_percentage: client.discount_percentage,
    discount_start_date: client.discount_start_date,
    contract_start_date: client.contract_start_date,
  });
  // Fallback naar contracts-tabel als clients.contract_start_date leeg is
  const fallbackStart = contractStart ? new Date(contractStart) : null;
  const startDate = contractInfo.startDate ?? fallbackStart;
  const contractEndDay = contractLastDay(contractInfo);
  const discountEndDay = discountLastDay(discountInfo);
  const startFormatted = startDate ? formatDate(startDate) : null;
  const contractEndFormatted = contractEndDay ? formatDate(contractEndDay) : null;
  const discountEndDate = discountEndDay ? formatDate(discountEndDay) : null;

  // Read-only (client) view: cleaner, more scannable layout
  if (!editable) {
    return (
      <div className="space-y-8">
        {/* Hero summary */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Stat
              label="Eenmalig"
              value={fmtEUR(oneTimeTotal, 2)}
              hint={depositPct > 0 && oneTimeTotal > 0 ? `${depositPct}% aanbetaling: ${fmtEUR(depositAmount, 2)}` : undefined}
            />
            <Stat
              label="Per maand"
              value={fmtEUR(discountPct > 0 ? monthlyAfterDiscount : monthlyTotal, 2)}
              hint={
                discountPct > 0 && discountMonths > 0
                  ? `${discountPct}% korting voor ${discountMonths} mnd${discountEndDate ? ` · t/m ${discountEndDate}` : ""}`
                  : undefined
              }
            />
            <Stat
              label="Diensten"
              value={`${lines.length}`}
              hint={`Verdeeld over ${orderedCats.length} categorie${orderedCats.length === 1 ? "" : "ën"}`}
            />
          </div>
          {(startFormatted || contractEndFormatted || discountEndDate) && (
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-x-8 gap-y-2 text-[12px]">
              {startFormatted && (
                <div>
                  <span className="text-muted-foreground">Contract gestart op </span>
                  <span className="text-foreground font-medium">{startFormatted}</span>
                </div>
              )}
              {contractEndFormatted && (
                <div>
                  <span className="text-muted-foreground">Einddatum contract </span>
                  <span className="text-foreground font-medium">{contractEndFormatted}</span>
                </div>
              )}
              {discountEndDate && (
                <div>
                  <span className="text-muted-foreground">Korting loopt t/m </span>
                  <span className="text-foreground font-medium">{discountEndDate}</span>
                </div>
              )}
            </div>
          )}
        </div>


        {lines.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground border border-border rounded-2xl bg-card">
            Nog geen diensten gekoppeld aan dit account.
          </div>
        ) : (
          <div className="space-y-4">
            {orderedCats.map((cat) => {
              const items = grouped[cat];
              const catOneTime = items.reduce((s, l) => s + Number(l.one_time_price) * Number(l.quantity), 0);
              const catMonthly = items.reduce((s, l) => s + Number(l.monthly_price) * Number(l.quantity), 0);
              return (
                <div key={cat} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="px-6 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-foreground">{cat}</h3>
                    <div className="flex items-center gap-4 text-[12px] text-muted-foreground tabular-nums">
                      {catOneTime > 0 && <span>Eenmalig <span className="text-foreground font-medium ml-1">{fmtEUR(catOneTime, 2)}</span></span>}
                      {catMonthly > 0 && <span>Per maand <span className="text-foreground font-medium ml-1">{fmtEUR(catMonthly, 2)}</span></span>}
                    </div>
                  </div>
                  <ul className="divide-y divide-border">
                    {items.map((l) => {
                      const oneTime = Number(l.one_time_price) * Number(l.quantity);
                      const monthly = Number(l.monthly_price) * Number(l.quantity);
                      const qty = Number(l.quantity);
                      return (
                        <li key={l.id} className="px-6 py-3.5 flex items-center justify-between gap-6">
                          <div className="min-w-0 flex-1 flex items-center gap-3">
                            <span className="text-[14px] text-foreground truncate">{l.service_name}</span>
                            {qty > 1 && (
                              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {qty}×
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0 tabular-nums">
                            {oneTime > 0 && (
                              <span className="text-[13px] text-foreground font-medium">
                                {fmtEUR(oneTime, 2)}
                                <span className="text-[11px] text-muted-foreground ml-1 font-normal">eenmalig</span>
                              </span>
                            )}
                            {oneTime > 0 && monthly > 0 && <span className="text-muted-foreground mx-2">·</span>}
                            {monthly > 0 && (
                              <span className="text-[13px] text-foreground font-medium">
                                {fmtEUR(monthly, 2)}
                                <span className="text-[11px] text-muted-foreground ml-1 font-normal">/mnd</span>
                              </span>
                            )}
                            {oneTime === 0 && monthly === 0 && (
                              <span className="text-[12px] text-muted-foreground italic">Inbegrepen</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Overzicht</p>
            {startFormatted && <Row label="Startdatum contract" value={startFormatted} />}
            {contractEndFormatted && <Row label="Einddatum contract" value={contractEndFormatted} />}
            {(startFormatted || contractEndFormatted) && <div className="h-px bg-border" />}
            <Row label="Eenmalig totaal" value={fmtEUR(oneTimeTotal, 2)} />
            <Row label="Maandelijks totaal" value={fmtEUR(monthlyTotal, 2)} />
            {depositPct > 0 && oneTimeTotal > 0 && (
              <Row label={`Aanbetaling (${depositPct}%)`} value={fmtEUR(depositAmount, 2)} highlight />
            )}
            {discountPct > 0 && discountMonths > 0 && (
              <>
                <div className="h-px bg-border" />
                <Row label={`Korting ${discountPct}% per maand`} value={`− ${fmtEUR(monthlyDiscount, 2)}`} />
                <Row label={`Korting totaal (${discountMonths} mnd)`} value={`− ${fmtEUR(totalDiscountAmount, 2)}`} />
                {discountEndDate && <Row label="Korting loopt t/m" value={discountEndDate} />}
                <Row label="Maandelijks (incl. korting)" value={fmtEUR(monthlyAfterDiscount, 2)} bold />
                <Row label="Maandelijks na kortingsperiode" value={fmtEUR(monthlyTotal, 2)} />
              </>
            )}
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Betalingen</p>
            <Row label="Betaald" value={fmtEUR(paid, 2)} positive />
            <Row label="Openstaand" value={fmtEUR(open, 2)} warn={open > 0} />
            <div className="h-px bg-border" />
            <Row label="Totaal gefactureerd" value={fmtEUR(paid + open, 2)} bold />
            <p className="text-[11px] text-muted-foreground pt-2">Bedragen op basis van facturen op deze klant.</p>
          </div>
        </div>
      </div>
    );
  }

  // Editable (admin) view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Contract & diensten</h2>
          <p className="text-sm text-muted-foreground">
            {lines.length === 0 ? "Nog geen diensten gekoppeld" : `${lines.length} dienst(en)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addCustom}>
            <HugeiconsIcon icon={Add01Icon} size={14} /> Maatwerk regel
          </Button>
          <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <HugeiconsIcon icon={Add01Icon} size={14} /> Diensten toevoegen
              </Button>
            </DialogTrigger>
            <ServicePicker catalog={catalog} existing={lines} onPick={addLines} />
          </Dialog>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground border border-border rounded-2xl bg-card">
          Klik op 'Diensten toevoegen' om uit het Webiro pakkettenoverzicht te kiezen.
        </div>
      ) : (
        <div className="space-y-6">
          {orderedCats.map((cat) => {
            const items = grouped[cat];
            const catOneTime = items.reduce((s, l) => s + Number(l.one_time_price) * Number(l.quantity), 0);
            const catMonthly = items.reduce((s, l) => s + Number(l.monthly_price) * Number(l.quantity), 0);
            return (
              <div key={cat} className="border border-border rounded-2xl bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Categorie</p>
                    <h3 className="text-base font-semibold text-foreground">{cat}</h3>
                  </div>
                  <div className="text-right">
                    {catOneTime > 0 && (
                      <p className="text-[12px] text-muted-foreground tabular-nums">
                        Eenmalig <span className="font-semibold text-foreground ml-1">{fmtEUR(catOneTime, 2)}</span>
                      </p>
                    )}
                    {catMonthly > 0 && (
                      <p className="text-[12px] text-muted-foreground tabular-nums">
                        Per maand <span className="font-semibold text-foreground ml-1">{fmtEUR(catMonthly, 2)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/20">
                    <tr>
                      <th className="text-left px-6 py-2 font-medium">Dienst</th>
                      <th className="text-right px-3 py-2 font-medium w-[120px]">Eenmalig</th>
                      <th className="text-right px-3 py-2 font-medium w-[120px]">Per maand</th>
                      <th className="text-center px-3 py-2 font-medium w-[80px]">Aantal</th>
                      <th className="w-[44px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((l) => (
                      <tr key={l.id}>
                        <td className="px-6 py-2.5">
                          {l.service_type === "custom" ? (
                            <Input value={l.service_name} onChange={(e) => updateLine(l.id, { service_name: e.target.value })} className="h-8" />
                          ) : (
                            <span className="text-foreground">{l.service_name}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Input type="number" step="0.01" value={l.one_time_price}
                            onChange={(e) => updateLine(l.id, { one_time_price: Number(e.target.value) })}
                            className="h-8 text-right tabular-nums" />
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <Input type="number" step="0.01" value={l.monthly_price}
                            onChange={(e) => updateLine(l.id, { monthly_price: Number(e.target.value) })}
                            className="h-8 text-right tabular-nums" />
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <Input type="number" value={l.quantity}
                            onChange={(e) => updateLine(l.id, { quantity: Number(e.target.value) })}
                            className="h-8 text-center w-[60px] mx-auto" />
                        </td>
                        <td className="px-2 text-right">
                          <Button variant="ghost" size="sm" onClick={() => deleteLine(l.id)}>
                            <HugeiconsIcon icon={Delete02Icon} size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Totalen</p>
          <Row label="Eenmalig totaal" value={fmtEUR(oneTimeTotal, 2)} />
          <Row label="Maandelijks totaal" value={fmtEUR(monthlyTotal, 2)} />
          {depositPct > 0 && oneTimeTotal > 0 && (
            <Row label={`Aanbetaling (${depositPct}%)`} value={fmtEUR(depositAmount, 2)} highlight />
          )}
          {discountPct > 0 && discountMonths > 0 && (
            <>
              <div className="h-px bg-border" />
              <Row label={`Korting ${discountPct}% per maand`} value={`− ${fmtEUR(monthlyDiscount, 2)}`} />
              <Row label={`Korting totaal (${discountMonths} mnd)`} value={`− ${fmtEUR(totalDiscountAmount, 2)}`} />
              <Row label="Maandelijks (incl. korting)" value={fmtEUR(monthlyAfterDiscount, 2)} bold />
              <Row label="Maandelijks na kortingsperiode" value={fmtEUR(monthlyTotal, 2)} />
            </>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Betalingen</p>
          <Row label="Betaald" value={fmtEUR(paid, 2)} positive />
          <Row label="Openstaand" value={fmtEUR(open, 2)} warn={open > 0} />
          <div className="h-px bg-border" />
          <Row label="Totaal gefactureerd" value={fmtEUR(paid + open, 2)} bold />
          <p className="text-[11px] text-muted-foreground pt-2">Bedragen op basis van facturen op deze klant.</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">{label}</p>
      <p className="text-2xl font-semibold text-foreground tabular-nums leading-tight">{value}</p>
      {hint && <p className="text-[12px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function Row({ label, value, bold, highlight, positive, warn }: { label: string; value: string; bold?: boolean; highlight?: boolean; positive?: boolean; warn?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className={`text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <span className={`tabular-nums text-sm ${
        bold ? "font-bold text-foreground" :
        highlight ? "font-semibold text-primary" :
        positive ? "font-semibold text-foreground" :
        warn ? "font-semibold text-foreground" :
        "text-foreground"
      }`}>{value}</span>
    </div>
  );
}

function ServicePicker({ catalog, existing, onPick }: {
  catalog: CatalogItem[];
  existing: ServiceLine[];
  onPick: (items: CatalogItem[]) => void;
}) {
  const existingIds = new Set(existing.map((l) => `${l.service_type}:${l.service_id}`));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const grouped = catalog.reduce<Record<string, CatalogItem[]>>((acc, it) => {
    const cat = it.category ?? "Overig";
    (acc[cat] ??= []).push(it);
    return acc;
  }, {});

  const submit = () => {
    const items = catalog.filter((it) => selected.has(`${it.type}:${it.id}`));
    onPick(items);
    setSelected(new Set());
  };

  return (
    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Diensten kiezen uit Webiro pakketten</DialogTitle>
      </DialogHeader>
      <div className="space-y-5">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">{cat}</p>
            <div className="space-y-1.5">
              {items.map((it) => {
                const key = `${it.type}:${it.id}`;
                const already = existingIds.has(key);
                const checked = selected.has(key);
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      already ? "border-border bg-muted/40 opacity-60 cursor-not-allowed" :
                      checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={already}
                      onCheckedChange={() => !already && toggle(key)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {it.name}
                        {already && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} /> al toegevoegd
                          </span>
                        )}
                      </p>
                      {it.custom && (
                        <p className="text-[11px] text-muted-foreground">Prijs op aanvraag — pas aan na toevoegen</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {it.one_time > 0 && <p className="text-xs tabular-nums text-foreground">{fmtEUR(it.one_time, 0)} <span className="text-muted-foreground">eenmalig</span></p>}
                      {it.monthly > 0 && <p className="text-xs tabular-nums text-foreground">{fmtEUR(it.monthly, 0)} <span className="text-muted-foreground">/ mnd</span></p>}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border sticky bottom-0 bg-background">
        <Button variant="ghost" onClick={() => setSelected(new Set())} disabled={selected.size === 0}>Wissen</Button>
        <Button onClick={submit} disabled={selected.size === 0}>
          {selected.size === 0 ? "Selecteer diensten" : `${selected.size} dienst(en) toevoegen`}
        </Button>
      </div>
    </DialogContent>
  );
}
