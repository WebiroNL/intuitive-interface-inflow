import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/hooks/useClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { FloppyDiskIcon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import {
  WEBSITE_INTAKE_SECTIONS,
  isWebsiteSectionVisible,
} from "@/components/intake/websiteSections";
import { getWebsiteLabel } from "@/components/intake/websiteLabels";

interface Props {
  client: Client;
}

type IntakeData = Record<string, any>;

const WLabelOverrideContext = createContext<Record<string, string>>({});

function WField({
  labelId,
  label,
  children,
}: {
  labelId: string;
  label: string;
  children: React.ReactNode;
}) {
  const overrides = useContext(WLabelOverrideContext);
  const display = getWebsiteLabel(labelId, overrides) || label;
  return (
    <div className="space-y-1.5">
      <Label className="text-[13px] font-medium text-foreground">{display}</Label>
      {children}
    </div>
  );
}

function WSec({
  id,
  sectionKey,
  number,
  defaultTitle,
  icon,
  children,
}: {
  id: string;
  sectionKey: string;
  number: number;
  defaultTitle: string;
  icon: any;
  children: React.ReactNode;
}) {
  const overrides = useContext(WLabelOverrideContext);
  const title = getWebsiteLabel(sectionKey, overrides) || defaultTitle;
  return (
    <section
      id={`wsec-${id}`}
      className="border border-border rounded-lg bg-card overflow-hidden scroll-mt-4"
    >
      <header className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
        <HugeiconsIcon icon={icon} size={16} className="text-primary" />
        <h2 className="text-[14px] font-semibold text-foreground">
          {number}. {title}
        </h2>
      </header>
      <div className="p-4 space-y-4">{children}</div>
    </section>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

export default function ClientWebsiteIntakeForm({ client }: Props) {
  const sections = useMemo(
    () =>
      WEBSITE_INTAKE_SECTIONS.filter((s) =>
        isWebsiteSectionVisible((client as any).website_intake_sections, s.id)
      ),
    [client]
  );
  const numberMap = useMemo(() => {
    const m = new Map<string, number>();
    sections.forEach((s, i) => m.set(s.id, i + 1));
    return m;
  }, [sections]);

  const [data, setData] = useState<IntakeData>({});
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("concept");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState<string>(sections[0]?.id ?? "bedrijf");

  const overrides = ((client as any).website_intake_labels ?? {}) as Record<string, string>;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: row } = await (supabase as any)
        .from("website_intakes")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (row) {
        setIntakeId(row.id);
        setData((row.data as IntakeData) || {});
        setStatus(row.status || "concept");
      }
      setLoading(false);
    })();
  }, [client.id]);

  const set = (key: string, value: any) => setData((d) => ({ ...d, [key]: value }));

  const save = async (newStatus?: "concept" | "ingediend") => {
    setSaving(true);
    const payload: any = {
      client_id: client.id,
      data,
      status: newStatus ?? status,
    };
    if (newStatus === "ingediend") payload.submitted_at = new Date().toISOString();

    let result;
    if (intakeId) {
      result = await (supabase as any)
        .from("website_intakes")
        .update(payload)
        .eq("id", intakeId)
        .select()
        .maybeSingle();
    } else {
      result = await (supabase as any)
        .from("website_intakes")
        .insert(payload)
        .select()
        .maybeSingle();
    }
    setSaving(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    if (result.data) {
      setIntakeId(result.data.id);
      setStatus(result.data.status);
    }
    toast.success(newStatus === "ingediend" ? "Intake ingediend" : "Concept opgeslagen");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-muted/40 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Website Intakeformulier</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Vul dit formulier zo volledig mogelijk in voor je <strong>nieuwe website</strong>. Je kunt tussentijds opslaan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {status === "ingediend" && (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} /> Ingediend
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => save()} disabled={saving}>
            <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> {saving ? "Bezig…" : "Concept opslaan"}
          </Button>
          <Button size="sm" onClick={() => save("ingediend")} disabled={saving}>
            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} /> Indienen
          </Button>
        </div>
      </div>

      <WLabelOverrideContext.Provider value={overrides}>
        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* Section nav */}
          <nav className="lg:sticky lg:top-4 self-start">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
              {sections.map((s) => (
                <li key={s.id} className="shrink-0">
                  <button
                    onClick={() => {
                      setActive(s.id);
                      document
                        .getElementById(`wsec-${s.id}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-colors w-full text-left border border-border ${
                      active === s.id
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <HugeiconsIcon icon={s.icon} size={14} />
                    <span className="whitespace-nowrap">
                      {numberMap.get(s.id)}.{" "}
                      {getWebsiteLabel(`wsec.${s.id}`, overrides) || s.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Form */}
          <div className="space-y-6 min-w-0">
            {sections.find((s) => s.id === "bedrijf") && (
              <WSec id="bedrijf" sectionKey="wsec.bedrijf" number={numberMap.get("bedrijf")!} defaultTitle="Bedrijf & Contact" icon={WEBSITE_INTAKE_SECTIONS[0].icon}>
                <Grid2>
                  <WField labelId="wf.bedrijfsnaam" label="Bedrijfsnaam"><Input value={data.bedrijfsnaam ?? ""} onChange={(e) => set("bedrijfsnaam", e.target.value)} /></WField>
                  <WField labelId="wf.contactpersoon" label="Contactpersoon"><Input value={data.contactpersoon ?? ""} onChange={(e) => set("contactpersoon", e.target.value)} /></WField>
                  <WField labelId="wf.email" label="E-mailadres"><Input type="email" value={data.email ?? ""} onChange={(e) => set("email", e.target.value)} /></WField>
                  <WField labelId="wf.telefoon" label="Telefoonnummer"><Input value={data.telefoon ?? ""} onChange={(e) => set("telefoon", e.target.value)} /></WField>
                  <WField labelId="wf.huidige_website" label="Huidige website"><Input placeholder="https://..." value={data.huidige_website ?? ""} onChange={(e) => set("huidige_website", e.target.value)} /></WField>
                  <WField labelId="wf.branche" label="Branche / sector"><Input value={data.branche ?? ""} onChange={(e) => set("branche", e.target.value)} /></WField>
                </Grid2>
              </WSec>
            )}

            {sections.find((s) => s.id === "doelen") && (
              <WSec id="doelen" sectionKey="wsec.doelen" number={numberMap.get("doelen")!} defaultTitle="Doelen van de website" icon={WEBSITE_INTAKE_SECTIONS[1].icon}>
                <WField labelId="wf.type_website" label="Type website"><Input placeholder="Bijv. brochure, webshop, portfolio, leadgen, boekingssysteem" value={data.type_website ?? ""} onChange={(e) => set("type_website", e.target.value)} /></WField>
                <WField labelId="wf.hoofddoel" label="Hoofddoel van de website"><Textarea rows={3} value={data.hoofddoel ?? ""} onChange={(e) => set("hoofddoel", e.target.value)} /></WField>
                <WField labelId="wf.belangrijkste_actie" label="Belangrijkste actie"><Input placeholder="Bijv. offerte aanvragen, afspraak boeken, product kopen" value={data.belangrijkste_actie ?? ""} onChange={(e) => set("belangrijkste_actie", e.target.value)} /></WField>
                <WField labelId="wf.succes_meten" label="Hoe meten we succes?"><Textarea rows={2} value={data.succes_meten ?? ""} onChange={(e) => set("succes_meten", e.target.value)} /></WField>
              </WSec>
            )}

            {sections.find((s) => s.id === "doelgroep") && (
              <WSec id="doelgroep" sectionKey="wsec.doelgroep" number={numberMap.get("doelgroep")!} defaultTitle="Doelgroep" icon={WEBSITE_INTAKE_SECTIONS[2].icon}>
                <WField labelId="wf.primaire_doelgroep" label="Primaire doelgroep"><Textarea rows={2} value={data.primaire_doelgroep ?? ""} onChange={(e) => set("primaire_doelgroep", e.target.value)} /></WField>
                <Grid2>
                  <WField labelId="wf.leeftijd_geslacht" label="Leeftijd / geslacht"><Input value={data.leeftijd_geslacht ?? ""} onChange={(e) => set("leeftijd_geslacht", e.target.value)} /></WField>
                  <WField labelId="wf.locatie_doelgroep" label="Locatie"><Input value={data.locatie_doelgroep ?? ""} onChange={(e) => set("locatie_doelgroep", e.target.value)} /></WField>
                </Grid2>
                <WField labelId="wf.taal" label="Talen op de website"><Input placeholder="Bijv. Nederlands, Engels" value={data.taal ?? ""} onChange={(e) => set("taal", e.target.value)} /></WField>
              </WSec>
            )}

            {sections.find((s) => s.id === "functionaliteiten") && (
              <WSec id="functionaliteiten" sectionKey="wsec.functionaliteiten" number={numberMap.get("functionaliteiten")!} defaultTitle="Functionaliteiten" icon={WEBSITE_INTAKE_SECTIONS[3].icon}>
                <WField labelId="wf.functionaliteiten" label="Gewenste functionaliteiten"><Textarea rows={4} placeholder="Bijv. contactformulier, blog, agenda, online betalen, login, meertaligheid..." value={data.functionaliteiten ?? ""} onChange={(e) => set("functionaliteiten", e.target.value)} /></WField>
                <Grid2>
                  <WField labelId="wf.aantal_paginas" label="Geschat aantal pagina's"><Input value={data.aantal_paginas ?? ""} onChange={(e) => set("aantal_paginas", e.target.value)} /></WField>
                  <WField labelId="wf.cms_voorkeur" label="CMS voorkeur"><Input placeholder="Bijv. WordPress, Webflow, geen voorkeur" value={data.cms_voorkeur ?? ""} onChange={(e) => set("cms_voorkeur", e.target.value)} /></WField>
                </Grid2>
                <WField labelId="wf.integraties" label="Integraties"><Textarea rows={2} placeholder="CRM, e-mail marketing, agenda, boekhouding..." value={data.integraties ?? ""} onChange={(e) => set("integraties", e.target.value)} /></WField>
              </WSec>
            )}

            {sections.find((s) => s.id === "design") && (
              <WSec id="design" sectionKey="wsec.design" number={numberMap.get("design")!} defaultTitle="Design & Uitstraling" icon={WEBSITE_INTAKE_SECTIONS[4].icon}>
                <WField labelId="wf.stijl" label="Gewenste stijl / sfeer"><Textarea rows={2} placeholder="Bijv. modern, premium, speels, zakelijk, minimalistisch" value={data.stijl ?? ""} onChange={(e) => set("stijl", e.target.value)} /></WField>
                <Grid2>
                  <WField labelId="wf.kleurvoorkeur" label="Kleurvoorkeur"><Input value={data.kleurvoorkeur ?? ""} onChange={(e) => set("kleurvoorkeur", e.target.value)} /></WField>
                  <WField labelId="wf.huisstijl_aanwezig" label="Huisstijl / logo aanwezig?"><Input placeholder="Ja / Nee / Gedeeltelijk" value={data.huisstijl_aanwezig ?? ""} onChange={(e) => set("huisstijl_aanwezig", e.target.value)} /></WField>
                </Grid2>
                <WField labelId="wf.voorbeelden_mooi" label="Voorbeeldwebsites die je mooi vindt"><Textarea rows={3} placeholder="Plak 3-5 URL's met korte uitleg" value={data.voorbeelden_mooi ?? ""} onChange={(e) => set("voorbeelden_mooi", e.target.value)} /></WField>
                <WField labelId="wf.voorbeelden_lelijk" label="Websites die je juist NIET mooi vindt"><Textarea rows={2} value={data.voorbeelden_lelijk ?? ""} onChange={(e) => set("voorbeelden_lelijk", e.target.value)} /></WField>
              </WSec>
            )}

            {sections.find((s) => s.id === "content") && (
              <WSec id="content" sectionKey="wsec.content" number={numberMap.get("content")!} defaultTitle="Content & Teksten" icon={WEBSITE_INTAKE_SECTIONS[5].icon}>
                <Grid2>
                  <WField labelId="wf.teksten_aanwezig" label="Zijn de teksten al klaar?"><Input placeholder="Ja / Nee / Deels" value={data.teksten_aanwezig ?? ""} onChange={(e) => set("teksten_aanwezig", e.target.value)} /></WField>
                  <WField labelId="wf.fotos_aanwezig" label="Zijn er foto's beschikbaar?"><Input placeholder="Ja / Nee / Deels" value={data.fotos_aanwezig ?? ""} onChange={(e) => set("fotos_aanwezig", e.target.value)} /></WField>
                  <WField labelId="wf.copywriter_nodig" label="Copywriter nodig?"><Input placeholder="Ja / Nee" value={data.copywriter_nodig ?? ""} onChange={(e) => set("copywriter_nodig", e.target.value)} /></WField>
                  <WField labelId="wf.fotograaf_nodig" label="Fotograaf nodig?"><Input placeholder="Ja / Nee" value={data.fotograaf_nodig ?? ""} onChange={(e) => set("fotograaf_nodig", e.target.value)} /></WField>
                </Grid2>
              </WSec>
            )}

            {sections.find((s) => s.id === "technisch") && (
              <WSec id="technisch" sectionKey="wsec.technisch" number={numberMap.get("technisch")!} defaultTitle="Technisch & Domein" icon={WEBSITE_INTAKE_SECTIONS[6].icon}>
                <Grid2>
                  <WField labelId="wf.domein" label="Domeinnaam"><Input placeholder="bedrijf.nl" value={data.domein ?? ""} onChange={(e) => set("domein", e.target.value)} /></WField>
                  <WField labelId="wf.hosting_huidig" label="Huidige hosting"><Input value={data.hosting_huidig ?? ""} onChange={(e) => set("hosting_huidig", e.target.value)} /></WField>
                </Grid2>
                <WField labelId="wf.email_setup" label="E-mail setup nodig?"><Input placeholder="Bijv. info@bedrijf.nl via Google Workspace" value={data.email_setup ?? ""} onChange={(e) => set("email_setup", e.target.value)} /></WField>
                <WField labelId="wf.seo_eisen" label="SEO eisen / wensen"><Textarea rows={2} value={data.seo_eisen ?? ""} onChange={(e) => set("seo_eisen", e.target.value)} /></WField>
                <WField labelId="wf.avg_cookies" label="AVG / cookie wensen"><Textarea rows={2} value={data.avg_cookies ?? ""} onChange={(e) => set("avg_cookies", e.target.value)} /></WField>
              </WSec>
            )}

            {sections.find((s) => s.id === "planning") && (
              <WSec id="planning" sectionKey="wsec.planning" number={numberMap.get("planning")!} defaultTitle="Planning & Budget" icon={WEBSITE_INTAKE_SECTIONS[7].icon}>
                <Grid2>
                  <WField labelId="wf.deadline" label="Gewenste oplevering"><Input placeholder="Bijv. binnen 6 weken" value={data.deadline ?? ""} onChange={(e) => set("deadline", e.target.value)} /></WField>
                  <WField labelId="wf.budget_indicatie" label="Budget indicatie"><Input value={data.budget_indicatie ?? ""} onChange={(e) => set("budget_indicatie", e.target.value)} /></WField>
                </Grid2>
                <WField labelId="wf.beslissers" label="Wie beslist mee?"><Textarea rows={2} value={data.beslissers ?? ""} onChange={(e) => set("beslissers", e.target.value)} /></WField>
                <WField labelId="wf.overige_opmerkingen" label="Overige opmerkingen"><Textarea rows={3} value={data.overige_opmerkingen ?? ""} onChange={(e) => set("overige_opmerkingen", e.target.value)} /></WField>
              </WSec>
            )}
          </div>
        </div>
      </WLabelOverrideContext.Provider>
    </div>
  );
}
