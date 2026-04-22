import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { referral_code, landing_page, referrer, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!referral_code) return json({ error: "Geen code" }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: partner } = await admin
      .from("partners")
      .select("id, status")
      .or(`referral_code.eq.${referral_code},discount_code.eq.${referral_code}`)
      .maybeSingle();

    if (!partner || partner.status !== "approved") {
      return json({ valid: false });
    }

    const ip = req.headers.get("x-forwarded-for") || "";
    const ipHash = ip ? await hashString(ip) : null;
    const userAgent = req.headers.get("user-agent") || "";

    await admin.from("partner_referrals").insert({
      partner_id: partner.id,
      referral_code,
      ip_hash: ipHash,
      user_agent: userAgent,
      landing_page,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
    });

    return json({ valid: true, partner_id: partner.id });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

async function hashString(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
