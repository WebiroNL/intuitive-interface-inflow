/**
 * Centrale mapping van interne configurator IDs naar Stripe price IDs.
 * Contract duur bepaalt of `_monthly`, `_yearly` of `_2year` suffix wordt gebruikt.
 */

import type { ContractDuration } from "@/components/pakketten/types";

const CONTRACT_SUFFIX: Record<ContractDuration, string> = {
  maandelijks: "monthly",
  jaarlijks: "yearly",
  "2jaar": "2year",
};

/** CMS hosting tiers naar Stripe product base id */
const CMS_PRODUCT_MAP: Record<string, string> = {
  basic: "cms_basic",
  pro: "cms_pro",
};

/** Add-ons (recurring widgets, marketing, care) naar Stripe product base id */
const ADDON_PRODUCT_MAP: Record<string, string> = {
  "webiro-care": "webiro_care",
  "booking-widget": "booking_widget",
  "ai-livechat": "ai_livechat",
};

/** Marketing services naar Stripe product base id */
const MARKETING_PRODUCT_MAP: Record<string, { product: string; setup?: string }> = {
  "google-ads": { product: "google_ads_mgmt" },
  "meta-ads": { product: "meta_ads_mgmt" },
  "tiktok-ads": { product: "tiktok_ads_mgmt" },
  "email-automation": { product: "email_automation", setup: "email_automation_setup" },
  "whatsapp-automation": { product: "whatsapp_automation", setup: "whatsapp_automation_setup" },
  "ai-chatbot": { product: "ai_chatbot", setup: "ai_chatbot_setup" },
  "lead-bot": { product: "lead_bot", setup: "lead_bot_setup" },
};

export function getCmsPriceId(cmsId: string, duration: ContractDuration): string | null {
  const base = CMS_PRODUCT_MAP[cmsId];
  if (!base) return null;
  return `${base}_${CONTRACT_SUFFIX[duration]}`;
}

export function getAddonPriceId(addonId: string, duration: ContractDuration): string | null {
  const base = ADDON_PRODUCT_MAP[addonId];
  if (!base) return null;
  return `${base}_${CONTRACT_SUFFIX[duration]}`;
}

export function getMarketingPriceIds(serviceId: string, duration: ContractDuration): { priceId: string; setupPriceId?: string } | null {
  const m = MARKETING_PRODUCT_MAP[serviceId];
  if (!m) return null;
  return {
    priceId: `${m.product}_${CONTRACT_SUFFIX[duration]}`,
    setupPriceId: m.setup,
  };
}

/** True als een product alleen op aanvraag/maatwerk is (geen Stripe price). */
export function isQuoteOnlyProduct(productId: string): boolean {
  return ["business", "shop", "enterprise", "advertentie-management"].includes(productId);
}
