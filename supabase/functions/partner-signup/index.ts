import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      email,
      password,
      company_name,
      contact_person,
      phone,
      website,
      kvk_number,
      btw_number,
      iban,
      bank_name,
      address_street,
      address_city,
      address_postal,
      address_country,
      agreed_terms,
    } = body;

    if (!email || !password || !company_name || !contact_person) {
      return json({ error: "Verplichte velden ontbreken" }, 400);
    }
    if (password.length < 8) return json({ error: "Wachtwoord min. 8 tekens" }, 400);
    if (!agreed_terms) return json({ error: "Akkoord met voorwaarden vereist" }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if email already used as partner
    const { data: existingPartner } = await admin
      .from("partners")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (existingPartner) return json({ error: "Dit e-mailadres is al geregistreerd als partner" }, 400);

    // Create or find auth user
    let userId: string | null = null;
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = existing?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (found) {
      userId = found.id;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: contact_person, role: "partner" },
      });
      if (createErr || !created.user) return json({ error: createErr?.message ?? "Aanmaken mislukt" }, 400);
      userId = created.user.id;
    }

    // Generate codes
    const { data: refCode } = await admin.rpc("generate_partner_code", { prefix: "REF" });
    const { data: discCode } = await admin.rpc("generate_partner_code", { prefix: "PART" });

    // Insert partner
    const { data: partner, error: insertErr } = await admin
      .from("partners")
      .insert({
        user_id: userId,
        email: email.toLowerCase(),
        company_name,
        contact_person,
        phone,
        website,
        kvk_number,
        btw_number,
        iban,
        bank_name,
        address_street,
        address_city,
        address_postal,
        address_country: address_country || "NL",
        status: "pending",
        tier: "bronze",
        referral_code: refCode,
        discount_code: discCode,
        agreed_terms_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) return json({ error: insertErr.message }, 400);

    return json({ success: true, partner });
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
