import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { getDiscountInfo, getContractInfo, formatDate, discountLastDay, contractLastDay } from "@/lib/discount";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { ContractView } from "@/components/contract/ContractView";

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

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("contracts")
        .select("*")
        .eq("client_id", client.id)
        .order("start_date", { ascending: false });
      setContracts((data as ContractDoc[]) ?? []);
      setContractsLoading(false);
    })();
  }, [client.id]);

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
      <header className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">Accountinstellingen</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Beheer je bedrijfs- en contractgegevens.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bedrijfsgegevens */}
        <div className="lg:col-span-3">
          <SectionCard
            title="Bedrijfsgegevens"
            description="Houd je bedrijfsinformatie actueel voor facturatie en communicatie."
          >
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              <div className="flex justify-end pt-3 border-t border-border">
                <Button type="submit" disabled={saving}>
                  {saving ? "Opslaan..." : "Wijzigingen opslaan"}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>

        {/* Contractgegevens */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Contractgegevens"
            description="Een overzicht van je actieve abonnement bij Webiro."
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
            {client.monthly_fee != null && Number(client.monthly_fee) > 0 && (
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2">
                  {discount.isActiveNow ? "Maandelijkse fee (deze maand)" : "Maandelijkse fee"}
                </p>
                {discount.isActiveNow ? (
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-semibold text-foreground tracking-tight">{fmtEUR(discount.discountedFee)}</span>
                    <span className="text-base line-through text-muted-foreground">{fmtEUR(discount.baseFee)}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      −{discount.percentage}%
                    </span>
                  </div>
                ) : (
                  <p className="text-3xl font-semibold text-foreground tracking-tight">{fmtEUR(discount.baseFee)}</p>
                )}
              </div>
            )}

            <dl className="space-y-3.5 text-sm">
              {client.contract_duration && client.contract_duration.trim() !== "" && (
                <DetailRow
                  label="Contractduur"
                  value={/maand|jaar|jr|year/i.test(client.contract_duration) ? client.contract_duration : `${client.contract_duration} ${client.contract_duration.trim() === "1" ? "maand" : "maanden"}`}
                />
              )}
              {contract.startDate && <DetailRow label="Startdatum" value={formatDate(contract.startDate)} />}
              {lastContractDay && <DetailRow label="Einddatum" value={formatDate(lastContractDay)} />}
              {discount.hasDiscount && (
                <>
                  <DetailRow
                    label="Korting"
                    value={`${discount.percentage}% • ${discount.months} ${discount.months === 1 ? "maand" : "maanden"}`}
                  />
                  {discount.startDate && lastDiscountDay && (
                    <DetailRow
                      label="Kortingsperiode"
                      value={`${formatDate(discount.startDate)} t/m ${formatDate(lastDiscountDay)}`}
                    />
                  )}
                </>
              )}
            </dl>

            <p className="mt-6 pt-5 border-t border-border text-[12px] text-muted-foreground text-center leading-relaxed">
              Wijzigingen aan contract of e-mail? Mail je accountmanager bij Webiro.
            </p>
          </SectionCard>
        </div>
      </div>

      <section className="mt-8">
        <ContractView client={client} editable={false} />
      </section>

      <section className="mt-8">
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
      </section>
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
      <dd className="text-[13px] font-medium text-foreground text-right">{value}</dd>
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

function Row({ label, value, valueNode }: { label: string; value: string; valueNode?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      {valueNode ?? <p className="text-sm text-foreground">{value}</p>}
    </div>
  );
}
