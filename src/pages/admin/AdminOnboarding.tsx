import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkSquare02Icon, ArrowRight01Icon, Cancel01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { loadSeenOnboardingKeys, saveSeenOnboardingKeys } from "@/lib/onboardingGrouping";
import { jsPDF } from "jspdf";

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

interface OnboardingGroup {
  key: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  website: string | null;
  client_id: string | null;
  newestTs: string;
  rows: OnboardingRow[];
}

const LAST_SEEN_KEY = "admin_onboarding_last_seen";

const serviceLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const humanizeKey = (k: string) =>
  k.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function groupRows(rows: OnboardingRow[]): OnboardingGroup[] {
  const map = new Map<string, OnboardingGroup>();
  for (const r of rows) {
    const ts = r.submitted_at ?? r.created_at;
    // Bucket by 10-minute window so one onboarding submission with multiple services merges
    const bucket = ts ? new Date(ts).toISOString().slice(0, 15) : "";
    const key = `${(r.email || "").toLowerCase()}|${r.company_name}|${bucket}`;
    const existing = map.get(key);
    if (existing) {
      existing.rows.push(r);
      if (ts > existing.newestTs) existing.newestTs = ts;
    } else {
      map.set(key, {
        key,
        company_name: r.company_name,
        contact_person: r.contact_person,
        email: r.email,
        phone: r.phone,
        website: r.website,
        client_id: r.client_id,
        newestTs: ts,
        rows: [r],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.newestTs > b.newestTs ? -1 : 1));
}

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

function flattenValue(v: any): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Ja" : "Nee";
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== "object" || x === null)) return v.map(String).join(", ");
    return JSON.stringify(v, null, 2);
  }
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
}

function downloadGroupPdf(group: OnboardingGroup) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) { doc.addPage(); y = margin; }
  };
  const writeWrapped = (text: string, size: number, opts: { bold?: boolean; color?: [number, number, number]; gap?: number } = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? [20, 20, 20]));
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensure(size + 4);
      doc.text(line, margin, y);
      y += size + 4;
    }
    y += opts.gap ?? 0;
  };
  const rule = () => {
    ensure(12);
    doc.setDrawColor(220);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  };
  const field = (label: string, value: string) => {
    writeWrapped(label.toUpperCase(), 8, { color: [130, 130, 130] });
    writeWrapped(value, 11, { gap: 6 });
  };

  // Header
  writeWrapped(group.company_name || "Onboarding", 18, { bold: true });
  writeWrapped(
    `${group.rows.length} ${group.rows.length === 1 ? "dienst" : "diensten"} · ${group.email || ""}`,
    10,
    { color: [110, 110, 110], gap: 8 }
  );
  rule();

  writeWrapped("Algemeen", 12, { bold: true, gap: 4 });
  field("Bedrijf", group.company_name || "—");
  field("Contactpersoon", group.contact_person || "—");
  field("E-mail", group.email || "—");
  field("Telefoon", group.phone || "—");
  field("Website", group.website || "—");
  field("Ingediend op", group.newestTs ? new Date(group.newestTs).toLocaleString("nl-NL") : "—");
  field("Diensten", group.rows.map((r) => serviceLabel(r.service_type)).join(", "));
  rule();

  for (const r of group.rows) {
    writeWrapped(serviceLabel(r.service_type), 13, { bold: true });
    writeWrapped(`Status: ${r.status}`, 9, { color: [130, 130, 130], gap: 6 });
    const entries = Object.entries(r.data ?? {});
    if (entries.length === 0) {
      writeWrapped("Geen aanvullende gegevens.", 10, { color: [130, 130, 130], gap: 6 });
    } else {
      for (const [k, v] of entries) field(humanizeKey(k), flattenValue(v));
    }
    if (r.admin_notes) {
      writeWrapped("Notities", 9, { color: [130, 130, 130] });
      writeWrapped(r.admin_notes, 11, { gap: 6 });
    }
    rule();
  }

  const safe = (group.company_name || "onboarding").replace(/[^a-z0-9\-_]+/gi, "_").toLowerCase();
  const date = group.newestTs ? new Date(group.newestTs).toISOString().slice(0, 10) : "";
  doc.save(`onboarding_${safe}${date ? "_" + date : ""}.pdf`);
}

function DetailPanel({ group, onClose }: { group: OnboardingGroup; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const baseFields: Array<[string, any]> = [
    ["Bedrijf", group.company_name],
    ["Contactpersoon", group.contact_person],
    ["E-mail", group.email],
    ["Telefoon", group.phone],
    ["Website", group.website],
    ["Ingediend op", group.newestTs ? new Date(group.newestTs).toLocaleString("nl-NL") : "—"],
  ];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed top-0 right-0 z-50 h-screen w-full max-w-[720px] bg-card border-l border-border flex flex-col shadow-2xl"
      >
        <div className="flex items-center gap-3 px-5 h-[60px] border-b border-border">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">{group.company_name}</p>
            <p className="text-[12px] text-muted-foreground truncate">
              {group.rows.length} {group.rows.length === 1 ? "dienst" : "diensten"} · {group.email}
            </p>
          </div>
          {group.client_id && (
            <Link
              to={`/admin/clients?open=${group.client_id}`}
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
            <div className="mt-3 flex flex-wrap gap-1.5">
              {group.rows.map((r) => (
                <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                  {serviceLabel(r.service_type)}
                </span>
              ))}
            </div>
          </section>

          {group.rows.map((r) => {
            const dataEntries = Object.entries(r.data ?? {});
            return (
              <section key={r.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-foreground">{serviceLabel(r.service_type)}</h3>
                  <span className="text-[11px] text-muted-foreground capitalize">{r.status}</span>
                </div>
                {dataEntries.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground">Geen aanvullende gegevens.</p>
                ) : (
                  <dl className="space-y-3">
                    {dataEntries.map(([k, v]) => (
                      <div key={k} className="rounded-md border border-border p-3 bg-background/40">
                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{humanizeKey(k)}</dt>
                        <dd className="text-[13px] text-foreground">{renderValue(v)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {r.admin_notes && (
                  <div className="mt-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Notities</p>
                    <p className="text-[13px] text-foreground whitespace-pre-wrap">{r.admin_notes}</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </aside>
    </>
  );
}

export default function AdminOnboarding() {
  const [rows, setRows] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [seenKeys, setSeenKeys] = useState<Set<string>>(() => loadSeenOnboardingKeys());
  const [openKey, setOpenKey] = useState<string | null>(null);

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

  const groups = useMemo(() => groupRows(rows), [rows]);

  const markGroupSeen = (key: string) => {
    if (seenKeys.has(key)) return;
    const next = new Set(seenKeys);
    next.add(key);
    setSeenKeys(next);
    saveSeenOnboardingKeys(next);
  };

  const markAllSeen = () => {
    const next = new Set(seenKeys);
    groups.forEach((g) => next.add(g.key));
    setSeenKeys(next);
    saveSeenOnboardingKeys(next);
  };

  const openGroupByKey = (key: string) => {
    setOpenKey(key);
    markGroupSeen(key);
  };

  const isGroupNew = (g: OnboardingGroup) => !seenKeys.has(g.key);
  const newCount = groups.filter(isGroupNew).length;
  const openGroup = groups.find((g) => g.key === openKey) || null;

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
        ) : groups.length === 0 ? (
          <div className="p-12 text-center text-[13px] text-muted-foreground">
            Nog geen onboarding aanvragen.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {groups.map((g) => {
              const fresh = isGroupNew(g);
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => openGroupByKey(g.key)}
                  className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold text-foreground truncate">{g.company_name}</p>
                      {fresh && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide">
                          Nieuw
                        </span>
                      )}
                      {g.rows.map((r) => (
                        <span key={r.id} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {serviceLabel(r.service_type)}
                        </span>
                      ))}
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                      {g.contact_person} · {g.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] text-muted-foreground tabular-nums">
                      {g.newestTs ? new Date(g.newestTs).toLocaleString("nl-NL", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {g.rows.length} {g.rows.length === 1 ? "dienst" : "diensten"}
                    </p>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {openGroup && <DetailPanel group={openGroup} onClose={() => setOpenKey(null)} />}
    </div>
  );
}
