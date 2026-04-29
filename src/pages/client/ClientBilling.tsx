import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/hooks/useClient";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon, RefreshIcon, ArrowRight01Icon, CheckmarkCircle02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

interface Props { client: Client }

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  status: string;
  contract_duration: string;
  current_period_end: string | null;
  commitment_end_date: string | null;
  cancel_at_period_end: boolean;
  price_id: string;
}

interface Payment {
  id: string;
  amount_cents: number;
  tax_cents: number;
  total_cents: number;
  status: string;
  payment_type: string;
  description: string | null;
  receipt_url: string | null;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  pakket: string | null;
  subtotaal: number;
  payment_mode: string;
  delivery_status: string;
  deposit_paid_at: string | null;
  final_paid_at: string | null;
  delivered_at: string | null;
}

const statusLabel: Record<string, string> = {
  active: "Actief",
  trialing: "Proefperiode",
  past_due: "Betaling mislukt",
  canceled: "Opgezegd",
  unpaid: "Onbetaald",
  incomplete: "In afwachting",
};

const contractLabel: Record<string, string> = {
  monthly: "Maandelijks",
  yearly: "Jaarlijks (–10%)",
  "2year": "2 jaar (–20%)",
};

export default function ClientBilling({ client }: Props) {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  const env = getStripeEnvironment();

  const load = async () => {
    setLoading(true);
    const [subRes, payRes, ordRes] = await Promise.all([
      supabase.from("subscriptions").select("*")
        .eq("client_id", client.id).eq("environment", env)
        .order("created_at", { ascending: false }),
      supabase.from("payments").select("*")
        .eq("client_id", client.id).eq("environment", env)
        .order("created_at", { ascending: false }).limit(50),
      supabase.from("orders").select("id,order_number,pakket,subtotaal,payment_mode,delivery_status,deposit_paid_at,final_paid_at,delivered_at")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false }),
    ]);
    setSubs((subRes.data as Subscription[]) || []);
    setPayments((payRes.data as Payment[]) || []);
    setOrders((ordRes.data as Order[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [client.id]);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          environment: env,
          returnUrl: window.location.href,
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "Portal niet beschikbaar");
      window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Kon klantportaal niet openen");
    } finally {
      setPortalLoading(false);
    }
  };

  const totalPaid = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.total_cents, 0) / 100;
  const activeSubs = subs.filter(s => ["active", "trialing", "past_due"].includes(s.status));
  const ordersWithOpenFinal = orders.filter(
    o => o.payment_mode === "50_50" && o.deposit_paid_at && !o.final_paid_at
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Actieve abonnementen</p>
          <p className="text-2xl font-semibold text-foreground tabular-nums">{activeSubs.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Totaal betaald</p>
          <p className="text-2xl font-semibold text-foreground tabular-nums">{fmtEUR(totalPaid)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Beheren</p>
            <p className="text-[13px] text-foreground">Betaalmethode, facturen, opzeggen</p>
          </div>
          <button
            onClick={openPortal}
            disabled={portalLoading || activeSubs.length === 0}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {portalLoading ? "..." : "Open portaal"}
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>

      {/* Open final payments */}
      {ordersWithOpenFinal.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-amber-500" />
            Slotbetaling openstaand
          </h2>
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-5 space-y-3">
            {ordersWithOpenFinal.map(o => (
              <div key={o.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{o.order_number} — {o.pakket}</p>
                  <p className="text-[12px] text-muted-foreground">
                    Slotbetaling 50%: {fmtEUR(Number(o.subtotaal) / 2)} ex. BTW
                    {o.delivered_at ? " — Project opgeleverd" : " — Gaat live na oplevering"}
                  </p>
                </div>
                {o.delivered_at && (
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">Wacht op betaallink van Webiro</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subscriptions */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <HugeiconsIcon icon={RefreshIcon} size={16} />
          Abonnementen
        </h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="h-32 bg-muted/40 animate-pulse" />
          ) : subs.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Geen abonnementen actief.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Contract</th>
                  <th className="text-left px-6 py-3 font-medium">Volgende verlenging</th>
                  <th className="text-left px-6 py-3 font-medium">Commitment t/m</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subs.map(s => (
                  <tr key={s.id}>
                    <td className="px-6 py-3 text-foreground font-medium">{s.price_id}</td>
                    <td className="px-6 py-3 text-muted-foreground">{contractLabel[s.contract_duration] || s.contract_duration}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("nl-NL") : "—"}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {s.commitment_end_date ? new Date(s.commitment_end_date).toLocaleDateString("nl-NL") : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        s.status === "active" || s.status === "trialing"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : s.status === "past_due"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {statusLabel[s.status] || s.status}
                        {s.cancel_at_period_end && " (opgezegd)"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Payments history */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <HugeiconsIcon icon={CreditCardIcon} size={16} />
          Betaalgeschiedenis
        </h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="h-40 bg-muted/40 animate-pulse" />
          ) : payments.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Nog geen betalingen.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Datum</th>
                  <th className="text-left px-6 py-3 font-medium">Omschrijving</th>
                  <th className="text-right px-6 py-3 font-medium">Bedrag (incl. BTW)</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("nl-NL")}</td>
                    <td className="px-6 py-3 text-foreground">{p.description || p.payment_type}</td>
                    <td className="px-6 py-3 text-right tabular-nums text-foreground">{fmtEUR(p.total_cents / 100)}</td>
                    <td className="px-6 py-3">
                      {p.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} /> Voldaan
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">{p.status}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {p.receipt_url && (
                        <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-primary hover:underline">Factuur</a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
