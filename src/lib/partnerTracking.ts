import { supabase } from "@/integrations/supabase/client";

const COOKIE_NAME = "webiro_partner_ref";
const COOKIE_DAYS = 30;

export function setPartnerCookie(code: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(code)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(COOKIE_NAME, code);
    localStorage.setItem(`${COOKIE_NAME}_expires`, expires.toISOString());
  } catch {}
}

export function getPartnerRef(): string | null {
  // Cookie first
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (match) return decodeURIComponent(match[1]);
  // localStorage fallback
  try {
    const code = localStorage.getItem(COOKIE_NAME);
    const expires = localStorage.getItem(`${COOKIE_NAME}_expires`);
    if (code && expires && new Date(expires) > new Date()) return code;
  } catch {}
  return null;
}

export function clearPartnerCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  try {
    localStorage.removeItem(COOKIE_NAME);
    localStorage.removeItem(`${COOKIE_NAME}_expires`);
  } catch {}
}

export async function captureReferralFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref") || params.get("partner");
  if (!ref) return;

  const existing = getPartnerRef();
  // Don't overwrite an active cookie unless URL has a different code
  if (existing === ref) return;

  setPartnerCookie(ref);
  try {
    await supabase.functions.invoke("partner-track", {
      body: {
        referral_code: ref,
        landing_page: window.location.pathname,
        referrer: document.referrer || null,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
      },
    });
  } catch (e) {
    console.warn("Partner tracking failed", e);
  }
}
