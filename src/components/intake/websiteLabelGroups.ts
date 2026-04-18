// Mapping van website-intake label-keys naar de bijbehorende sectie.

export const WEBSITE_LABEL_KEYS_BY_SECTION: Record<string, string[]> = {
  bedrijf: [
    "wf.bedrijfsnaam",
    "wf.contactpersoon",
    "wf.email",
    "wf.telefoon",
    "wf.huidige_website",
    "wf.branche",
  ],
  doelen: [
    "wf.type_website",
    "wf.hoofddoel",
    "wf.belangrijkste_actie",
    "wf.succes_meten",
  ],
  doelgroep: [
    "wf.primaire_doelgroep",
    "wf.leeftijd_geslacht",
    "wf.locatie_doelgroep",
    "wf.taal",
  ],
  functionaliteiten: [
    "wf.functionaliteiten",
    "wf.aantal_paginas",
    "wf.integraties",
    "wf.cms_voorkeur",
  ],
  design: [
    "wf.stijl",
    "wf.kleurvoorkeur",
    "wf.huisstijl_aanwezig",
    "wf.voorbeelden_mooi",
    "wf.voorbeelden_lelijk",
  ],
  content: [
    "wf.teksten_aanwezig",
    "wf.fotos_aanwezig",
    "wf.copywriter_nodig",
    "wf.fotograaf_nodig",
  ],
  technisch: [
    "wf.domein",
    "wf.hosting_huidig",
    "wf.email_setup",
    "wf.seo_eisen",
    "wf.avg_cookies",
  ],
  planning: [
    "wf.deadline",
    "wf.budget_indicatie",
    "wf.beslissers",
    "wf.overige_opmerkingen",
  ],
};
