import type { Locale } from "@/lib/onboardingChecklists";

export const ONBOARDING_UI = {
  nl: {
    badge: "Onboarding",
    title: "Aanleverlijst",
    intro: "Vul de informatie in die we nodig hebben om snel met je diensten aan de slag te kunnen.",
    language: "Taal",
    dutch: "Nederlands",
    english: "Engels",

    companyTitle: "Bedrijfsgegevens",
    companySubtitle: "Met wie hebben we te maken?",
    companyName: "Bedrijfsnaam",
    contactPerson: "Contactpersoon",
    email: "E-mail",
    phone: "Telefoon",
    website: "Website",

    servicesTitle: "Welke diensten gaan we doen?",
    servicesSubtitle: "Per dienst krijg je een specifieke aanleverlijst.",
    marketingCat: "Marketing",
    websiteCat: "Website / Webshop",

    stepOf: (i: number, n: number) => `stap ${i} van ${n}`,
    assetsTitle: "Aanleveren van merkmateriaal",
    assetsSubtitle:
      "Deze informatie hebben we sowieso nodig, ongeacht welke dienst(en) je hebt gekozen.",

    overviewTitle: "Controleren en verzenden",
    overviewSubtitle: "Klopt alles? Verstuur dan je aanleverlijst.",
    company: "Bedrijf",
    brandMaterial: "Merkmateriaal",
    noBrandMaterial: "Geen merkmateriaal aangeleverd.",

    doneTitle: "Bedankt, we hebben alles ontvangen!",
    doneText:
      "We nemen de aanleverlijst door en nemen contact met je op zodra we kunnen starten.",
    backHome: "Terug naar home",
    submitMore: "Nog een dienst aanleveren",

    previous: "Vorige",
    next: "Volgende",
    submit: "Versturen",
    submitting: "Versturen...",
    choose: "Kies...",
    addLink: "Nog een link toevoegen",
    removeLink: "Link verwijderen",

    chooseAtLeastOne: "Kies minimaal één dienst",
    fillRequired: (label: string) => `Vul "${label}" in`,
    requiredAt: (svc: string) => `Verplicht veld bij ${svc}.`,
    fillRequiredCompany: "Vul de verplichte velden in",
    fillRequiredCompanyDesc:
      "Bedrijfsnaam, contactpersoon en e-mail zijn vereist.",
    submitFailed: "Versturen mislukt",
  },
  en: {
    badge: "Onboarding",
    title: "Briefing checklist",
    intro:
      "Fill in the information we need to get started on your services quickly.",
    language: "Language",
    dutch: "Dutch",
    english: "English",

    companyTitle: "Company details",
    companySubtitle: "Who are we working with?",
    companyName: "Company name",
    contactPerson: "Contact person",
    email: "Email",
    phone: "Phone",
    website: "Website",

    servicesTitle: "Which services will we be doing?",
    servicesSubtitle: "Each service has its own specific checklist.",
    marketingCat: "Marketing",
    websiteCat: "Website / Webshop",

    stepOf: (i: number, n: number) => `step ${i} of ${n}`,
    assetsTitle: "Brand materials",
    assetsSubtitle:
      "We always need this information, regardless of which service(s) you have chosen.",

    overviewTitle: "Review and submit",
    overviewSubtitle: "Looks good? Submit your checklist.",
    company: "Company",
    brandMaterial: "Brand material",
    noBrandMaterial: "No brand material provided.",

    doneTitle: "Thanks, we have received everything!",
    doneText:
      "We will review the checklist and get in touch as soon as we can start.",
    backHome: "Back to home",
    submitMore: "Submit another service",

    previous: "Previous",
    next: "Next",
    submit: "Submit",
    submitting: "Submitting...",
    choose: "Choose...",
    addLink: "Add another link",
    removeLink: "Remove link",

    chooseAtLeastOne: "Choose at least one service",
    fillRequired: (label: string) => `Please fill in "${label}"`,
    requiredAt: (svc: string) => `Required field for ${svc}.`,
    fillRequiredCompany: "Fill in the required fields",
    fillRequiredCompanyDesc:
      "Company name, contact person and email are required.",
    submitFailed: "Submission failed",
  },
} satisfies Record<Locale, Record<string, any>>;

export type OnboardingUi = (typeof ONBOARDING_UI)["nl"];

export function useOnboardingUi(locale: Locale): OnboardingUi {
  return ONBOARDING_UI[locale];
}
