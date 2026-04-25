import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PartnerProgramNav } from "@/components/admin/PartnerProgramNav";

interface Payout {
  id: string;
  partner_id: string;
  amount: number;
  commission_count: number;
  status: "requested" | "approved" | "paid" | "rejected";
  iban: string | null;
  invoice_number: string | null;
  bank_reference: string | null;
  partner_notes: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  paid_at: string | null;
  created_at: string;
  partners?: { company_name: string; email: string; iban: string | null };
}

const statusColors: Record<string, string> = {
  requested: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminPartnerPayouts() {
  const [items, setItems] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partner_payouts")
      .select("*, partners(company_name, email, iban)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<Payout>) => {
    const { error } = await supabase.from("partner_payouts").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Uitbetaling bijgewerkt");
    load();
  };

  const approve = async (p: Payout) => {
    await update(p.id, { status: "approved" } as any);
    // Mark linked commissions to "approved" stays — we mark as paid only when payout is paid
  };

  const markPaid = async (p: Payout, ref: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("partner_payouts").update({
      status: "paid",
      paid_at: new Date().toISOString(),
      paid_by: user?.id || null,
      bank_reference: ref || null,
    } as any).eq("id", p.id);

    // Mark approved commissions as paid for this partner up to amount (simple: mark all approved)
    await supabase.from("partner_commissions")
      .update({ status: "paid", payout_id: p.id } as any)
      .eq("partner_id", p.partner_id)
      .eq("status", "approved");

    toast.success("Uitbetaling gemarkeerd als betaald");
    load();
  };

  const reject = async (p: Payout, reason: string) => {
    await update(p.id, { status: "rejected", rejection_reason: reason } as any);
  };

  const filtered = items.filter((i) => statusFilter === "all" || i.status === statusFilter);

  const totals = {
    requested: items.filter((i) => i.status === "requested").reduce((s, i) => s + Number(i.amount), 0),
    approved: items.filter((i) => i.status === "approved").reduce((s, i) => s + Number(i.amount), 0),
    paid: items.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0),
  };

  return (
    <div className="space-y-6">
      <PartnerProgramNav />

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Aangevraagd</p>
          <p className="text-xl font-semibold text-foreground mt-1">€{totals.requested.toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</p>
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

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 text-sm bg-background border border-border rounded-md">
        <option value="all">Alle statussen</option>
        <option value="requested">Aangevraagd</option>
        <option value="approved">Goedgekeurd</option>
        <option value="paid">Betaald</option>
        <option value="rejected">Afgewezen</option>
      </select>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Datum</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Partner</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">IBAN</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Bedrag</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Notitie</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Laden...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Geen uitbetalingen.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("nl-NL")}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.partners?.company_name}</div>
                    <div className="text-xs text-muted-foreground">{p.partners?.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.iban || p.partners?.iban || "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold">€{Number(p.amount).toLocaleString("nl-NL", { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium border rounded ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{p.partner_notes || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "requested" && (
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => approve(p)} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Keur goed</button>
                        <button onClick={() => {
                          const reason = prompt("Reden voor afwijzing?");
                          if (reason) reject(p, reason);
                        }} className="text-xs px-2 py-1 rounded text-destructive hover:bg-destructive/10">Wijs af</button>
                      </div>
                    )}
                    {p.status === "approved" && (
                      <button onClick={() => {
                        const ref = prompt("Bankreferentie / kenmerk (optioneel)") || "";
                        markPaid(p, ref);
                      }} className="text-xs px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20">Markeer betaald</button>
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
