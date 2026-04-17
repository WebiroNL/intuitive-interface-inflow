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
  logo_url: z.string().trim().url("Ongeldige URL").max(500).optional().or(z.literal("")),
});

export default function ClientAccount({ client }: Props) {
  const [form, setForm] = useState({
    company_name: client.company_name ?? "",
    contact_person: client.contact_person ?? "",
    phone: client.phone ?? "",
    logo_url: client.logo_url ?? "",
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
        logo_url: parsed.data.logo_url || null,
      })
      .eq("id", client.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Bedrijfsgegevens opgeslagen");
  };

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
        <Field
          label="Logo URL"
          value={form.logo_url}
          onChange={(v) => setForm({ ...form, logo_url: v })}
          placeholder="https://..."
        />

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
