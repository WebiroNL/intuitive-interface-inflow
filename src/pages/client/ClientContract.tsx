import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { ContractView } from "@/components/contract/ContractView";

interface Props { client: Client }

interface Contract {
  id: string; title: string; file_url: string | null; start_date: string | null; end_date: string | null;
}

export default function ClientContract({ client }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("contracts")
        .select("*")
        .eq("client_id", client.id)
        .order("start_date", { ascending: false });
      setContracts((data as Contract[]) ?? []);
      setLoading(false);
    })();
  }, [client.id]);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] space-y-10">
      <ContractView client={client} editable={false} />

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Contract documenten</h2>
        {loading ? (
          <div className="h-20 bg-muted/40 rounded-lg animate-pulse" />
        ) : contracts.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-6 text-sm text-muted-foreground text-center">Nog geen contract beschikbaar.</div>
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
    </div>
  );
}
