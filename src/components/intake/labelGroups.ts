// Mapping van intake label-keys naar de bijbehorende sectie.
// Wordt gebruikt om "Vragen hernoemen" gegroepeerd te tonen,
// in dezelfde volgorde en met dezelfde iconen als het intake-formulier zelf.

export const LABEL_KEYS_BY_SECTION: Record<string, string[]> = {
  bedrijf: [
    "f.bedrijfsnaam",
    "f.contactpersoon",
    "f.telefoon",
    "f.whatsapp_block",
    "f.email",
    "f.vestigingsplaats",
    "f.factuur_naam",
    "f.factuur_email",
    "f.factuur_adres",
    "f.factuur_postcode",
    "f.factuur_plaats",
    "f.factuur_kvk",
    "f.factuur_btw",
  ],
  werkgebied: [
    "f.werkgebied_type",
    "f.steden",
    "f.max_rij_km",
    "f.max_radius_km",
  ],
  dienst: [
    "f.hoofddienst",
    "f.tweede_dienst",
    "f.spoed",
    "f.heeft_actie",
  ],
  doel: [
    "f.doelen",
    "f.conversiepunt",
  ],
  doelgroep: [
    "f.doelgroep_type",
    "f.segment",
  ],
  problemen: [
    "f.problemen_anders",
  ],
  usp: [
    "f.usp",
    "f.ad_focus",
  ],
  vertrouwen: [
    "f.reviews_op",
    "f.review_links",
  ],
  concurrentie: [
    "f.concurrenten",
    "f.beter_dan_hen",
    "f.voorbeeld_sites",
  ],
  materiaal: [
    "f.materiaal_links",
  ],
  dosdonts: [
    "f.dos",
    "f.donts",
  ],
  faq: [],
  planning: [
    "f.drukke_periodes",
    "f.drukte",
  ],
  uitstraling: [],
  kanalen: [
    "f.kanalen",
    "f.budget",
    "f.marketing_situatie",
  ],
};
