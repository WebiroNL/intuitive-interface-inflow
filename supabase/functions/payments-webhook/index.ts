// Stripe webhook handler.
// - subscription created/updated/deleted -> sync subscriptions table
// - checkout.session.completed (mode=payment) -> create payment row, mark order deposit/final paid
// - invoice.paid -> log recurring payment

import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function db() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function handleSubscriptionUpsert(sub: any, env: StripeEnv) {
  const md = sub.metadata || {};
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? sub.current_period_start;
  const periodEnd = item?.current_period_end ?? sub.current_period_end;

  await db().from("subscriptions").upsert(
    {
      user_id: md.user_id || null,
      client_id: md.client_id || null,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer,
      product_id: productId,
      price_id: priceId,
      contract_duration: md.contract_duration || "monthly",
      status: sub.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      commitment_end_date: md.commitment_end_date || null,
      cancel_at_period_end: sub.cancel_at_period_end || false,
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
      environment: env,
      metadata: md,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
}

async function handleSubscriptionDeleted(sub: any, env: StripeEnv) {
  await db().from("subscriptions").update({
    status: "canceled",
    canceled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("stripe_subscription_id", sub.id).eq("environment", env);
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  // Only handle payment-mode sessions here (subscription handled via subscription.* events)
  if (session.mode !== "payment") return;

  const md = session.metadata || {};
  const amountTotal = session.amount_total || 0;
  const amountSubtotal = session.amount_subtotal || amountTotal;
  const taxAmount = session.total_details?.amount_tax || 0;

  await db().from("payments").upsert(
    {
      user_id: md.user_id || null,
      client_id: md.client_id || null,
      order_id: md.order_id || null,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent || null,
      amount_cents: amountSubtotal,
      tax_cents: taxAmount,
      total_cents: amountTotal,
      currency: session.currency || "eur",
      status: "completed",
      payment_type: md.payment_type || "full",
      description: session.metadata?.description || null,
      environment: env,
      metadata: md,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );

  // Update order delivery flags
  if (md.order_id) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (md.payment_type === "deposit") {
      updateData.deposit_paid_at = new Date().toISOString();
      updateData.status = "in_productie";
    } else if (md.payment_type === "final") {
      updateData.final_paid_at = new Date().toISOString();
      updateData.status = "afgerond";
    } else if (md.payment_type === "full") {
      updateData.deposit_paid_at = new Date().toISOString();
      updateData.final_paid_at = new Date().toISOString();
      updateData.status = "in_productie";
    }
    await db().from("orders").update(updateData).eq("id", md.order_id);
  }
}

async function handleInvoicePaid(invoice: any, env: StripeEnv) {
  if (!invoice.subscription) return;
  const md = invoice.subscription_details?.metadata || {};
  const line = invoice.lines?.data?.[0];
  const periodStart = line?.period?.start ?? null;
  const periodEnd = line?.period?.end ?? null;
  await db().from("payments").insert({
    user_id: md.user_id || null,
    client_id: md.client_id || null,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: invoice.payment_intent || null,
    amount_cents: invoice.amount_paid - (invoice.tax || 0),
    tax_cents: invoice.tax || 0,
    total_cents: invoice.amount_paid,
    currency: invoice.currency || "eur",
    status: "completed",
    payment_type: "subscription",
    description: line?.description || "Abonnement",
    receipt_url: invoice.hosted_invoice_url || null,
    environment: env,
    metadata: {
      ...md,
      invoice_number: invoice.number || null,
      invoice_pdf: invoice.invoice_pdf || null,
      hosted_invoice_url: invoice.hosted_invoice_url || null,
      period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook invalid env:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;
  try {
    const event = await verifyWebhook(req, env);
    console.log("Webhook event:", event.type);
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, env);
        break;
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object, env);
        break;
      case "invoice.payment_failed": {
        const inv = event.data.object;
        const md = inv.subscription_details?.metadata || {};
        await db().from("payments").insert({
          user_id: md.user_id || null,
          client_id: md.client_id || null,
          stripe_invoice_id: inv.id,
          amount_cents: inv.amount_due ?? 0,
          tax_cents: inv.tax ?? 0,
          total_cents: inv.amount_due ?? 0,
          currency: inv.currency || "eur",
          status: "failed",
          payment_type: "subscription",
          description: `Betaling mislukt: ${inv.lines?.data?.[0]?.description || "Abonnement"}`,
          environment: env,
          metadata: md,
        });
        break;
      }
      default:
        console.log("Unhandled:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
