// One-time checkout for website orders.
// Supports: full payment, deposit (50%), final payment (50%).
// Uses dynamic price_data attached to the website_order product.

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
  amountCents: number;
  description: string;
  paymentType: "full" | "deposit" | "final" | "termination";
  orderId?: string;
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
    if (!body.amountCents || body.amountCents < 50) {
      throw new Error("Amount must be at least 50 cents");
    }
    if (!body.returnUrl || !body.environment) {
      throw new Error("Missing required fields");
    }

    const stripe = createStripeClient(body.environment);

    // Resolve the placeholder website_order product id so invoices show the right product
    const products = await stripe.products.list({ limit: 100 });
    const websiteProduct = products.data.find((p) => p.metadata?.lovable_external_id === "website_order");

    const metadata: Record<string, string> = {
      payment_type: body.paymentType,
    };
    if (body.orderId) metadata.order_id = body.orderId;
    if (body.userId) metadata.user_id = body.userId;
    if (body.clientId) metadata.client_id = body.clientId;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: body.amountCents,
            ...(websiteProduct
              ? { product: websiteProduct.id }
              : {
                  product_data: {
                    name: body.description,
                    tax_code: TAX_CODES.professional_services,
                  },
                }),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      ui_mode: "embedded",
      return_url: body.returnUrl,
      ...(body.customerEmail && { customer_email: body.customerEmail }),
      ...SHARED_TAX_OPTIONS,
      payment_intent_data: { metadata },
      metadata,
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
