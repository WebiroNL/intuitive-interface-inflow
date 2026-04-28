import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Client {
  id: string;
  user_id: string | null;
  slug: string;
  company_name: string;
  email: string;
  phone: string | null;
  contact_person: string | null;
  logo_url: string | null;
  contract_duration: string | null;
  monthly_fee: number;
  active: boolean;
  kvk_number: string | null;
  btw_number: string | null;
  discount_months: number | null;
  discount_percentage: number | null;
  deposit_percentage: number | null;
  contract_start_date?: string | null;
  discount_start_date?: string | null;
  show_intake_form?: boolean | null;
  show_website_intake_form?: boolean | null;
  show_onboarding_form?: boolean | null;
  intake_sections?: string[] | null;
  visible_menus?: string[] | null;
  created_at: string;
  updated_at: string;
}

export function useMyClient() {
  const { user, isLoading: authLoading } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setClient(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setClient((data as Client) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { client, loading: loading || authLoading };
}
