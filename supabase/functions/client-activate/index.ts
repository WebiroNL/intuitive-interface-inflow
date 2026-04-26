import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PHONE_ALIAS_DOMAIN = "phone.webiro.local";

function normalizePhone(input: string): string {
  // Houd alleen + en cijfers, verwijder spaties en streepjes
  let p = input.trim().replace(/[\s\-().]/g, "");
  if (!p) return "";
  // Nederlandse defaults: 06... → +316...
  if (p.startsWith("00")) p = "+" + p.slice(2);
  else if (p.startsWith("0")) p = "+31" + p.slice(1);
  else if (!p.startsWith("+")) p = "+" + p;
  return p;
}

function phoneToAlias(phone: string): string {
  const digits = normalizePhone(phone).replace(/\+/g, "");
  return `${digits}@${PHONE_ALIAS_DOMAIN}`;
}

function isStrongPassword(p: string): boolean {
  if (typeof p !== "string" || p.length < 10) return false;
  const hasLower = /[a-z]/.test(p);
  const hasUpper = /[A-Z]/.test(p);
  const hasDigit = /[0-9]/.test(p);
  return hasLower && hasUpper && hasDigit;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "Ongeldig verzoek" }, 400);

    const action = (body as any).action as string;

    // ---------- LOOKUP: token check + ontbrekende velden teruggeven ----------
    if (action === "lookup") {
      const token = String((body as any).token ?? "").trim();
      if (!token) return json({ error: "Token ontbreekt" }, 400);

      const { data: client, error } = await admin
        .from("clients")
        .select("id, company_name, email, phone, first_name, last_name, contact_person, kvk_number, btw_number, address_street, address_postal, address_city, address_country, activation_expires_at, activated_at")
        .eq("activation_token", token)
        .maybeSingle();

      if (error || !client) return json({ error: "Ongeldige of verlopen link" }, 404);
      if (client.activated_at) return json({ error: "Dit account is al geactiveerd. Log in." }, 410);
      if (client.activation_expires_at && new Date(client.activation_expires_at) < new Date()) {
        return json({ error: "Deze activatielink is verlopen" }, 410);
      }

      return json({ client });
    }

    // ---------- ACTIVATE: account aanmaken + klantgegevens aanvullen ----------
    if (action === "activate") {
      const token = String((body as any).token ?? "").trim();
      const password = String((body as any).password ?? "");
      const fields = (body as any).fields ?? {};

      if (!token) return json({ error: "Token ontbreekt" }, 400);
      if (!isStrongPassword(password)) {
        return json({ error: "Wachtwoord vereist min. 10 tekens, hoofdletter, kleine letter en cijfer" }, 400);
      }

      const { data: client, error: cErr } = await admin
        .from("clients")
        .select("*")
        .eq("activation_token", token)
        .maybeSingle();

      if (cErr || !client) return json({ error: "Ongeldige link" }, 404);
      if (client.activated_at) return json({ error: "Al geactiveerd" }, 410);
      if (client.activation_expires_at && new Date(client.activation_expires_at) < new Date()) {
        return json({ error: "Link is verlopen" }, 410);
      }

      // Combineer klant-data met door klant ingevulde velden (fallback voor admin)
      const merged = {
        company_name: client.company_name || String(fields.company_name ?? "").trim(),
        email: (client.email && client.email.trim()) || String(fields.email ?? "").trim().toLowerCase() || null,
        phone: (client.phone && client.phone.trim()) || String(fields.phone ?? "").trim() || null,
        first_name: client.first_name || String(fields.first_name ?? "").trim() || null,
        last_name: client.last_name || String(fields.last_name ?? "").trim() || null,
        kvk_number: client.kvk_number || String(fields.kvk_number ?? "").trim() || null,
        btw_number: client.btw_number || String(fields.btw_number ?? "").trim() || null,
        address_street: client.address_street || String(fields.address_street ?? "").trim() || null,
        address_postal: client.address_postal || String(fields.address_postal ?? "").trim() || null,
        address_city: client.address_city || String(fields.address_city ?? "").trim() || null,
        address_country: client.address_country || String(fields.address_country ?? "").trim() || "NL",
      };

      // Verplichte velden
      if (!merged.company_name) return json({ error: "Bedrijfsnaam is verplicht" }, 400);
      if (!merged.first_name) return json({ error: "Voornaam is verplicht" }, 400);
      if (!merged.last_name) return json({ error: "Achternaam is verplicht" }, 400);
      if (!merged.kvk_number) return json({ error: "KVK nummer is verplicht" }, 400);
      if (!merged.email && !merged.phone) {
        return json({ error: "Vul ten minste e-mail of telefoon in" }, 400);
      }

      // Bepaal login identifier voor Supabase Auth (e-mail of telefoon-alias)
      const normalizedPhone = merged.phone ? normalizePhone(merged.phone) : "";
      const authEmail = merged.email
        ? merged.email
        : normalizedPhone
          ? phoneToAlias(normalizedPhone)
          : null;

      if (!authEmail) return json({ error: "Geen geldige login gegeven" }, 400);

      // Maak of werk auth user bij
      const { data: existingUsers } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = existingUsers?.users.find(
        (u) => u.email?.toLowerCase() === authEmail.toLowerCase()
      );

      let userId: string;
      if (found) {
        userId = found.id;
        const { error: updErr } = await admin.auth.admin.updateUserById(found.id, { password });
        if (updErr) return json({ error: updErr.message }, 400);
      } else {
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email: authEmail,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: `${merged.first_name} ${merged.last_name}`.trim(),
            login_method: merged.email ? "email" : "phone",
            phone_login_alias: !merged.email,
          },
        });
        if (createErr || !created.user) return json({ error: createErr?.message ?? "Aanmaken mislukt" }, 400);
        userId = created.user.id;
      }

      // Update klant: activation tokens leegmaken, gegevens invullen, koppelen aan user
      const { error: linkErr } = await admin
        .from("clients")
        .update({
          ...merged,
          phone: normalizedPhone || null,
          contact_person: client.contact_person || `${merged.first_name} ${merged.last_name}`.trim(),
          user_id: userId,
          activation_token: null,
          activation_expires_at: null,
          activated_at: new Date().toISOString(),
        })
        .eq("id", client.id);

      if (linkErr) return json({ error: linkErr.message }, 400);

      return json({
        success: true,
        login_email: authEmail,
        login_method: merged.email ? "email" : "phone",
      });
    }

    // ---------- RESOLVE LOGIN: vertaal telefoon → alias ----------
    if (action === "resolve_login") {
      const identifier = String((body as any).identifier ?? "").trim();
      if (!identifier) return json({ error: "Identifier ontbreekt" }, 400);

      // Als het een e-mail is, gewoon teruggeven
      if (identifier.includes("@")) {
        return json({ login_email: identifier.toLowerCase() });
      }

      // Anders: behandel als telefoon
      const normalized = normalizePhone(identifier);
      if (!normalized.startsWith("+") || normalized.length < 7) {
        return json({ error: "Ongeldig telefoonnummer of e-mailadres" }, 400);
      }

      // Zoek klant met dit telefoonnummer voor betere foutmelding
      const { data: clientRow } = await admin
        .from("clients")
        .select("email, user_id")
        .eq("phone", normalized)
        .maybeSingle();

      // Als deze klant met e-mail is geregistreerd, gebruik die
      if (clientRow?.email && clientRow.user_id) {
        return json({ login_email: clientRow.email.toLowerCase() });
      }

      return json({ login_email: phoneToAlias(normalized) });
    }

    return json({ error: "Onbekende actie" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
