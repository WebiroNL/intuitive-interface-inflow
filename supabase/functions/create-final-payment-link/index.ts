// Admin function: generate Stripe checkout session for the final 50% after delivery.
// Called from admin dashboard when marking an order as delivered.

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

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, environment, baseUrl } = await req.json();
    if (!orderId || !environment) throw new Error("Missing fields");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    if (orderError || !order) throw new Error("Order niet gevonden");

    if (order.payment_mode !== "50_50") {
      throw new Error("Order is niet 50/50 betaalmodus");
    }
    if (order.final_paid_at) throw new Error("Eindbetaling al voldaan");

    // 50% of subtotal (ex BTW, Stripe adds BTW automatically)
    const finalAmountCents = Math.round((Number(order.subtotaal) / 2) * 100);

    const stripe = createStripeClient(environment as StripeEnv);
    const products = await stripe.products.list({ limit: 100 });
    const websiteProduct = products.data.find(
      (p) => p.metadata?.lovable_external_id === "website_order",
    );

    const metadata = {
      order_id: orderId,
      payment_type: "final",
      user_id: order.user_id || "",
      client_id: order.client_id || "",
    };

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: finalAmountCents,
          ...(websiteProduct
            ? { product: websiteProduct.id }
            : { product_data: { name: `Eindbetaling ${order.order_number}`, tax_code: TAX_CODES.professional_services } }),
        },
        quantity: 1,
      }],
      mode: "payment",
      ui_mode: "hosted",
      success_url: `${baseUrl || ""}/portaal/betalingen?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl || ""}/portaal/betalingen`,
      ...(order.email && { customer_email: order.email }),
      ...SHARED_TAX_OPTIONS,
      payment_intent_data: { metadata },
      metadata,
    });

    // Save payment link
    await supabase.from("payment_links").insert({
      order_id: orderId,
      client_id: order.client_id,
      stripe_session_id: session.id,
      stripe_payment_link_url: session.url,
      amount_cents: finalAmountCents,
      link_type: "final_payment",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      environment,
      metadata,
    });

    // Mark order as delivered
    await supabase.from("orders").update({
      delivery_status: "opgeleverd",
      delivered_at: new Date().toISOString(),
    }).eq("id", orderId);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-final-payment-link error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
