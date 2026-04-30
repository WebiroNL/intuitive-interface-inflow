import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Niet ingelogd" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Niet ingelogd" }, 401);

    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Geen rechten" }, 403);

    const { client_id, redirect_to } = await req.json();
    if (!client_id) return json({ error: "client_id ontbreekt" }, 400);

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: client, error: clientErr } = await admin
      .from("clients")
      .select("id, user_id, email, company_name")
      .eq("id", client_id)
      .maybeSingle();

    if (clientErr || !client) return json({ error: "Klant niet gevonden" }, 404);
    if (!client.user_id) return json({ error: "Klant heeft geen gekoppeld account" }, 400);

    // Haal email van de auth user (kan afwijken van clients.email)
    const { data: authUser, error: authErr } = await admin.auth.admin.getUserById(client.user_id);
    if (authErr || !authUser.user?.email) {
      return json({ error: "Auth-gebruiker niet gevonden" }, 404);
    }

    const email = authUser.user.email;

    // Genereer magic link
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: redirect_to || `${new URL(req.url).origin.replace("supabase.co", "lovable.app")}/dashboard`,
      },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      return json({ error: linkErr?.message ?? "Link genereren mislukt" }, 500);
    }

    return json({
      success: true,
      action_link: linkData.properties.action_link,
      email,
      company_name: client.company_name,
    });
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
