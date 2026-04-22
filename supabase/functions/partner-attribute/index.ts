import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CommissionItem {
  product_type: "website_package" | "marketing_service" | "shop_product" | "addon" | "cms_hosting" | "other";
  product_name: string;
  product_id?: string | null;
  sale_amount: number;
  is_recurring?: boolean;
  recurring_months?: number | null;
}

interface AttributePayload {
  referral_code: string;
  order_id?: string | null;
  shopify_order_id?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  conversion_source?: "link" | "code" | "manual";
  items: CommissionItem[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const payload: AttributePayload = await req.json();
    if (!payload.referral_code || !Array.isArray(payload.items) || payload.items.length === 0) {
      return json({ error: "referral_code en items vereist" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Lookup partner by referral OR discount code
    const { data: partner } = await admin
      .from("partners")
      .select("id, status, tier")
      .or(`referral_code.eq.${payload.referral_code},discount_code.eq.${payload.referral_code}`)
      .maybeSingle();

    if (!partner) return json({ ok: false, reason: "partner_not_found" });
    if (partner.status !== "approved") return json({ ok: false, reason: "partner_not_approved" });

    // Lookup tier commission percentages
    const { data: tier } = await admin
      .from("partner_tiers")
      .select("commission_website, commission_marketing, commission_shop, commission_addon")
      .eq("tier", partner.tier)
      .maybeSingle();

    if (!tier) return json({ ok: false, reason: "tier_not_found" });

    const pctFor = (type: string): number => {
      switch (type) {
        case "website_package": return Number(tier.commission_website);
        case "marketing_service": return Number(tier.commission_marketing);
        case "shop_product": return Number(tier.commission_shop);
        case "addon":
        case "cms_hosting":
        case "other":
        default: return Number(tier.commission_addon);
      }
    };

    const rows = payload.items
      .filter((i) => i.sale_amount > 0)
      .map((i) => {
        const pct = pctFor(i.product_type);
        const commission = Math.round(i.sale_amount * pct) / 100;
        return {
          partner_id: partner.id,
          order_id: payload.order_id || null,
          shopify_order_id: payload.shopify_order_id || null,
          customer_name: payload.customer_name || null,
          customer_email: payload.customer_email || null,
          product_type: i.product_type,
          product_name: i.product_name,
          product_id: i.product_id || null,
          sale_amount: i.sale_amount,
          commission_percentage: pct,
          commission_amount: commission,
          is_recurring: !!i.is_recurring,
          recurring_months: i.recurring_months || null,
          conversion_source: payload.conversion_source || "link",
          status: "pending" as const,
        };
      });

    if (rows.length === 0) return json({ ok: false, reason: "no_billable_items" });

    const { error: insErr } = await admin.from("partner_commissions").insert(rows);
    if (insErr) throw insErr;

    // Mark referral as converted (best-effort, take latest unconverted)
    if (payload.order_id) {
      await admin
        .from("partner_referrals")
        .update({ converted: true, converted_at: new Date().toISOString(), converted_order_id: payload.order_id })
        .eq("partner_id", partner.id)
        .eq("referral_code", payload.referral_code)
        .eq("converted", false);
    }

    return json({ ok: true, partner_id: partner.id, commissions: rows.length });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
