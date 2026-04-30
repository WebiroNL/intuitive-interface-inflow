// One-time admin utility: zet de juiste Stripe Tax codes op alle aangemaakte producten.
// Run via: supabase.functions.invoke("setup-tax-codes", { body: { environment: "sandbox" } })
// Idempotent — kan vaker uitgevoerd worden.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  createStripeClient,
  TAX_CODES,
  type StripeEnv,
} from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Map: lovable_external_id → tax code
const PRODUCT_TAX_MAP: Record<string, string> = {
  // SaaS / hosting / recurring tools
  cms_basic: TAX_CODES.saas,
  cms_pro: TAX_CODES.saas,
  webiro_care: TAX_CODES.saas,
  booking_widget: TAX_CODES.saas,
  ai_livechat: TAX_CODES.saas,
  google_ads_mgmt: TAX_CODES.professional_services,
  meta_ads_mgmt: TAX_CODES.professional_services,
  tiktok_ads_mgmt: TAX_CODES.professional_services,
  email_automation: TAX_CODES.saas,
  whatsapp_automation: TAX_CODES.saas,
  ai_chatbot: TAX_CODES.saas,
  lead_bot: TAX_CODES.saas,
  // Setup fees + website werk = professional services
  email_automation_setup: TAX_CODES.professional_services,
  whatsapp_automation_setup: TAX_CODES.professional_services,
  ai_chatbot_setup: TAX_CODES.professional_services,
  lead_bot_setup: TAX_CODES.professional_services,
  website_order: TAX_CODES.professional_services,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Admin check
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { environment } = await req.json();
    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("Invalid environment");
    }

    const stripe = createStripeClient(environment as StripeEnv);
    const products = await stripe.products.list({ limit: 100 });

    const results: { id: string; name: string; tax_code: string; updated: boolean }[] = [];

    for (const p of products.data) {
      const externalId = p.metadata?.lovable_external_id;
      if (!externalId) continue;
      const taxCode = PRODUCT_TAX_MAP[externalId];
      if (!taxCode) continue;
      // Skip als al correct
      if ((p as any).tax_code === taxCode) {
        results.push({ id: externalId, name: p.name, tax_code: taxCode, updated: false });
        continue;
      }
      await stripe.products.update(p.id, { tax_code: taxCode } as any);
      results.push({ id: externalId, name: p.name, tax_code: taxCode, updated: true });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("setup-tax-codes error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
