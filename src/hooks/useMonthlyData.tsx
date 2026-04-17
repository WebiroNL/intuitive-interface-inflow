import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/hooks/useClient";

export interface MonthlyData {
  id: string;
  client_id: string;
  year: number;
  month: number;
  google_spend: number;
  google_clicks: number;
  google_conversions: number;
  google_ctr: number;
  google_cpc: number;
  meta_spend: number;
  meta_clicks: number;
  meta_conversions: number;
  meta_ctr: number;
  meta_cpc: number;
  tiktok_spend: number;
  tiktok_clicks: number;
  tiktok_conversions: number;
  tiktok_ctr: number;
  tiktok_cpc: number;
  total_leads: number;
  cpa: number;
  roas: number;
  webiro_fee: number;
  insights: string | null;
}

export function useMonthlyData(client: Client, year: number, month: number) {
  const [current, setCurrent] = useState<MonthlyData | null>(null);
  const [previous, setPrevious] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;

      const [{ data: cur }, { data: prev }] = await Promise.all([
        supabase.from("monthly_data").select("*").eq("client_id", client.id).eq("year", year).eq("month", month).maybeSingle(),
        supabase.from("monthly_data").select("*").eq("client_id", client.id).eq("year", prevYear).eq("month", prevMonth).maybeSingle(),
      ]);

      if (!cancelled) {
        setCurrent((cur as MonthlyData) ?? null);
        setPrevious((prev as MonthlyData) ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client.id, year, month]);

  return { current, previous, loading };
}

export function useAllMonthlyData(clientId: string) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("monthly_data")
        .select("*")
        .eq("client_id", clientId)
        .order("year", { ascending: true })
        .order("month", { ascending: true });
      if (!cancelled) {
        setData((data as MonthlyData[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return { data, loading };
}

export function totalSpend(d: MonthlyData | null): number {
  if (!d) return 0;
  return Number(d.google_spend ?? 0) + Number(d.meta_spend ?? 0) + Number(d.tiktok_spend ?? 0);
}

export function totalPaid(d: MonthlyData | null): number {
  if (!d) return 0;
  return totalSpend(d) + Number(d.webiro_fee ?? 0);
}

export function pctChange(curr: number, prev: number): number | null {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}

export function fmtEUR(v: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

export function fmtNum(v: number, decimals = 0): string {
  return new Intl.NumberFormat("nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}
