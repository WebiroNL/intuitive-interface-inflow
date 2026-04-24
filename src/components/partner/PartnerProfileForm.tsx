import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Partner } from "@/hooks/usePartner";

interface Props {
  partner: Partner;
}

export function PartnerProfileForm({ partner }: Props) {
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState({
    company_name: partner.company_name ?? "",
    contact_person: partner.contact_person ?? "",
    phone: partner.phone ?? "",
    website: partner.website ?? "",
    kvk_number: partner.kvk_number ?? "",
    btw_number: partner.btw_number ?? "",
    address_street: partner.address_street ?? "",
    address_postal: partner.address_postal ?? "",
    address_city: partner.address_city ?? "",
    address_country: partner.address_country ?? "NL",
    bank_name: partner.bank_name ?? "",
    iban: partner.iban ?? "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("partners").update(form).eq("id", partner.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Wijzigingen opgeslagen");
  };

  const onPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Wachtwoord moet minstens 8 tekens zijn");
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewPassword("");
    toast.success("Wachtwoord bijgewerkt");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-foreground">Account instellingen</h2>
        <p className="text-muted-foreground text-[13px] mt-1">Beheer je bedrijfsgegevens en uitbetalingsinformatie.</p>
      </div>

      <form onSubmit={onSave} className="rounded-xl border border-border bg-card p-6 space-y-6">
        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-foreground">Account</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>E-mailadres</Label>
              <Input value={partner.email} disabled />
            </div>
            <div>
              <Label>Tier</Label>
              <Input value={partner.tier} disabled className="capitalize" />
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-[14px] font-semibold text-foreground">Bedrijf</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Bedrijfsnaam</Label>
              <Input id="company_name" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="contact_person">Contactpersoon</Label>
              <Input id="contact_person" value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Telefoon</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://" value={form.website} onChange={(e) => update("website", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="kvk_number">KvK nummer</Label>
              <Input id="kvk_number" value={form.kvk_number} onChange={(e) => update("kvk_number", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="btw_number">BTW nummer</Label>
              <Input id="btw_number" value={form.btw_number} onChange={(e) => update("btw_number", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-[14px] font-semibold text-foreground">Adres</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="address_street">Straat en huisnummer</Label>
              <Input id="address_street" value={form.address_street} onChange={(e) => update("address_street", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="address_postal">Postcode</Label>
              <Input id="address_postal" value={form.address_postal} onChange={(e) => update("address_postal", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="address_city">Plaats</Label>
              <Input id="address_city" value={form.address_city} onChange={(e) => update("address_city", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-[14px] font-semibold text-foreground">Uitbetaling</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bank_name">Rekeninghouder</Label>
              <Input id="bank_name" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="iban">IBAN</Label>
              <Input id="iban" placeholder="NL00 BANK 0000 0000 00" value={form.iban} onChange={(e) => update("iban", e.target.value)} />
            </div>
          </div>
        </section>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Opslaan..." : "Wijzigingen opslaan"}
          </Button>
        </div>
      </form>

      <form onSubmit={onPasswordChange} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <h3 className="text-[14px] font-semibold text-foreground">Wachtwoord wijzigen</h3>
          <p className="text-[12px] text-muted-foreground mt-1">Minstens 8 tekens.</p>
        </div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <Label htmlFor="new_password">Nieuw wachtwoord</Label>
            <Input
              id="new_password"
              type="password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" variant="outline" disabled={pwSaving || newPassword.length < 8}>
            {pwSaving ? "Bezig..." : "Wachtwoord bijwerken"}
          </Button>
        </div>
      </form>
    </div>
  );
}
