import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/hooks/useClient";

/**
 * Determines which sections in the client portal have data.
 * Used to conditionally show/hide sidebar items.
 */
export interface ClientSections {
  hasMonthlyData: boolean;
  hasInvoices: boolean;
  hasContracts: boolean;
  hasFiles: boolean;
  hasActivity: boolean;
  loading: boolean;
}

export function useClientSections(client: Client): ClientSections {
  const [state, setState] = useState<ClientSections>({
    hasMonthlyData: false,
    hasInvoices: false,
    hasContracts: false,
    hasFiles: false,
    hasActivity: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const head = { count: "exact" as const, head: true };
      const [m, i, c, f, a] = await Promise.all([
        supabase.from("monthly_data").select("id", head).eq("client_id", client.id),
        supabase.from("invoices").select("id", head).eq("client_id", client.id),
        supabase.from("contracts").select("id", head).eq("client_id", client.id),
        supabase.from("client_files").select("id", head).eq("client_id", client.id),
        supabase.from("activity_log").select("id", head).eq("client_id", client.id),
      ]);
      if (cancelled) return;
      setState({
        hasMonthlyData: (m.count ?? 0) > 0,
        hasInvoices: (i.count ?? 0) > 0,
        hasContracts: (c.count ?? 0) > 0,
        hasFiles: (f.count ?? 0) > 0,
        hasActivity: (a.count ?? 0) > 0,
        loading: false,
      });
    })();
    return () => { cancelled = true; };
  }, [client.id]);

  return state;
}
