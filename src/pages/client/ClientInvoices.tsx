import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Link04Icon } from "@hugeicons/core-free-icons";

interface Props { client: Client }

interface Row {
  id: string;
  number: string;
  amount: number;
  status: string;
  date: string;
  period?: string | null;
  description?: string | null;
  pdfUrl?: string | null;
  hostedUrl?: string | null;
  paymentUrl?: string | null;
  source: "stripe" | "manual";
}

const fmtNL = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });

export default function ClientInvoices({ client }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1. Stripe abonnementsfacturen uit payments
      const { data: payments } = await supabase
        .from("payments")
        .select("id, total_cents, status, created_at, description, receipt_url, metadata, stripe_invoice_id")
        .eq("client_id", client.id)
        .eq("payment_type", "subscription")
        .order("created_at", { ascending: false });

      // 2. Handmatige facturen uit invoices
      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", client.id)
        .order("invoice_date", { ascending: false });

      const stripeRows: Row[] = (payments ?? []).map((p: any) => {
        const md = p.metadata || {};
        const ps = md.period_start ? fmtNL(md.period_start) : null;
        const pe = md.period_end ? fmtNL(md.period_end) : null;
        return {
          id: p.id,
          number: md.invoice_number || `STR-${String(p.stripe_invoice_id || p.id).slice(-8).toUpperCase()}`,
          amount: Number(p.total_cents) / 100,
          status: p.status === "completed" ? "paid" : p.status === "failed" ? "overdue" : "open",
          date: p.created_at,
          period: ps && pe ? `${ps} → ${pe}` : null,
          description: p.description,
          pdfUrl: md.invoice_pdf || null,
          hostedUrl: md.hosted_invoice_url || p.receipt_url || null,
          source: "stripe",
        };
      });

      const manualRows: Row[] = (invoices ?? []).map((i: any) => ({
        id: i.id,
        number: i.invoice_number,
        amount: Number(i.amount),
        status: i.status,
        date: i.invoice_date,
        description: i.description,
        pdfUrl: i.file_url,
        hostedUrl: null,
        paymentUrl: i.payment_url,
        source: "manual",
      }));

      const combined = [...stripeRows, ...manualRows].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setRows(combined);
      setLoading(false);
    })();
  }, [client.id]);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      open: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    };
    const labels: Record<string, string> = { paid: "Betaald", open: "Open", overdue: "Mislukt" };
    return (
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${map[status] ?? "bg-muted"}`}>
        {labels[status] ?? status}
      </span>
    );
  };

  const totalPaid = rows.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalOpen = rows.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Betaald</p>
          <p className="text-2xl font-semibold text-foreground tabular-nums">{fmtEUR(totalPaid)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Openstaand</p>
          <p className="text-2xl font-semibold text-foreground tabular-nums">{fmtEUR(totalOpen)}</p>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Alle facturen</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="h-40 bg-muted/40 animate-pulse" />
          ) : rows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Nog geen facturen.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Nummer</th>
                  <th className="text-left px-6 py-3 font-medium">Datum</th>
                  <th className="text-left px-6 py-3 font-medium">Periode / Omschrijving</th>
                  <th className="text-right px-6 py-3 font-medium">Bedrag</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-3 text-foreground font-medium whitespace-nowrap">{r.number}</td>
                    <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">{fmtNL(r.date)}</td>
                    <td className="px-6 py-3">
                      {r.period && <p className="text-foreground text-[13px]">{r.period}</p>}
                      {r.description && (
                        <p className="text-muted-foreground text-[12px] truncate max-w-[280px]">
                          {r.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums text-foreground whitespace-nowrap">
                      {fmtEUR(r.amount)}
                    </td>
                    <td className="px-6 py-3">{statusBadge(r.status)}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {r.paymentUrl && r.status !== "paid" && (
                          <a
                            href={r.paymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                          >
                            Betalen
                          </a>
                        )}
                        {r.pdfUrl && (
                          <a
                            href={r.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                            title="Download PDF"
                          >
                            <HugeiconsIcon icon={Download01Icon} size={14} /> PDF
                          </a>
                        )}
                        {r.hostedUrl && (
                          <a
                            href={r.hostedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                            title="Bekijk online"
                          >
                            <ExternalLink02Icon size={14} /> Bekijk
                          </a>
                        )}
                      </div>
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
