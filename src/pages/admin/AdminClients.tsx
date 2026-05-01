import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit02Icon, Delete02Icon, UserIcon, UserAdd01Icon, MagicWand01Icon, FloppyDiskIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { MONTH_NAMES } from "@/components/client/MonthSelector";
import { ContractView } from "@/components/contract/ContractView";
import { INTAKE_SECTIONS, ALL_SECTION_IDS } from "@/components/intake/sections";
import { CLIENT_MENUS, ALL_MENU_IDS } from "@/components/client/menus";
import ClientIntakeForm from "@/pages/client/ClientIntakeForm";
import ClientWebsiteIntakeForm from "@/pages/client/ClientWebsiteIntakeForm";
import { DEFAULT_INTAKE_LABELS, ALL_INTAKE_LABEL_KEYS } from "@/components/intake/labels";
import { LABEL_KEYS_BY_SECTION } from "@/components/intake/labelGroups";
import {
  WEBSITE_INTAKE_SECTIONS,
  ALL_WEBSITE_SECTION_IDS,
} from "@/components/intake/websiteSections";
import {
  DEFAULT_WEBSITE_INTAKE_LABELS,
  ALL_WEBSITE_INTAKE_LABEL_KEYS,
} from "@/components/intake/websiteLabels";
import { WEBSITE_LABEL_KEYS_BY_SECTION } from "@/components/intake/websiteLabelGroups";
import { AdsCampaignsTab } from "@/components/admin/AdsCampaigns";

interface Client {
  id: string; user_id: string | null; slug: string; company_name: string;
  email: string; phone: string | null; contact_person: string | null;
  contract_duration: string | null; monthly_fee: number; active: boolean;
  kvk_number: string | null; btw_number: string | null;
  discount_months: number | null; discount_percentage: number | null;
  deposit_percentage: number | null;
  contract_start_date?: string | null;
  discount_start_date?: string | null;
  logo_url: string | null;
  show_intake_form?: boolean;
  activation_token?: string | null;
  activation_expires_at?: string | null;
  activated_at?: string | null;
  created_at: string; updated_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Client | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [formCounts, setFormCounts] = useState<Record<string, number>>({});
  const [adsAgg, setAdsAgg] = useState<Record<string, { count: number; total: number }>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("company_name");
    const list = (data as Client[]) ?? [];
    setClients(list);
    setLoading(false);

    // Load form counts: ads intake (marketing_intakes), website intake, onboarding (service_onboardings)
    const [mi, wi, so, ac] = await Promise.all([
      supabase.from("marketing_intakes").select("client_id"),
      supabase.from("website_intakes" as any).select("client_id"),
      supabase.from("service_onboardings").select("client_id, submitted_at, created_at"),
      supabase.from("ads_campaigns").select("client_id, platforms, platform_costs"),
    ]);
    const perClient: Record<string, { intake: number; website_intake: number; onboarding: number }> = {};
    const ensure = (id: string) => {
      if (!perClient[id]) perClient[id] = { intake: 0, website_intake: 0, onboarding: 0 };
      return perClient[id];
    };
    (mi.data ?? []).forEach((r: any) => { if (r.client_id) ensure(r.client_id).intake += 1; });
    ((wi as any).data ?? []).forEach((r: any) => { if (r.client_id) ensure(r.client_id).website_intake += 1; });
    // Group onboarding rows by submission timestamp (1 form fill = N rows with same timestamp)
    const onboardingGroups: Record<string, Set<string>> = {};
    (so.data ?? []).forEach((r: any) => {
      if (!r.client_id) return;
      const key = r.submitted_at ?? r.created_at ?? "";
      if (!onboardingGroups[r.client_id]) onboardingGroups[r.client_id] = new Set();
      onboardingGroups[r.client_id].add(String(key));
    });
    Object.entries(onboardingGroups).forEach(([id, set]) => { ensure(id).onboarding = set.size; });

    const counts: Record<string, number> = {};
    Object.entries(perClient).forEach(([id, totals]) => {
      const seenI = Number(localStorage.getItem(`admin_seen_intake_${id}`) || 0);
      const seenW = Number(localStorage.getItem(`admin_seen_website_intake_${id}`) || 0);
      const seenO = Number(localStorage.getItem(`admin_seen_onboarding_${id}`) || 0);
      const unseen =
        Math.max(0, totals.intake - seenI) +
        Math.max(0, totals.website_intake - seenW) +
        Math.max(0, totals.onboarding - seenO);
      if (unseen > 0) counts[id] = unseen;
    });
    setFormCounts(counts);

    // Aggregate ads campaigns: count + total monthly fee per client
    const agg: Record<string, { count: number; total: number }> = {};
    (ac.data ?? []).forEach((row: any) => {
      if (!row.client_id) return;
      const cur = agg[row.client_id] ?? { count: 0, total: 0 };
      const platforms: string[] = Array.isArray(row.platforms) ? row.platforms : [];
      cur.count += platforms.length;
      const costs = (row.platform_costs ?? {}) as Record<string, number>;
      cur.total += platforms.reduce((s, pid) => s + (Number(costs[pid]) || 0), 0);
      agg[row.client_id] = cur;
    });
    setAdsAgg(agg);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <HugeiconsIcon icon={Add01Icon} size={16} /> Nieuwe klant
            </Button>
          </DialogTrigger>
          <ClientFormDialog onSaved={() => { setCreateOpen(false); load(); }} />
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({length:4}).map((_,i) => <div key={i} className="h-14 bg-muted/40 rounded animate-pulse" />)}</div>
      ) : clients.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">Nog geen klanten.</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Bedrijf</th>
                
                <th className="text-left px-4 py-3 font-medium">E-mail</th>
                <th className="text-right px-4 py-3 font-medium">Fee</th>
                <th className="text-right px-4 py-3 font-medium">Campagnes</th>
                <th className="text-left px-4 py-3 font-medium">Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span>{c.company_name}</span>
                      {formCounts[c.id] > 0 && (
                        <span
                          title="Aantal ingevulde formulieren (ads intake, campagne, onboarding)"
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tabular-nums"
                        >
                          {formCounts[c.id]}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {fmtEUR(Number(c.monthly_fee) + (adsAgg[c.id]?.total ?? 0))}
                    {adsAgg[c.id]?.total > 0 && (
                      <div className="text-[10px] text-muted-foreground leading-tight">
                        incl. {fmtEUR(adsAgg[c.id].total)} ads
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {adsAgg[c.id]?.count > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                        {adsAgg[c.id].count} {adsAgg[c.id].count === 1 ? "campagne" : "campagnes"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.user_id ? (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const tab = window.open("about:blank", "_blank");
                          try {
                            const { data, error } = await supabase.functions.invoke("admin-impersonate-client", {
                              body: { client_id: c.id, redirect_to: `${window.location.origin}/dashboard` },
                            });
                            if (error || (data as any)?.error) {
                              if (tab) tab.close();
                              toast.error((data as any)?.error ?? "Inloggen mislukt");
                              return;
                            }
                            if (tab) tab.location.href = (data as any).action_link;
                          } catch (err) {
                            if (tab) tab.close();
                            toast.error("Inloggen mislukt");
                          }
                        }}
                        title="Inloggen als deze klant in nieuw tabblad"
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                      >
                        Inloggen
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Geen account</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(c)} className="text-xs px-2 py-1 rounded hover:bg-muted/50 text-primary font-medium">Beheer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <ClientManageDialog client={selected} onChanged={load} onClose={() => setSelected(null)} />
        </Dialog>
      )}
    </div>
  );
}

function ClientFormDialog({ client, onSaved }: { client?: Client; onSaved: () => void }) {
  const [form, setForm] = useState({
    company_name: client?.company_name ?? "",
    slug: client?.slug ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    contact_person: client?.contact_person ?? "",
    first_name: (client as any)?.first_name ?? "",
    last_name: (client as any)?.last_name ?? "",
    contract_duration: client?.contract_duration ?? "",
    monthly_fee: client?.monthly_fee != null ? String(client.monthly_fee) : "",
    active: client?.active ?? true,
    kvk_number: client?.kvk_number ?? "",
    btw_number: client?.btw_number ?? "",
    address_street: (client as any)?.address_street ?? "",
    address_postal: (client as any)?.address_postal ?? "",
    address_city: (client as any)?.address_city ?? "",
    address_country: (client as any)?.address_country ?? "NL",
    discount_months: client?.discount_months != null ? String(client.discount_months) : "",
    discount_percentage: client?.discount_percentage != null ? String(client.discount_percentage) : "",
    deposit_percentage: client?.deposit_percentage != null ? String(client.deposit_percentage) : "",
    contract_start_date: (client as any)?.contract_start_date ?? (client ? "" : new Date().toISOString().slice(0, 10)),
    discount_start_date: (client as any)?.discount_start_date ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validatie: minimaal e-mail OF telefoon
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("Vul minimaal een e-mail of telefoonnummer in");
      return;
    }

    setSaving(true);
    const basePayload: any = {
      company_name: form.company_name,
      slug: form.slug || slugify(form.company_name),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      contact_person: form.contact_person || null,
      first_name: form.first_name || null,
      last_name: form.last_name || null,
      contract_duration: form.contract_duration || null,
      monthly_fee: form.monthly_fee !== "" ? Number(form.monthly_fee) : null,
      active: form.active,
      kvk_number: form.kvk_number || null,
      btw_number: form.btw_number || null,
      address_street: form.address_street || null,
      address_postal: form.address_postal || null,
      address_city: form.address_city || null,
      address_country: form.address_country || "NL",
      discount_months: form.discount_months !== "" ? Number(form.discount_months) : null,
      discount_percentage: form.discount_percentage !== "" ? Number(form.discount_percentage) : null,
      deposit_percentage: form.deposit_percentage !== "" ? Number(form.deposit_percentage) : null,
      contract_start_date: form.contract_start_date || (client ? null : new Date().toISOString().slice(0, 10)),
      discount_start_date: form.discount_start_date || form.contract_start_date || (client ? null : new Date().toISOString().slice(0, 10)),
    };

    if (client) {
      const { error } = await supabase.from("clients").update(basePayload).eq("id", client.id);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Bijgewerkt");
      onSaved();
      return;
    }

    // Nieuwe klant: genereer activatie token
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const expires = new Date();
    expires.setDate(expires.getDate() + 14); // 14 dagen geldig

    const { data: inserted, error } = await supabase
      .from("clients")
      .insert({
        ...basePayload,
        visible_menus: ["dashboard"],
        show_intake_form: false,
        show_website_intake_form: false,
        show_onboarding_form: false,
        activation_token: token,
        activation_expires_at: expires.toISOString(),
      })
      .select("id")
      .single();

    setSaving(false);
    if (error || !inserted) { toast.error(error?.message ?? "Aanmaken mislukt"); return; }

    const url = `${window.location.origin}/client/activate?token=${token}`;
    setActivationUrl(url);
    toast.success("Klant aangemaakt — kopieer de activatielink");
  };

  return (
    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{client ? "Klant bewerken" : "Nieuwe klant"}</DialogTitle></DialogHeader>

      {activationUrl ? (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200 mb-1">Klant aangemaakt</p>
            <p className="text-[13px] text-emerald-800 dark:text-emerald-300">
              Stuur deze activatielink naar de klant. De klant vult zelf ontbrekende gegevens in en kiest een wachtwoord. Link is 14 dagen geldig.
            </p>
          </div>
          <div>
            <Label>Activatielink</Label>
            <div className="flex gap-2 mt-1.5">
              <Input value={activationUrl} readOnly onFocus={(e) => e.currentTarget.select()} className="font-mono text-[12px]" />
              <Button
                type="button"
                onClick={() => { navigator.clipboard.writeText(activationUrl); toast.success("Gekopieerd"); }}
              >
                Kopieer
              </Button>
            </div>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => { setActivationUrl(null); onSaved(); }}>
            Sluiten
          </Button>
        </div>
      ) : (
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Bedrijfsnaam *</Label>
            <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value, slug: form.slug || slugify(e.target.value) })} required />
          </div>
          <div className="col-span-2 bg-muted/30 border border-border rounded p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Login (e-mail of telefoon — minimaal één)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[12px]">E-mail</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@bedrijf.nl" />
              </div>
              <div>
                <Label className="text-[12px]">Telefoon</Label>
                <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+316..." />
              </div>
            </div>
          </div>
          <div>
            <Label>Voornaam</Label>
            <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <Label>Achternaam</Label>
            <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div>
            <Label>KVK nummer</Label>
            <Input value={form.kvk_number} onChange={(e) => setForm({ ...form, kvk_number: e.target.value })} placeholder="12345678" />
          </div>
          <div>
            <Label>BTW nummer (optioneel)</Label>
            <Input value={form.btw_number} onChange={(e) => setForm({ ...form, btw_number: e.target.value })} placeholder="NL000000000B00" />
          </div>

          <div className="col-span-2 pt-2 border-t border-border">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2">Adres (optioneel)</p>
          </div>
          <div className="col-span-2">
            <Label>Straat + huisnummer</Label>
            <Input value={form.address_street} onChange={(e) => setForm({ ...form, address_street: e.target.value })} />
          </div>
          <div>
            <Label>Postcode</Label>
            <Input value={form.address_postal} onChange={(e) => setForm({ ...form, address_postal: e.target.value })} />
          </div>
          <div>
            <Label>Plaats</Label>
            <Input value={form.address_city} onChange={(e) => setForm({ ...form, address_city: e.target.value })} />
          </div>

          <div className="col-span-2 pt-2 border-t border-border" />
          <div>
            <Label>Maandelijkse fee (€)</Label>
            <Input type="number" step="0.01" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} placeholder="bv. 500" />
          </div>
          <div>
            <Label>Startdatum contract</Label>
            <Input type="date" value={form.contract_start_date} onChange={(e) => setForm({ ...form, contract_start_date: e.target.value })} />
            <p className="text-[11px] text-muted-foreground mt-1">Vanaf welke maand het contract ingaat.</p>
          </div>

          <div className="col-span-2 pt-2 border-t border-border">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2">Korting (optioneel)</p>
          </div>
          <div>
            <Label>Aantal maanden korting</Label>
            <Input type="number" min="0" value={form.discount_months} onChange={(e) => setForm({ ...form, discount_months: e.target.value })} placeholder="bv. 3" />
          </div>
          <div>
            <Label>Kortingspercentage (%)</Label>
            <Input type="number" min="0" max="100" step="0.1" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} placeholder="bv. 20" />
          </div>
          <div className="col-span-2">
            <Label>Startdatum korting (optioneel)</Label>
            <Input type="date" value={form.discount_start_date} onChange={(e) => setForm({ ...form, discount_start_date: e.target.value })} />
            <p className="text-[11px] text-muted-foreground mt-1">Laat leeg om de contractstart te gebruiken. Vul in om een korting tussentijds te starten.</p>
          </div>
          <div className="col-span-2">
            <Label>Aanbetaling (%)</Label>
            <Input type="number" min="0" max="100" step="1" value={form.deposit_percentage} onChange={(e) => setForm({ ...form, deposit_percentage: e.target.value })} placeholder="bv. 50" />
            <p className="text-[11px] text-muted-foreground mt-1">Percentage van de eenmalige kosten dat de klant vooraf betaalt.</p>
          </div>
        </div>
        {!client && (
          <div className="bg-primary/5 border border-primary/20 rounded p-3 text-[12px] text-muted-foreground">
            Na opslaan krijg je een <span className="font-medium text-foreground">activatielink</span> die je naar de klant kunt sturen. De klant vult zelf ontbrekende gegevens in en kiest een veilig wachtwoord.
          </div>
        )}
        <Button type="submit" disabled={saving} className="w-full">{saving ? "Bezig..." : (client ? "Bijwerken" : "Aanmaken + activatielink genereren")}</Button>
      </form>
      )}
    </DialogContent>
  );
}

function ClientManageDialog({ client, onChanged, onClose }: { client: Client; onChanged: () => void; onClose: () => void }) {
  const [tabCounts, setTabCounts] = useState<{ intake: number; website_intake: number; onboarding: number }>({
    intake: 0, website_intake: 0, onboarding: 0,
  });
  const seenKey = (kind: string) => `admin_seen_${kind}_${client.id}`;
  const [seen, setSeen] = useState<{ intake: number; website_intake: number; onboarding: number }>(() => ({
    intake: Number(localStorage.getItem(`admin_seen_intake_${client.id}`) || 0),
    website_intake: Number(localStorage.getItem(`admin_seen_website_intake_${client.id}`) || 0),
    onboarding: Number(localStorage.getItem(`admin_seen_onboarding_${client.id}`) || 0),
  }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [mi, wi, so] = await Promise.all([
        supabase.from("marketing_intakes").select("id", head).eq("client_id", client.id),
        supabase.from("website_intakes" as any).select("id", head).eq("client_id", client.id),
        supabase.from("service_onboardings").select("id", head).eq("client_id", client.id),
      ]);
      if (cancelled) return;
      setTabCounts({
        intake: mi.count ?? 0,
        website_intake: (wi as any).count ?? 0,
        onboarding: so.count ?? 0,
      });
    })();
    return () => { cancelled = true; };
  }, [client.id]);

  const markSeen = (kind: "intake" | "website_intake" | "onboarding", total: number) => {
    localStorage.setItem(seenKey(kind), String(total));
    setSeen((s) => ({ ...s, [kind]: total }));
    onChanged();
  };

  const Badge = ({ n, kind, total }: { n: number; kind: "intake" | "website_intake" | "onboarding"; total: number }) => n > 0 ? (
    <span
      role="button"
      title="Markeer als gezien"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); markSeen(kind, total); }}
      className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold tabular-nums cursor-pointer hover:bg-primary/80 transition-colors group"
    >
      <span className="group-hover:hidden">{n}</span>
      <HugeiconsIcon icon={Tick02Icon} className="hidden group-hover:block w-3 h-3" strokeWidth={3} />
    </span>
  ) : null;

  return (
    <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{client.company_name}</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="info">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="services">Diensten</TabsTrigger>
          <TabsTrigger value="months">Maanddata</TabsTrigger>
          <TabsTrigger value="invoices">Facturen</TabsTrigger>
          <TabsTrigger value="activity">Activiteit</TabsTrigger>
          <TabsTrigger value="ads_campaigns">Ads campagnes</TabsTrigger>
          <TabsTrigger value="intake">Ads Intake<Badge n={Math.max(0, tabCounts.intake - seen.intake)} kind="intake" total={tabCounts.intake} /></TabsTrigger>
          <TabsTrigger value="website_intake">Website Intake<Badge n={Math.max(0, tabCounts.website_intake - seen.website_intake)} kind="website_intake" total={tabCounts.website_intake} /></TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding<Badge n={Math.max(0, tabCounts.onboarding - seen.onboarding)} kind="onboarding" total={tabCounts.onboarding} /></TabsTrigger>
          <TabsTrigger value="menus">Zijmenu klantportaal</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ClientFormDialogInline
            client={client}
            onSaved={onChanged}
            onDelete={async () => {
              if (!confirm("Klant verwijderen? Alle gekoppelde data wordt ook verwijderd.")) return;
              await supabase.from("clients").delete().eq("id", client.id);
              toast.success("Verwijderd");
              onChanged(); onClose();
            }}
          />
        </TabsContent>

        <TabsContent value="account"><AccountTab client={client} onChanged={onChanged} /></TabsContent>
        <TabsContent value="services"><ContractView client={client as any} editable /></TabsContent>
        <TabsContent value="months"><MonthsTab client={client} /></TabsContent>
        <TabsContent value="invoices"><InvoicesTab client={client} /></TabsContent>
        <TabsContent value="activity"><ActivityTab client={client} /></TabsContent>
        <TabsContent value="ads_campaigns"><AdsCampaignsTab clientId={client.id} /></TabsContent>
        <TabsContent value="intake"><IntakeFormTab client={client} onChanged={onChanged} /></TabsContent>
        <TabsContent value="website_intake"><WebsiteIntakeFormTab client={client} onChanged={onChanged} /></TabsContent>
        <TabsContent value="onboarding"><OnboardingFormTab client={client} onChanged={onChanged} /></TabsContent>
        <TabsContent value="menus"><VisibleMenusTab client={client} onChanged={onChanged} /></TabsContent>
      </Tabs>
    </DialogContent>
  );
}

function ClientFormDialogInline({ client, onSaved, onDelete }: { client: Client; onSaved: () => void; onDelete?: () => void | Promise<void> }) {
  const [form, setForm] = useState<any>({ ...client });
  const [saving, setSaving] = useState(false);

  // Intake-secties opslag:
  // - ["__all__"] => alles aan (default, ook toekomstige secties)
  // - []          => niets aan (expliciet "Alles uit")
  // - [...ids]    => specifieke selectie
  const rawSections = (form as any).intake_sections;
  const isAllSentinel =
    Array.isArray(rawSections) && rawSections.length === 1 && rawSections[0] === "__all__";
  const isExplicitNone = Array.isArray(rawSections) && rawSections.length === 0;

  const enabledSections: string[] = isAllSentinel
    ? ALL_SECTION_IDS
    : isExplicitNone
      ? []
      : Array.isArray(rawSections)
        ? (rawSections as string[])
        : ALL_SECTION_IDS;

  const allOn = enabledSections.length === ALL_SECTION_IDS.length;
  const noneOn = enabledSections.length === 0;

  const setEnabledSections = (next: string[]) => {
    let valueToStore: string[];
    if (next.length === ALL_SECTION_IDS.length) {
      valueToStore = ["__all__"]; // sentinel
    } else {
      valueToStore = next; // kan [] zijn = expliciet alles uit
    }
    setForm({ ...form, intake_sections: valueToStore });
  };

  const toggleSection = (id: string) => {
    const set = new Set(enabledSections);
    if (set.has(id)) set.delete(id); else set.add(id);
    setEnabledSections(ALL_SECTION_IDS.filter((sid) => set.has(sid))); // behoud volgorde
  };

  // Zichtbare menu-items in zijbalk klantportaal
  const rawMenus = (form as any).visible_menus;
  const isMenuAllSentinel =
    Array.isArray(rawMenus) && rawMenus.length === 1 && rawMenus[0] === "__all__";
  const isMenuExplicitNone = Array.isArray(rawMenus) && rawMenus.length === 0;
  const enabledMenus: string[] = isMenuAllSentinel
    ? ALL_MENU_IDS
    : isMenuExplicitNone
      ? []
      : Array.isArray(rawMenus)
        ? (rawMenus as string[])
        : ALL_MENU_IDS;
  const menusAllOn = enabledMenus.length === ALL_MENU_IDS.length;
  const menusNoneOn = enabledMenus.length === 0;

  const setEnabledMenus = (next: string[]) => {
    const valueToStore = next.length === ALL_MENU_IDS.length ? ["__all__"] : next;
    setForm({ ...form, visible_menus: valueToStore });
  };

  const toggleMenu = (id: string) => {
    const set = new Set(enabledMenus);
    if (set.has(id)) set.delete(id); else set.add(id);
    setEnabledMenus(ALL_MENU_IDS.filter((mid) => set.has(mid)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("clients").update(form).eq("id", client.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Bijgewerkt"); onSaved();
  };
  return (
    <form onSubmit={submit} className="space-y-3 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Bedrijfsnaam</Label><Input value={form.company_name} onChange={(e)=>setForm({...form, company_name: e.target.value, slug: slugify(e.target.value)})} /></div>
        <div><Label>E-mail</Label><Input value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} /></div>
        <div><Label>Telefoon</Label><Input value={form.phone ?? ""} onChange={(e)=>setForm({...form, phone:e.target.value})} /></div>
        <div><Label>Contactpersoon</Label><Input value={form.contact_person ?? ""} onChange={(e)=>setForm({...form, contact_person:e.target.value})} /></div>
        <div><Label>Contractduur</Label><Input value={form.contract_duration ?? ""} onChange={(e)=>setForm({...form, contract_duration:e.target.value})} /></div>
        <div><Label>KVK nummer</Label><Input value={form.kvk_number ?? ""} onChange={(e)=>setForm({...form, kvk_number:e.target.value})} placeholder="12345678" /></div>
        <div><Label>BTW nummer</Label><Input value={form.btw_number ?? ""} onChange={(e)=>setForm({...form, btw_number:e.target.value})} placeholder="NL000000000B00" /></div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        {onDelete ? (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            <HugeiconsIcon icon={Delete02Icon} size={14} /> Verwijderen
          </Button>
        ) : <span />}
        <Button type="submit" disabled={saving}>
          <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
          {saving ? "Bezig..." : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}

function IntakeFormTab({ client, onChanged }: { client: Client; onChanged: () => void }) {
  const [form, setForm] = useState<any>({
    show_intake_form: !!(client as any).show_intake_form,
    intake_sections: (client as any).intake_sections,
    intake_labels: (client as any).intake_labels ?? {},
  });
  const [saving, setSaving] = useState(false);
  const [labelFilter, setLabelFilter] = useState("");

  const rawSections = form.intake_sections;
  const isAllSentinel =
    Array.isArray(rawSections) && rawSections.length === 1 && rawSections[0] === "__all__";
  const isExplicitNone = Array.isArray(rawSections) && rawSections.length === 0;
  const enabledSections: string[] = isAllSentinel
    ? ALL_SECTION_IDS
    : isExplicitNone
      ? []
      : Array.isArray(rawSections)
        ? (rawSections as string[])
        : ALL_SECTION_IDS;
  const allOn = enabledSections.length === ALL_SECTION_IDS.length;
  const noneOn = enabledSections.length === 0;

  const setEnabledSections = (next: string[]) => {
    const valueToStore = next.length === ALL_SECTION_IDS.length ? ["__all__"] : next;
    setForm({ ...form, intake_sections: valueToStore });
  };
  const toggleSection = (id: string) => {
    const set = new Set(enabledSections);
    if (set.has(id)) set.delete(id); else set.add(id);
    setEnabledSections(ALL_SECTION_IDS.filter((sid) => set.has(sid)));
  };

  const setLabelOverride = (key: string, value: string) => {
    const next = { ...(form.intake_labels ?? {}) };
    if (value.trim() === "") delete next[key];
    else next[key] = value;
    setForm({ ...form, intake_labels: next });
  };
  const resetAllLabels = () => setForm({ ...form, intake_labels: {} });

  const filteredLabelKeys = ALL_INTAKE_LABEL_KEYS.filter((k) => {
    const def = DEFAULT_INTAKE_LABELS[k] ?? "";
    const cur = (form.intake_labels ?? {})[k] ?? "";
    if (!labelFilter.trim()) return true;
    const q = labelFilter.toLowerCase();
    return k.toLowerCase().includes(q) || def.toLowerCase().includes(q) || cur.toLowerCase().includes(q);
  });
  const overriddenCount = Object.keys(form.intake_labels ?? {}).filter(
    (k) => (form.intake_labels[k] ?? "").trim() !== ""
  ).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("clients").update(form).eq("id", client.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Intake-instellingen bijgewerkt"); onChanged();
  };

  return (
    <form onSubmit={submit} className="space-y-3 pt-4">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Intake Formulier</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">Beheer de zichtbaarheid in het zijmenu en welke secties de klant ziet.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!form.show_intake_form}
              onChange={(e) => setForm({ ...form, show_intake_form: e.target.checked })}
            />
            <span className="text-[13px] font-medium text-foreground">Zichtbaar in zijmenu</span>
          </label>
        </div>

        <div className={`p-4 ${form.show_intake_form ? "" : "opacity-50 pointer-events-none"}`}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <p className="text-[13px] font-medium text-foreground">Zichtbare secties</p>
              <p className="text-[11px] text-muted-foreground">
                {allOn
                  ? "Alle secties zijn zichtbaar voor de klant."
                  : noneOn
                    ? "Geen enkele sectie is zichtbaar — de klant ziet een leeg formulier."
                    : `${enabledSections.length} van ${ALL_SECTION_IDS.length} secties zichtbaar.`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEnabledSections([...ALL_SECTION_IDS])} disabled={allOn}>Alles aan</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setEnabledSections([])} disabled={noneOn}>Alles uit</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {INTAKE_SECTIONS.map((s, idx) => {
              const checked = enabledSections.includes(s.id);
              return (
                <label key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/40 cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={() => toggleSection(s.id)} />
                  <HugeiconsIcon icon={s.icon} size={14} className="text-muted-foreground" />
                  <span className="text-[13px] text-foreground">{idx + 1}. {s.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={saving}>
          <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
          {saving ? "Bezig..." : "Instellingen opslaan"}
        </Button>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={saving}>
          <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
          {saving ? "Bezig..." : "Instellingen opslaan"}
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        <div className="border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">Vragen hernoemen</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Pas labels van vragen aan voor deze klant. Laat leeg om de standaardtekst te gebruiken.
                {overriddenCount > 0 && (
                  <> · <span className="font-medium text-foreground">{overriddenCount}</span> aangepast</>
                )}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Zoek label..."
                value={labelFilter}
                onChange={(e) => setLabelFilter(e.target.value)}
                className="h-8 w-48"
              />
              <Button type="button" variant="outline" size="sm" onClick={resetAllLabels} disabled={overriddenCount === 0}>
                Alles resetten
              </Button>
            </div>
          </div>
        </div>

        {INTAKE_SECTIONS.map((section, idx) => {
          const sectionKey = `sec.${section.id}`;
          const fieldKeys = LABEL_KEYS_BY_SECTION[section.id] ?? [];
          const allKeys = [sectionKey, ...fieldKeys];
          const visibleKeys = allKeys.filter((k) => filteredLabelKeys.includes(k));
          if (visibleKeys.length === 0) return null;

          const sectionDef = DEFAULT_INTAKE_LABELS[sectionKey] ?? section.title;
          const sectionCur = (form.intake_labels ?? {})[sectionKey] ?? "";

          return (
            <div key={section.id} className="border border-border rounded-lg bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
                <HugeiconsIcon icon={section.icon} size={16} className="text-primary" />
                <span className="text-[14px] font-semibold text-foreground">
                  {idx + 1}. {sectionCur || sectionDef}
                </span>
              </div>
              <div className="p-4 space-y-2">
                {visibleKeys.includes(sectionKey) && (
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 items-center pb-2 border-b border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-primary font-semibold">Sectietitel</span>
                      <span className="text-[13px] text-foreground truncate" title={sectionDef}>{sectionDef}</span>
                    </div>
                    <Input
                      placeholder={`(standaard: ${sectionDef})`}
                      value={sectionCur}
                      onChange={(e) => setLabelOverride(sectionKey, e.target.value)}
                      className="h-8"
                    />
                    {sectionCur ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setLabelOverride(sectionKey, "")}>
                        Reset
                      </Button>
                    ) : <div />}
                  </div>
                )}
                {fieldKeys.filter((k) => visibleKeys.includes(k)).map((key) => {
                  const def = DEFAULT_INTAKE_LABELS[key] ?? "";
                  const cur = (form.intake_labels ?? {})[key] ?? "";
                  return (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Veld</span>
                        <span className="text-[13px] text-foreground truncate" title={def}>{def}</span>
                      </div>
                      <Input
                        placeholder={`(standaard: ${def})`}
                        value={cur}
                        onChange={(e) => setLabelOverride(key, e.target.value)}
                        className="h-8"
                      />
                      {cur ? (
                        <Button type="button" variant="ghost" size="sm" onClick={() => setLabelOverride(key, "")}>
                          Reset
                        </Button>
                      ) : <div />}
                    </div>
                  );
                })}
                {fieldKeys.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">Deze sectie heeft geen aanpasbare veldlabels.</p>
                )}
              </div>
            </div>
          );
        })}
        {filteredLabelKeys.length === 0 && (
          <div className="border border-border rounded-lg bg-card p-4">
            <p className="text-[12px] text-muted-foreground text-center">Geen labels gevonden voor "{labelFilter}".</p>
          </div>
        )}
      </div>

      <div className="border border-border rounded-lg bg-card mt-6">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-[14px] font-semibold text-foreground">Antwoorden bewerken</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Bewerk hieronder de antwoorden van de klant. Alleen de hierboven ingeschakelde secties zijn zichtbaar. Wijzigingen worden via de knoppen in dit formulier opgeslagen.
          </p>
        </div>
        <div className="p-2">
          <ClientIntakeForm client={client} />
        </div>
      </div>
    </form>
  );
}

function WebsiteIntakeFormTab({ client, onChanged }: { client: Client; onChanged: () => void }) {
  const [form, setForm] = useState<any>({
    show_website_intake_form: !!(client as any).show_website_intake_form,
    website_intake_sections: (client as any).website_intake_sections,
    website_intake_labels: (client as any).website_intake_labels ?? {},
  });
  const [saving, setSaving] = useState(false);
  const [labelFilter, setLabelFilter] = useState("");

  const rawSections = form.website_intake_sections;
  const isAllSentinel =
    Array.isArray(rawSections) && rawSections.length === 1 && rawSections[0] === "__all__";
  const isExplicitNone = Array.isArray(rawSections) && rawSections.length === 0;
  const enabledSections: string[] = isAllSentinel
    ? ALL_WEBSITE_SECTION_IDS
    : isExplicitNone
      ? []
      : Array.isArray(rawSections)
        ? (rawSections as string[])
        : ALL_WEBSITE_SECTION_IDS;
  const allOn = enabledSections.length === ALL_WEBSITE_SECTION_IDS.length;
  const noneOn = enabledSections.length === 0;

  const setEnabledSections = (next: string[]) => {
    const valueToStore = next.length === ALL_WEBSITE_SECTION_IDS.length ? ["__all__"] : next;
    setForm({ ...form, website_intake_sections: valueToStore });
  };
  const toggleSection = (id: string) => {
    const set = new Set(enabledSections);
    if (set.has(id)) set.delete(id); else set.add(id);
    setEnabledSections(ALL_WEBSITE_SECTION_IDS.filter((sid) => set.has(sid)));
  };

  const setLabelOverride = (key: string, value: string) => {
    const next = { ...(form.website_intake_labels ?? {}) };
    if (value.trim() === "") delete next[key];
    else next[key] = value;
    setForm({ ...form, website_intake_labels: next });
  };
  const resetAllLabels = () => setForm({ ...form, website_intake_labels: {} });

  const filteredLabelKeys = ALL_WEBSITE_INTAKE_LABEL_KEYS.filter((k) => {
    const def = DEFAULT_WEBSITE_INTAKE_LABELS[k] ?? "";
    const cur = (form.website_intake_labels ?? {})[k] ?? "";
    if (!labelFilter.trim()) return true;
    const q = labelFilter.toLowerCase();
    return k.toLowerCase().includes(q) || def.toLowerCase().includes(q) || cur.toLowerCase().includes(q);
  });
  const overriddenCount = Object.keys(form.website_intake_labels ?? {}).filter(
    (k) => (form.website_intake_labels[k] ?? "").trim() !== ""
  ).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const { error } = await (supabase as any).from("clients").update(form).eq("id", client.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Website-intake instellingen bijgewerkt"); onChanged();
  };

  return (
    <form onSubmit={submit} className="space-y-3 pt-4">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Website Intakeformulier</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">Beheer de zichtbaarheid in het zijmenu en welke secties de klant ziet voor de website-intake.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!form.show_website_intake_form}
              onChange={(e) => setForm({ ...form, show_website_intake_form: e.target.checked })}
            />
            <span className="text-[13px] font-medium text-foreground">Zichtbaar in zijmenu</span>
          </label>
        </div>

        <div className={`p-4 ${form.show_website_intake_form ? "" : "opacity-50 pointer-events-none"}`}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <p className="text-[13px] font-medium text-foreground">Zichtbare secties</p>
              <p className="text-[11px] text-muted-foreground">
                {allOn
                  ? "Alle secties zijn zichtbaar voor de klant."
                  : noneOn
                    ? "Geen enkele sectie is zichtbaar — de klant ziet een leeg formulier."
                    : `${enabledSections.length} van ${ALL_WEBSITE_SECTION_IDS.length} secties zichtbaar.`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEnabledSections([...ALL_WEBSITE_SECTION_IDS])} disabled={allOn}>Alles aan</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setEnabledSections([])} disabled={noneOn}>Alles uit</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {WEBSITE_INTAKE_SECTIONS.map((s, idx) => {
              const checked = enabledSections.includes(s.id);
              return (
                <label key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/40 cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={() => toggleSection(s.id)} />
                  <HugeiconsIcon icon={s.icon} size={14} className="text-muted-foreground" />
                  <span className="text-[13px] text-foreground">{idx + 1}. {s.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={saving}>
          <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
          {saving ? "Bezig..." : "Instellingen opslaan"}
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        <div className="border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
            <div>
              <h3 className="text-[14px] font-semibold text-foreground">Vragen hernoemen</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Pas labels van vragen aan voor deze klant. Laat leeg om de standaardtekst te gebruiken.
                {overriddenCount > 0 && (
                  <> · <span className="font-medium text-foreground">{overriddenCount}</span> aangepast</>
                )}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Zoek label..."
                value={labelFilter}
                onChange={(e) => setLabelFilter(e.target.value)}
                className="h-8 w-48"
              />
              <Button type="button" variant="outline" size="sm" onClick={resetAllLabels} disabled={overriddenCount === 0}>
                Alles resetten
              </Button>
            </div>
          </div>
        </div>

        {WEBSITE_INTAKE_SECTIONS.map((section, idx) => {
          const sectionKey = `wsec.${section.id}`;
          const fieldKeys = WEBSITE_LABEL_KEYS_BY_SECTION[section.id] ?? [];
          const allKeys = [sectionKey, ...fieldKeys];
          const visibleKeys = allKeys.filter((k) => filteredLabelKeys.includes(k));
          if (visibleKeys.length === 0) return null;

          const sectionDef = DEFAULT_WEBSITE_INTAKE_LABELS[sectionKey] ?? section.title;
          const sectionCur = (form.website_intake_labels ?? {})[sectionKey] ?? "";

          return (
            <div key={section.id} className="border border-border rounded-lg bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
                <HugeiconsIcon icon={section.icon} size={16} className="text-primary" />
                <span className="text-[14px] font-semibold text-foreground">
                  {idx + 1}. {sectionCur || sectionDef}
                </span>
              </div>
              <div className="p-4 space-y-2">
                {visibleKeys.includes(sectionKey) && (
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 items-center pb-2 border-b border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wide text-primary font-semibold">Sectietitel</span>
                      <span className="text-[13px] text-foreground truncate" title={sectionDef}>{sectionDef}</span>
                    </div>
                    <Input
                      placeholder={`(standaard: ${sectionDef})`}
                      value={sectionCur}
                      onChange={(e) => setLabelOverride(sectionKey, e.target.value)}
                      className="h-8"
                    />
                    {sectionCur ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setLabelOverride(sectionKey, "")}>
                        Reset
                      </Button>
                    ) : <div />}
                  </div>
                )}
                {fieldKeys.filter((k) => visibleKeys.includes(k)).map((key) => {
                  const def = DEFAULT_WEBSITE_INTAKE_LABELS[key] ?? "";
                  const cur = (form.website_intake_labels ?? {})[key] ?? "";
                  return (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Veld</span>
                        <span className="text-[13px] text-foreground truncate" title={def}>{def}</span>
                      </div>
                      <Input
                        placeholder={`(standaard: ${def})`}
                        value={cur}
                        onChange={(e) => setLabelOverride(key, e.target.value)}
                        className="h-8"
                      />
                      {cur ? (
                        <Button type="button" variant="ghost" size="sm" onClick={() => setLabelOverride(key, "")}>
                          Reset
                        </Button>
                      ) : <div />}
                    </div>
                  );
                })}
                {fieldKeys.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">Deze sectie heeft geen aanpasbare veldlabels.</p>
                )}
              </div>
            </div>
          );
        })}
        {filteredLabelKeys.length === 0 && (
          <div className="border border-border rounded-lg bg-card p-4">
            <p className="text-[12px] text-muted-foreground text-center">Geen labels gevonden voor "{labelFilter}".</p>
          </div>
        )}
      </div>

      <div className="border border-border rounded-lg bg-card mt-6">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-[14px] font-semibold text-foreground">Antwoorden bewerken</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Bewerk hieronder de antwoorden van de klant. Alleen de hierboven ingeschakelde secties zijn zichtbaar.
          </p>
        </div>
        <div className="p-2">
          <ClientWebsiteIntakeForm client={client} />
        </div>
      </div>
    </form>
  );
}

function OnboardingFormTab({ client, onChanged }: { client: Client; onChanged: () => void }) {
  const [form, setForm] = useState<any>({
    show_onboarding_form: !!(client as any).show_onboarding_form,
  });
  const [saving, setSaving] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    (async () => {
      setLoadingSubs(true);
      const { data } = await (supabase as any)
        .from("service_onboardings")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });
      setSubmissions(data ?? []);
      setLoadingSubs(false);
    })();
  }, [client.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Synchroniseer 'onboarding' menu-item met de toggle 'Zichtbaar in zijmenu'.
    const rawMenus = (client as any).visible_menus;
    const isAllSentinel =
      Array.isArray(rawMenus) && rawMenus.length === 1 && rawMenus[0] === "__all__";

    let nextVisibleMenus: any = rawMenus;
    if (form.show_onboarding_form) {
      // Aan: zorg dat 'onboarding' in de zichtbare menu's staat.
      if (isAllSentinel || rawMenus == null) {
        nextVisibleMenus = ["__all__"]; // alles aan -> al inbegrepen
      } else if (Array.isArray(rawMenus) && !rawMenus.includes("onboarding")) {
        const next = [...rawMenus, "onboarding"];
        nextVisibleMenus = next.length === ALL_MENU_IDS.length ? ["__all__"] : next;
      }
    } else {
      // Uit: verwijder 'onboarding' uit een expliciete selectie.
      if (isAllSentinel || rawMenus == null) {
        // Maak expliciete selectie zonder 'onboarding'
        nextVisibleMenus = ALL_MENU_IDS.filter((id) => id !== "onboarding");
      } else if (Array.isArray(rawMenus) && rawMenus.includes("onboarding")) {
        nextVisibleMenus = rawMenus.filter((id: string) => id !== "onboarding");
      }
    }

    const { error } = await supabase
      .from("clients")
      .update({ ...form, visible_menus: nextVisibleMenus })
      .eq("id", client.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Onboarding-instellingen bijgewerkt"); onChanged();
  };

  return (
    <form onSubmit={submit} className="space-y-3 pt-4">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Onboarding (Aanleverlijst)</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Beheer of de klant het Onboarding-formulier ziet in het zijmenu. Hierin kan de klant per dienst (Google Ads, Meta, Website, etc.) de benodigde gegevens aanleveren.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!form.show_onboarding_form}
              onChange={(e) => setForm({ ...form, show_onboarding_form: e.target.checked })}
            />
            <span className="text-[13px] font-medium text-foreground">Zichtbaar in zijmenu</span>
          </label>
        </div>
        <div className="p-4">
          <p className="text-[12px] text-muted-foreground">
            Deze schakelaar wordt automatisch gesynchroniseerd met het menu-item <span className="font-medium text-foreground">"Onboarding"</span> in het tabblad <span className="font-medium text-foreground">"Zijmenu klantportaal"</span>. Aan = klant ziet "Onboarding" links onderaan, uit = verborgen.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={saving}>
          <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
          {saving ? "Bezig..." : "Instellingen opslaan"}
        </Button>
      </div>

      <div className="border border-border rounded-lg bg-card mt-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-[14px] font-semibold text-foreground">Ingestuurde aanleverlijsten</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Hier verschijnen de antwoorden zodra de klant het Onboarding-formulier indient.
          </p>
        </div>
        {loadingSubs ? (
          <div className="p-6 text-center text-[13px] text-muted-foreground">Laden...</div>
        ) : submissions.length === 0 ? (
          <div className="p-6 text-center text-[13px] text-muted-foreground">Nog geen inzendingen.</div>
        ) : (
          <div className="divide-y divide-border">
            {submissions.map((s) => (
              <div key={s.id} className="p-4">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="text-[13px] font-medium text-foreground">{s.service_type}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(s.created_at).toLocaleString("nl-NL")} · {s.status}
                  </div>
                </div>
                {s.data && Object.keys(s.data).length > 0 ? (
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
                    {Object.entries(s.data).map(([k, v]) => (
                      <div key={k} className="break-words">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-foreground whitespace-pre-wrap">
                          {Array.isArray(v) ? v.join(", ") : String(v ?? "—")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-[12px] text-muted-foreground italic">Geen data ingevuld.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}

function VisibleMenusTab({ client, onChanged }: { client: Client; onChanged: () => void }) {
  const [form, setForm] = useState<any>({ visible_menus: (client as any).visible_menus });
  const [saving, setSaving] = useState(false);

  const rawMenus = form.visible_menus;
  const isMenuAllSentinel =
    Array.isArray(rawMenus) && rawMenus.length === 1 && rawMenus[0] === "__all__";
  const isMenuExplicitNone = Array.isArray(rawMenus) && rawMenus.length === 0;
  const enabledMenus: string[] = isMenuAllSentinel
    ? ALL_MENU_IDS
    : isMenuExplicitNone
      ? []
      : Array.isArray(rawMenus)
        ? (rawMenus as string[])
        : ALL_MENU_IDS;
  const menusAllOn = enabledMenus.length === ALL_MENU_IDS.length;
  const menusNoneOn = enabledMenus.length === 0;

  const setEnabledMenus = (next: string[]) => {
    const valueToStore = next.length === ALL_MENU_IDS.length ? ["__all__"] : next;
    setForm({ ...form, visible_menus: valueToStore });
  };
  const toggleMenu = (id: string) => {
    const set = new Set(enabledMenus);
    if (set.has(id)) set.delete(id); else set.add(id);
    setEnabledMenus(ALL_MENU_IDS.filter((mid) => set.has(mid)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);

    // Synchroniseer 'onboarding' menu-item met show_onboarding_form toggle.
    const onboardingVisible = isMenuAllSentinel || form.visible_menus == null
      ? true
      : Array.isArray(form.visible_menus) && form.visible_menus.includes("onboarding");

    const { error } = await supabase
      .from("clients")
      .update({ ...form, show_onboarding_form: onboardingVisible })
      .eq("id", client.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Zijmenu bijgewerkt"); onChanged();
  };

  return (
    <form onSubmit={submit} className="space-y-3 pt-4">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Zijmenu klantportaal</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">Bepaal welke menu-items deze klant ziet in het zijmenu. Standaard staan alle items aan.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEnabledMenus([...ALL_MENU_IDS])} disabled={menusAllOn}>Alles aan</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setEnabledMenus([])} disabled={menusNoneOn}>Alles uit</Button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[11px] text-muted-foreground mb-2">
            {menusAllOn
              ? "Alle menu-items zijn zichtbaar."
              : menusNoneOn
                ? "Geen enkel menu-item zichtbaar — de klant ziet alleen de standaard pagina's."
                : `${enabledMenus.length} van ${ALL_MENU_IDS.length} menu-items zichtbaar.`}
          </p>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {CLIENT_MENUS.map((m) => {
              const checked = enabledMenus.includes(m.id);
              return (
                <label key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/40 cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={() => toggleMenu(m.id)} />
                  <HugeiconsIcon icon={m.icon} size={14} className="text-muted-foreground" />
                  <span className="text-[13px] text-foreground">{m.label}</span>
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Aangevinkte items zijn altijd zichtbaar voor de klant — ook als er nog geen data is. Vink items uit om ze volledig te verbergen.
          </p>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={saving}>
          <HugeiconsIcon icon={FloppyDiskIcon} size={14} />
          {saving ? "Bezig..." : "Opslaan"}
        </Button>
      </div>
    </form>
  );
}

function AccountTab({ client, onChanged }: { client: Client; onChanged: () => void }) {
  const [email, setEmail] = useState(client.email);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let p = "";
    for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
  };

  const submit = async () => {
    if (password.length < 8) { toast.error("Wachtwoord min. 8 tekens"); return; }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("client-account", {
      body: { client_id: client.id, email, password },
    });
    setSaving(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Fout");
      return;
    }
    toast.success((data as any)?.created ? "Account aangemaakt" : "Wachtwoord bijgewerkt");
    setPassword("");
    onChanged();
  };

  // Activatielink (her)genereren
  const [activationUrl, setActivationUrl] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState(false);

  const generateActivation = async () => {
    setGenLoading(true);
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const expires = new Date();
    expires.setDate(expires.getDate() + 14);
    const { error } = await supabase
      .from("clients")
      .update({ activation_token: token, activation_expires_at: expires.toISOString(), activated_at: null })
      .eq("id", client.id);
    setGenLoading(false);
    if (error) { toast.error(error.message); return; }
    const url = `${window.location.origin}/client/activate?token=${token}`;
    setActivationUrl(url);
    navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Activatielink aangemaakt en gekopieerd");
  };

  // Bestaande (nog geldige, niet-geactiveerde) link tonen
  const existingActivationUrl = (() => {
    if (!client.activation_token) return null;
    if (client.activated_at) return null;
    if (client.activation_expires_at && new Date(client.activation_expires_at) < new Date()) return null;
    return `${window.location.origin}/client/activate?token=${client.activation_token}`;
  })();
  const currentUrl = activationUrl ?? existingActivationUrl;
  const expiresLabel = client.activation_expires_at
    ? new Date(client.activation_expires_at).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <div className="pt-4 space-y-6">
      <div className="bg-muted/30 border border-border rounded p-4 text-[13px] text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Activatielink (klant kiest zelf wachtwoord)</p>
        <p>Genereer een unieke link en stuur deze naar de klant. De klant vult ontbrekende gegevens aan en kiest een sterk wachtwoord. Werkt voor zowel e-mail als telefoon-login. Link is 14 dagen geldig.</p>

        {currentUrl && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Huidige activatielink</span>
              {expiresLabel && !activationUrl && (
                <span className="text-[11px] text-muted-foreground">Geldig t/m {expiresLabel}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Input value={currentUrl} readOnly onFocus={(e) => e.currentTarget.select()} className="font-mono text-[12px]" />
              <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(currentUrl); toast.success("Gekopieerd"); }}>
                Kopieer
              </Button>
            </div>
          </div>
        )}

        <Button type="button" size="sm" className="mt-3" onClick={generateActivation} disabled={genLoading}>
          {genLoading ? "Bezig..." : (currentUrl ? "Nieuwe activatielink genereren (reset)" : "Activatielink genereren")}
        </Button>
      </div>

      <div className="bg-muted/30 border border-border rounded p-4 text-[13px] text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Of: zelf wachtwoord instellen (overschrijft bestaand)</p>
        <p>Vul e-mail + wachtwoord in. Bestaat het e-mailadres al? Dan wordt het wachtwoord overschreven en gekoppeld aan deze klant.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>E-mail</Label>
          <Input type="email" value={email ?? ""} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Wachtwoord (min. 8)</Label>
          <div className="flex gap-2">
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <Button type="button" variant="outline" size="sm" onClick={generate}>Genereer</Button>
          </div>
        </div>
      </div>

      {password && (
        <div className="bg-primary/5 border border-primary/20 rounded p-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Te delen met klant</p>
            <p className="text-sm font-mono text-foreground mt-0.5">{email} / {password}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(`${email} / ${password}`); toast.success("Gekopieerd"); }}>Kopieer</Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={submit} disabled={saving || !password}>
          {saving ? "Bezig..." : client.user_id ? "Wachtwoord bijwerken" : "Account aanmaken"}
        </Button>
        {client.user_id && (
          <span className="text-[12px] text-emerald-600 font-medium">✓ Account gekoppeld</span>
        )}
      </div>
    </div>
  );
}

function MonthsTab({ client }: { client: Client }) {
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const { data } = await supabase.from("monthly_data").select("*").eq("client_id", client.id).order("year",{ascending:false}).order("month",{ascending:false});
    setData(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const blank = () => {
    const platforms = ["google","meta","tiktok","linkedin","pinterest","youtube","snapchat"];
    const platformDefaults: Record<string, number> = {};
    platforms.forEach((p) => {
      ["spend","clicks","conversions","ctr","cpc","impressions","reach","frequency","link_clicks","lpv","cpm"].forEach((k) => {
        platformDefaults[`${p}_${k}`] = 0;
      });
    });
    return {
      client_id: client.id, year: new Date().getFullYear(), month: new Date().getMonth() + 1,
      ...platformDefaults,
      total_leads:0, cpa:0, roas:0, webiro_fee: client.monthly_fee, insights: "",
      instagram_growth:0, facebook_growth:0,
      benchmark_lpv_cost:0, benchmark_ctr:0,
      summary_bullets: [], recommendation_bullets: [],
    };
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between mb-3">
        <p className="text-sm text-muted-foreground">{data.length} maanden geregistreerd</p>
        <Button size="sm" onClick={() => setEditing(blank())}><HugeiconsIcon icon={Add01Icon} size={14} /> Nieuwe maand</Button>
      </div>
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left px-3 py-2">Maand</th><th className="text-right px-3 py-2">Spend</th><th className="text-right px-3 py-2">Leads</th><th className="text-right px-3 py-2">Fee</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((d:any) => (
              <tr key={d.id}>
                <td className="px-3 py-2">{MONTH_NAMES[d.month-1]} {d.year}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtEUR(["google","meta","tiktok","linkedin","pinterest","youtube","snapchat"].reduce((s,p)=>s+Number(d[`${p}_spend`] ?? 0),0))}</td>
                <td className="px-3 py-2 text-right">{d.total_leads}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtEUR(Number(d.webiro_fee))}</td>
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" size="sm" onClick={()=>setEditing(d)}>Bewerk</Button>
                  <Button variant="ghost" size="sm" onClick={async()=>{
                    if(!confirm("Verwijderen?")) return;
                    await supabase.from("monthly_data").delete().eq("id", d.id); load();
                  }}><HugeiconsIcon icon={Delete02Icon} size={14} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Dialog open onOpenChange={(o)=>!o && setEditing(null)}>
          <MonthEditDialog row={editing} client={client} onSaved={() => { setEditing(null); load(); }} />
        </Dialog>
      )}
    </div>
  );
}

function MonthEditDialog({ row, client, onSaved }: { row: any; client: Client; onSaved: () => void }) {
  const [form, setForm] = useState({
    ...row,
    summary_bullets: Array.isArray(row.summary_bullets) ? row.summary_bullets : [],
    recommendation_bullets: Array.isArray(row.recommendation_bullets) ? row.recommendation_bullets : [],
    ai_plain_language: Array.isArray(row.ai_plain_language) ? row.ai_plain_language : [],
    ai_reach_text: row.ai_reach_text ?? "",
    ai_benchmark_text: row.ai_benchmark_text ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null); // null | "all" | field key
  const f = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  const generateAI = async (field: "all" | "summary_bullets" | "reach_text" | "benchmark_text" | "plain_language" | "recommendation_bullets" | "insights" = "all") => {
    setAiLoading(field);
    try {
      const { data, error } = await supabase.functions.invoke("report-ai", {
        body: {
          metrics: form,
          company_name: client.company_name,
          period: `${MONTH_NAMES[(form.month ?? 1) - 1]} ${form.year}`,
          field,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const r = data.result ?? {};
      const next = { ...form };
      if (field === "all") {
        next.summary_bullets = r.summary_bullets ?? form.summary_bullets;
        next.recommendation_bullets = r.recommendation_bullets ?? form.recommendation_bullets;
        next.ai_reach_text = r.reach_text ?? form.ai_reach_text;
        next.ai_benchmark_text = r.benchmark_text ?? form.ai_benchmark_text;
        next.ai_plain_language = r.plain_language ?? form.ai_plain_language;
      } else if (field === "summary_bullets") next.summary_bullets = r.summary_bullets ?? form.summary_bullets;
      else if (field === "recommendation_bullets") next.recommendation_bullets = r.recommendation_bullets ?? form.recommendation_bullets;
      else if (field === "reach_text") next.ai_reach_text = r.reach_text ?? form.ai_reach_text;
      else if (field === "benchmark_text") next.ai_benchmark_text = r.benchmark_text ?? form.ai_benchmark_text;
      else if (field === "plain_language") next.ai_plain_language = r.plain_language ?? form.ai_plain_language;
      else if (field === "insights") next.insights = r.insights ?? form.insights;
      setForm(next);
      toast.success("AI tekst gegenereerd");
    } catch (e: any) {
      toast.error(e.message ?? "AI fout");
    } finally {
      setAiLoading(null);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    // Strip empty bullets
    const payload = {
      ...form,
      summary_bullets: (form.summary_bullets ?? []).filter((b: string) => b?.trim()),
      recommendation_bullets: (form.recommendation_bullets ?? []).filter((b: string) => b?.trim()),
      ai_plain_language: (form.ai_plain_language ?? []).filter((p: any) => p?.title?.trim() || p?.text?.trim()),
    };
    // Remove non-column fields that may have leaked from row
    delete (payload as any).company_name;
    const q = row.id
      ? supabase.from("monthly_data").update(payload).eq("id", row.id)
      : supabase.from("monthly_data").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Opgeslagen"); onSaved();
  };

  const Field = ({ k, label, step }: { k: string; label: string; step?: string }) => (
    <div><Label className="text-[11px]">{label}</Label><Input type="number" step={step ?? "1"} value={form[k] ?? 0} onChange={f(k)} className="h-8" /></div>
  );

  const AiBtn = ({ field, className = "" }: { field: "summary_bullets" | "reach_text" | "benchmark_text" | "plain_language" | "recommendation_bullets" | "insights"; className?: string }) => (
    <Button type="button" variant="ghost" size="sm" className={`h-6 px-2 text-[11px] ${className}`} onClick={() => generateAI(field)} disabled={aiLoading !== null}>
      <HugeiconsIcon icon={MagicWand01Icon} size={12} />
      {aiLoading === field ? "Bezig..." : "AI"}
    </Button>
  );

  const BulletList = ({ field, label, placeholder }: { field: "summary_bullets" | "recommendation_bullets"; label: string; placeholder: string }) => {
    const list: string[] = form[field] ?? [];
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-[11px]">{label}</Label>
          <AiBtn field={field} />
        </div>
        <div className="space-y-2">
          {list.map((val, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                value={val}
                onChange={(e) => {
                  const next = [...list]; next[i] = e.target.value;
                  setForm({ ...form, [field]: next });
                }}
                rows={2}
                placeholder={placeholder}
                className="text-sm"
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => {
                const next = list.filter((_, idx) => idx !== i);
                setForm({ ...form, [field]: next });
              }}>
                <HugeiconsIcon icon={Delete02Icon} size={14} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, [field]: [...list, ""] })}>
            <HugeiconsIcon icon={Add01Icon} size={14} /> Bullet toevoegen
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between gap-3 pr-6">
          <span>Maanddata</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => generateAI("all")}
            disabled={aiLoading !== null}
          >
            <HugeiconsIcon icon={MagicWand01Icon} size={14} />
            {aiLoading === "all" ? "AI bezig..." : "Genereer alle teksten met AI"}
          </Button>
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="text-[11px]">Jaar</Label><Input type="number" value={form.year} onChange={f("year")} className="h-8" /></div>
          <div>
            <Label className="text-[11px]">Maand</Label>
            <Select value={String(form.month)} onValueChange={(v)=>setForm({...form, month:Number(v)})}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>{MONTH_NAMES.map((m,i)=><SelectItem key={i} value={String(i+1)}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Field k="webiro_fee" label="Webiro fee (€)" step="0.01" />
        </div>

        {(["google","meta","tiktok","linkedin","pinterest","youtube","snapchat"] as const).map((p) => {
          const labels: Record<string, string> = {
            google: "Google Ads", meta: "Meta Ads", tiktok: "TikTok Ads",
            linkedin: "LinkedIn Ads", pinterest: "Pinterest Ads", youtube: "YouTube Ads", snapchat: "Snapchat Ads",
          };
          return (
            <div key={p} className="border border-border rounded p-3 space-y-3">
              <div className="flex items-center gap-2">
                <img src={`/images/tools/${p === "google" ? "googleads" : p}.svg`} alt={labels[p]} className="w-4 h-4 object-contain" />
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{labels[p]}</p>
                <span className="text-[10px] text-muted-foreground ml-auto">Leeg laten = niet zichtbaar voor klant</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <Field k={`${p}_spend`} label="Spend (€)" step="0.01" />
                <Field k={`${p}_clicks`} label="Klikken" />
                <Field k={`${p}_link_clicks`} label="Link clicks" />
                <Field k={`${p}_conversions`} label="Conversies" />
                <Field k={`${p}_lpv`} label="Landing page views" />
              </div>
              <div className="grid grid-cols-6 gap-2">
                <Field k={`${p}_impressions`} label="Impressies" />
                <Field k={`${p}_reach`} label="Bereik" />
                <Field k={`${p}_frequency`} label="Frequentie" step="0.01" />
                <Field k={`${p}_ctr`} label="CTR (%)" step="0.01" />
                <Field k={`${p}_cpc`} label="CPC (€)" step="0.01" />
                <Field k={`${p}_cpm`} label="CPM (€)" step="0.01" />
              </div>
            </div>
          );
        })}

        <div className="grid grid-cols-3 gap-3">
          <Field k="total_leads" label="Totaal leads" />
          <Field k="cpa" label="CPA (€)" step="0.01" />
          <Field k="roas" label="ROAS" step="0.01" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field k="instagram_growth" label="Instagram nieuwe volgers" />
          <Field k="facebook_growth" label="Facebook nieuwe volgers" />
        </div>

        <div className="border border-border rounded p-3 space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Benchmarks</p>
          <div className="grid grid-cols-2 gap-3">
            <Field k="benchmark_lpv_cost" label="Markt kosten per LPV (€)" step="0.01" />
            <Field k="benchmark_ctr" label="Markt CTR (%)" step="0.01" />
          </div>
        </div>

        <BulletList field="summary_bullets" label="01 — Management samenvatting (bullets)" placeholder="Bijv: Sterke zichtbaarheid, 16.730 unieke personen bereikt..." />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-[11px]">04 — Bereik & impressies (uitleg)</Label>
            <AiBtn field="reach_text" />
          </div>
          <Textarea value={form.ai_reach_text ?? ""} onChange={f("ai_reach_text")} rows={4} placeholder="Wat betekent dit? Twee korte alinea's." />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-[11px]">06 — Benchmark vergelijking (uitleg)</Label>
            <AiBtn field="benchmark_text" />
          </div>
          <Textarea value={form.ai_benchmark_text ?? ""} onChange={f("ai_benchmark_text")} rows={4} placeholder="Vergelijking met de markt." />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-[11px]">07 — In gewone taal (3 blokken)</Label>
            <AiBtn field="plain_language" />
          </div>
          <div className="space-y-2">
            {(form.ai_plain_language ?? []).map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <Input
                  value={item?.title ?? ""}
                  placeholder="Titel"
                  className="h-8"
                  onChange={(e) => {
                    const next = [...(form.ai_plain_language ?? [])];
                    next[i] = { ...next[i], title: e.target.value };
                    setForm({ ...form, ai_plain_language: next });
                  }}
                />
                <Textarea
                  value={item?.text ?? ""}
                  placeholder="Korte uitleg in gewone taal"
                  rows={2}
                  className="text-sm"
                  onChange={(e) => {
                    const next = [...(form.ai_plain_language ?? [])];
                    next[i] = { ...next[i], text: e.target.value };
                    setForm({ ...form, ai_plain_language: next });
                  }}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => {
                  const next = (form.ai_plain_language ?? []).filter((_: any, idx: number) => idx !== i);
                  setForm({ ...form, ai_plain_language: next });
                }}>
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, ai_plain_language: [...(form.ai_plain_language ?? []), { title: "", text: "" }] })}>
              <HugeiconsIcon icon={Add01Icon} size={14} /> Blok toevoegen
            </Button>
          </div>
        </div>

        <BulletList field="recommendation_bullets" label="08 — Aanbevelingen volgende maand (bullets)" placeholder="Bijv: Verhoog het maandbudget naar €400-600..." />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-[11px]">Inzichten / vrije notitie (intern)</Label>
            <AiBtn field="insights" />
          </div>
          <Textarea value={form.insights ?? ""} onChange={f("insights")} rows={3} />
        </div>

        <Button type="submit" disabled={saving} className="w-full">{saving ? "Bezig..." : "Opslaan"}</Button>
      </form>
    </DialogContent>
  );
}

function InvoicesTab({ client }: { client: Client }) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ invoice_number: "", amount: 0, status: "open", invoice_date: new Date().toISOString().slice(0,10), file_url: "", payment_url: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const load = async () => {
    const { data } = await supabase.from("invoices").select("*").eq("client_id", client.id).order("invoice_date",{ascending:false});
    setItems(data ?? []);
  };
  useEffect(()=>{ load(); }, []);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("invoices").insert({ ...form, client_id: client.id });
    if (error) { toast.error(error.message); return; }
    toast.success("Toegevoegd");
    setForm({ invoice_number:"", amount:0, status:"open", invoice_date:new Date().toISOString().slice(0,10), file_url:"", payment_url:"", description:"" });
    load();
  };
  const startEdit = (i: any) => {
    setEditingId(i.id);
    setEditForm({
      invoice_number: i.invoice_number ?? "",
      amount: Number(i.amount ?? 0),
      status: i.status ?? "open",
      invoice_date: i.invoice_date ? String(i.invoice_date).slice(0,10) : "",
      file_url: i.file_url ?? "",
      payment_url: i.payment_url ?? "",
      description: i.description ?? "",
    });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm(null); };
  const saveEdit = async () => {
    if (!editingId || !editForm) return;
    const { error } = await supabase.from("invoices").update({
      invoice_number: editForm.invoice_number,
      amount: Number(editForm.amount),
      status: editForm.status,
      invoice_date: editForm.invoice_date,
      file_url: editForm.file_url || null,
      payment_url: editForm.payment_url || null,
      description: editForm.description || null,
    }).eq("id", editingId);
    if (error) { toast.error(error.message); return; }
    toast.success("Factuur bijgewerkt");
    cancelEdit();
    load();
  };
  return (
    <div className="pt-4 space-y-4">
      <form onSubmit={add} className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded border border-border">
        <Input placeholder="Factuurnr" value={form.invoice_number} onChange={(e)=>setForm({...form, invoice_number:e.target.value})} required className="h-8" />
        <Input type="number" step="0.01" placeholder="Bedrag" value={form.amount} onChange={(e)=>setForm({...form, amount:Number(e.target.value)})} required className="h-8" />
        <Input type="date" value={form.invoice_date} onChange={(e)=>setForm({...form, invoice_date:e.target.value})} className="h-8" />
        <Select value={form.status} onValueChange={(v)=>setForm({...form, status:v})}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem><SelectItem value="paid">Betaald</SelectItem><SelectItem value="overdue">Verlopen</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="PDF URL (optioneel)" value={form.file_url} onChange={(e)=>setForm({...form, file_url:e.target.value})} className="h-8 col-span-2" />
        <Input placeholder="Betaallink (optioneel) — toont 'Betalen' knop bij klant" value={form.payment_url} onChange={(e)=>setForm({...form, payment_url:e.target.value})} className="h-8 col-span-3" />
        <Button type="submit" size="sm" className="col-span-3"><HugeiconsIcon icon={Add01Icon} size={14}/> Factuur toevoegen</Button>
      </form>
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-[12px] uppercase text-muted-foreground"><tr><th className="text-left px-3 py-2">Nr</th><th className="text-left px-3 py-2">Datum</th><th className="text-right px-3 py-2">Bedrag</th><th className="text-left px-3 py-2">Status</th><th></th></tr></thead>
          <tbody className="divide-y divide-border">
            {items.map((i:any) => editingId === i.id ? (
              <tr key={i.id} className="bg-muted/20">
                <td colSpan={5} className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Factuurnr" value={editForm.invoice_number} onChange={(e)=>setEditForm({...editForm, invoice_number:e.target.value})} className="h-8" />
                    <Input type="number" step="0.01" placeholder="Bedrag" value={editForm.amount} onChange={(e)=>setEditForm({...editForm, amount:Number(e.target.value)})} className="h-8" />
                    <Input type="date" value={editForm.invoice_date} onChange={(e)=>setEditForm({...editForm, invoice_date:e.target.value})} className="h-8" />
                    <Select value={editForm.status} onValueChange={(v)=>setEditForm({...editForm, status:v})}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem><SelectItem value="paid">Betaald</SelectItem><SelectItem value="overdue">Verlopen</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="PDF URL (optioneel)" value={editForm.file_url} onChange={(e)=>setEditForm({...editForm, file_url:e.target.value})} className="h-8 col-span-2" />
                    <Input placeholder="Betaallink (optioneel)" value={editForm.payment_url} onChange={(e)=>setEditForm({...editForm, payment_url:e.target.value})} className="h-8 col-span-3" />
                    <Input placeholder="Omschrijving (optioneel)" value={editForm.description} onChange={(e)=>setEditForm({...editForm, description:e.target.value})} className="h-8 col-span-3" />
                    <div className="col-span-3 flex gap-2 justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>Annuleren</Button>
                      <Button type="button" size="sm" onClick={saveEdit}><HugeiconsIcon icon={FloppyDiskIcon} size={14}/> Opslaan</Button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={i.id}>
                <td className="px-3 py-2">{i.invoice_number}</td>
                <td className="px-3 py-2">{new Date(i.invoice_date).toLocaleDateString("nl-NL")}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtEUR(Number(i.amount))}</td>
                <td className="px-3 py-2">{i.status}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(i)}><HugeiconsIcon icon={Edit02Icon} size={14}/></Button>
                    <Button variant="ghost" size="sm" onClick={async()=>{ await supabase.from("invoices").delete().eq("id",i.id); load(); }}><HugeiconsIcon icon={Delete02Icon} size={14}/></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContractsTab({ client }: { client: Client }) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", file_url: "", start_date: "", end_date: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const load = async () => {
    const { data } = await supabase.from("contracts").select("*").eq("client_id", client.id);
    setItems(data ?? []);
  };
  useEffect(()=>{ load(); }, []);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, client_id: client.id, start_date: form.start_date || null, end_date: form.end_date || null };
    const { error } = await supabase.from("contracts").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Toegevoegd"); setForm({title:"",file_url:"",start_date:"",end_date:""}); load();
  };
  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditForm({
      title: c.title ?? "",
      file_url: c.file_url ?? "",
      start_date: c.start_date ? String(c.start_date).slice(0,10) : "",
      end_date: c.end_date ? String(c.end_date).slice(0,10) : "",
    });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm(null); };
  const saveEdit = async () => {
    if (!editingId || !editForm) return;
    const { error } = await supabase.from("contracts").update({
      title: editForm.title,
      file_url: editForm.file_url || null,
      start_date: editForm.start_date || null,
      end_date: editForm.end_date || null,
    }).eq("id", editingId);
    if (error) { toast.error(error.message); return; }
    toast.success("Contract bijgewerkt"); cancelEdit(); load();
  };
  return (
    <div className="pt-4 space-y-4">
      <form onSubmit={add} className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded border border-border">
        <Input placeholder="Titel" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required className="h-8 col-span-2" />
        <Input placeholder="PDF URL" value={form.file_url} onChange={(e)=>setForm({...form, file_url:e.target.value})} className="h-8 col-span-2" />
        <Input type="date" value={form.start_date} onChange={(e)=>setForm({...form, start_date:e.target.value})} className="h-8" />
        <Input type="date" value={form.end_date} onChange={(e)=>setForm({...form, end_date:e.target.value})} className="h-8" />
        <Button type="submit" size="sm" className="col-span-2"><HugeiconsIcon icon={Add01Icon} size={14}/> Contract toevoegen</Button>
      </form>
      <div className="space-y-2">
        {items.map((c:any) => editingId === c.id ? (
          <div key={c.id} className="border border-border rounded p-3 bg-muted/20">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Titel" value={editForm.title} onChange={(e)=>setEditForm({...editForm, title:e.target.value})} className="h-8 col-span-2" />
              <Input placeholder="PDF URL" value={editForm.file_url} onChange={(e)=>setEditForm({...editForm, file_url:e.target.value})} className="h-8 col-span-2" />
              <Input type="date" value={editForm.start_date} onChange={(e)=>setEditForm({...editForm, start_date:e.target.value})} className="h-8" />
              <Input type="date" value={editForm.end_date} onChange={(e)=>setEditForm({...editForm, end_date:e.target.value})} className="h-8" />
              <div className="col-span-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>Annuleren</Button>
                <Button type="button" size="sm" onClick={saveEdit}><HugeiconsIcon icon={FloppyDiskIcon} size={14}/> Opslaan</Button>
              </div>
            </div>
          </div>
        ) : (
          <div key={c.id} className="flex items-center justify-between border border-border rounded p-3">
            <div><p className="text-sm font-medium">{c.title}</p><p className="text-[12px] text-muted-foreground">{c.start_date ?? "—"} → {c.end_date ?? "doorlopend"}</p></div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => startEdit(c)}><HugeiconsIcon icon={Edit02Icon} size={14}/></Button>
              <Button variant="ghost" size="sm" onClick={async()=>{ await supabase.from("contracts").delete().eq("id",c.id); load(); }}><HugeiconsIcon icon={Delete02Icon} size={14}/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTab({ client }: { client: Client }) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ type: "update", title: "", description: "" });
  const load = async () => {
    const { data } = await supabase.from("activity_log").select("*").eq("client_id", client.id).order("occurred_at",{ascending:false});
    setItems(data ?? []);
  };
  useEffect(()=>{ load(); }, []);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("activity_log").insert({ ...form, client_id: client.id });
    if (error) { toast.error(error.message); return; }
    setForm({type:"update", title:"", description:""}); load();
  };
  return (
    <div className="pt-4 space-y-4">
      <form onSubmit={add} className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded border border-border">
        <Select value={form.type} onValueChange={(v)=>setForm({...form, type:v})}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="launch">Campagne gestart</SelectItem>
            <SelectItem value="optimization">Optimalisatie</SelectItem>
            <SelectItem value="performance">Performance update</SelectItem>
            <SelectItem value="update">Update</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Titel" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required className="h-8" />
        <Textarea placeholder="Beschrijving (optioneel)" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} rows={2} className="col-span-2" />
        <Button type="submit" size="sm" className="col-span-2">Toevoegen</Button>
      </form>
      <div className="space-y-2">
        {items.map((a:any) => (
          <div key={a.id} className="flex items-start justify-between border border-border rounded p-3">
            <div>
              <p className="text-sm font-medium">{a.title}</p>
              <p className="text-[12px] text-muted-foreground">{new Date(a.occurred_at).toLocaleString("nl-NL")} · {a.type}</p>
              {a.description && <p className="text-[13px] mt-1">{a.description}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={async()=>{ await supabase.from("activity_log").delete().eq("id",a.id); load(); }}><HugeiconsIcon icon={Delete02Icon} size={14}/></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
