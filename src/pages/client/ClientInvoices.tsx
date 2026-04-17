import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { fmtEUR } from "@/hooks/useMonthlyData";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { ContractView } from "@/components/contract/ContractView";

interface Props { client: Client }

interface Invoice {
  id: string; invoice_number: string; amount: number; status: string;
  invoice_date: string; due_date: string | null; file_url: string | null; description: string | null;
}
interface Contract {
  id: string; title: string; file_url: string | null; start_date: string | null; end_date: string | null;
}

export default function ClientInvoices({ client }: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: inv }, { data: con }] = await Promise.all([
        supabase.from("invoices").select("*").eq("client_id", client.id).order("invoice_date", { ascending: false }),
        supabase.from("contracts").select("*").eq("client_id", client.id).order("start_date", { ascending: false }),
      ]);
      setInvoices((inv as Invoice[]) ?? []);
      setContracts((con as Contract[]) ?? []);
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

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Contract & Facturen</p>
        <h1 className="text-2xl font-semibold text-foreground">Documenten</h1>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">Contract</h2>
        {loading ? (
          <div className="h-20 bg-muted/40 rounded-lg animate-pulse" />
        ) : contracts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-6 text-sm text-muted-foreground">Nog geen contract beschikbaar.</div>
        ) : (
          <div className="space-y-2">
            {contracts.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                    <HugeiconsIcon icon={File02Icon} size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.title}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {c.start_date ? new Date(c.start_date).toLocaleDateString("nl-NL") : "—"} – {c.end_date ? new Date(c.end_date).toLocaleDateString("nl-NL") : "doorlopend"}
                    </p>
                  </div>
                </div>
                {c.file_url && (
                  <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-primary hover:underline flex items-center gap-1.5">
                    <HugeiconsIcon icon={Download01Icon} size={14} /> Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Facturen</h2>
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
