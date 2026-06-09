import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkSquare02Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface OnboardingRow {
  id: string;
  client_id: string | null;
  partner_id: string | null;
  submitted_by_user_id: string | null;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  website: string | null;
  service_type: string;
  status: string;
  admin_notes: string | null;
  data: Record<string, any>;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

const LAST_SEEN_KEY = "admin_onboarding_last_seen";

const serviceLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const humanizeKey = (k: string) =>
  k.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function renderValue(v: any): React.ReactNode {
  if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return v ? "Ja" : "Nee";
  if (Array.isArray(v)) {
    if (v.length === 0) return <span className="text-muted-foreground">—</span>;
    if (v.every((x) => typeof x !== "object" || x === null)) {
      return (
        <div className="flex flex-wrap gap-1">
          {v.map((x, i) => (
            <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-[12px] text-foreground">
              {String(x)}
            </span>
          ))}
        </div>
      );
    }
    return (
      <pre className="text-[12px] bg-muted/50 rounded p-2 overflow-auto whitespace-pre-wrap break-words">
        {JSON.stringify(v, null, 2)}
      </pre>
    );
  }
  if (typeof v === "object") {
    return (
      <div className="space-y-1.5 pl-3 border-l border-border">
        {Object.entries(v).map(([k, val]) => (
          <div key={k}>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{humanizeKey(k)}</p>
            <div className="text-[13px] text-foreground">{renderValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }
  const str = String(v);
  if (/^https?:\/\//.test(str)) {
    return <a href={str} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{str}</a>;
  }
  return <span className="whitespace-pre-wrap break-words">{str}</span>;
}

function DetailPanel({ row, onClose }: { row: OnboardingRow; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const baseFields: Array<[string, any]> = [
    ["Bedrijf", row.company_name],
    ["Contactpersoon", row.contact_person],
    ["E-mail", row.email],
    ["Telefoon", row.phone],
    ["Website", row.website],
    ["Dienst", serviceLabel(row.service_type)],
    ["Status", row.status],
    ["Ingediend op", row.submitted_at ? new Date(row.submitted_at).toLocaleString("nl-NL") : new Date(row.created_at).toLocaleString("nl-NL")],
  ];

  const dataEntries = Object.entries(row.data ?? {});

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed top-0 right-0 z-50 h-screen w-full max-w-[640px] bg-card border-l border-border flex flex-col shadow-2xl"
      >
        <div className="flex items-center gap-3 px-5 h-[60px] border-b border-border">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">{row.company_name}</p>
            <p className="text-[12px] text-muted-foreground truncate">{serviceLabel(row.service_type)} · {row.email}</p>
          </div>
          {row.client_id && (
            <Link
              to={`/admin/clients?open=${row.client_id}`}
              className="text-[12px] font-medium text-primary hover:underline"
            >
              Open klant
            </Link>
          )}
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Algemeen</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {baseFields.map(([label, val]) => (
                <div key={label}>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="text-[13px] text-foreground mt-0.5">{renderValue(val)}</dd>
                </div>
              ))}
            </dl>
          </section>

          {dataEntries.length > 0 && (
            <section>
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Ingevulde gegevens</h3>
              <dl className="space-y-3">
                {dataEntries.map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border p-3 bg-background/40">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{humanizeKey(k)}</dt>
                    <dd className="text-[13px] text-foreground">{renderValue(v)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {row.admin_notes && (
            <section>
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Notities</h3>
              <p className="text-[13px] text-foreground whitespace-pre-wrap">{row.admin_notes}</p>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}

export default function AdminOnboarding() {
  const [rows, setRows] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState<string>(() => localStorage.getItem(LAST_SEEN_KEY) || "");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("service_onboardings")
        .select("*")
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
  const openRow = rows.find((r) => r.id === openId) || null;

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
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setOpenId(r.id)}
                  className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
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
                </button>
              );
            })}
          </div>
        )}
      </div>

      {openRow && <DetailPanel row={openRow} onClose={() => setOpenId(null)} />}
    </div>
  );
}
