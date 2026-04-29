import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { getDiscountInfo, getContractInfo, formatDate, discountLastDay, contractLastDay } from "@/lib/discount";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, Download01Icon, Building03Icon, ChartLineData01Icon, Folder02Icon } from "@hugeicons/core-free-icons";
import { ContractView } from "@/components/contract/ContractView";
import { AD_PLATFORMS, type AdsCampaign } from "@/components/admin/AdsCampaigns";

interface Props { client: Client }

const schema = z.object({
  company_name: z.string().trim().min(1, "Bedrijfsnaam is verplicht").max(120),
  contact_person: z.string().trim().min(1, "Contactpersoon is verplicht").max(120),
  phone: z.string().trim().min(1, "Telefoonnummer is verplicht").max(40),
  kvk_number: z.string().trim().max(40).optional().or(z.literal("")),
  btw_number: z.string().trim().max(40).optional().or(z.literal("")),
});

interface ContractDoc {
  id: string; title: string; file_url: string | null; start_date: string | null; end_date: string | null;
}

export default function ClientAccount({ client }: Props) {
  const [form, setForm] = useState({
    company_name: client.company_name ?? "",
    contact_person: client.contact_person ?? "",
    phone: client.phone ?? "",
    kvk_number: client.kvk_number ?? "",
    btw_number: client.btw_number ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [contracts, setContracts] = useState<ContractDoc[]>([]);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [hasPakketServices, setHasPakketServices] = useState(false);
  const [campaigns, setCampaigns] = useState<AdsCampaign[]>([]);

  useEffect(() => {
    (async () => {
      const [contractsRes, servicesRes, campaignsRes] = await Promise.all([
        supabase
          .from("contracts")
          .select("*")
          .eq("client_id", client.id)
          .order("start_date", { ascending: false }),
        supabase
          .from("client_services")
          .select("id", { count: "exact", head: true })
          .eq("client_id", client.id),
        supabase
          .from("ads_campaigns")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: true }),
      ]);
      setContracts((contractsRes.data as ContractDoc[]) ?? []);
      setHasPakketServices((servicesRes.count ?? 0) > 0);
      setCampaigns((campaignsRes.data as AdsCampaign[]) ?? []);
      setContractsLoading(false);
    })();
  }, [client.id]);

  const hasAdsContract =
    (client.monthly_fee != null && Number(client.monthly_fee) > 0) || campaigns.length > 0;
  const hasPakketContract = hasPakketServices;
  const showDocs = hasAdsContract || hasPakketContract;
  const defaultTab = "bedrijf";

  // Verzamel unieke platforms over alle campagnes
  const allPlatforms = Array.from(new Set(campaigns.flatMap((c) => c.platforms)));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("clients")
      .update({
        company_name: parsed.data.company_name,
        contact_person: parsed.data.contact_person || null,
        phone: parsed.data.phone || null,
        kvk_number: parsed.data.kvk_number || null,
        btw_number: parsed.data.btw_number || null,
      })
      .eq("id", client.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Bedrijfsgegevens opgeslagen");
  };

  const discount = getDiscountInfo(client);
  const contract = getContractInfo(client);
  const lastDiscountDay = discountLastDay(discount);
  const lastContractDay = contractLastDay(contract);

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">Accountinstellingen</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Beheer je bedrijfs- en contractgegevens.</p>
      </header>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 sm:flex sm:justify-start bg-transparent border-b border-border rounded-none p-0 h-auto mb-6 gap-x-1">
          <TabsTrigger
            value="bedrijf"
            className="gap-1.5 sm:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 sm:px-4 py-2.5 text-[12px] sm:text-sm whitespace-nowrap min-w-0"
          >
            <HugeiconsIcon icon={Building03Icon} size={14} className="shrink-0" />
            <span className="truncate">Contract<span className="hidden sm:inline">gegevens</span></span>
          </TabsTrigger>
          {hasAdsContract && (
            <TabsTrigger
              value="ads"
              className="gap-1.5 sm:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 sm:px-4 py-2.5 text-[12px] sm:text-sm whitespace-nowrap min-w-0"
            >
              <HugeiconsIcon icon={ChartLineData01Icon} size={14} className="shrink-0" />
              <span className="truncate">Ads<span className="hidden sm:inline"> contract</span></span>
            </TabsTrigger>
          )}
          {hasPakketContract && (
            <TabsTrigger
              value="pakket"
              className="gap-1.5 sm:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 sm:px-4 py-2.5 text-[12px] sm:text-sm whitespace-nowrap min-w-0"
            >
              <HugeiconsIcon icon={File02Icon} size={14} className="shrink-0" />
              <span className="truncate">Pakket<span className="hidden sm:inline"> contract</span></span>
            </TabsTrigger>
          )}
          {showDocs && (
            <TabsTrigger
              value="docs"
              className="gap-1.5 sm:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 sm:px-4 py-2.5 text-[12px] sm:text-sm whitespace-nowrap min-w-0"
            >
              <HugeiconsIcon icon={Folder02Icon} size={14} className="shrink-0" />
              <span className="truncate">Documenten</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab 1 — Contractgegevens (bedrijfsinfo form) */}
        <TabsContent value="bedrijf" className="mt-0">
          <SectionCard
            title="Contractgegevens"
            description="Houd je bedrijfsinformatie actueel voor facturatie en communicatie."
          >
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <Field
                  label="Bedrijfsnaam"
                  value={form.company_name}
                  onChange={(v) => setForm({ ...form, company_name: v })}
                  required
                />
                <Field
                  label="Contactpersoon"
                  value={form.contact_person}
                  onChange={(v) => setForm({ ...form, contact_person: v })}
                  required
                />
                {client.email && (
                  <Field
                    label="E-mailadres"
                    value={client.email}
                    onChange={() => {}}
                    type="email"
                    readOnly
                    required
                  />
                )}
                <Field
                  label="Mobiel nummer"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  type="tel"
                  required
                />
                <Field
                  label="KVK nummer"
                  value={form.kvk_number}
                  onChange={(v) => setForm({ ...form, kvk_number: v })}
                  placeholder="12345678"
                />
                <Field
                  label="BTW nummer"
                  value={form.btw_number}
                  onChange={(v) => setForm({ ...form, btw_number: v })}
                  placeholder="NL000000000B00"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={saving}>
                  {saving ? "Opslaan..." : "Wijzigingen opslaan"}
                </Button>
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        {/* Tab 2 — Pakket contract (volledig overzicht) */}
        {hasPakketContract && (
          <TabsContent value="pakket" className="mt-0">
            <ContractView client={client} editable={false} />
          </TabsContent>
        )}

        {/* Tab 3 — Ads contract */}
        {hasAdsContract && (
        <TabsContent value="ads" className="mt-0">
          <SectionCard
            title="Ads contract"
            description="Een overzicht van je actieve advertentie-contract bij Webiro."
            headerExtra={
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full ${
                  client.active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${client.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                {client.active ? "Actief" : "Inactief"}
              </span>
            }
          >
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isDiscountActive = (c: any): boolean => {
                if (!c.discount_percentage || !c.discount_months) return false;
                const start = c.discount_start_date
                  ? new Date(c.discount_start_date)
                  : c.contract_start_date
                  ? new Date(c.contract_start_date)
                  : null;
                if (!start) return false;
                const end = new Date(start);
                end.setMonth(end.getMonth() + c.discount_months);
                end.setDate(end.getDate() - 1);
                return today >= start && today <= end;
              };

              let baseTotal = 0;
              let discountedTotal = 0;
              let anyDiscountActive = false;
              campaigns.forEach((c: any) => {
                const costs = c.platform_costs ?? {};
                const sub = c.platforms.reduce(
                  (s: number, pid: string) => s + (Number(costs[pid]) || 0),
                  0
                );
                baseTotal += sub;
                if (isDiscountActive(c)) {
                  anyDiscountActive = true;
                  discountedTotal += sub * (1 - Number(c.discount_percentage) / 100);
                } else {
                  discountedTotal += sub;
                }
              });

              if (baseTotal <= 0) return null;
              const totalCampaigns = campaigns.reduce((s, c) => s + (c.platforms?.length || 0), 0);
              return (
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                    <p className="text-[12px] uppercase tracking-wider text-muted-foreground">
                      {anyDiscountActive ? "Totaal Maandelijkse fee (deze maand)" : "Totaal Maandelijkse fee"}
                    </p>
                    <p className="text-[12px] uppercase tracking-wider text-muted-foreground">
                      Actieve campagnes
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    {anyDiscountActive ? (
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-3xl font-semibold text-foreground tracking-tight">
                          {fmtEUR(discountedTotal)}
                        </span>
                        <span className="text-base line-through text-muted-foreground">
                          {fmtEUR(baseTotal)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-3xl font-semibold text-foreground tracking-tight">
                        {fmtEUR(baseTotal)}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-primary/10 text-primary">
                      {`${totalCampaigns} ${totalCampaigns === 1 ? "campagne" : "campagnes"}`}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Som van alle platform kosten over {totalCampaigns}{" "}
                    {totalCampaigns === 1 ? "campagne" : "campagnes"}.
                  </p>
                </div>
              );
            })()}

            {campaigns.length > 0 && (
              <div className="mb-6 pb-6 border-b border-border space-y-4">

                {/* Campagne lijst */}
                <ul className="space-y-2">
                  {campaigns.map((c) => {
                    const costs = (c as any).platform_costs ?? {};
                    const total = c.platforms.reduce((sum, pid) => sum + (Number(costs[pid]) || 0), 0);
                    const _today = new Date(); _today.setHours(0, 0, 0, 0);
                    const _dStart = c.discount_start_date
                      ? new Date(c.discount_start_date)
                      : c.contract_start_date
                      ? new Date(c.contract_start_date)
                      : null;
                    let discountActive = false;
                    if (c.discount_percentage && c.discount_months && _dStart) {
                      const _dEnd = new Date(_dStart);
                      _dEnd.setMonth(_dEnd.getMonth() + c.discount_months);
                      _dEnd.setDate(_dEnd.getDate() - 1);
                      discountActive = _today >= _dStart && _today <= _dEnd;
                    }
                    const discountedCampaign = discountActive
                      ? total * (1 - Number(c.discount_percentage) / 100)
                      : total;
                    return (
                      <li
                        key={c.id}
                        className="p-3 rounded-lg border border-border bg-muted/20 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                          {total > 0 && (
                            <div className="flex flex-col items-end shrink-0">
                              {discountActive ? (
                                <>
                                  <span className="flex items-baseline gap-2">
                                    <span className="text-[12px] line-through text-muted-foreground tabular-nums">
                                      {fmtEUR(total)}
                                    </span>
                                    <span className="text-sm font-semibold text-foreground tabular-nums">
                                      {fmtEUR(discountedCampaign)}
                                    </span>
                                  </span>
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    Fee deze maand
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-sm font-semibold text-foreground tabular-nums">
                                    {fmtEUR(total)}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    Fee deze maand
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <ul
                          className="grid gap-1.5"
                          style={{
                            gridTemplateColumns: `repeat(${Math.min(c.platforms.length || 1, 4)}, minmax(0, 1fr))`,
                          }}
                        >
                          {c.platforms.map((pid) => {
                            const p = AD_PLATFORMS.find((x) => x.id === pid);
                            if (!p) return null;
                            const cost = Number(costs[pid]) || 0;
                            const discountedCost = discountActive
                              ? cost * (1 - Number(c.discount_percentage) / 100)
                              : cost;
                            return (
                              <li
                                key={pid}
                                className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-md bg-background border border-border/60 min-w-0 min-h-[56px]"
                              >
                                <span className="flex items-center gap-2 min-w-0">
                                  <img src={p.logo} alt={p.label} className="w-4 h-4 object-contain shrink-0" />
                                  <span className="text-[12px] text-foreground truncate">
                                    {p.label.replace(/ Ads$/, "").replace(/ \(.*\)$/, "")}
                                  </span>
                                </span>
                                {discountActive && cost > 0 ? (
                                  <span className="flex min-w-[84px] flex-col items-end shrink-0 text-right leading-none">
                                    <span className="text-[11px] font-medium line-through decoration-1 text-muted-foreground tabular-nums">
                                      {fmtEUR(cost)}
                                    </span>
                                    <span className="mt-1 text-[13px] font-semibold text-foreground tabular-nums">
                                      {fmtEUR(discountedCost)}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="min-w-[84px] shrink-0 text-right text-[13px] font-semibold text-foreground tabular-nums">
                                    {fmtEUR(cost)}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        {(() => {
                          const parseMonths = (s?: string | null) => {
                            if (!s) return null;
                            const m = s.match(/(\d+)/);
                            if (!m) return null;
                            const n = parseInt(m[1], 10);
                            if (!n) return null;
                            return /jaar|jr|year/i.test(s) ? n * 12 : n;
                          };
                          const addMonths = (d: Date, months: number) => {
                            const x = new Date(d);
                            x.setMonth(x.getMonth() + months);
                            x.setDate(x.getDate() - 1);
                            return x;
                          };
                          const startDate = c.contract_start_date ? new Date(c.contract_start_date) : null;
                          const months = parseMonths(c.contract_duration);
                          const endDate = startDate && months ? addMonths(startDate, months) : null;
                          const discStart = c.discount_start_date
                            ? new Date(c.discount_start_date)
                            : startDate;
                          const discEnd =
                            discStart && c.discount_months ? addMonths(discStart, c.discount_months) : null;
                          const hasAny =
                            startDate ||
                            c.contract_duration ||
                            (c.discount_percentage != null && c.discount_months != null);
                          if (!hasAny) return null;
                          return (
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-2 mt-1 border-t border-border/60 text-[12px]">
                              {startDate && (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">Startdatum</dt>
                                  <dd className="text-foreground font-medium">{formatDate(startDate)}</dd>
                                </div>
                              )}
                              {endDate && (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">Einddatum</dt>
                                  <dd className="text-foreground font-medium">{formatDate(endDate)}</dd>
                                </div>
                              )}
                              {c.discount_percentage != null && c.discount_months != null && (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">Korting</dt>
                                  <dd className="text-foreground font-medium">
                                    {c.discount_percentage}% • {c.discount_months}{" "}
                                    {c.discount_months === 1 ? "maand" : "maanden"}
                                  </dd>
                                </div>
                              )}
                              {discStart && discEnd && (
                                <div className="flex justify-between gap-2">
                                  <dt className="text-muted-foreground">Kortingsperiode</dt>
                                  <dd className="text-foreground font-medium">
                                    {formatDate(discStart)} t/m {formatDate(discEnd)}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          );
                        })()}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}



            <p className="mt-6 text-[12px] text-muted-foreground text-center leading-relaxed">
              Wijzigingen aan contract of e-mail? Mail je accountmanager bij Webiro.
            </p>
          </SectionCard>
        </TabsContent>
        )}

        {/* Tab 4 — Documenten */}
        {showDocs && (
        <TabsContent value="docs" className="mt-0">
          <SectionCard
            title="Contract documenten"
            description="Download je ondertekende overeenkomsten en bijlagen."
          >
            {contractsLoading ? (
              <div className="h-20 bg-muted/40 rounded-lg animate-pulse" />
            ) : contracts.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                  <HugeiconsIcon icon={File02Icon} size={18} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Nog geen contract beschikbaar.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border -my-2">
                {contracts.map((c) => (
                  <li key={c.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={File02Icon} size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">
                          {c.start_date ? new Date(c.start_date).toLocaleDateString("nl-NL") : "—"} t/m {c.end_date ? new Date(c.end_date).toLocaleDateString("nl-NL") : "doorlopend"}
                        </p>
                      </div>
                    </div>
                    {c.file_url && (
                      <a
                        href={c.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg border border-border bg-background hover:bg-muted/60 hover:border-primary/40 transition-colors"
                      >
                        <HugeiconsIcon icon={Download01Icon} size={14} /> Download
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function SectionCard({
  title,
  description,
  headerExtra,
  children,
}: {
  title: string;
  description?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
          {description && <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{description}</p>}
        </div>
        {headerExtra && <div className="shrink-0">{headerExtra}</div>}
      </div>
      <div className="p-6 flex-1">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground text-right text-xs">{value}</dd>
    </div>
  );
}

function Field({
  label, value, onChange, required, type = "text", placeholder, readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <Label className="text-[13px]">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`mt-1.5${readOnly ? " bg-muted/40 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
