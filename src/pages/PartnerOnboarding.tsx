import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMyPartner } from "@/hooks/usePartner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ONBOARDING_SERVICES, getServiceById, type OnboardingField } from "@/lib/onboardingChecklists";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowLeft01Icon, Tick02Icon, RocketIcon } from "@hugeicons/core-free-icons";
import { updatePageMeta } from "@/utils/seo";

type Step = "company" | "services" | "fields" | "overview" | "done";

interface CompanyInfo {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
}

export default function PartnerOnboarding() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { partner } = useMyPartner();

  const [step, setStep] = useState<Step>("company");
  const [submitting, setSubmitting] = useState(false);

  const [company, setCompany] = useState<CompanyInfo>({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    website: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>({});

  useEffect(() => {
    updatePageMeta("Onboarding", "Vul de aanleverlijst in voor je gekozen diensten.", "/onboarding");
  }, []);

  // Pre-fill from partner profile if logged in
  useEffect(() => {
    if (partner) {
      setCompany((c) => ({
        company_name: c.company_name || partner.company_name || "",
        contact_person: c.contact_person || partner.contact_person || "",
        email: c.email || partner.email || "",
        phone: c.phone || partner.phone || "",
        website: c.website || partner.website || "",
      }));
    }
  }, [partner]);

  // Pre-select service via ?service=google_ads
  useEffect(() => {
    const pre = params.get("service");
    if (pre && ONBOARDING_SERVICES.some((s) => s.id === pre)) {
      setSelectedServices([pre]);
    }
  }, [params]);

  const activeService = useMemo(
    () => (step === "fields" ? getServiceById(selectedServices[activeServiceIndex]) : undefined),
    [step, selectedServices, activeServiceIndex]
  );

  const setAnswer = (serviceId: string, key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] ?? {}), [key]: value },
    }));
  };

  const validateCompany = () => {
    if (!company.company_name.trim() || !company.contact_person.trim() || !company.email.trim()) {
      toast({ title: "Vul de verplichte velden in", description: "Bedrijfsnaam, contactpersoon en e-mail zijn vereist.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateServiceFields = (serviceId: string): boolean => {
    const svc = getServiceById(serviceId);
    if (!svc) return true;
    const data = answers[serviceId] ?? {};
    for (const f of svc.fields) {
      if (f.required) {
        const v = data[f.key];
        const empty = v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0);
        if (empty) {
          toast({ title: `Vul "${f.label}" in`, description: `Verplicht veld bij ${svc.label}.`, variant: "destructive" });
          return false;
        }
      }
    }
    return true;
  };

  const next = () => {
    if (step === "company") {
      if (!validateCompany()) return;
      setStep("services");
    } else if (step === "services") {
      if (selectedServices.length === 0) {
        toast({ title: "Kies minimaal één dienst", variant: "destructive" });
        return;
      }
      setActiveServiceIndex(0);
      setStep("fields");
    } else if (step === "fields") {
      const current = selectedServices[activeServiceIndex];
      if (!validateServiceFields(current)) return;
      if (activeServiceIndex < selectedServices.length - 1) {
        setActiveServiceIndex((i) => i + 1);
      } else {
        setStep("overview");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (step === "services") setStep("company");
    else if (step === "fields") {
      if (activeServiceIndex > 0) setActiveServiceIndex((i) => i - 1);
      else setStep("services");
    } else if (step === "overview") {
      setActiveServiceIndex(selectedServices.length - 1);
      setStep("fields");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const rows = selectedServices.map((serviceId) => ({
        partner_id: partner?.id ?? null,
        submitted_by_user_id: user?.id ?? null,
        company_name: company.company_name.trim(),
        contact_person: company.contact_person.trim(),
        email: company.email.trim().toLowerCase(),
        phone: company.phone.trim() || null,
        website: company.website.trim() || null,
        service_type: serviceId,
        data: answers[serviceId] ?? {},
        status: "submitted",
      }));

      const { error } = await supabase.from("service_onboardings").insert(rows);
      if (error) throw error;

      setStep("done");
    } catch (e: any) {
      toast({ title: "Versturen mislukt", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ==== UI ====
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-4">
            <HugeiconsIcon icon=RocketIcon size={14} /> Onboarding
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Aanleverlijst</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Vul de informatie in die we nodig hebben om snel met je diensten aan de slag te kunnen.
          </p>
        </div>

        {/* Progress */}
        <ProgressBar step={step} services={selectedServices} activeIndex={activeServiceIndex} />

        {/* STEP: company */}
        {step === "company" && (
          <Section title="Bedrijfsgegevens" subtitle="Met wie hebben we te maken?">
            <Field label="Bedrijfsnaam *">
              <Input value={company.company_name} onChange={(e) => setCompany({ ...company, company_name: e.target.value })} />
            </Field>
            <Field label="Contactpersoon *">
              <Input value={company.contact_person} onChange={(e) => setCompany({ ...company, contact_person: e.target.value })} />
            </Field>
            <Field label="E-mail *">
              <Input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
            </Field>
            <Field label="Telefoon">
              <Input type="tel" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
            </Field>
            <Field label="Website">
              <Input type="url" placeholder="https://" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
            </Field>
          </Section>
        )}

        {/* STEP: services */}
        {step === "services" && (
          <Section title="Welke diensten gaan we doen?" subtitle="Per dienst krijg je een specifieke aanleverlijst.">
            <div className="space-y-6">
              {(["marketing", "website"] as const).map((cat) => (
                <div key={cat}>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    {cat === "marketing" ? "Marketing" : "Website / Webshop"}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ONBOARDING_SERVICES.filter((s) => s.category === cat).map((s) => {
                      const active = selectedServices.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() =>
                            setSelectedServices((prev) =>
                              prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                            )
                          }
                          className={`text-left p-4 rounded-xl border transition-all ${
                            active
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-medium">{s.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
                            </div>
                            {active && (
                              <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
                                <HugeiconsIcon icon=Tick02Icon size={12} />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* STEP: fields per service */}
        {step === "fields" && activeService && (
          <Section
            title={activeService.label}
            subtitle={`${activeService.description} · stap ${activeServiceIndex + 1} van ${selectedServices.length}`}
          >
            <div className="space-y-5">
              {activeService.fields.map((field) => (
                <DynamicField
                  key={field.key}
                  field={field}
                  value={answers[activeService.id]?.[field.key]}
                  onChange={(v) => setAnswer(activeService.id, field.key, v)}
                />
              ))}
            </div>
          </Section>
        )}

        {/* STEP: overview */}
        {step === "overview" && (
          <Section title="Controleren en verzenden" subtitle="Klopt alles? Verstuur dan je aanleverlijst.">
            <div className="space-y-6">
              <div className="rounded-xl border border-border p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Bedrijf</div>
                <div className="text-sm">
                  <div className="font-medium">{company.company_name}</div>
                  <div className="text-muted-foreground">
                    {company.contact_person} · {company.email}
                    {company.phone && ` · ${company.phone}`}
                  </div>
                  {company.website && <div className="text-muted-foreground">{company.website}</div>}
                </div>
              </div>

              {selectedServices.map((sid) => {
                const svc = getServiceById(sid);
                if (!svc) return null;
                const data = answers[sid] ?? {};
                return (
                  <div key={sid} className="rounded-xl border border-border p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{svc.label}</div>
                    <dl className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {svc.fields.map((f) => {
                        const v = data[f.key];
                        const display = Array.isArray(v) ? v.join(", ") : v;
                        if (!display && display !== 0) return null;
                        return (
                          <div key={f.key} className="break-words">
                            <dt className="text-muted-foreground text-xs">{f.label}</dt>
                            <dd className="whitespace-pre-wrap">{String(display)}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* STEP: done */}
        {step === "done" && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <HugeiconsIcon icon=Tick02Icon size={32} />
            </div>
            <h2 className="text-3xl font-semibold mb-3">Bedankt, we hebben alles ontvangen!</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We nemen de aanleverlijst door en nemen contact met je op zodra we kunnen starten.
            </p>
            <Button onClick={() => navigate("/")}>Terug naar home</Button>
          </div>
        )}

        {/* Navigation */}
        {step !== "done" && (
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === "company"}
              className="gap-2"
            >
              <HugeiconsIcon icon=ArrowLeft01Icon size={16} /> Vorige
            </Button>

            {step === "overview" ? (
              <Button onClick={submit} disabled={submitting} className="gap-2">
                {submitting ? "Versturen..." : "Versturen"} <HugeiconsIcon icon=Tick02Icon size={16} />
              </Button>
            ) : (
              <Button onClick={next} className="gap-2">
                Volgende <HugeiconsIcon icon=ArrowRight01Icon size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==== Helpers ====

function ProgressBar({
  step,
  services,
  activeIndex,
}: {
  step: Step;
  services: string[];
  activeIndex: number;
}) {
  const totalFieldSteps = Math.max(services.length, 1);
  let pct = 0;
  if (step === "company") pct = 10;
  else if (step === "services") pct = 25;
  else if (step === "fields") pct = 25 + ((activeIndex + 1) / totalFieldSteps) * 60;
  else if (step === "overview") pct = 90;
  else if (step === "done") pct = 100;

  return (
    <div className="mb-8">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1 mb-6">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-6"}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: OnboardingField;
  value: any;
  onChange: (v: any) => void;
}) {
  const label = field.label + (field.required ? " *" : "");

  if (field.type === "textarea") {
    return (
      <Field label={label}>
        <Textarea
          rows={4}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </Field>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <Field label={label}>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Kies..." />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </Field>
    );
  }

  if (field.type === "multiselect" && field.options) {
    const arr: string[] = Array.isArray(value) ? value : [];
    const toggle = (opt: string) => {
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    };
    return (
      <Field label={label}>
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const active = arr.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </Field>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex items-start gap-3 mb-4">
        <Checkbox checked={!!value} onCheckedChange={(c) => onChange(!!c)} />
        <div>
          <Label>{label}</Label>
          {field.help && <p className="text-xs text-muted-foreground mt-1">{field.help}</p>}
        </div>
      </div>
    );
  }

  // text / url / email / tel / number
  return (
    <Field label={label}>
      <Input
        type={field.type === "number" ? "number" : field.type}
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
      />
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </Field>
  );
}
