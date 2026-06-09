export interface MinimalOnboardingRow {
  email?: string | null;
  company_name?: string | null;
  submitted_at?: string | null;
  created_at?: string | null;
}

/** Compute the group key used to merge onboarding rows belonging to the same submission. */
export function onboardingGroupKey(r: MinimalOnboardingRow): string {
  const ts = r.submitted_at ?? r.created_at ?? "";
  const bucket = ts ? new Date(ts).toISOString().slice(0, 15) : "";
  return `${(r.email || "").toLowerCase()}|${r.company_name || ""}|${bucket}`;
}

export const ONBOARDING_SEEN_KEYS_LS = "admin_onboarding_seen_keys";

export function loadSeenOnboardingKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(ONBOARDING_SEEN_KEYS_LS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveSeenOnboardingKeys(set: Set<string>) {
  localStorage.setItem(ONBOARDING_SEEN_KEYS_LS, JSON.stringify(Array.from(set)));
  window.dispatchEvent(new Event("storage"));
}
