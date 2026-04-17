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

    // Verify caller is admin
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

    const { client_id, email, password } = await req.json();
    if (!client_id || !email || !password || password.length < 8) {
      return json({ error: "Ongeldige invoer (wachtwoord min. 8 tekens)" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Try to find existing user by email
    let userId: string | null = null;
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = existing?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (found) {
      userId = found.id;
      // Update password
      await admin.auth.admin.updateUserById(found.id, { password });
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr || !created.user) return json({ error: createErr?.message ?? "Aanmaken mislukt" }, 400);
      userId = created.user.id;
    }

    // Link to client
    const { error: linkErr } = await admin
      .from("clients")
      .update({ user_id: userId, email })
      .eq("id", client_id);
    if (linkErr) return json({ error: linkErr.message }, 400);

    return json({ success: true, user_id: userId, created: !found });
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
