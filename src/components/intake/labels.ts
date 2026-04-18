// Standaard labels voor het intake-formulier.
// Per klant kunnen deze overschreven worden via clients.intake_labels (jsonb).
// Sleutel = stabiele identifier, waarde = standaard NL-label.

export const DEFAULT_INTAKE_LABELS: Record<string, string> = {
  // Sectie-titels (key = "sec.<sectionId>")
  "sec.bedrijf": "Bedrijfsgegevens & Factuurgegevens",
  "sec.werkgebied": "Werkgebied",
  "sec.dienst": "Dienst / Aanbod",
  "sec.doel": "Doel van de advertenties",
  "sec.doelgroep": "Doelgroep",
  "sec.problemen": "Klantproblemen",
  "sec.usp": "USP's & Positionering",
  "sec.vertrouwen": "Vertrouwen & Autoriteit",
  "sec.concurrentie": "Markt, Concurrentie & Inspiratie",
  "sec.materiaal": "Advertentiemateriaal",
  "sec.dosdonts": "Do's & Don'ts in advertenties",
  "sec.faq": "Veelgestelde vragen van klanten",
  "sec.planning": "Planning & Seizoenen",
  "sec.uitstraling": "Gewenste uitstraling advertenties",
  "sec.kanalen": "Advertentiekanalen, Budget & Geschiedenis",

  // Veld-labels
  "f.bedrijfsnaam": "Bedrijfsnaam",
  "f.contactpersoon": "Contactpersoon",
  "f.telefoon": "Telefoonnummer",
  "f.email": "E-mailadres",
  "f.vestigingsplaats": "Vestigingsplaats",
  "f.whatsapp_block": "WhatsApp",
  "f.factuur_naam": "Officiële bedrijfsnaam",
  "f.factuur_email": "Factuur e-mailadres",
  "f.factuur_adres": "Factuuradres",
  "f.factuur_postcode": "Postcode",
  "f.factuur_plaats": "Plaats",
  "f.factuur_kvk": "KvK-nummer",
  "f.factuur_btw": "BTW-nummer",

  "f.steden": "Steden / regio",
  "f.werkgebied_type": "Werkgebied type",
  "f.max_rij_km": "Max afstand naar klanten (km)",
  "f.max_radius_km": "Max advertentie-radius (km)",

  "f.hoofddienst": "Hoofddienst of product",
  "f.tweede_dienst": "Tweede dienst (optioneel)",
  "f.spoed": "Spoed of normaal?",
  "f.heeft_actie": "Actie / aanbieding?",

  "f.doelen": "Doelen",
  "f.conversiepunt": "Conversiepunt",

  "f.doelgroep_type": "Type",
  "f.segment": "Specifiek segment",

  "f.problemen_anders": "Anders",

  "f.usp": "Waarom moeten klanten JOU kiezen?",
  "f.ad_focus": "Advertentie focus",

  "f.reviews_op": "Reviews op",
  "f.review_links": "Links naar reviews",

  "f.concurrenten": "Concurrenten (3)",
  "f.beter_dan_hen": "Wat doe jij beter dan hen?",
  "f.voorbeeld_sites": "Voorbeeldwebsites (stijl / uitstraling)",

  "f.materiaal_links": "Links naar materiaal",

  "f.dos": "Moet in advertenties staan",
  "f.donts": "Mag NIET in advertenties staan",

  "f.drukke_periodes": "Drukke periodes",
  "f.drukte": "Drukte per dag (1 = heel druk, 3 = rustig)",

  "f.kanalen": "Kanalen",
  "f.budget": "Maandbudget advertenties (€)",
  "f.marketing_situatie": "Huidige marketing situatie",
};

export const ALL_INTAKE_LABEL_KEYS = Object.keys(DEFAULT_INTAKE_LABELS);

export function getLabel(
  key: string,
  overrides?: Record<string, string> | null
): string {
  const o = overrides?.[key];
  if (o && o.trim() !== "") return o;
  return DEFAULT_INTAKE_LABELS[key] ?? key;
}
