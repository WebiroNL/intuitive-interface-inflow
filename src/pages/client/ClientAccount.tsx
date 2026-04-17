import { useState } from "react";
import type { Client } from "@/hooks/useClient";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

interface Props { client: Client }

const schema = z.object({
  company_name: z.string().trim().min(1, "Verplicht").max(120),
  contact_person: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  kvk_number: z.string().trim().max(40).optional().or(z.literal("")),
  btw_number: z.string().trim().max(40).optional().or(z.literal("")),
});

export default function ClientAccount({ client }: Props) {
  const [form, setForm] = useState({
    company_name: client.company_name ?? "",
    contact_person: client.contact_person ?? "",
    phone: client.phone ?? "",
    kvk_number: client.kvk_number ?? "",
    btw_number: client.btw_number ?? "",
  });
  const [saving, setSaving] = useState(false);

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

  const hasDiscount =
    client.discount_months != null &&
    client.discount_percentage != null &&
    Number(client.discount_months) > 0 &&
    Number(client.discount_percentage) > 0;

  return (
    <div className="p-6 lg:p-8 max-w-[800px]">
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Account</p>
        <h1 className="text-2xl font-semibold text-foreground">Bedrijfsgegevens</h1>
        <p className="text-sm text-muted-foreground mt-1">Werk je bedrijfsgegevens hier zelf bij.</p>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-lg p-6 space-y-5">
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
        />
        <Field
          label="Telefoon"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          type="tel"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">Contractgegevens</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="divide-y divide-border">
            <Row label="E-mail (login)" value={client.email} />
            <Row label="Contractduur" value={client.contract_duration ?? "—"} />
            <Row label="Maandelijkse fee" value={fmtEUR(Number(client.monthly_fee))} />
            <Row label="Status" value={client.active ? "Actief" : "Inactief"} />
            {hasDiscount && (
              <Row
                label="Kortingsperiode"
                value={`${client.discount_percentage}% korting voor ${client.discount_months} ${
                  Number(client.discount_months) === 1 ? "maand" : "maanden"
                }`}
              />
            )}
          </div>
        </div>
        <p className="text-[12px] text-muted-foreground mt-3">
          Wijzigingen aan contract of e-mail? Mail je accountmanager bij Webiro.
        </p>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, required, type = "text", placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-[13px]">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
