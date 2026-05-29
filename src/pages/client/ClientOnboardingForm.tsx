import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Client } from "@/hooks/useClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  ONBOARDING_SERVICES,
  getCommonAssetFields,
  getServiceById,
  tr,
  trOptions,
  type Locale,
  type OnboardingField,
} from "@/lib/onboardingChecklists";
import { useOnboardingUi, type OnboardingUi } from "@/lib/onboardingUiStrings";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Tick02Icon,
  RocketIcon,
  PlusSignIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

type Step = "services" | "fields" | "assets" | "overview" | "done";

interface Props {
  client: Client;
}

export default function ClientOnboardingForm({ client }: Props) {
  const { user } = useAuth();

  const [locale, setLocale] = useState<Locale>("nl");
  const ui = useOnboardingUi(locale);

  const [step, setStep] = useState<Step>("services");
  const [submitting, setSubmitting] = useState(false);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, any>>>(
    {}
  );
  const [commonAssets, setCommonAssets] = useState<Record<string, any>>({});

  const setCommonAsset = (key: string, value: any) => {
    setCommonAssets((prev) => ({ ...prev, [key]: value }));
  };

  const activeService = useMemo(
    () =>
      step === "fields"
        ? getServiceById(selectedServices[activeServiceIndex])
        : undefined,
    [step, selectedServices, activeServiceIndex]
  );

  const commonFields = useMemo(
    () => getCommonAssetFields(selectedServices),
    [selectedServices]
  );

  const setAnswer = (serviceId: string, key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] ?? {}), [key]: value },
    }));
  };

  const validateServiceFields = (serviceId: string): boolean => {
    const svc = getServiceById(serviceId);
    if (!svc) return true;
    const data = answers[serviceId] ?? {};
    for (const f of svc.fields) {
      if (f.required) {
        const v = data[f.key];
        const empty =
          v === undefined ||
          v === null ||
          (typeof v === "string" && !v.trim()) ||
          (Array.isArray(v) && v.length === 0);
        if (empty) {
          toast({
            title: ui.fillRequired(tr(f.label, locale)),
            description: ui.requiredAt(tr(svc.label, locale)),
            variant: "destructive",
          });
          return false;
        }
      }
    }
    return true;
  };

  const next = () => {
    if (step === "services") {
      if (selectedServices.length === 0) {
        toast({ title: ui.chooseAtLeastOne, variant: "destructive" });
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
        setStep(commonFields.length > 0 ? "assets" : "overview");
      }
    } else if (step === "assets") {
      setStep("overview");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (step === "fields") {
      if (activeServiceIndex > 0) setActiveServiceIndex((i) => i - 1);
      else setStep("services");
    } else if (step === "assets") {
      setActiveServiceIndex(selectedServices.length - 1);
      setStep("fields");
    } else if (step === "overview") {
      if (commonFields.length > 0) {
        setStep("assets");
      } else {
        setActiveServiceIndex(selectedServices.length - 1);
        setStep("fields");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const rows = selectedServices.map((serviceId) => ({
        client_id: client.id,
        submitted_by_user_id: user?.id ?? null,
        company_name: client.company_name,
        contact_person: client.contact_person ?? client.company_name,
        email: client.email,
        phone: client.phone ?? null,
        website: null,
        service_type: serviceId,
        data: { ...(answers[serviceId] ?? {}), _common_assets: commonAssets, _locale: locale },
        status: "submitted",
      }));

      const { error } = await supabase
        .from("service_onboardings")
        .insert(rows);
      if (error) throw error;

      setStep("done");
    } catch (e: any) {
      toast({
        title: ui.submitFailed,
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-4">
              <HugeiconsIcon icon={RocketIcon} size={14} /> {ui.badge}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {ui.title}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">{ui.intro}</p>
          </div>
          <LanguageToggle locale={locale} setLocale={setLocale} ui={ui} />
        </div>

        <ProgressBar
          step={step}
          services={selectedServices}
          activeIndex={activeServiceIndex}
        />

        {step === "services" && (
          <Section
            title={ui.servicesTitle}
            subtitle={ui.servicesSubtitle}
          >
            <div className="space-y-6">
              {(["marketing", "website"] as const).map((cat) => (
                <div key={cat}>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    {cat === "marketing" ? ui.marketingCat : ui.websiteCat}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ONBOARDING_SERVICES.filter((s) => s.category === cat).map(
                      (s) => {
                        const active = selectedServices.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              setSelectedServices((prev) =>
                                prev.includes(s.id)
                                  ? prev.filter((x) => x !== s.id)
                                  : [...prev, s.id]
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
                                <div className="font-medium">{tr(s.label, locale)}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {tr(s.description, locale)}
                                </div>
                              </div>
                              {active && (
                                <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
                                  <HugeiconsIcon icon={Tick02Icon} size={12} />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {step === "fields" && activeService && (
          <Section
            title={tr(activeService.label, locale)}
            subtitle={`${tr(activeService.description, locale)} · ${ui.stepOf(activeServiceIndex + 1, selectedServices.length)}`}
          >
            <div className="space-y-5">
              {activeService.fields.map((field) => (
                <DynamicField
                  key={field.key}
                  field={field}
                  locale={locale}
                  ui={ui}
                  value={answers[activeService.id]?.[field.key]}
                  onChange={(v) => setAnswer(activeService.id, field.key, v)}
                />
              ))}
            </div>
          </Section>
        )}

        {step === "assets" && (
          <Section
            title={ui.assetsTitle}
            subtitle={ui.assetsSubtitle}
          >
            <div className="space-y-5">
              {commonFields.map((field) => (
                <DynamicField
                  key={field.key}
                  field={field}
                  locale={locale}
                  ui={ui}
                  value={commonAssets[field.key]}
                  onChange={(v) => setCommonAsset(field.key, v)}
                />
              ))}
            </div>
          </Section>
        )}

        {step === "overview" && (
          <Section
            title={ui.overviewTitle}
            subtitle={ui.overviewSubtitle}
          >
            <div className="space-y-6">
              <div className="rounded-xl border border-border p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {ui.company}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{client.company_name}</div>
                  <div className="text-muted-foreground">
                    {client.contact_person ?? "—"} · {client.email}
                    {client.phone && ` · ${client.phone}`}
                  </div>
                </div>
              </div>

              {selectedServices.map((sid) => {
                const svc = getServiceById(sid);
                if (!svc) return null;
                const data = answers[sid] ?? {};
                return (
                  <div
                    key={sid}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      {tr(svc.label, locale)}
                    </div>
                    <dl className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {svc.fields.map((f) => {
                        const v = data[f.key];
                        const display = Array.isArray(v) ? v.filter((x: any) => x && String(x).trim()).join("\n") : v;
                        if (!display && display !== 0) return null;
                        return (
                          <div key={f.key} className="break-words">
                            <dt className="text-muted-foreground text-xs">
                              {tr(f.label, locale)}
                            </dt>
                            <dd className="whitespace-pre-wrap">
                              {String(display)}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                );
              })}

              <div className="rounded-xl border border-border p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {ui.brandMaterial}
                </div>
                <dl className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {commonFields.map((f) => {
                    const v = commonAssets[f.key];
                    const display = Array.isArray(v) ? v.filter((x: any) => x && String(x).trim()).join("\n") : v;
                    if (!display && display !== 0) return null;
                    return (
                      <div key={f.key} className="break-words">
                        <dt className="text-muted-foreground text-xs">{tr(f.label, locale)}</dt>
                        <dd className="whitespace-pre-wrap">{String(display)}</dd>
                      </div>
                    );
                  })}
                  {commonFields.every((f) => {
                    const v = commonAssets[f.key];
                    return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
                  }) && (
                    <div className="text-muted-foreground text-xs col-span-full">
                      {ui.noBrandMaterial}
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </Section>
        )}

        {step === "done" && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <HugeiconsIcon icon={Tick02Icon} size={32} />
            </div>
            <h2 className="text-3xl font-semibold mb-3">
              {ui.doneTitle}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {ui.doneText}
            </p>
            <Button
              variant="outline"
              className="hover:bg-primary/10 hover:text-primary hover:border-primary/40"
              onClick={() => {
                setSelectedServices([]);
                setAnswers({});
                setCommonAssets({});
                setActiveServiceIndex(0);
                setStep("services");
              }}
            >
              {ui.submitMore}
            </Button>
          </div>
        )}

        {step !== "done" && (
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === "services"}
              className="gap-2 hover:bg-primary/10 hover:text-primary"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} /> {ui.previous}
            </Button>

            {step === "overview" ? (
              <Button onClick={submit} disabled={submitting} className="gap-2">
                {submitting ? ui.submitting : ui.submit}{" "}
                <HugeiconsIcon icon={Tick02Icon} size={16} />
              </Button>
            ) : (
              <Button onClick={next} className="gap-2">
                {ui.next} <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==== Helpers ====

function LanguageToggle({
  locale,
  setLocale,
  ui,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  ui: OnboardingUi;
}) {
  return (
    <div className="inline-flex rounded-full border border-border p-1 bg-card">
      <button
        type="button"
        onClick={() => setLocale("nl")}
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          locale === "nl"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={ui.dutch}
      >
        NL
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label={ui.english}
      >
        EN
      </button>
    </div>
  );
}

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
  if (step === "services") pct = 10;
  else if (step === "fields")
    pct = 10 + ((activeIndex + 1) / totalFieldSteps) * 65;
  else if (step === "assets") pct = 82;
  else if (step === "overview") pct = 92;
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

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1 mb-6">{subtitle}</p>
      )}
      <div className={subtitle ? "" : "mt-6"}>{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  locale,
  ui,
}: {
  field: OnboardingField;
  value: any;
  onChange: (v: any) => void;
  locale: Locale;
  ui: OnboardingUi;
}) {
  const labelText = tr(field.label, locale) + (field.required ? " *" : "");
  const placeholder = tr(field.placeholder, locale) || undefined;
  const help = tr(field.help, locale) || undefined;

  if (field.type === "textarea") {
    return (
      <Field label={labelText}>
        <Textarea
          rows={4}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
        {help && (
          <p className="text-xs text-muted-foreground">{help}</p>
        )}
      </Field>
    );
  }

  if (field.type === "select" && field.options) {
    const options = trOptions(field.options, locale);
    return (
      <Field label={labelText}>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={ui.choose} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {help && (
          <p className="text-xs text-muted-foreground">{help}</p>
        )}
      </Field>
    );
  }

  if (field.type === "multiselect" && field.options) {
    const options = trOptions(field.options, locale);
    const arr: string[] = Array.isArray(value) ? value : [];
    const toggle = (opt: string) => {
      onChange(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
    };
    return (
      <Field label={labelText}>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
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
        {help && (
          <p className="text-xs text-muted-foreground">{help}</p>
        )}
      </Field>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex items-start gap-3 mb-4">
        <Checkbox checked={!!value} onCheckedChange={(c) => onChange(!!c)} />
        <div>
          <Label>{labelText}</Label>
          {help && (
            <p className="text-xs text-muted-foreground mt-1">{help}</p>
          )}
        </div>
      </div>
    );
  }

  if (field.type === "multilink") {
    const links: string[] = Array.isArray(value)
      ? value
      : typeof value === "string" && value
        ? [value]
        : [""];
    const safeLinks = links.length > 0 ? links : [""];

    const updateAt = (idx: number, v: string) => {
      const next = [...safeLinks];
      next[idx] = v;
      if (idx === next.length - 1 && v.trim() !== "") {
        next.push("");
      }
      onChange(next);
    };

    const removeAt = (idx: number) => {
      const next = safeLinks.filter((_, i) => i !== idx);
      onChange(next.length > 0 ? next : [""]);
    };

    return (
      <Field label={labelText}>
        <div className="space-y-2">
          {safeLinks.map((link, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                type="url"
                placeholder={placeholder}
                value={link}
                onChange={(e) => updateAt(idx, e.target.value)}
              />
              {safeLinks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary"
                  onClick={() => removeAt(idx)}
                  aria-label={ui.removeLink}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => onChange([...safeLinks, ""])}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} />
            {ui.addLink}
          </Button>
        </div>
        {help && (
          <p className="text-xs text-muted-foreground">{help}</p>
        )}
      </Field>
    );
  }

  return (
    <Field label={labelText}>
      <Input
        type={field.type === "number" ? "number" : field.type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            field.type === "number"
              ? e.target.value === ""
                ? ""
                : Number(e.target.value)
              : e.target.value
          )
        }
      />
      {help && (
        <p className="text-xs text-muted-foreground">{help}</p>
      )}
    </Field>
  );
}
