// Standaard labels voor het Website-intakeformulier.
// Per klant kunnen deze overschreven worden via clients.website_intake_labels (jsonb).

export const DEFAULT_WEBSITE_INTAKE_LABELS: Record<string, string> = {
  // Sectie-titels
  "wsec.bedrijf": "Bedrijf & Contact",
  "wsec.doelen": "Doelen van de website",
  "wsec.doelgroep": "Doelgroep",
  "wsec.functionaliteiten": "Functionaliteiten",
  "wsec.design": "Design & Uitstraling",
  "wsec.content": "Content & Teksten",
  "wsec.technisch": "Technisch & Domein",
  "wsec.planning": "Planning & Budget",

  // Bedrijf
  "wf.bedrijfsnaam": "Bedrijfsnaam",
  "wf.contactpersoon": "Contactpersoon",
  "wf.email": "E-mailadres",
  "wf.telefoon": "Telefoonnummer",
  "wf.huidige_website": "Huidige website (indien aanwezig)",
  "wf.branche": "Branche / sector",

  // Doelen
  "wf.type_website": "Type website",
  "wf.hoofddoel": "Hoofddoel van de website",
  "wf.belangrijkste_actie": "Belangrijkste actie die bezoekers moeten doen",
  "wf.succes_meten": "Hoe meten we succes?",

  // Doelgroep
  "wf.primaire_doelgroep": "Primaire doelgroep",
  "wf.leeftijd_geslacht": "Leeftijd / geslacht",
  "wf.locatie_doelgroep": "Locatie doelgroep",
  "wf.taal": "Talen op de website",

  // Functionaliteiten
  "wf.functionaliteiten": "Gewenste functionaliteiten",
  "wf.aantal_paginas": "Geschat aantal pagina's",
  "wf.integraties": "Integraties (CRM, e-mail, agenda, etc.)",
  "wf.cms_voorkeur": "CMS voorkeur",

  // Design
  "wf.stijl": "Gewenste stijl / sfeer",
  "wf.kleurvoorkeur": "Kleurvoorkeur",
  "wf.huisstijl_aanwezig": "Is er een huisstijl / logo?",
  "wf.voorbeelden_mooi": "Voorbeeldwebsites die je mooi vindt",
  "wf.voorbeelden_lelijk": "Websites die je juist NIET mooi vindt",

  // Content
  "wf.teksten_aanwezig": "Zijn de teksten al klaar?",
  "wf.fotos_aanwezig": "Zijn er foto's beschikbaar?",
  "wf.copywriter_nodig": "Copywriter nodig?",
  "wf.fotograaf_nodig": "Fotograaf nodig?",

  // Technisch
  "wf.domein": "Domeinnaam",
  "wf.hosting_huidig": "Huidige hosting (indien aanwezig)",
  "wf.email_setup": "E-mail setup nodig?",
  "wf.seo_eisen": "SEO eisen / wensen",
  "wf.avg_cookies": "AVG / cookie wensen",

  // Planning
  "wf.deadline": "Gewenste oplevering",
  "wf.budget_indicatie": "Budget indicatie",
  "wf.beslissers": "Wie beslist mee?",
  "wf.overige_opmerkingen": "Overige opmerkingen",
};

export const ALL_WEBSITE_INTAKE_LABEL_KEYS = Object.keys(DEFAULT_WEBSITE_INTAKE_LABELS);

export function getWebsiteLabel(
  key: string,
  overrides?: Record<string, string> | null
): string {
  const o = overrides?.[key];
  if (o && o.trim() !== "") return o;
  return DEFAULT_WEBSITE_INTAKE_LABELS[key] ?? key;
}
