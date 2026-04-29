import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, CheckmarkCircle02Icon, Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { PartnerProgramNav } from "@/components/admin/PartnerProgramNav";

interface PartnerRow {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "suspended" | "rejected";
  tier: "bronze" | "silver" | "gold";
  referral_code: string;
  discount_code: string;
  total_revenue: number;
  total_commission: number;
  pending_balance: number;
  available_balance: number;
  total_referrals: number;
  total_conversions: number;
  created_at: string;
  approved_at: string | null;
  notes: string | null;
  user_id: string | null;
  iban: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  website: string | null;
  address_city: string | null;
  address_country: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  suspended: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const tierColors: Record<string, string> = {
  bronze: "bg-amber-700/10 text-amber-700 border-amber-700/20",
  silver: "bg-slate-400/10 text-slate-500 border-slate-400/20",
  gold: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

export default function AdminPartners() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<PartnerRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPartners((data as PartnerRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updatePartner = async (id: string, patch: Partial<PartnerRow>) => {
    const { error } = await supabase.from("partners").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Partner bijgewerkt");
    await load();
    if (selected?.id === id) {
      setSelected((p) => p ? { ...p, ...patch } as PartnerRow : p);
    }
  };

  const approve = (p: PartnerRow) => updatePartner(p.id, { status: "approved", approved_at: new Date().toISOString() } as any);
  const reject = (p: PartnerRow) => updatePartner(p.id, { status: "rejected" } as any);
  const suspend = (p: PartnerRow) => updatePartner(p.id, { status: "suspended" } as any);

  const filtered = partners.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.company_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.contact_person.toLowerCase().includes(q) ||
      p.referral_code.toLowerCase().includes(q) ||
      p.discount_code.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: partners.length,
    pending: partners.filter((p) => p.status === "pending").length,
    approved: partners.filter((p) => p.status === "approved").length,
    revenue: partners.reduce((s, p) => s + Number(p.total_revenue || 0), 0),
    commission: partners.reduce((s, p) => s + Number(p.total_commission || 0), 0),
  };

  return (
    <div className="space-y-6">
      <PartnerProgramNav />
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Totaal" value={stats.total.toString()} />
        <StatCard label="In afwachting" value={stats.pending.toString()} accent="amber" />
        <StatCard label="Goedgekeurd" value={stats.approved.toString()} accent="emerald" />
        <StatCard label="Omzet via partners" value={`€${stats.revenue.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`} />
        <StatCard label="Totaal commissie" value={`€${stats.commission.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek op bedrijf, e-mail of code..."
            className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Alle statussen</option>
          <option value="pending">In afwachting</option>
          <option value="approved">Goedgekeurd</option>
          <option value="suspended">Geschorst</option>
          <option value="rejected">Afgewezen</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Bedrijf</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Tier</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Omzet</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Commissie</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Conv.</th>
                <th className="px-4 py-3 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Laden...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Geen partners gevonden.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.company_name}</div>
                    <div className="text-xs text-muted-foreground">{p.contact_person} · {p.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium border rounded ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium border rounded uppercase ${tierColors[p.tier]}`}>{p.tier}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.referral_code}</td>
                  <td className="px-4 py-3 text-right">€{Number(p.total_revenue).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-right">€{Number(p.total_commission).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right">{p.total_conversions}/{p.total_referrals}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(p)} className="text-xs px-2 py-1 rounded hover:bg-muted/50 text-primary font-medium">Beheer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <PartnerDetail
          partner={selected}
          onClose={() => setSelected(null)}
          onApprove={() => approve(selected)}
          onReject={() => reject(selected)}
          onSuspend={() => suspend(selected)}
          onUpdate={(patch) => updatePartner(selected.id, patch)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: "amber" | "emerald" }) {
  const ring = accent === "amber" ? "ring-amber-500/20" : accent === "emerald" ? "ring-emerald-500/20" : "ring-border";
  return (
    <div className={`bg-card border border-border rounded-lg p-4 ring-1 ${ring}`}>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground mt-1">{value}</p>
    </div>
  );
}

function PartnerDetail({ partner, onClose, onApprove, onReject, onSuspend, onUpdate }: {
  partner: PartnerRow;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
  onUpdate: (patch: Partial<PartnerRow>) => void;
}) {
  const [notes, setNotes] = useState(partner.notes || "");
  const [tier, setTier] = useState(partner.tier);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={onClose} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <aside className="ml-auto relative w-full max-w-xl h-full bg-card border-l border-border overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 h-[60px] flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground truncate">{partner.company_name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted/50">
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded ${statusColors[partner.status]}`}>{partner.status}</span>
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded uppercase ${tierColors[partner.tier]}`}>{partner.tier}</span>
            <div className="ml-auto flex items-center gap-2">
              {partner.status !== "approved" && (
                <button onClick={onApprove} className="text-xs px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} /> Goedkeuren
                </button>
              )}
              {partner.status === "approved" && (
                <button onClick={onSuspend} className="text-xs px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-600 border border-orange-500/20 hover:bg-orange-500/20">Schorsen</button>
              )}
              {partner.status !== "rejected" && partner.status !== "approved" && (
                <button onClick={onReject} className="text-xs px-3 py-1.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20">Afwijzen</button>
              )}
            </div>
          </div>

          {/* Codes */}
          <Section title="Tracking codes">
            <Field label="Referral link" value={`${window.location.origin}/?ref=${partner.referral_code}`} mono />
            <Field label="Discount code" value={partner.discount_code} mono />
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <Field label="Contactpersoon" value={partner.contact_person} />
            <Field label="E-mail" value={partner.email} />
            <Field label="Telefoon" value={partner.phone || "—"} />
            <Field label="Website" value={partner.website || "—"} />
            <Field label="Locatie" value={[partner.address_city, partner.address_country].filter(Boolean).join(", ") || "—"} />
          </Section>

          {/* Bedrijf */}
          <Section title="Bedrijf">
            <Field label="KvK" value={partner.kvk_number || "—"} />
            <Field label="BTW" value={partner.btw_number || "—"} />
            <Field label="IBAN" value={partner.iban || "—"} mono />
          </Section>

          {/* Performance */}
          <Section title="Performance">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Omzet" value={`€${Number(partner.total_revenue).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`} />
              <MiniStat label="Commissie" value={`€${Number(partner.total_commission).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}`} />
              <MiniStat label="Beschikbaar" value={`€${Number(partner.available_balance).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}`} />
              <MiniStat label="In behandeling" value={`€${Number(partner.pending_balance).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}`} />
              <MiniStat label="Referrals" value={partner.total_referrals.toString()} />
              <MiniStat label="Conversies" value={partner.total_conversions.toString()} />
            </div>
          </Section>

          {/* Tier override */}
          <Section title="Tier (handmatig)">
            <div className="flex items-center gap-2">
              <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="flex-1 h-10 px-3 text-sm bg-background border border-border rounded-md">
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
              <button onClick={() => onUpdate({ tier } as any)} className="text-xs px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Opslaan</button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Tier wordt automatisch herberekend op basis van omzet, maar je kunt hier handmatig overrulen.</p>
          </Section>

          {/* Notes */}
          <Section title="Interne notities">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Notities zichtbaar voor admins..."
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button onClick={() => onUpdate({ notes } as any)} className="mt-2 text-xs px-3 py-2 rounded-md border border-border hover:bg-muted/50">Notities opslaan</button>
          </Section>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-foreground text-right break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 border border-border rounded-md px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
