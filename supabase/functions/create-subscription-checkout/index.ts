// Subscription checkout — recurring plans with optional setup fee.
// Returns Stripe Embedded Checkout client_secret.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  createStripeClient,
  SHARED_TAX_OPTIONS,
  type StripeEnv,
} from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Body {
  priceId: string;
  setupPriceId?: string;
  contractDuration?: "monthly" | "yearly" | "2year";
  customerEmail?: string;
  userId?: string;
  clientId?: string;
  returnUrl: string;
  environment: StripeEnv;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: Body = await req.json();
    if (!body.priceId || !body.returnUrl || !body.environment) {
      throw new Error("Missing required fields");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(body.priceId)) throw new Error("Invalid priceId");

    const stripe = createStripeClient(body.environment);

    // Resolve recurring price by lookup_key
    const prices = await stripe.prices.list({ lookup_keys: [body.priceId] });
    if (!prices.data.length) throw new Error(`Price not found: ${body.priceId}`);
    const recurringPrice = prices.data[0];
    if (recurringPrice.type !== "recurring") {
      throw new Error("Selected price is not recurring");
    }

    // Optional setup fee
    let addInvoiceItems: Array<{ price: string; quantity: number }> | undefined;
    if (body.setupPriceId) {
      const setupPrices = await stripe.prices.list({ lookup_keys: [body.setupPriceId] });
      if (setupPrices.data.length && setupPrices.data[0].type === "one_time") {
        addInvoiceItems = [{ price: setupPrices.data[0].id, quantity: 1 }];
      }
    }

    // Calculate commitment end date based on contract duration
    const now = new Date();
    let commitmentEndDate: string | null = null;
    const duration = body.contractDuration || "monthly";
    if (duration === "yearly") {
      const d = new Date(now);
      d.setMonth(d.getMonth() + 12);
      commitmentEndDate = d.toISOString();
    } else if (duration === "2year") {
      const d = new Date(now);
      d.setMonth(d.getMonth() + 24);
      commitmentEndDate = d.toISOString();
    }

    const metadata: Record<string, string> = {
      contract_duration: duration,
      price_id: body.priceId,
    };
    if (body.userId) metadata.user_id = body.userId;
    if (body.clientId) metadata.client_id = body.clientId;
    if (commitmentEndDate) metadata.commitment_end_date = commitmentEndDate;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: recurringPrice.id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: body.returnUrl,
      ...(body.customerEmail && { customer_email: body.customerEmail }),
      ...SHARED_TAX_OPTIONS,
      metadata,
      subscription_data: {
        metadata,
        ...(addInvoiceItems && { add_invoice_items: addInvoiceItems }),
      },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-subscription-checkout error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
