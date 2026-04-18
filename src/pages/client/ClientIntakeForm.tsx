import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/hooks/useClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  Globe02Icon,
  PackageIcon,
  Target02Icon,
  UserGroup02Icon,
  AlertCircleIcon,
  StarIcon,
  Shield01Icon,
  Crown02Icon,
  Image01Icon,
  CheckmarkCircle02Icon,
  HelpCircleIcon,
  Calendar03Icon,
  PaintBrushIcon,
  Megaphone01Icon,
  FloppyDiskIcon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { INTAKE_SECTIONS, isSectionVisible } from "@/components/intake/sections";
import { getLabel } from "@/components/intake/labels";

interface Props {
  client: Client;
}

type IntakeData = Record<string, any>;

export default function ClientIntakeForm({ client }: Props) {
  const visibleSections = useMemo(
    () => INTAKE_SECTIONS.filter((s) => isSectionVisible(client.intake_sections, s.id)),
    [client.intake_sections]
  );
  const visibleSet = useMemo(() => new Set(visibleSections.map((s) => s.id)), [visibleSections]);
  const numberMap = useMemo(() => {
    const m = new Map<string, number>();
    visibleSections.forEach((s, i) => m.set(s.id, i + 1));
    return m;
  }, [visibleSections]);

  const [data, setData] = useState<IntakeData>({});
  const [intakeId, setIntakeId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("concept");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState<string>(visibleSections[0]?.id ?? "bedrijf");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: row } = await supabase
        .from("marketing_intakes")
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
  const toggle = (key: string, value: string) => {
    setData((d) => {
      const arr: string[] = Array.isArray(d[key]) ? d[key] : [];
      return {
        ...d,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };
  const has = (key: string, value: string) =>
    Array.isArray(data[key]) && data[key].includes(value);

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
      result = await supabase
        .from("marketing_intakes")
        .update(payload)
        .eq("id", intakeId)
        .select()
        .maybeSingle();
    } else {
      result = await supabase
        .from("marketing_intakes")
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
          <h1 className="text-xl font-semibold text-foreground">Ads Intakeformulier</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Vul dit formulier zo volledig mogelijk in voor je <strong>advertentiecampagnes</strong>. Je kunt tussentijds opslaan.
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

      <LabelOverrideContext.Provider value={(client as any).intake_labels ?? {}}>
      <VisibleSectionsContext.Provider value={{ visible: visibleSet, numbers: numberMap }}>
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Section nav */}
        <nav className="lg:sticky lg:top-4 self-start">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
            {visibleSections.map((s) => (
              <li key={s.id} className="shrink-0">
                <button
                  onClick={() => {
                    setActive(s.id);
                    document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-colors w-full text-left border border-border ${
                    active === s.id
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <HugeiconsIcon icon={s.icon} size={14} />
                  <span className="whitespace-nowrap">{(numberMap.get(s.id) ?? "")}. {s.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Form */}
        <div className="space-y-6 min-w-0">
          {/* 1. Bedrijf & Factuur */}
          <Sec id="bedrijf" title="1. Bedrijfsgegevens & Factuurgegevens" icon={Building03Icon}>
            <Grid2>
              <Field labelId="f.bedrijfsnaam" label="Bedrijfsnaam"><Input value={data.bedrijfsnaam ?? ""} onChange={(e) => set("bedrijfsnaam", e.target.value)} /></Field>
              <Field labelId="f.contactpersoon" label="Contactpersoon"><Input value={data.contactpersoon ?? ""} onChange={(e) => set("contactpersoon", e.target.value)} /></Field>
              <Field labelId="f.telefoon" label="Telefoonnummer"><Input value={data.telefoon ?? ""} onChange={(e) => set("telefoon", e.target.value)} /></Field>
              <Field labelId="f.email" label="E-mailadres"><Input type="email" value={data.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field labelId="f.vestigingsplaats" label="Vestigingsplaats"><Input value={data.vestigingsplaats ?? ""} onChange={(e) => set("vestigingsplaats", e.target.value)} /></Field>
              <Field labelId="f.whatsapp_block" label="WhatsApp">
                <CheckRow><Check label="Telefoon voor leads" checked={!!data.tel_voor_leads} onChange={(v) => set("tel_voor_leads", v)} /></CheckRow>
                <CheckRow><Check label="WhatsApp voor leads" checked={!!data.wa_voor_leads} onChange={(v) => set("wa_voor_leads", v)} /></CheckRow>
              </Field>
            </Grid2>

            <Divider />

            <Check label="Factuurgegevens zijn hetzelfde als bedrijfsgegevens" checked={!!data.factuur_zelfde} onChange={(v) => set("factuur_zelfde", v)} />

            {!data.factuur_zelfde && (
              <Grid2 className="mt-3">
                <Field labelId="f.factuur_naam" label="Officiële bedrijfsnaam"><Input value={data.factuur_naam ?? ""} onChange={(e) => set("factuur_naam", e.target.value)} /></Field>
                <Field labelId="f.factuur_email" label="Factuur e-mailadres"><Input type="email" value={data.factuur_email ?? ""} onChange={(e) => set("factuur_email", e.target.value)} /></Field>
                <Field labelId="f.factuur_adres" label="Factuuradres"><Input value={data.factuur_adres ?? ""} onChange={(e) => set("factuur_adres", e.target.value)} /></Field>
                <Field labelId="f.factuur_postcode" label="Postcode"><Input value={data.factuur_postcode ?? ""} onChange={(e) => set("factuur_postcode", e.target.value)} /></Field>
                <Field labelId="f.factuur_plaats" label="Plaats"><Input value={data.factuur_plaats ?? ""} onChange={(e) => set("factuur_plaats", e.target.value)} /></Field>
                <Field labelId="f.factuur_kvk" label="KvK-nummer"><Input value={data.factuur_kvk ?? ""} onChange={(e) => set("factuur_kvk", e.target.value)} /></Field>
                <Field labelId="f.factuur_btw" label="BTW-nummer"><Input value={data.factuur_btw ?? ""} onChange={(e) => set("factuur_btw", e.target.value)} /></Field>
              </Grid2>
            )}
          </Sec>

          {/* 2. Werkgebied */}
          <Sec id="werkgebied" title="2. Werkgebied" icon={Globe02Icon}>
            <Field labelId="f.steden" label="Steden / regio"><Input value={data.steden ?? ""} onChange={(e) => set("steden", e.target.value)} /></Field>
            <Field labelId="f.werkgebied_type" label="Werkgebied type">
              <CheckRow>
                <Check label="Klant komt naar jou" checked={has("werkgebied_type", "klant_naar_jou")} onChange={() => toggle("werkgebied_type", "klant_naar_jou")} />
                <Check label="Jij gaat naar klant" checked={has("werkgebied_type", "jij_naar_klant")} onChange={() => toggle("werkgebied_type", "jij_naar_klant")} />
                <Check label="Beide" checked={has("werkgebied_type", "beide")} onChange={() => toggle("werkgebied_type", "beide")} />
              </CheckRow>
            </Field>
            <Grid2>
              <Field labelId="f.max_rij_km" label="Max afstand naar klanten (km)"><Input type="number" value={data.max_rij_km ?? ""} onChange={(e) => set("max_rij_km", e.target.value)} /></Field>
              <Field labelId="f.max_radius_km" label="Max advertentie-radius (km)"><Input type="number" value={data.max_radius_km ?? ""} onChange={(e) => set("max_radius_km", e.target.value)} /></Field>
            </Grid2>
          </Sec>

          {/* 3. Dienst */}
          <Sec id="dienst" title="3. Dienst / Aanbod" icon={PackageIcon}>
            <Grid2>
              <Field labelId="f.hoofddienst" label="Hoofddienst of product"><Input value={data.hoofddienst ?? ""} onChange={(e) => set("hoofddienst", e.target.value)} /></Field>
              <Field labelId="f.tweede_dienst" label="Tweede dienst (optioneel)"><Input value={data.tweede_dienst ?? ""} onChange={(e) => set("tweede_dienst", e.target.value)} /></Field>
            </Grid2>
            <Field labelId="f.spoed" label="Spoed of normaal?">
              <CheckRow>
                <Check label="Spoed" checked={data.spoed === "spoed"} onChange={(v) => set("spoed", v ? "spoed" : null)} />
                <Check label="Normaal" checked={data.spoed === "normaal"} onChange={(v) => set("spoed", v ? "normaal" : null)} />
              </CheckRow>
            </Field>
            <Field labelId="f.heeft_actie" label="Actie / aanbieding?">
              <CheckRow>
                <Check label="Ja" checked={data.heeft_actie === true} onChange={(v) => set("heeft_actie", v ? true : null)} />
                <Check label="Nee" checked={data.heeft_actie === false} onChange={(v) => set("heeft_actie", v ? false : null)} />
              </CheckRow>
              {data.heeft_actie === true && (
                <Textarea className="mt-2" placeholder="Welke actie?" value={data.actie_omschrijving ?? ""} onChange={(e) => set("actie_omschrijving", e.target.value)} />
              )}
            </Field>
          </Sec>

          {/* 4. Doel */}
          <Sec id="doel" title="4. Doel van de advertenties" icon={Target02Icon}>
            <Field labelId="f.doelen" label="Doelen">
              <CheckRow>
                {["Meer telefoontjes", "Meer WhatsApp berichten", "Offerte-aanvragen", "Afspraken", "Online verkopen", "Leads verzamelen"].map((o) => (
                  <Check key={o} label={o} checked={has("doelen", o)} onChange={() => toggle("doelen", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.conversiepunt" label="Conversiepunt">
              <CheckRow>
                {["Bellen", "WhatsApp", "Leadformulier", "Afspraakplanner", "Webshop"].map((o) => (
                  <Check key={o} label={o} checked={has("conversiepunt", o)} onChange={() => toggle("conversiepunt", o)} />
                ))}
              </CheckRow>
            </Field>
          </Sec>

          {/* 5. Doelgroep */}
          <Sec id="doelgroep" title="5. Doelgroep" icon={UserGroup02Icon}>
            <Field labelId="f.doelgroep_type" label="Type">
              <CheckRow>
                {["Particulieren", "Bedrijven", "Beide"].map((o) => (
                  <Check key={o} label={o} checked={has("doelgroep_type", o)} onChange={() => toggle("doelgroep_type", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.segment" label="Specifiek segment">
              <CheckRow>
                {["Luxe klanten", "Budget klanten", "Spoedzoekers", "Lokale klanten", "Landelijk"].map((o) => (
                  <Check key={o} label={o} checked={has("segment", o)} onChange={() => toggle("segment", o)} />
                ))}
              </CheckRow>
            </Field>
          </Sec>

          {/* 6. Klantproblemen */}
          <Sec id="problemen" title="6. Klantproblemen" icon={AlertCircleIcon}>
            <Field labelId="f.problemen" label="Veelvoorkomende klantproblemen">
              <CheckRow>
                {["Te duur bij anderen", "Lang wachten bij concurrenten", "Slechte ervaring elders", "Spoedgeval", "Geen vertrouwen in andere aanbieders", "Onduidelijke prijzen bij anderen"].map((o) => (
                  <Check key={o} label={o} checked={has("problemen", o)} onChange={() => toggle("problemen", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.problemen_anders" label="Anders" className="mt-3">
              <Input value={data.problemen_anders ?? ""} onChange={(e) => set("problemen_anders", e.target.value)} />
            </Field>
          </Sec>

          {/* 7. USP's */}
          <Sec id="usp" title="7. USP's & Positionering" icon={StarIcon}>
            <Field labelId="f.usp" label="Waarom moeten klanten JOU kiezen?">
              <CheckRow>
                {["Snelle service", "24/7 beschikbaar", "Goedkoop", "Premium kwaliteit", "Garantie", "Gecertificeerd", "Gratis offerte"].map((o) => (
                  <Check key={o} label={o} checked={has("usp", o)} onChange={() => toggle("usp", o)} />
                ))}
              </CheckRow>
              <div className="flex items-center gap-2 mt-3">
                <Label className="text-[13px]">Ervaring (jaren)</Label>
                <Input className="w-24" type="number" value={data.ervaring_jaren ?? ""} onChange={(e) => set("ervaring_jaren", e.target.value)} />
              </div>
            </Field>
            <Field labelId="f.ad_focus" label="Advertentie focus">
              <CheckRow>
                {["Snelheid", "Prijs", "Kwaliteit", "Ervaring", "Garantie", "Luxe uitstraling", "Groot bereik"].map((o) => (
                  <Check key={o} label={o} checked={has("ad_focus", o)} onChange={() => toggle("ad_focus", o)} />
                ))}
              </CheckRow>
            </Field>
          </Sec>

          {/* 8. Vertrouwen */}
          <Sec id="vertrouwen" title="8. Vertrouwen & Autoriteit" icon={Shield01Icon}>
            <Field labelId="f.vertrouwen" label="Vertrouwen & autoriteit punten">
              <CheckRow>
                {["Aantal klanten geholpen", "Jaren actief", "Bekende merken gewerkt voor", "Bekend in regio", "Media vermeldingen", "Lid van brancheorganisatie"].map((o) => (
                  <Check key={o} label={o} checked={has("vertrouwen", o)} onChange={() => toggle("vertrouwen", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.reviews_op" label="Reviews op">
              <CheckRow>
                {["Google", "Facebook", "Trustpilot", "Brancheplatform"].map((o) => (
                  <Check key={o} label={o} checked={has("reviews_op", o)} onChange={() => toggle("reviews_op", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.review_links" label="Links naar reviews">
              <Textarea value={data.review_links ?? ""} onChange={(e) => set("review_links", e.target.value)} placeholder="Eén link per regel" />
            </Field>
          </Sec>

          {/* 9. Concurrentie */}
          <Sec id="concurrentie" title="9. Markt, Concurrentie & Inspiratie" icon={Crown02Icon}>
            <Field labelId="f.concurrenten" label="Concurrenten (3)">
              {[0, 1, 2].map((i) => (
                <Input key={i} className="mb-2" value={(data.concurrenten ?? [])[i] ?? ""} onChange={(e) => {
                  const arr = [...((data.concurrenten as string[]) ?? ["", "", ""])];
                  arr[i] = e.target.value;
                  set("concurrenten", arr);
                }} placeholder={`Concurrent ${i + 1}`} />
              ))}
            </Field>
            <Field labelId="f.beter_dan_hen" label="Wat doe jij beter dan hen?"><Textarea value={data.beter_dan_hen ?? ""} onChange={(e) => set("beter_dan_hen", e.target.value)} /></Field>
            <Field labelId="f.voorbeeld_sites" label="Voorbeeldwebsites (stijl / uitstraling)">
              {[0, 1, 2].map((i) => (
                <Input key={i} className="mb-2" value={(data.voorbeeld_sites ?? [])[i] ?? ""} onChange={(e) => {
                  const arr = [...((data.voorbeeld_sites as string[]) ?? ["", "", ""])];
                  arr[i] = e.target.value;
                  set("voorbeeld_sites", arr);
                }} placeholder={`Site ${i + 1}`} />
              ))}
            </Field>
          </Sec>

          {/* 10. Materiaal */}
          <Sec id="materiaal" title="10. Advertentiemateriaal" icon={Image01Icon}>
            <Field labelId="f.materiaal" label="Beschikbaar advertentiemateriaal">
              <CheckRow>
                {["Voor/na foto's", "Video's", "Certificaten", "Keurmerken", "Klantcases"].map((o) => (
                  <Check key={o} label={o} checked={has("materiaal", o)} onChange={() => toggle("materiaal", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.materiaal_links" label="Links naar materiaal">
              <Textarea value={data.materiaal_links ?? ""} onChange={(e) => set("materiaal_links", e.target.value)} placeholder="Eén link per regel" />
            </Field>
          </Sec>

          {/* 11. Do's & Don'ts */}
          <Sec id="dosdonts" title="11. Do's & Don'ts in advertenties" icon={CheckmarkCircle02Icon}>
            <Field labelId="f.dos" label="Moet in advertenties staan"><Textarea value={data.dos ?? ""} onChange={(e) => set("dos", e.target.value)} /></Field>
            <Field labelId="f.donts" label="Mag NIET in advertenties staan"><Textarea value={data.donts ?? ""} onChange={(e) => set("donts", e.target.value)} /></Field>
          </Sec>

          {/* 12. FAQ */}
          <Sec id="faq" title="12. Veelgestelde vragen van klanten" icon={HelpCircleIcon}>
            {[0, 1, 2].map((i) => (
              <Input key={i} className="mb-2" value={(data.faq ?? [])[i] ?? ""} onChange={(e) => {
                const arr = [...((data.faq as string[]) ?? ["", "", ""])];
                arr[i] = e.target.value;
                set("faq", arr);
              }} placeholder={`Vraag ${i + 1}`} />
            ))}
          </Sec>

          {/* 13. Planning */}
          <Sec id="planning" title="13. Planning & Seizoenen" icon={Calendar03Icon}>
            <Field labelId="f.drukke_periodes" label="Drukke periodes">
              <CheckRow>
                {["Heel jaar gelijk", "Zomer drukker", "Winter drukker", "Alleen bij acties"].map((o) => (
                  <Check key={o} label={o} checked={has("drukke_periodes", o)} onChange={() => toggle("drukke_periodes", o)} />
                ))}
              </CheckRow>
            </Field>
            <Field labelId="f.drukte" label="Drukte per dag (1 = heel druk, 3 = rustig)">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"].map((d) => (
                  <div key={d} className="flex items-center gap-2">
                    <Label className="text-[13px] w-20">{d}</Label>
                    <Input type="number" min={1} max={3} className="w-16" value={(data.drukte ?? {})[d] ?? ""} onChange={(e) => set("drukte", { ...(data.drukte ?? {}), [d]: e.target.value })} />
                  </div>
                ))}
              </div>
            </Field>
          </Sec>

          {/* 14. Uitstraling */}
          <Sec id="uitstraling" title="14. Gewenste uitstraling advertenties" icon={PaintBrushIcon}>
            <Field labelId="f.uitstraling" label="Gewenste uitstraling">
              <CheckRow>
                {["Luxe", "Zakelijk", "Vriendelijk", "Stoer", "Modern", "Budgetgericht"].map((o) => (
                  <Check key={o} label={o} checked={has("uitstraling", o)} onChange={() => toggle("uitstraling", o)} />
                ))}
              </CheckRow>
            </Field>
          </Sec>

          {/* 15. Kanalen & Budget */}
          <Sec id="kanalen" title="15. Advertentiekanalen, Budget & Geschiedenis" icon={Megaphone01Icon}>
            <Field labelId="f.kanalen" label="Kanalen">
              {["Google Ads", "Facebook / Instagram", "TikTok"].map((o) => (
                <Check key={o} label={o} checked={has("kanalen", o)} onChange={() => toggle("kanalen", o)} />
              ))}
              <div className="mt-3">
                <Label className="text-[13px]">Andere kanalen</Label>
                {((data.andere_kanalen as string[]) ?? [""]).map((val, i, arr) => (
                  <Input
                    key={i}
                    className="mb-2 mt-1"
                    value={val}
                    placeholder="Bijv. LinkedIn Ads"
                    onChange={(e) => {
                      const next = [...arr];
                      next[i] = e.target.value;
                      // Houd altijd 1 lege rij onderaan
                      const cleaned = next.filter((v, idx) => idx === next.length - 1 || v.trim() !== "");
                      if (cleaned[cleaned.length - 1]?.trim() !== "") cleaned.push("");
                      set("andere_kanalen", cleaned);
                    }}
                  />
                ))}
              </div>
            </Field>
            <Field labelId="f.budget" label="Maandbudget advertenties (€)">
              <Input type="number" value={data.budget ?? ""} onChange={(e) => set("budget", e.target.value)} />
            </Field>
            <Field labelId="f.marketing_situatie" label="Huidige marketing situatie">
              {["Eerder advertenties gedraaid", "Nog nooit geadverteerd", "Resultaten vielen tegen", "Wel leads, maar lage kwaliteit"].map((o) => (
                <Check key={o} label={o} checked={has("marketing_situatie", o)} onChange={() => toggle("marketing_situatie", o)} />
              ))}
            </Field>
          </Sec>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => save()} disabled={saving}>
              <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> Concept opslaan
            </Button>
            <Button onClick={() => save("ingediend")} disabled={saving}>
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} /> Indienen
            </Button>
          </div>
        </div>
      </div>
      </VisibleSectionsContext.Provider>
      </LabelOverrideContext.Provider>
    </div>
  );
}

/* ---------- Helpers ---------- */

type SectionsCtx = { visible: Set<string>; numbers: Map<string, number> };
const VisibleSectionsContext = createContext<SectionsCtx | null>(null);

type LabelOverrides = Record<string, string>;
const LabelOverrideContext = createContext<LabelOverrides>({});

function useLabel(key: string, fallback: string): string {
  const o = useContext(LabelOverrideContext);
  if (key && o && typeof o[key] === "string" && o[key].trim() !== "") return o[key];
  return getLabel(key, o) ?? fallback;
}

function Sec({ id, title, icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) {
  const ctx = useContext(VisibleSectionsContext);
  const overrides = useContext(LabelOverrideContext);
  if (ctx && !ctx.visible.has(id)) return null;
  // Strip eventueel hardcoded "N. " prefix uit title en vervang door dynamisch nummer.
  const cleanFallback = title.replace(/^\s*\d+\.\s*/, "");
  const customLabel = overrides[`sec.${id}`];
  const cleanTitle = customLabel && customLabel.trim() !== "" ? customLabel : cleanFallback;
  const num = ctx?.numbers.get(id);
  const displayTitle = num ? `${num}. ${cleanTitle}` : cleanTitle;
  return (
    <section id={`sec-${id}`} className="bg-card border border-border rounded-lg p-5 scroll-mt-20">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <HugeiconsIcon icon={icon} size={18} className="text-primary" />
        <h2 className="text-[15px] font-semibold text-foreground">{displayTitle}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Grid2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid sm:grid-cols-2 gap-3 ${className}`}>{children}</div>;
}

function Field({ label, labelId, children, className = "" }: { label: string; labelId?: string; children: React.ReactNode; className?: string }) {
  const overrides = useContext(LabelOverrideContext);
  const display = labelId && overrides[labelId] && overrides[labelId].trim() !== ""
    ? overrides[labelId]
    : label;
  return (
    <div className={className}>
      <Label className="text-[13px] mb-3 block">{display}</Label>
      {children}
    </div>
  );
}

function CheckRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-2">{children}</div>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-[13px] text-foreground cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
      <span>{label}</span>
    </label>
  );
}

function Divider() {
  return <div className="border-t border-border my-4" />;
}
