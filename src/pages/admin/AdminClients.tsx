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
import { Add01Icon, Edit02Icon, Delete02Icon, UserIcon, UserAdd01Icon, MagicWand01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { MONTH_NAMES } from "@/components/client/MonthSelector";
import { ContractView } from "@/components/contract/ContractView";
import { INTAKE_SECTIONS, ALL_SECTION_IDS } from "@/components/intake/sections";
import { CLIENT_MENUS, ALL_MENU_IDS } from "@/components/client/menus";

interface Client {
  id: string; user_id: string | null; slug: string; company_name: string;
  email: string; phone: string | null; contact_person: string | null;
  contract_duration: string | null; monthly_fee: number; active: boolean;
  kvk_number: string | null; btw_number: string | null;
  discount_months: number | null; discount_percentage: number | null;
  deposit_percentage: number | null;
  logo_url: string | null;
  show_intake_form?: boolean;
  created_at: string; updated_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Client | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("company_name");
    setClients((data as Client[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Klanten</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Beheer client portalen en gegevens</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <HugeiconsIcon icon={Add01Icon} size={14} /> Nieuwe klant
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
                <th className="text-left px-4 py-3 font-medium">Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{c.company_name}</td>
                  
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtEUR(Number(c.monthly_fee))}</td>
                  <td className="px-4 py-3">
                    {c.user_id ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Gekoppeld</span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Geen account</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>Beheer</Button>
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
    contract_duration: client?.contract_duration ?? "",
    monthly_fee: client?.monthly_fee ?? 0,
    active: client?.active ?? true,
    kvk_number: client?.kvk_number ?? "",
    btw_number: client?.btw_number ?? "",
    discount_months: client?.discount_months ?? 0,
    discount_percentage: client?.discount_percentage ?? 0,
    deposit_percentage: client?.deposit_percentage ?? 50,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.company_name),
      kvk_number: form.kvk_number || null,
      btw_number: form.btw_number || null,
      discount_months: form.discount_months ? Number(form.discount_months) : null,
      discount_percentage: form.discount_percentage ? Number(form.discount_percentage) : null,
      deposit_percentage: form.deposit_percentage ? Number(form.deposit_percentage) : null,
    };
    const q = client
      ? supabase.from("clients").update(payload).eq("id", client.id)
      : supabase.from("clients").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(client ? "Bijgewerkt" : "Aangemaakt");
    onSaved();
  };

  return (
    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{client ? "Klant bewerken" : "Nieuwe klant"}</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Bedrijfsnaam</Label>
            <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value, slug: form.slug || slugify(e.target.value) })} required />
          </div>
          <div className="col-span-2">
            <Label>Slug (wordt /client/...)</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} required />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label>Telefoon</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Contactpersoon</Label>
            <Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
          </div>
          <div>
            <Label>Contractduur</Label>
            <Input value={form.contract_duration} onChange={(e) => setForm({ ...form, contract_duration: e.target.value })} placeholder="bv. 12 maanden" />
          </div>
          <div>
            <Label>KVK nummer</Label>
            <Input value={form.kvk_number} onChange={(e) => setForm({ ...form, kvk_number: e.target.value })} placeholder="12345678" />
          </div>
          <div>
            <Label>BTW nummer</Label>
            <Input value={form.btw_number} onChange={(e) => setForm({ ...form, btw_number: e.target.value })} placeholder="NL000000000B00" />
          </div>
          <div>
            <Label>Maandelijkse fee (€)</Label>
            <Input type="number" step="0.01" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: Number(e.target.value) })} />
          </div>
          <div className="col-span-2 pt-2 border-t border-border">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2">Korting (optioneel)</p>
          </div>
          <div>
            <Label>Aantal maanden korting</Label>
            <Input type="number" min="0" value={form.discount_months} onChange={(e) => setForm({ ...form, discount_months: Number(e.target.value) })} placeholder="bv. 3" />
          </div>
          <div>
            <Label>Kortingspercentage (%)</Label>
            <Input type="number" min="0" max="100" step="0.1" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: Number(e.target.value) })} placeholder="bv. 20" />
          </div>
          <div className="col-span-2">
            <Label>Aanbetaling (%)</Label>
            <Input type="number" min="0" max="100" step="1" value={form.deposit_percentage} onChange={(e) => setForm({ ...form, deposit_percentage: Number(e.target.value) })} placeholder="bv. 50" />
            <p className="text-[11px] text-muted-foreground mt-1">Percentage van de eenmalige kosten dat de klant vooraf betaalt.</p>
          </div>
        </div>
        <Button type="submit" disabled={saving} className="w-full">{saving ? "Bezig..." : "Opslaan"}</Button>
      </form>
    </DialogContent>
  );
}

function ClientManageDialog({ client, onChanged, onClose }: { client: Client; onChanged: () => void; onClose: () => void }) {
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
          <TabsTrigger value="contracts">Contracten</TabsTrigger>
          <TabsTrigger value="activity">Activiteit</TabsTrigger>
          <TabsTrigger value="intake">Intake formulier</TabsTrigger>
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
        <TabsContent value="contracts"><ContractsTab client={client} /></TabsContent>
        <TabsContent value="activity"><ActivityTab client={client} /></TabsContent>
        <TabsContent value="intake"><IntakeFormTab client={client} onChanged={onChanged} /></TabsContent>
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
        <div><Label>Fee (€)</Label><Input type="number" step="0.01" value={form.monthly_fee} onChange={(e)=>setForm({...form, monthly_fee:Number(e.target.value)})} /></div>
        <div className="col-span-2 pt-2 border-t border-border">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground">Korting (optioneel)</p>
        </div>
        <div><Label>Aantal maanden korting</Label><Input type="number" min="0" value={form.discount_months ?? 0} onChange={(e)=>setForm({...form, discount_months: e.target.value ? Number(e.target.value) : null})} placeholder="bv. 3" /></div>
        <div><Label>Kortingspercentage (%)</Label><Input type="number" min="0" max="100" step="0.1" value={form.discount_percentage ?? 0} onChange={(e)=>setForm({...form, discount_percentage: e.target.value ? Number(e.target.value) : null})} placeholder="bv. 20" /></div>
        <div><Label>Aanbetaling (%)</Label><Input type="number" min="0" max="100" value={form.deposit_percentage ?? 50} onChange={(e)=>setForm({...form, deposit_percentage: e.target.value ? Number(e.target.value) : null})} placeholder="bv. 50" /></div>

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
  });
  const [saving, setSaving] = useState(false);

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
            {INTAKE_SECTIONS.map((s) => {
              const checked = enabledSections.includes(s.id);
              return (
                <label key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/40 cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={() => toggleSection(s.id)} />
                  <HugeiconsIcon icon={s.icon} size={14} className="text-muted-foreground" />
                  <span className="text-[13px] text-foreground">{s.label}</span>
                </label>
              );
            })}
          </div>
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
    const { error } = await supabase.from("clients").update(form).eq("id", client.id);
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
            Let op: items die data vereisen (bijv. Facturen, Bestanden) verschijnen pas in het menu zodra er ook werkelijke data voor de klant beschikbaar is.
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

  return (
    <div className="pt-4 space-y-4">
      <div className="bg-muted/30 border border-border rounded p-4 text-[13px] text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Inlogaccount aanmaken of resetten</p>
        <p>Vul e-mail + wachtwoord in. Bestaat het e-mailadres al? Dan wordt het wachtwoord overschreven en gekoppeld aan deze klant. De klant logt in op <span className="font-mono text-foreground">webiro.nl/login</span>.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>E-mail</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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

  const BulletList = ({ field, label, placeholder, aiField }: { field: "summary_bullets" | "recommendation_bullets"; label: string; placeholder: string; aiField: "summary_bullets" | "recommendation_bullets" }) => {
    const list: string[] = form[field] ?? [];
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-[11px]">{label}</Label>
          <AiBtn field={aiField} />
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
          <Label className="text-[11px]">04 — Bereik & impressies (uitleg)</Label>
          <Textarea value={form.ai_reach_text ?? ""} onChange={f("ai_reach_text")} rows={4} placeholder="Wat betekent dit? Twee korte alinea's." />
        </div>

        <div>
          <Label className="text-[11px]">06 — Benchmark vergelijking (uitleg)</Label>
          <Textarea value={form.ai_benchmark_text ?? ""} onChange={f("ai_benchmark_text")} rows={4} placeholder="Vergelijking met de markt." />
        </div>

        <div>
          <Label className="text-[11px] mb-1.5 block">07 — In gewone taal (3 blokken)</Label>
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
          <Label className="text-[11px]">Inzichten / vrije notitie (intern)</Label>
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
            {items.map((i:any) => (
              <tr key={i.id}>
                <td className="px-3 py-2">{i.invoice_number}</td>
                <td className="px-3 py-2">{new Date(i.invoice_date).toLocaleDateString("nl-NL")}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtEUR(Number(i.amount))}</td>
                <td className="px-3 py-2">{i.status}</td>
                <td className="px-3 py-2 text-right"><Button variant="ghost" size="sm" onClick={async()=>{ await supabase.from("invoices").delete().eq("id",i.id); load(); }}><HugeiconsIcon icon={Delete02Icon} size={14}/></Button></td>
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
        {items.map((c:any) => (
          <div key={c.id} className="flex items-center justify-between border border-border rounded p-3">
            <div><p className="text-sm font-medium">{c.title}</p><p className="text-[12px] text-muted-foreground">{c.start_date ?? "—"} → {c.end_date ?? "doorlopend"}</p></div>
            <Button variant="ghost" size="sm" onClick={async()=>{ await supabase.from("contracts").delete().eq("id",c.id); load(); }}><HugeiconsIcon icon={Delete02Icon} size={14}/></Button>
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
