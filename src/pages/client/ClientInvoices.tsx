import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { fmtEUR } from "@/hooks/useMonthlyData";

interface Props { client: Client }

interface Invoice {
  id: string; invoice_number: string; amount: number; status: string;
  invoice_date: string; due_date: string | null; file_url: string | null; description: string | null;
}

export default function ClientInvoices({ client }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", client.id)
        .order("invoice_date", { ascending: false });
      setInvoices((data as Invoice[]) ?? []);
      setLoading(false);
    })();
  }, [client.id]);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      open: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      overdue: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    };
    const labels: Record<string, string> = { paid: "Betaald", open: "Open", overdue: "Verlopen" };
    return <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${map[status] ?? "bg-muted"}`}>{labels[status] ?? status}</span>;
  };

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const totalOpen = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] space-y-8">
      <div>
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Financieel</p>
        <h1 className="text-2xl font-semibold text-foreground">Facturen</h1>
      </div>

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
          ) : invoices.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Nog geen facturen.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Nummer</th>
                  <th className="text-left px-6 py-3 font-medium">Datum</th>
                  <th className="text-right px-6 py-3 font-medium">Bedrag</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="px-6 py-3 text-foreground font-medium">{i.invoice_number}</td>
                    <td className="px-6 py-3 text-muted-foreground">{new Date(i.invoice_date).toLocaleDateString("nl-NL")}</td>
                    <td className="px-6 py-3 text-right tabular-nums text-foreground">{fmtEUR(Number(i.amount))}</td>
                    <td className="px-6 py-3">{statusBadge(i.status)}</td>
                    <td className="px-6 py-3 text-right">
                      {i.file_url && (
                        <a href={i.file_url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-primary hover:underline">Bekijk</a>
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
