import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/hooks/useClient";

export interface MonthlyData {
  id: string;
  client_id: string;
  year: number;
  month: number;
  // Per-platform basics
  google_spend: number; google_clicks: number; google_conversions: number; google_ctr: number; google_cpc: number;
  meta_spend: number; meta_clicks: number; meta_conversions: number; meta_ctr: number; meta_cpc: number;
  tiktok_spend: number; tiktok_clicks: number; tiktok_conversions: number; tiktok_ctr: number; tiktok_cpc: number;
  // Extended per-platform (Novelle-style)
  google_impressions: number; google_reach: number; google_frequency: number;
  google_link_clicks: number; google_lpv: number; google_cpm: number;
  meta_impressions: number; meta_reach: number; meta_frequency: number;
  meta_link_clicks: number; meta_lpv: number; meta_cpm: number;
  tiktok_impressions: number; tiktok_reach: number; tiktok_frequency: number;
  tiktok_link_clicks: number; tiktok_lpv: number; tiktok_cpm: number;
  // Aggregate
  total_leads: number; cpa: number; roas: number; webiro_fee: number;
  insights: string | null;
  // Social growth
  instagram_growth: number;
  facebook_growth: number;
  // Benchmarks
  benchmark_lpv_cost: number;
  benchmark_ctr: number;
  // Bullet content (jsonb arrays of strings)
  summary_bullets: string[];
  recommendation_bullets: string[];
  // AI-generated narrative copy
  ai_reach_text: string | null;
  ai_benchmark_text: string | null;
  ai_plain_language: { title: string; text: string }[];
}

const normalize = (raw: any): MonthlyData | null => {
  if (!raw) return null;
  return {
    ...raw,
    summary_bullets: Array.isArray(raw.summary_bullets) ? raw.summary_bullets : [],
    recommendation_bullets: Array.isArray(raw.recommendation_bullets) ? raw.recommendation_bullets : [],
    ai_plain_language: Array.isArray(raw.ai_plain_language) ? raw.ai_plain_language : [],
    ai_reach_text: raw.ai_reach_text ?? null,
    ai_benchmark_text: raw.ai_benchmark_text ?? null,
  } as MonthlyData;
};

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
        setCurrent(normalize(cur));
        setPrevious(normalize(prev));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
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
        setData(((data ?? []) as any[]).map((r) => normalize(r)!) ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
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

/** Sum a numeric field across all 3 platforms */
export function sumPlatform(d: MonthlyData | null, suffix: string): number {
  if (!d) return 0;
  return Number((d as any)[`google_${suffix}`] ?? 0) +
         Number((d as any)[`meta_${suffix}`] ?? 0) +
         Number((d as any)[`tiktok_${suffix}`] ?? 0);
}

/** Weighted average for rate metrics like CTR / frequency, weighted by impressions */
export function weightedRate(d: MonthlyData | null, rateSuffix: string): number {
  if (!d) return 0;
  const platforms = ["google", "meta", "tiktok"] as const;
  let num = 0, den = 0;
  for (const p of platforms) {
    const imp = Number((d as any)[`${p}_impressions`] ?? 0);
    const rate = Number((d as any)[`${p}_${rateSuffix}`] ?? 0);
    num += imp * rate;
    den += imp;
  }
  return den > 0 ? num / den : 0;
}

export function pctChange(curr: number, prev: number): number | null {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}

export function fmtEUR(v: number, decimals = 0): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}

export function fmtNum(v: number, decimals = 0): string {
  return new Intl.NumberFormat("nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}
