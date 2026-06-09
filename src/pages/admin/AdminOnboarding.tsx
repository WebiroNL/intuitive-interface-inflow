import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkSquare02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface OnboardingRow {
  id: string;
  client_id: string | null;
  company_name: string;
  contact_person: string;
  email: string;
  service_type: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
}

const LAST_SEEN_KEY = "admin_onboarding_last_seen";

const serviceLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function AdminOnboarding() {
  const [rows, setRows] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState<string>(() => localStorage.getItem(LAST_SEEN_KEY) || "");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("service_onboardings")
        .select("id, client_id, company_name, contact_person, email, service_type, status, submitted_at, created_at")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setRows((data as any) ?? []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const newestTs = useMemo(() => {
    return rows.reduce((acc, r) => {
      const t = r.submitted_at ?? r.created_at;
      return t && t > acc ? t : acc;
    }, "");
  }, [rows]);

  const markAllSeen = () => {
    if (!newestTs) return;
    localStorage.setItem(LAST_SEEN_KEY, newestTs);
    setLastSeen(newestTs);
    window.dispatchEvent(new Event("storage"));
  };

  const isNew = (r: OnboardingRow) => {
    const t = r.submitted_at ?? r.created_at;
    return !lastSeen || (t && t > lastSeen);
  };

  const newCount = rows.filter(isNew).length;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">Onboarding aanvragen</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {newCount > 0 ? `${newCount} nieuwe aanvraag${newCount === 1 ? "" : "en"}` : "Geen nieuwe aanvragen"}
          </p>
        </div>
        {newCount > 0 && (
          <button
            onClick={markAllSeen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon icon={CheckmarkSquare02Icon} size={14} />
            Markeer alles als gezien
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-[13px] text-muted-foreground">
            Nog geen onboarding aanvragen.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((r) => {
              const fresh = isNew(r);
              const ts = r.submitted_at ?? r.created_at;
              return (
                <Link
                  key={r.id}
                  to={r.client_id ? `/admin/clients?open=${r.client_id}` : "/admin/clients"}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-foreground truncate">{r.company_name}</p>
                      {fresh && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide">
                          Nieuw
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {serviceLabel(r.service_type)}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                      {r.contact_person} · {r.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] text-muted-foreground tabular-nums">
                      {ts ? new Date(ts).toLocaleString("nl-NL", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground capitalize mt-0.5">{r.status}</p>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
