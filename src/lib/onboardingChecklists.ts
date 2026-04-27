// Aanleverlijsten per dienst voor de partner/klant onboarding wizard.
// Elke dienst heeft een set velden die de invuller moet beantwoorden.

export type FieldType = "text" | "textarea" | "url" | "email" | "tel" | "select" | "multiselect" | "number" | "checkbox";

export interface OnboardingField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: string[]; // voor select / multiselect
  /**
   * Optioneel: lijst van service-id's die dit veld al (deels) afdekken.
   * Wordt gebruikt om gemeenschappelijke aanlevervelden te verbergen
   * wanneer ze al binnen een gekozen dienst gevraagd zijn.
   */
  coveredBy?: string[];
}

export interface OnboardingService {
  id: string;
  label: string;
  category: "marketing" | "website";
  description: string;
  fields: OnboardingField[];
}

export const ONBOARDING_SERVICES: OnboardingService[] = [
  // ===== MARKETING =====
  {
    id: "google_ads",
    label: "Google Ads",
    category: "marketing",
    description: "Zoek-, Display-, Performance Max en YouTube campagnes via Google.",
    fields: [
      { key: "google_ads_id", label: "Google Ads klant-ID (10 cijfers)", type: "text", placeholder: "123-456-7890", help: "Te vinden rechtsboven in je Google Ads account." },
      { key: "mcc_access_granted", label: "Toegang verleend aan ons MCC (mcc@webiro.nl)?", type: "select", options: ["Ja", "Nee, hulp nodig"], required: true },
      { key: "ga4_property_id", label: "GA4 Property ID", type: "text", placeholder: "GA4-XXXXXXXX" },
      { key: "gtm_container_id", label: "Google Tag Manager container ID", type: "text", placeholder: "GTM-XXXXXX" },
      { key: "monthly_budget", label: "Maandelijks media-budget (€)", type: "number", required: true },
      { key: "campaign_goals", label: "Belangrijkste doelen", type: "multiselect", options: ["Leads", "Verkoop / e-commerce", "Telefoongesprekken", "Naamsbekendheid", "Winkelbezoek", "App-installs"], required: true },
      { key: "conversion_actions", label: "Conversies die we moeten meten", type: "textarea", placeholder: "Bijv. formulier verzonden, telefoongesprek > 60s, aankoop, demo aangevraagd" },
      { key: "target_audience", label: "Doelgroep / ideale klant", type: "textarea", required: true },
      { key: "service_area", label: "Bedienings-/leveringsgebied", type: "text", placeholder: "Heel NL / Randstad / Internationaal" },
      { key: "usps", label: "USP's en sterke punten", type: "textarea", required: true },
      { key: "competitors", label: "Top 3 concurrenten (URL's)", type: "textarea" },
      { key: "landing_pages", label: "Landingspagina's per dienst/product", type: "textarea", help: "URL + welke dienst, één per regel." },
      { key: "keywords", label: "Belangrijke zoektermen", type: "textarea" },
      { key: "negative_keywords", label: "Uitsluitings-zoektermen", type: "textarea" },
      { key: "branded_terms", label: "Mag op merknaam concurrenten worden geboden?", type: "select", options: ["Ja", "Nee", "Overleg"] },
      { key: "phone_for_calls", label: "Telefoonnummer voor call-extensies", type: "tel" },
    ],
  },
  {
    id: "meta_ads",
    label: "Meta Ads (Facebook & Instagram)",
    category: "marketing",
    description: "Advertenties op Facebook, Instagram, Messenger en het Audience Network.",
    fields: [
      { key: "fb_business_id", label: "Facebook Business Manager ID", type: "text", placeholder: "123456789012345" },
      { key: "bm_access_granted", label: "Toegang verleend aan ons Business Account?", type: "select", options: ["Ja", "Nee, hulp nodig"], required: true },
      { key: "ad_account_id", label: "Advertentieaccount ID (act_...)", type: "text" },
      { key: "fb_page_url", label: "Facebook pagina URL", type: "url", required: true },
      { key: "ig_handle", label: "Instagram @handle", type: "text", required: true },
      { key: "pixel_id", label: "Meta Pixel ID", type: "text" },
      { key: "capi_setup", label: "Conversions API ingesteld?", type: "select", options: ["Ja", "Nee", "Weet ik niet"] },
      { key: "monthly_budget", label: "Maandelijks media-budget (€)", type: "number", required: true },
      { key: "campaign_objective", label: "Belangrijkste doelen", type: "multiselect", options: ["Leads", "Verkoop / catalogus", "Berichten", "Bereik / awareness", "Verkeer", "Engagement", "Video views"], required: true },
      { key: "target_audience", label: "Doelgroep beschrijving", type: "textarea", required: true },
      { key: "geo_targeting", label: "Geografische targeting", type: "text" },
      { key: "creative_assets", label: "Creatives beschikbaar?", type: "multiselect", options: ["Foto's", "Video's", "Reels", "Stories", "Carrousel", "Wij maken alles"] },
      { key: "brand_guidelines", label: "Huisstijl / brand book aanwezig?", type: "select", options: ["Ja, beschikbaar", "Deels", "Nee"] },
      { key: "tone_of_voice", label: "Tone of voice", type: "textarea", placeholder: "Formeel, speels, deskundig, etc." },
      { key: "products_services", label: "Producten/diensten om te promoten", type: "textarea", required: true },
      { key: "offers_promos", label: "Lopende of geplande aanbiedingen", type: "textarea" },
    ],
  },
  {
    id: "tiktok_ads",
    label: "TikTok Ads",
    category: "marketing",
    description: "Advertenties op TikTok via TikTok Ads Manager.",
    fields: [
      { key: "tiktok_handle", label: "TikTok @handle", type: "text", required: true },
      { key: "tiktok_business_id", label: "TikTok Business Center ID", type: "text" },
      { key: "ad_account_access", label: "Toegang verleend aan onze TikTok Ads Manager?", type: "select", options: ["Ja", "Nee, hulp nodig"] },
      { key: "tiktok_pixel", label: "TikTok Pixel geïnstalleerd?", type: "select", options: ["Ja", "Nee", "Weet ik niet"] },
      { key: "monthly_budget", label: "Maandelijks media-budget (€)", type: "number", required: true },
      { key: "campaign_goals", label: "Doelen", type: "multiselect", options: ["Bereik", "Verkeer", "Video views", "Leads", "Verkoop", "App-installs"] },
      { key: "target_audience", label: "Doelgroep", type: "textarea", required: true },
      { key: "creative_style", label: "Creatieve stijl / ideeën", type: "textarea" },
      { key: "creator_collabs", label: "Open voor creator/influencer samenwerkingen?", type: "select", options: ["Ja", "Nee", "Misschien"] },
      { key: "existing_content", label: "Bestaande TikTok content (links)", type: "textarea" },
    ],
  },
  {
    id: "linkedin_ads",
    label: "LinkedIn Ads",
    category: "marketing",
    description: "B2B advertenties op LinkedIn via Campaign Manager.",
    fields: [
      { key: "linkedin_company_url", label: "LinkedIn Company Page URL", type: "url", required: true },
      { key: "campaign_manager_access", label: "Toegang verleend aan ons Campaign Manager account?", type: "select", options: ["Ja", "Nee, hulp nodig"] },
      { key: "insight_tag", label: "LinkedIn Insight Tag geïnstalleerd?", type: "select", options: ["Ja", "Nee", "Weet ik niet"] },
      { key: "monthly_budget", label: "Maandelijks media-budget (€)", type: "number", required: true },
      { key: "ad_formats", label: "Gewenste formats", type: "multiselect", options: ["Sponsored Content", "Message Ads", "Lead Gen Forms", "Conversation Ads", "Video Ads", "Document Ads"] },
      { key: "target_industries", label: "Target branches / industries", type: "textarea" },
      { key: "target_titles", label: "Target functies/titels", type: "textarea", required: true },
      { key: "target_company_size", label: "Bedrijfsgrootte", type: "multiselect", options: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"] },
      { key: "geo_targeting", label: "Geografische targeting", type: "text" },
      { key: "value_proposition", label: "Value proposition voor LinkedIn", type: "textarea", required: true },
      { key: "lead_magnet", label: "Lead magnet (whitepaper, demo, etc.)", type: "textarea" },
    ],
  },
  {
    id: "seo",
    label: "SEO (Zoekmachine optimalisatie)",
    category: "marketing",
    description: "Organische groei via Google: techniek, content en autoriteit.",
    fields: [
      { key: "website_url", label: "Website URL", type: "url", required: true },
      { key: "gsc_access", label: "Google Search Console toegang verleend?", type: "select", options: ["Ja", "Nee, hulp nodig"], required: true },
      { key: "ga4_access", label: "Google Analytics 4 toegang verleend?", type: "select", options: ["Ja", "Nee, hulp nodig"], required: true },
      { key: "cms", label: "Welk CMS draait de site?", type: "text", placeholder: "WordPress, Shopify, Webflow, custom..." },
      { key: "cms_admin_access", label: "Krijgen we admin-toegang tot het CMS?", type: "select", options: ["Ja", "Read-only", "Nee, alleen aanpassingen via jullie"] },
      { key: "current_traffic", label: "Huidig maandelijks organisch verkeer (indien bekend)", type: "text" },
      { key: "target_keywords", label: "Belangrijkste zoektermen waarop je wilt scoren", type: "textarea", required: true },
      { key: "service_locations", label: "Locaties (voor lokale SEO)", type: "textarea" },
      { key: "competitors", label: "Top 3 organische concurrenten", type: "textarea" },
      { key: "content_resources", label: "Wie schrijft de content?", type: "select", options: ["Wij (klant)", "Webiro", "Mix"] },
      { key: "publish_frequency", label: "Gewenste publicatie-frequentie", type: "select", options: ["Wekelijks", "2x per maand", "Maandelijks", "Per kwartaal"] },
      { key: "backlink_assets", label: "Bestaande PR/partnerships voor backlinks", type: "textarea" },
    ],
  },
  {
    id: "social_media",
    label: "Social Media beheer",
    category: "marketing",
    description: "Organisch contentbeheer op je social kanalen.",
    fields: [
      { key: "channels", label: "Welke kanalen beheren we?", type: "multiselect", options: ["Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube", "Pinterest", "X (Twitter)"], required: true },
      { key: "channel_handles", label: "Handles / URLs per kanaal", type: "textarea", required: true, placeholder: "Instagram: @bedrijf\nLinkedIn: /company/bedrijf" },
      { key: "access_method", label: "Hoe verlenen we toegang?", type: "select", options: ["Wachtwoord delen", "Business Manager / page-rol", "Inloggen via jullie device"] },
      { key: "post_frequency", label: "Gewenste post-frequentie per kanaal", type: "textarea" },
      { key: "tone_of_voice", label: "Tone of voice", type: "textarea", required: true },
      { key: "content_pillars", label: "Content pijlers / onderwerpen", type: "textarea" },
      { key: "do_not_post", label: "Onderwerpen / woorden die we NIET mogen gebruiken", type: "textarea" },
      { key: "approval_flow", label: "Posts vooraf laten goedkeuren?", type: "select", options: ["Ja, altijd", "Steekproef", "Nee, jullie posten direct"] },
      { key: "asset_sources", label: "Bron beeldmateriaal", type: "multiselect", options: ["Eigen fotografie", "Stockmateriaal", "Wij maken visuals", "Jullie leveren aan"] },
      { key: "hashtags", label: "Vaste hashtags / branded tags", type: "textarea" },
    ],
  },
  {
    id: "email_marketing",
    label: "E-mailmarketing",
    category: "marketing",
    description: "Nieuwsbrieven, automations en flows.",
    fields: [
      { key: "esp", label: "Email-platform", type: "select", options: ["Mailchimp", "Klaviyo", "ActiveCampaign", "Mailerlite", "HubSpot", "Brevo", "Anders", "Nog te kiezen"], required: true },
      { key: "esp_access", label: "Account toegang verleend?", type: "select", options: ["Ja", "Nee, hulp nodig"] },
      { key: "list_size", label: "Huidige lijstgrootte", type: "number" },
      { key: "send_frequency", label: "Gewenste verzendfrequentie", type: "select", options: ["Wekelijks", "2x per maand", "Maandelijks", "Per kwartaal", "Alleen automations"] },
      { key: "automations_needed", label: "Welke automations / flows?", type: "multiselect", options: ["Welkomstreeks", "Verlaten winkelwagen", "Post-purchase", "Re-engagement", "Verjaardag", "Lead nurture", "Anders"] },
      { key: "domain_for_sending", label: "Verzenddomein", type: "text", placeholder: "mail.jouwbedrijf.nl" },
      { key: "dns_access", label: "Krijgen we DNS toegang voor SPF/DKIM/DMARC?", type: "select", options: ["Ja", "Nee, jullie zetten zelf records", "Hulp nodig"] },
      { key: "brand_template", label: "Bestaande mail-template?", type: "select", options: ["Ja, mooi", "Ja, mag opgefrist", "Nee, opnieuw bouwen"] },
      { key: "content_provider", label: "Wie schrijft de content?", type: "select", options: ["Wij (klant)", "Webiro", "Mix"] },
    ],
  },
  // ===== WEBSITE / WEBSHOP =====
  {
    id: "website",
    label: "Website",
    category: "website",
    description: "Bedrijfssite, landingspagina's of corporate website.",
    fields: [
      { key: "current_url", label: "Huidige website URL (indien aanwezig)", type: "url" },
      { key: "domain", label: "Gewenste domeinnaam", type: "text", required: true },
      { key: "domain_owner", label: "Wie is eigenaar van het domein?", type: "select", options: ["Wij (klant)", "Webiro mag overnemen", "Nieuw te registreren"] },
      { key: "hosting", label: "Hosting voorkeur", type: "select", options: ["Webiro hosting (aanbevolen)", "Eigen hosting", "Nog te bepalen"] },
      { key: "company_description", label: "Korte beschrijving van het bedrijf", type: "textarea", required: true },
      { key: "target_audience", label: "Doelgroep", type: "textarea", required: true },
      { key: "usps", label: "USP's", type: "textarea", required: true },
      { key: "main_goal", label: "Hoofddoel van de website", type: "select", options: ["Leads genereren", "Informeren / portfolio", "Verkopen", "Boekingen", "Service / support", "Combinatie"], required: true },
      { key: "pages_needed", label: "Pagina's die we nodig hebben", type: "textarea", required: true, placeholder: "Home, Over ons, Diensten, Contact..." },
      { key: "examples", label: "Voorbeeldsites die je mooi vindt (URLs)", type: "textarea" },
      { key: "examples_disliked", label: "Sites die je juist niet mooi vindt", type: "textarea" },
      { key: "brand_assets", label: "Wat is er aan huisstijl?", type: "multiselect", options: ["Logo", "Kleurenpalet", "Typografie", "Brand book", "Fotografie", "Iconen", "Niets, opnieuw maken"] },
      { key: "content_provider", label: "Wie levert teksten en beeld?", type: "select", options: ["Wij (klant)", "Webiro", "Mix"] },
      { key: "integrations", label: "Benodigde integraties", type: "multiselect", options: ["Contactformulier", "Nieuwsbrief", "Calendly / boekingen", "Live chat", "CRM (HubSpot/Pipedrive)", "Google Maps", "Reviews", "Anders"] },
      { key: "languages", label: "Talen", type: "multiselect", options: ["Nederlands", "Engels", "Duits", "Frans", "Spaans", "Anders"] },
      { key: "deadline", label: "Gewenste oplevering", type: "text", placeholder: "Bijv. eind Q2 2026" },
    ],
  },
  {
    id: "webshop",
    label: "Webshop",
    category: "website",
    description: "E-commerce shop met producten, kassa en betaling.",
    fields: [
      { key: "platform", label: "Voorkeur platform", type: "select", options: ["Shopify", "WooCommerce", "Lightspeed", "Custom", "Advies graag"], required: true },
      { key: "domain", label: "Gewenste domeinnaam", type: "text", required: true },
      { key: "current_shop", label: "Huidige webshop URL (indien migratie)", type: "url" },
      { key: "product_count", label: "Aantal producten / SKU's", type: "number" },
      { key: "product_categories", label: "Productcategorieën", type: "textarea" },
      { key: "product_data_ready", label: "Productdata aanwezig (foto's, teksten, prijzen)?", type: "select", options: ["Ja, compleet", "Deels", "Nee, hulp nodig"] },
      { key: "payment_methods", label: "Betaalmethoden", type: "multiselect", options: ["iDEAL", "Creditcard", "PayPal", "Klarna (achteraf)", "Bancontact", "Apple/Google Pay", "Op rekening"] },
      { key: "shipping", label: "Verzendmethoden", type: "multiselect", options: ["PostNL", "DHL", "DPD", "Afhalen", "Internationaal", "Eigen bezorging"] },
      { key: "shipping_zones", label: "Verzendgebieden", type: "text" },
      { key: "vat_setup", label: "BTW-tarieven", type: "select", options: ["21% standaard", "9% laag tarief", "Mix", "BTW-vrij"] },
      { key: "stock_management", label: "Voorraadbeheer", type: "select", options: ["In webshop zelf", "Externe voorraad/ERP", "Geen voorraad nodig (dropshipping/dienst)"] },
      { key: "integrations", label: "Integraties", type: "multiselect", options: ["Boekhouding (Moneybird/Exact)", "ERP", "CRM", "Email-marketing", "Google Merchant", "Meta Catalog", "Reviews (Trustpilot/Kiyoh)", "Anders"] },
      { key: "examples", label: "Voorbeeldshops die je mooi vindt", type: "textarea" },
      { key: "brand_assets", label: "Huisstijl beschikbaar?", type: "multiselect", options: ["Logo", "Kleuren", "Typografie", "Brand book", "Productfoto's", "Lifestyle foto's", "Niets"] },
      { key: "languages", label: "Talen", type: "multiselect", options: ["Nederlands", "Engels", "Duits", "Frans", "Anders"] },
      { key: "deadline", label: "Gewenste live-datum", type: "text" },
    ],
  },
];

/**
 * Algemene aanlevervelden die altijd gevraagd worden, ongeacht de gekozen dienst(en).
 * Worden getoond als laatste stap vóór "Controleren en verzenden".
 */
export const COMMON_ASSET_FIELDS: OnboardingField[] = [
  { key: "logo_url", label: "Link naar logo", type: "url", placeholder: "https://drive.google.com/... of https://wetransfer.com/...", help: "Deel een link (Drive, Dropbox, WeTransfer) naar je logo bestanden — bij voorkeur in vector (SVG/AI/EPS) én PNG." },
  { key: "content_url", label: "Link naar content (teksten & beeld)", type: "url", placeholder: "https://drive.google.com/...", help: "Deel een link naar teksten, foto's en eventuele video's." },
  { key: "brand_book_url", label: "Link naar brand book / huisstijl", type: "url", placeholder: "https://drive.google.com/...", help: "Optioneel — als je al een huisstijldocument hebt." },
  { key: "brand_colors", label: "Huisstijl kleuren (HEX-codes)", type: "textarea", placeholder: "#0F172A\n#3A4DEA\n#F8FAFC" },
  { key: "brand_fonts", label: "Lettertypes (fonts)", type: "text", placeholder: "Bijv. Inter, Söhne, Helvetica Neue" },
  { key: "tone_of_voice", label: "Tone of voice / schrijfstijl", type: "textarea", placeholder: "Bijv. zakelijk, persoonlijk, speels, deskundig...", coveredBy: ["meta_ads", "social_media"] },
  { key: "company_description_short", label: "Korte beschrijving van je bedrijf (1–2 zinnen)", type: "textarea", coveredBy: ["website", "webshop"] },
  { key: "key_contacts", label: "Contactpersonen (naam, rol, e-mail, telefoon)", type: "textarea", placeholder: "Jan de Vries — Marketing — jan@bedrijf.nl — 06 12345678" },
  { key: "social_links", label: "Links naar social media kanalen", type: "textarea", placeholder: "Instagram: https://instagram.com/...\nLinkedIn: https://linkedin.com/company/...\nFacebook: ...\nTikTok: ...", coveredBy: ["social_media"] },
  { key: "domain_dns_access", label: "Wie beheert het domein / DNS?", type: "select", options: ["Wij (klant)", "Externe partij", "Webiro mag overnemen", "Weet ik niet"], coveredBy: ["website", "webshop", "email_marketing"] },
  { key: "legal_docs_url", label: "Link naar juridische documenten (KVK, BTW, AV)", type: "url", placeholder: "https://drive.google.com/...", help: "Optioneel — handig voor facturatie en eventuele integraties." },
  { key: "deadline_general", label: "Belangrijke deadlines of mijlpalen", type: "textarea", placeholder: "Bijv. event op 12 juni, lancering Q3 2026...", coveredBy: ["website", "webshop"] },
  { key: "extra_notes", label: "Overige opmerkingen of bestanden", type: "textarea", placeholder: "Alles wat we nog moeten weten." },
];

/**
 * Geeft de gemeenschappelijke aanlevervelden terug, met velden die al door
 * een gekozen dienst gevraagd worden eruit gefilterd.
 */
export function getCommonAssetFields(selectedServiceIds: string[]): OnboardingField[] {
  return COMMON_ASSET_FIELDS.filter((f) => {
    if (!f.coveredBy || f.coveredBy.length === 0) return true;
    return !f.coveredBy.some((sid) => selectedServiceIds.includes(sid));
  });
}

export function getServiceById(id: string): OnboardingService | undefined {
  return ONBOARDING_SERVICES.find((s) => s.id === id);
}
