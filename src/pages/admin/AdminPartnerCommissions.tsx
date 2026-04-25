import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { PartnerProgramNav } from "@/components/admin/PartnerProgramNav";

interface Commission {
  id: string;
  partner_id: string;
  product_type: string;
  product_name: string;
  sale_amount: number;
  commission_amount: number;
  commission_percentage: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  conversion_source: string;
  customer_name: string | null;
  customer_email: string | null;
  is_recurring: boolean;
  created_at: string;
  partners?: { company_name: string; referral_code: string };
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminPartnerCommissions() {
  const [items, setItems] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partner_commissions")
      .select("*, partners(company_name, referral_code)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Commission["status"]) => {
    const patch: any = { status };
    if (status === "approved") {
      patch.approved_at = new Date().toISOString();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) patch.approved_by = user.id;
    }
    const { error } = await supabase.from("partner_commissions").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Commissie bijgewerkt");
    load();
  };

  const filtered = items.filter((i) => statusFilter === "all" || i.status === statusFilter);

  const totals = {
    pending: items.filter((i) => i.status === "pending").reduce((s, i) => s + Number(i.commission_amount), 0),
    approved: items.filter((i) => i.status === "approved").reduce((s, i) => s + Number(i.commission_amount), 0),
    paid: items.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.commission_amount), 0),
  };

  return (
    <div className="space-y-6">
      <PartnerProgramNav />

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">In afwachting</p>
          <p className="text-xl font-semibold text-foreground mt-1">€{totals.pending.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Goedgekeurd</p>
          <p className="text-xl font-semibold text-foreground mt-1">€{totals.approved.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Uitbetaald</p>
          <p className="text-xl font-semibold text-foreground mt-1">€{totals.paid.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 text-sm bg-background border border-border rounded-md">
          <option value="all">Alle statussen</option>
          <option value="pending">In afwachting</option>
          <option value="approved">Goedgekeurd</option>
          <option value="paid">Uitbetaald</option>
          <option value="cancelled">Geannuleerd</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Datum</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Partner</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Klant</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Bron</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Verkoop</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">%</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Commissie</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">Laden...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">Geen commissies.</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString("nl-NL")}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.partners?.company_name || "—"}</div>
                    <div className="text-xs text-muted-foreground font-mono">{c.partners?.referral_code}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{c.product_name}</div>
                    <div className="text-xs text-muted-foreground">{c.product_type}{c.is_recurring ? " · recurring" : ""}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{c.customer_name || "—"}<br /><span className="text-muted-foreground">{c.customer_email}</span></td>
                  <td className="px-4 py-3 text-xs uppercase">{c.conversion_source}</td>
                  <td className="px-4 py-3 text-right">€{Number(c.sale_amount).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right">{c.commission_percentage}%</td>
                  <td className="px-4 py-3 text-right font-semibold">€{Number(c.commission_amount).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium border rounded ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.status === "pending" && (
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => updateStatus(c.id, "approved")} className="w-7 h-7 rounded flex items-center justify-center text-emerald-600 hover:bg-emerald-500/10" title="Goedkeuren">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                        </button>
                        <button onClick={() => updateStatus(c.id, "cancelled")} className="w-7 h-7 rounded flex items-center justify-center text-destructive hover:bg-destructive/10" title="Annuleren">
                          <HugeiconsIcon icon={Cancel01Icon} size={16} />
                        </button>
                      </div>
                    )}
                    {c.status === "approved" && (
                      <button onClick={() => updateStatus(c.id, "cancelled")} className="text-xs text-destructive hover:underline">Annuleren</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
