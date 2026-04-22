import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Partner {
  id: string;
  user_id: string | null;
  email: string;
  company_name: string;
  contact_person: string;
  phone: string | null;
  website: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  iban: string | null;
  bank_name: string | null;
  address_street: string | null;
  address_city: string | null;
  address_postal: string | null;
  address_country: string | null;
  status: "pending" | "approved" | "suspended" | "rejected";
  tier: "bronze" | "silver" | "gold";
  referral_code: string;
  discount_code: string;
  total_revenue: number;
  total_commission: number;
  total_paid: number;
  pending_balance: number;
  available_balance: number;
  total_referrals: number;
  total_conversions: number;
  notes: string | null;
  agreed_terms_at: string | null;
  approved_at: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useMyPartner() {
  const { user, isLoading: authLoading } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setPartner(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setPartner((data as Partner) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { partner, loading: loading || authLoading };
}
