// Maakt Stripe product + price + 50% coupon (3 mnd repeating) en een
// subscription checkout met trial_end = contract_start_date.
// Klant betaalt nu €0 via iDEAL → SEPA mandaat. Eerste afschrijving start op contract_start_date.
// Na 3 maanden vervalt coupon → automatisch €500/mnd.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  createStripeClient,
  SHARED_TAX_OPTIONS,
  TAX_CODES,
  type StripeEnv,
} from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Body {
  clientId: string;
  serviceLabel: string;        // bv "3 maanden Google Ads"
  monthlyAmountCents: number;  // bv 50000 voor €500
  discountPercent?: number;    // bv 50
  discountMonths?: number;     // bv 3
  contractMonths: number;      // totale looptijd, bv 3
  contractStartDate: string;   // ISO date "2026-05-05"
  cancelAtEnd?: boolean;       // false = doorlopen na contract; true = stoppen
  environment?: StripeEnv;     // default 'live'
  returnUrl: string;           // succes pagina
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Auth: alleen admins
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) throw new Error("Unauthorized");
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    const body: Body = await req.json();
    if (!body.clientId || !body.serviceLabel || !body.monthlyAmountCents || !body.contractStartDate || !body.returnUrl) {
      throw new Error("Missing required fields");
    }
    const env: StripeEnv = body.environment ?? "live";

    // Klant ophalen
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("id, company_name, email, contact_person, first_name, last_name, btw_number, address_country")
      .eq("id", body.clientId)
      .single();
    if (clientErr || !client) throw new Error("Client niet gevonden");
    if (!client.email) throw new Error("Klant heeft geen e-mailadres");

    const stripe = createStripeClient(env);

    // 1. Customer (zoek of maak)
    let customerId: string;
    const existing = await stripe.customers.list({ email: client.email, limit: 1 });
    if (existing.data.length) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.company_name,
        metadata: { client_id: client.id },
      });
      customerId = customer.id;
    }

    // 2. Product (idempotent per client+service)
    const productLookup = `client_${client.id}_${body.serviceLabel.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase()}`.slice(0, 60);
    const products = await stripe.products.search({ query: `metadata['lookup']:'${productLookup}'`, limit: 1 });
    let productId: string;
    if (products.data.length) {
      productId = products.data[0].id;
    } else {
      const product = await stripe.products.create({
        name: `${client.company_name} — ${body.serviceLabel}`,
        tax_code: TAX_CODES.saas,
        metadata: { lookup: productLookup, client_id: client.id, lovable_external_id: productLookup },
      });
      productId = product.id;
    }

    // 3. Price (€X/mnd) — altijd exclusive BTW (v2 lookup om oude inclusive prices te omzeilen)
    const priceLookup = `${productLookup}_monthly_${body.monthlyAmountCents}_excl_v2`;
    let priceId: string;
    const existingPrices = await stripe.prices.list({ product: productId, lookup_keys: [priceLookup], limit: 1 });
    if (existingPrices.data.length && existingPrices.data[0].tax_behavior === "exclusive") {
      priceId = existingPrices.data[0].id;
    } else {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: body.monthlyAmountCents,
        currency: "eur",
        recurring: { interval: "month" },
        tax_behavior: "exclusive",
        lookup_key: priceLookup,
        transfer_lookup_key: true,
        metadata: { lovable_external_id: priceLookup },
      });
      priceId = price.id;
    }

    // 4. Coupon (50% off, 3 mnd repeating) — optioneel
    let couponId: string | undefined;
    if (body.discountPercent && body.discountMonths) {
      const couponLookup = `disc_${body.discountPercent}_${body.discountMonths}m`;
      const existingCoupons = await stripe.coupons.list({ limit: 100 });
      const found = existingCoupons.data.find((c) => c.metadata?.lookup === couponLookup);
      if (found) {
        couponId = found.id;
      } else {
        const coupon = await stripe.coupons.create({
          percent_off: body.discountPercent,
          duration: "repeating",
          duration_in_months: body.discountMonths,
          name: `${body.discountPercent}% korting ${body.discountMonths} mnd`,
          metadata: { lookup: couponLookup },
        });
        couponId = coupon.id;
      }
    }

    // 5. Bereken trial_end (= contract_start) en cancel_at (= einde contract)
    const startTs = Math.floor(new Date(body.contractStartDate).getTime() / 1000);
    const endDate = new Date(body.contractStartDate);
    endDate.setMonth(endDate.getMonth() + body.contractMonths);
    const cancelAtTs = Math.floor(endDate.getTime() / 1000);

    // GEEN trial: klant betaalt nu direct de eerste maand (vandaag → +1 maand).
    // Stripe zet billing_cycle_anchor automatisch op vandaag, dus elke volgende
    // maand wordt op dezelfde dag-of-month automatisch afgeschreven via SEPA.

    // 6. Subscription checkout — hosted, want we sturen link per mail
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ["ideal", "sepa_debit", "card"],
      payment_method_collection: "always",
      ...SHARED_TAX_OPTIONS,
      ...(couponId && { discounts: [{ coupon: couponId }] }),
      subscription_data: {
        ...(body.cancelAtEnd && { cancel_at: cancelAtTs }),
        metadata: {
          client_id: client.id,
          service_label: body.serviceLabel,
          contract_start: body.contractStartDate,
          contract_months: String(body.contractMonths),
          ...(couponId && { coupon_id: couponId }),
        },
      },
      success_url: body.returnUrl + "?status=success",
      cancel_url: body.returnUrl + "?status=cancel",
      metadata: { client_id: client.id, service_label: body.serviceLabel },
    });

    return new Response(
      JSON.stringify({
        url: session.url,
        sessionId: session.id,
        customerId,
        productId,
        priceId,
        couponId,
        contractStartDate: body.contractStartDate,
        contractEndDate: endDate.toISOString().slice(0, 10),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-client-subscription error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
