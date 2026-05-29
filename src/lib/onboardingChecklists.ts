// Aanleverlijsten per dienst voor de partner/klant onboarding wizard.
// Elke dienst heeft een set velden die de invuller moet beantwoorden.
// Alle teksten zijn beschikbaar in NL en EN.

export type Locale = "nl" | "en";

export type I18n = { nl: string; en: string };
export type LocalizedString = string | I18n;

export function tr(value: LocalizedString | undefined, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.nl ?? "";
}

export function trOptions(options: LocalizedString[] | undefined, locale: Locale): string[] {
  return (options ?? []).map((o) => tr(o, locale));
}

export type FieldType = "text" | "textarea" | "url" | "email" | "tel" | "select" | "multiselect" | "number" | "checkbox" | "multilink";

export interface OnboardingField {
  key: string;
  label: LocalizedString;
  type: FieldType;
  placeholder?: LocalizedString;
  help?: LocalizedString;
  required?: boolean;
  options?: LocalizedString[]; // voor select / multiselect
  /**
   * Optioneel: lijst van service-id's die dit veld al (deels) afdekken.
   * Wordt gebruikt om gemeenschappelijke aanlevervelden te verbergen
   * wanneer ze al binnen een gekozen dienst gevraagd zijn.
   */
  coveredBy?: string[];
}

export interface OnboardingService {
  id: string;
  label: LocalizedString;
  category: "marketing" | "website";
  description: LocalizedString;
  fields: OnboardingField[];
}

// Veelgebruikte options gebundeld voor consistentie
const YES_NO_HELP: I18n[] = [
  { nl: "Ja", en: "Yes" },
  { nl: "Nee, hulp nodig", en: "No, need help" },
];
const YES_NO_DONTKNOW: I18n[] = [
  { nl: "Ja", en: "Yes" },
  { nl: "Nee", en: "No" },
  { nl: "Weet ik niet", en: "Not sure" },
];
const CONTENT_PROVIDER: I18n[] = [
  { nl: "Wij (klant)", en: "Us (client)" },
  { nl: "Webiro", en: "Webiro" },
  { nl: "Mix", en: "Mix" },
];

export const ONBOARDING_SERVICES: OnboardingService[] = [
  // ===== MARKETING =====
  {
    id: "google_ads",
    label: { nl: "Google Ads", en: "Google Ads" },
    category: "marketing",
    description: { nl: "Zoek-, Display-, Performance Max en YouTube campagnes via Google.", en: "Search, Display, Performance Max and YouTube campaigns via Google." },
    fields: [
      { key: "google_ads_id", label: { nl: "Google Ads klant-ID (10 cijfers)", en: "Google Ads customer ID (10 digits)" }, type: "text", placeholder: "123-456-7890", help: { nl: "Te vinden rechtsboven in je Google Ads account.", en: "Found at the top right of your Google Ads account." } },
      { key: "mcc_access_granted", label: { nl: "Toegang verleend aan ons MCC (mcc@webiro.nl)?", en: "Access granted to our MCC (mcc@webiro.nl)?" }, type: "select", options: YES_NO_HELP, required: true },
      { key: "ga4_property_id", label: { nl: "GA4 Property ID", en: "GA4 Property ID" }, type: "text", placeholder: "GA4-XXXXXXXX" },
      { key: "gtm_container_id", label: { nl: "Google Tag Manager container ID", en: "Google Tag Manager container ID" }, type: "text", placeholder: "GTM-XXXXXX" },
      { key: "monthly_budget", label: { nl: "Maandelijks media-budget (€)", en: "Monthly media budget (€)" }, type: "number", required: true },
      { key: "campaign_goals", label: { nl: "Belangrijkste doelen", en: "Main goals" }, type: "multiselect", options: [
        { nl: "Leads", en: "Leads" },
        { nl: "Verkoop / e-commerce", en: "Sales / e-commerce" },
        { nl: "Telefoongesprekken", en: "Phone calls" },
        { nl: "Naamsbekendheid", en: "Brand awareness" },
        { nl: "Winkelbezoek", en: "Store visits" },
        { nl: "App-installs", en: "App installs" },
      ], required: true },
      { key: "conversion_actions", label: { nl: "Conversies die we moeten meten", en: "Conversions we should track" }, type: "textarea", placeholder: { nl: "Bijv. formulier verzonden, telefoongesprek > 60s, aankoop, demo aangevraagd", en: "E.g. form submitted, phone call > 60s, purchase, demo requested" } },
      { key: "target_audience", label: { nl: "Doelgroep / ideale klant", en: "Target audience / ideal customer" }, type: "textarea", required: true },
      { key: "service_area", label: { nl: "Bedienings-/leveringsgebied", en: "Service / delivery area" }, type: "text", placeholder: { nl: "Heel NL / Randstad / Internationaal", en: "All NL / Randstad / International" } },
      { key: "usps", label: { nl: "USP's en sterke punten", en: "USPs and strengths" }, type: "textarea", required: true },
      { key: "competitors", label: { nl: "Top 3 concurrenten (URL's)", en: "Top 3 competitors (URLs)" }, type: "textarea" },
      { key: "landing_pages", label: { nl: "Landingspagina's per dienst/product", en: "Landing pages per service/product" }, type: "textarea", help: { nl: "URL + welke dienst, één per regel.", en: "URL + which service, one per line." } },
      { key: "keywords", label: { nl: "Belangrijke zoektermen", en: "Important keywords" }, type: "textarea" },
      { key: "negative_keywords", label: { nl: "Uitsluitings-zoektermen", en: "Negative keywords" }, type: "textarea" },
      { key: "branded_terms", label: { nl: "Mag op merknaam concurrenten worden geboden?", en: "Can we bid on competitor brand names?" }, type: "select", options: [
        { nl: "Ja", en: "Yes" },
        { nl: "Nee", en: "No" },
        { nl: "Overleg", en: "Discuss" },
      ] },
      { key: "phone_for_calls", label: { nl: "Telefoonnummer voor call-extensies", en: "Phone number for call extensions" }, type: "tel" },
    ],
  },
  {
    id: "meta_ads",
    label: { nl: "Meta Ads (Facebook & Instagram)", en: "Meta Ads (Facebook & Instagram)" },
    category: "marketing",
    description: { nl: "Advertenties op Facebook, Instagram, Messenger en het Audience Network.", en: "Ads on Facebook, Instagram, Messenger and the Audience Network." },
    fields: [
      { key: "fb_business_id", label: { nl: "Facebook Business Manager ID", en: "Facebook Business Manager ID" }, type: "text", placeholder: "123456789012345" },
      { key: "bm_access_granted", label: { nl: "Toegang verleend aan ons Business Account?", en: "Access granted to our Business Account?" }, type: "select", options: YES_NO_HELP, required: true },
      { key: "ad_account_id", label: { nl: "Advertentieaccount ID (act_...)", en: "Ad account ID (act_...)" }, type: "text" },
      { key: "fb_page_url", label: { nl: "Facebook pagina URL", en: "Facebook page URL" }, type: "url", required: true },
      { key: "ig_handle", label: { nl: "Instagram @handle", en: "Instagram @handle" }, type: "text", required: true },
      { key: "pixel_id", label: { nl: "Meta Pixel ID", en: "Meta Pixel ID" }, type: "text" },
      { key: "capi_setup", label: { nl: "Conversions API ingesteld?", en: "Conversions API set up?" }, type: "select", options: YES_NO_DONTKNOW },
      { key: "monthly_budget", label: { nl: "Maandelijks media-budget (€)", en: "Monthly media budget (€)" }, type: "number", required: true },
      { key: "campaign_objective", label: { nl: "Belangrijkste doelen", en: "Main goals" }, type: "multiselect", options: [
        { nl: "Leads", en: "Leads" },
        { nl: "Verkoop / catalogus", en: "Sales / catalog" },
        { nl: "Berichten", en: "Messages" },
        { nl: "Bereik / awareness", en: "Reach / awareness" },
        { nl: "Verkeer", en: "Traffic" },
        { nl: "Engagement", en: "Engagement" },
        { nl: "Video views", en: "Video views" },
      ], required: true },
      { key: "target_audience", label: { nl: "Doelgroep beschrijving", en: "Target audience description" }, type: "textarea", required: true },
      { key: "geo_targeting", label: { nl: "Geografische targeting", en: "Geographic targeting" }, type: "text" },
      { key: "creative_assets", label: { nl: "Creatives beschikbaar?", en: "Creative assets available?" }, type: "multiselect", options: [
        { nl: "Foto's", en: "Photos" },
        { nl: "Video's", en: "Videos" },
        { nl: "Reels", en: "Reels" },
        { nl: "Stories", en: "Stories" },
        { nl: "Carrousel", en: "Carousel" },
        { nl: "Wij maken alles", en: "We create everything" },
      ] },
      { key: "brand_guidelines", label: { nl: "Huisstijl / brand book aanwezig?", en: "Brand guidelines / brand book available?" }, type: "select", options: [
        { nl: "Ja, beschikbaar", en: "Yes, available" },
        { nl: "Deels", en: "Partly" },
        { nl: "Nee", en: "No" },
      ] },
      { key: "tone_of_voice", label: { nl: "Tone of voice", en: "Tone of voice" }, type: "textarea", placeholder: { nl: "Formeel, speels, deskundig, etc.", en: "Formal, playful, expert, etc." } },
      { key: "products_services", label: { nl: "Producten/diensten om te promoten", en: "Products/services to promote" }, type: "textarea", required: true },
      { key: "offers_promos", label: { nl: "Lopende of geplande aanbiedingen", en: "Current or planned offers" }, type: "textarea" },
    ],
  },
  {
    id: "tiktok_ads",
    label: { nl: "TikTok Ads", en: "TikTok Ads" },
    category: "marketing",
    description: { nl: "Advertenties op TikTok via TikTok Ads Manager.", en: "Ads on TikTok via TikTok Ads Manager." },
    fields: [
      { key: "tiktok_handle", label: { nl: "TikTok @handle", en: "TikTok @handle" }, type: "text", required: true },
      { key: "tiktok_business_id", label: { nl: "TikTok Business Center ID", en: "TikTok Business Center ID" }, type: "text" },
      { key: "ad_account_access", label: { nl: "Toegang verleend aan onze TikTok Ads Manager?", en: "Access granted to our TikTok Ads Manager?" }, type: "select", options: YES_NO_HELP },
      { key: "tiktok_pixel", label: { nl: "TikTok Pixel geïnstalleerd?", en: "TikTok Pixel installed?" }, type: "select", options: YES_NO_DONTKNOW },
      { key: "monthly_budget", label: { nl: "Maandelijks media-budget (€)", en: "Monthly media budget (€)" }, type: "number", required: true },
      { key: "campaign_goals", label: { nl: "Doelen", en: "Goals" }, type: "multiselect", options: [
        { nl: "Bereik", en: "Reach" },
        { nl: "Verkeer", en: "Traffic" },
        { nl: "Video views", en: "Video views" },
        { nl: "Leads", en: "Leads" },
        { nl: "Verkoop", en: "Sales" },
        { nl: "App-installs", en: "App installs" },
      ] },
      { key: "target_audience", label: { nl: "Doelgroep", en: "Target audience" }, type: "textarea", required: true },
      { key: "creative_style", label: { nl: "Creatieve stijl / ideeën", en: "Creative style / ideas" }, type: "textarea" },
      { key: "creator_collabs", label: { nl: "Open voor creator/influencer samenwerkingen?", en: "Open to creator/influencer collaborations?" }, type: "select", options: [
        { nl: "Ja", en: "Yes" },
        { nl: "Nee", en: "No" },
        { nl: "Misschien", en: "Maybe" },
      ] },
      { key: "existing_content", label: { nl: "Bestaande TikTok content (links)", en: "Existing TikTok content (links)" }, type: "textarea" },
    ],
  },
  {
    id: "linkedin_ads",
    label: { nl: "LinkedIn Ads", en: "LinkedIn Ads" },
    category: "marketing",
    description: { nl: "B2B advertenties op LinkedIn via Campaign Manager.", en: "B2B ads on LinkedIn via Campaign Manager." },
    fields: [
      { key: "linkedin_company_url", label: { nl: "LinkedIn Company Page URL", en: "LinkedIn Company Page URL" }, type: "url", required: true },
      { key: "campaign_manager_access", label: { nl: "Toegang verleend aan ons Campaign Manager account?", en: "Access granted to our Campaign Manager account?" }, type: "select", options: YES_NO_HELP },
      { key: "insight_tag", label: { nl: "LinkedIn Insight Tag geïnstalleerd?", en: "LinkedIn Insight Tag installed?" }, type: "select", options: YES_NO_DONTKNOW },
      { key: "monthly_budget", label: { nl: "Maandelijks media-budget (€)", en: "Monthly media budget (€)" }, type: "number", required: true },
      { key: "ad_formats", label: { nl: "Gewenste formats", en: "Preferred formats" }, type: "multiselect", options: [
        { nl: "Sponsored Content", en: "Sponsored Content" },
        { nl: "Message Ads", en: "Message Ads" },
        { nl: "Lead Gen Forms", en: "Lead Gen Forms" },
        { nl: "Conversation Ads", en: "Conversation Ads" },
        { nl: "Video Ads", en: "Video Ads" },
        { nl: "Document Ads", en: "Document Ads" },
      ] },
      { key: "target_industries", label: { nl: "Target branches / industries", en: "Target industries" }, type: "textarea" },
      { key: "target_titles", label: { nl: "Target functies/titels", en: "Target job titles" }, type: "textarea", required: true },
      { key: "target_company_size", label: { nl: "Bedrijfsgrootte", en: "Company size" }, type: "multiselect", options: [
        "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+",
      ] },
      { key: "geo_targeting", label: { nl: "Geografische targeting", en: "Geographic targeting" }, type: "text" },
      { key: "value_proposition", label: { nl: "Value proposition voor LinkedIn", en: "Value proposition for LinkedIn" }, type: "textarea", required: true },
      { key: "lead_magnet", label: { nl: "Lead magnet (whitepaper, demo, etc.)", en: "Lead magnet (whitepaper, demo, etc.)" }, type: "textarea" },
    ],
  },
  {
    id: "seo",
    label: { nl: "SEO (Zoekmachine optimalisatie)", en: "SEO (Search engine optimization)" },
    category: "marketing",
    description: { nl: "Organische groei via Google: techniek, content en autoriteit.", en: "Organic growth via Google: technical, content and authority." },
    fields: [
      { key: "website_url", label: { nl: "Website URL", en: "Website URL" }, type: "url", required: true },
      { key: "gsc_access", label: { nl: "Google Search Console toegang verleend?", en: "Google Search Console access granted?" }, type: "select", options: YES_NO_HELP, required: true },
      { key: "ga4_access", label: { nl: "Google Analytics 4 toegang verleend?", en: "Google Analytics 4 access granted?" }, type: "select", options: YES_NO_HELP, required: true },
      { key: "cms", label: { nl: "Welk CMS draait de site?", en: "Which CMS does the site run on?" }, type: "text", placeholder: { nl: "WordPress, Shopify, Webflow, custom...", en: "WordPress, Shopify, Webflow, custom..." } },
      { key: "cms_admin_access", label: { nl: "Krijgen we admin-toegang tot het CMS?", en: "Do we get admin access to the CMS?" }, type: "select", options: [
        { nl: "Ja", en: "Yes" },
        { nl: "Read-only", en: "Read-only" },
        { nl: "Nee, alleen aanpassingen via jullie", en: "No, changes only via you" },
      ] },
      { key: "current_traffic", label: { nl: "Huidig maandelijks organisch verkeer (indien bekend)", en: "Current monthly organic traffic (if known)" }, type: "text" },
      { key: "target_keywords", label: { nl: "Belangrijkste zoektermen waarop je wilt scoren", en: "Top keywords you want to rank for" }, type: "textarea", required: true },
      { key: "service_locations", label: { nl: "Locaties (voor lokale SEO)", en: "Locations (for local SEO)" }, type: "textarea" },
      { key: "competitors", label: { nl: "Top 3 organische concurrenten", en: "Top 3 organic competitors" }, type: "textarea" },
      { key: "content_resources", label: { nl: "Wie schrijft de content?", en: "Who writes the content?" }, type: "select", options: CONTENT_PROVIDER },
      { key: "publish_frequency", label: { nl: "Gewenste publicatie-frequentie", en: "Desired publishing frequency" }, type: "select", options: [
        { nl: "Wekelijks", en: "Weekly" },
        { nl: "2x per maand", en: "Twice a month" },
        { nl: "Maandelijks", en: "Monthly" },
        { nl: "Per kwartaal", en: "Quarterly" },
      ] },
      { key: "backlink_assets", label: { nl: "Bestaande PR/partnerships voor backlinks", en: "Existing PR/partnerships for backlinks" }, type: "textarea" },
    ],
  },
  {
    id: "social_media",
    label: { nl: "Social Media beheer", en: "Social Media management" },
    category: "marketing",
    description: { nl: "Organisch contentbeheer op je social kanalen.", en: "Organic content management on your social channels." },
    fields: [
      { key: "channels", label: { nl: "Welke kanalen beheren we?", en: "Which channels do we manage?" }, type: "multiselect", options: [
        "Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube", "Pinterest", "X (Twitter)",
      ], required: true },
      { key: "channel_handles", label: { nl: "Handles / URLs per kanaal", en: "Handles / URLs per channel" }, type: "textarea", required: true, placeholder: { nl: "Instagram: @bedrijf\nLinkedIn: /company/bedrijf", en: "Instagram: @company\nLinkedIn: /company/company" } },
      { key: "access_method", label: { nl: "Hoe verlenen we toegang?", en: "How do we grant access?" }, type: "select", options: [
        { nl: "Wachtwoord delen", en: "Share password" },
        { nl: "Business Manager / page-rol", en: "Business Manager / page role" },
        { nl: "Inloggen via jullie device", en: "Login via your device" },
      ] },
      { key: "post_frequency", label: { nl: "Gewenste post-frequentie per kanaal", en: "Desired posting frequency per channel" }, type: "textarea" },
      { key: "tone_of_voice", label: { nl: "Tone of voice", en: "Tone of voice" }, type: "textarea", required: true },
      { key: "content_pillars", label: { nl: "Content pijlers / onderwerpen", en: "Content pillars / topics" }, type: "textarea" },
      { key: "do_not_post", label: { nl: "Onderwerpen / woorden die we NIET mogen gebruiken", en: "Topics / words we should NOT use" }, type: "textarea" },
      { key: "approval_flow", label: { nl: "Posts vooraf laten goedkeuren?", en: "Posts require approval beforehand?" }, type: "select", options: [
        { nl: "Ja, altijd", en: "Yes, always" },
        { nl: "Steekproef", en: "Spot checks" },
        { nl: "Nee, jullie posten direct", en: "No, you post directly" },
      ] },
      { key: "asset_sources", label: { nl: "Bron beeldmateriaal", en: "Source of visual material" }, type: "multiselect", options: [
        { nl: "Eigen fotografie", en: "Own photography" },
        { nl: "Stockmateriaal", en: "Stock material" },
        { nl: "Wij maken visuals", en: "We create visuals" },
        { nl: "Jullie leveren aan", en: "You provide" },
      ] },
      { key: "hashtags", label: { nl: "Vaste hashtags / branded tags", en: "Fixed hashtags / branded tags" }, type: "textarea" },
    ],
  },
  {
    id: "email_marketing",
    label: { nl: "E-mailmarketing", en: "Email marketing" },
    category: "marketing",
    description: { nl: "Nieuwsbrieven, automations en flows.", en: "Newsletters, automations and flows." },
    fields: [
      { key: "esp", label: { nl: "Email-platform", en: "Email platform" }, type: "select", options: [
        "Mailchimp", "Klaviyo", "ActiveCampaign", "Mailerlite", "HubSpot", "Brevo",
        { nl: "Anders", en: "Other" },
        { nl: "Nog te kiezen", en: "To be chosen" },
      ], required: true },
      { key: "esp_access", label: { nl: "Account toegang verleend?", en: "Account access granted?" }, type: "select", options: YES_NO_HELP },
      { key: "list_size", label: { nl: "Huidige lijstgrootte", en: "Current list size" }, type: "number" },
      { key: "send_frequency", label: { nl: "Gewenste verzendfrequentie", en: "Desired send frequency" }, type: "select", options: [
        { nl: "Wekelijks", en: "Weekly" },
        { nl: "2x per maand", en: "Twice a month" },
        { nl: "Maandelijks", en: "Monthly" },
        { nl: "Per kwartaal", en: "Quarterly" },
        { nl: "Alleen automations", en: "Automations only" },
      ] },
      { key: "automations_needed", label: { nl: "Welke automations / flows?", en: "Which automations / flows?" }, type: "multiselect", options: [
        { nl: "Welkomstreeks", en: "Welcome series" },
        { nl: "Verlaten winkelwagen", en: "Abandoned cart" },
        { nl: "Post-purchase", en: "Post-purchase" },
        { nl: "Re-engagement", en: "Re-engagement" },
        { nl: "Verjaardag", en: "Birthday" },
        { nl: "Lead nurture", en: "Lead nurture" },
        { nl: "Anders", en: "Other" },
      ] },
      { key: "domain_for_sending", label: { nl: "Verzenddomein", en: "Sending domain" }, type: "text", placeholder: { nl: "mail.jouwbedrijf.nl", en: "mail.yourcompany.com" } },
      { key: "dns_access", label: { nl: "Krijgen we DNS toegang voor SPF/DKIM/DMARC?", en: "Do we get DNS access for SPF/DKIM/DMARC?" }, type: "select", options: [
        { nl: "Ja", en: "Yes" },
        { nl: "Nee, jullie zetten zelf records", en: "No, you set the records yourselves" },
        { nl: "Hulp nodig", en: "Need help" },
      ] },
      { key: "brand_template", label: { nl: "Bestaande mail-template?", en: "Existing mail template?" }, type: "select", options: [
        { nl: "Ja, mooi", en: "Yes, looks good" },
        { nl: "Ja, mag opgefrist", en: "Yes, could use a refresh" },
        { nl: "Nee, opnieuw bouwen", en: "No, rebuild" },
      ] },
      { key: "content_provider", label: { nl: "Wie schrijft de content?", en: "Who writes the content?" }, type: "select", options: CONTENT_PROVIDER },
    ],
  },
  // ===== WEBSITE / WEBSHOP =====
  {
    id: "website",
    label: { nl: "Website", en: "Website" },
    category: "website",
    description: { nl: "Bedrijfssite, landingspagina's of corporate website.", en: "Business site, landing pages or corporate website." },
    fields: [
      { key: "current_url", label: { nl: "Huidige website URL (indien aanwezig)", en: "Current website URL (if any)" }, type: "url" },
      { key: "domain", label: { nl: "Gewenste domeinnaam", en: "Desired domain name" }, type: "text", required: true },
      { key: "domain_owner", label: { nl: "Wie is eigenaar van het domein?", en: "Who owns the domain?" }, type: "select", options: [
        { nl: "Wij (klant)", en: "Us (client)" },
        { nl: "Webiro mag overnemen", en: "Webiro may take over" },
        { nl: "Nieuw te registreren", en: "To be newly registered" },
      ] },
      { key: "hosting", label: { nl: "Hosting voorkeur", en: "Hosting preference" }, type: "select", options: [
        { nl: "Webiro hosting (aanbevolen)", en: "Webiro hosting (recommended)" },
        { nl: "Eigen hosting", en: "Own hosting" },
        { nl: "Nog te bepalen", en: "To be decided" },
      ] },
      { key: "company_description", label: { nl: "Korte beschrijving van het bedrijf", en: "Short description of the company" }, type: "textarea", required: true },
      { key: "target_audience", label: { nl: "Doelgroep", en: "Target audience" }, type: "textarea", required: true },
      { key: "usps", label: { nl: "USP's", en: "USPs" }, type: "textarea", required: true },
      { key: "main_goal", label: { nl: "Hoofddoel van de website", en: "Main goal of the website" }, type: "select", options: [
        { nl: "Leads genereren", en: "Generate leads" },
        { nl: "Informeren / portfolio", en: "Inform / portfolio" },
        { nl: "Verkopen", en: "Sell" },
        { nl: "Boekingen", en: "Bookings" },
        { nl: "Service / support", en: "Service / support" },
        { nl: "Combinatie", en: "Combination" },
      ], required: true },
      { key: "pages_needed", label: { nl: "Pagina's die we nodig hebben", en: "Pages we need" }, type: "textarea", required: true, placeholder: { nl: "Home, Over ons, Diensten, Contact...", en: "Home, About, Services, Contact..." } },
      { key: "examples", label: { nl: "Voorbeeldsites die je mooi vindt (URLs)", en: "Example sites you like (URLs)" }, type: "textarea" },
      { key: "examples_disliked", label: { nl: "Sites die je juist niet mooi vindt", en: "Sites you don't like" }, type: "textarea" },
      { key: "brand_assets", label: { nl: "Wat is er aan huisstijl?", en: "What brand assets exist?" }, type: "multiselect", options: [
        { nl: "Logo", en: "Logo" },
        { nl: "Kleurenpalet", en: "Color palette" },
        { nl: "Typografie", en: "Typography" },
        { nl: "Brand book", en: "Brand book" },
        { nl: "Fotografie", en: "Photography" },
        { nl: "Iconen", en: "Icons" },
        { nl: "Niets, opnieuw maken", en: "Nothing, build from scratch" },
      ] },
      { key: "content_provider", label: { nl: "Wie levert teksten en beeld?", en: "Who provides copy and visuals?" }, type: "select", options: CONTENT_PROVIDER },
      { key: "integrations", label: { nl: "Benodigde integraties", en: "Required integrations" }, type: "multiselect", options: [
        { nl: "Contactformulier", en: "Contact form" },
        { nl: "Nieuwsbrief", en: "Newsletter" },
        { nl: "Calendly / boekingen", en: "Calendly / bookings" },
        { nl: "Live chat", en: "Live chat" },
        { nl: "CRM (HubSpot/Pipedrive)", en: "CRM (HubSpot/Pipedrive)" },
        { nl: "Google Maps", en: "Google Maps" },
        { nl: "Reviews", en: "Reviews" },
        { nl: "Anders", en: "Other" },
      ] },
      { key: "languages", label: { nl: "Talen", en: "Languages" }, type: "multiselect", options: [
        { nl: "Nederlands", en: "Dutch" },
        { nl: "Engels", en: "English" },
        { nl: "Duits", en: "German" },
        { nl: "Frans", en: "French" },
        { nl: "Spaans", en: "Spanish" },
        { nl: "Anders", en: "Other" },
      ] },
      { key: "deadline", label: { nl: "Gewenste oplevering", en: "Desired delivery" }, type: "text", placeholder: { nl: "Bijv. eind Q2 2026", en: "E.g. end of Q2 2026" } },
      { key: "legal_docs_url", label: { nl: "Link naar juridische documenten (KVK, BTW, AV)", en: "Link to legal documents (CoC, VAT, T&Cs)" }, type: "multilink", placeholder: { nl: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box of Mega...", en: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box or Mega..." }, help: { nl: "Optioneel, handig voor facturatie en eventuele integraties.", en: "Optional, useful for invoicing and integrations." } },
    ],
  },
  {
    id: "webshop",
    label: { nl: "Webshop", en: "Webshop" },
    category: "website",
    description: { nl: "E-commerce shop met producten, kassa en betaling.", en: "E-commerce shop with products, checkout and payment." },
    fields: [
      { key: "platform", label: { nl: "Voorkeur platform", en: "Preferred platform" }, type: "select", options: [
        "Shopify", "WooCommerce", "Lightspeed",
        { nl: "Custom", en: "Custom" },
        { nl: "Advies graag", en: "Advise please" },
      ], required: true },
      { key: "domain", label: { nl: "Gewenste domeinnaam", en: "Desired domain name" }, type: "text", required: true },
      { key: "current_shop", label: { nl: "Huidige webshop URL (indien migratie)", en: "Current shop URL (if migrating)" }, type: "url" },
      { key: "company_description", label: { nl: "Korte beschrijving van het bedrijf", en: "Short description of the company" }, type: "textarea", required: true },
      { key: "product_count", label: { nl: "Aantal producten / SKU's", en: "Number of products / SKUs" }, type: "number" },
      { key: "product_categories", label: { nl: "Productcategorieën", en: "Product categories" }, type: "textarea" },
      { key: "product_data_ready", label: { nl: "Productdata aanwezig (foto's, teksten, prijzen)?", en: "Product data available (photos, copy, prices)?" }, type: "select", options: [
        { nl: "Ja, compleet", en: "Yes, complete" },
        { nl: "Deels", en: "Partly" },
        { nl: "Nee, hulp nodig", en: "No, need help" },
      ] },
      { key: "payment_methods", label: { nl: "Betaalmethoden", en: "Payment methods" }, type: "multiselect", options: [
        "iDEAL",
        { nl: "Creditcard", en: "Credit card" },
        "PayPal",
        { nl: "Klarna (achteraf)", en: "Klarna (pay later)" },
        "Bancontact",
        "Apple/Google Pay",
        { nl: "Op rekening", en: "On invoice" },
      ] },
      { key: "shipping", label: { nl: "Verzendmethoden", en: "Shipping methods" }, type: "multiselect", options: [
        "PostNL", "DHL", "DPD",
        { nl: "Afhalen", en: "Pickup" },
        { nl: "Internationaal", en: "International" },
        { nl: "Eigen bezorging", en: "Own delivery" },
      ] },
      { key: "shipping_zones", label: { nl: "Verzendgebieden", en: "Shipping zones" }, type: "text" },
      { key: "vat_setup", label: { nl: "BTW-tarieven", en: "VAT rates" }, type: "select", options: [
        { nl: "21% standaard", en: "21% standard" },
        { nl: "9% laag tarief", en: "9% reduced rate" },
        { nl: "Mix", en: "Mix" },
        { nl: "BTW-vrij", en: "VAT exempt" },
      ] },
      { key: "stock_management", label: { nl: "Voorraadbeheer", en: "Stock management" }, type: "select", options: [
        { nl: "In webshop zelf", en: "In the webshop itself" },
        { nl: "Externe voorraad/ERP", en: "External stock/ERP" },
        { nl: "Geen voorraad nodig (dropshipping/dienst)", en: "No stock needed (dropshipping/service)" },
      ] },
      { key: "integrations", label: { nl: "Integraties", en: "Integrations" }, type: "multiselect", options: [
        { nl: "Boekhouding (Moneybird/Exact)", en: "Accounting (Moneybird/Exact)" },
        "ERP", "CRM",
        { nl: "Email-marketing", en: "Email marketing" },
        "Google Merchant", "Meta Catalog",
        { nl: "Reviews (Trustpilot/Kiyoh)", en: "Reviews (Trustpilot/Kiyoh)" },
        { nl: "Anders", en: "Other" },
      ] },
      { key: "examples", label: { nl: "Voorbeeldshops die je mooi vindt", en: "Example shops you like" }, type: "textarea" },
      { key: "brand_assets", label: { nl: "Huisstijl beschikbaar?", en: "Brand assets available?" }, type: "multiselect", options: [
        { nl: "Logo", en: "Logo" },
        { nl: "Kleuren", en: "Colors" },
        { nl: "Typografie", en: "Typography" },
        { nl: "Brand book", en: "Brand book" },
        { nl: "Productfoto's", en: "Product photos" },
        { nl: "Lifestyle foto's", en: "Lifestyle photos" },
        { nl: "Niets", en: "Nothing" },
      ] },
      { key: "languages", label: { nl: "Talen", en: "Languages" }, type: "multiselect", options: [
        { nl: "Nederlands", en: "Dutch" },
        { nl: "Engels", en: "English" },
        { nl: "Duits", en: "German" },
        { nl: "Frans", en: "French" },
        { nl: "Anders", en: "Other" },
      ] },
      { key: "deadline", label: { nl: "Gewenste live-datum", en: "Desired go-live date" }, type: "text" },
      { key: "legal_docs_url", label: { nl: "Link naar juridische documenten (KVK, BTW, AV)", en: "Link to legal documents (CoC, VAT, T&Cs)" }, type: "multilink", placeholder: { nl: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box of Mega...", en: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box or Mega..." }, help: { nl: "Optioneel, handig voor facturatie en eventuele integraties.", en: "Optional, useful for invoicing and integrations." } },
    ],
  },
];

/**
 * Algemene aanlevervelden die altijd gevraagd worden, ongeacht de gekozen dienst(en).
 * Worden getoond als laatste stap vóór "Controleren en verzenden".
 */
export const COMMON_ASSET_FIELDS: OnboardingField[] = [
  { key: "logo_url", label: { nl: "Link naar logo", en: "Link to logo" }, type: "multilink", placeholder: { nl: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box of Mega...", en: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box or Mega..." }, help: { nl: "Deel één of meerdere links (Drive, Dropbox, WeTransfer) naar je logo bestanden, bij voorkeur in vector (SVG/AI/EPS) én PNG.", en: "Share one or more links (Drive, Dropbox, WeTransfer) to your logo files, preferably in vector (SVG/AI/EPS) and PNG." } },
  { key: "content_url", label: { nl: "Link naar content (teksten & beeld)", en: "Link to content (copy & visuals)" }, type: "multilink", placeholder: { nl: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box of Mega...", en: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box or Mega..." }, help: { nl: "Deel één of meerdere links naar teksten, foto's en eventuele video's.", en: "Share one or more links to copy, photos and any videos." } },
  { key: "brand_book_url", label: { nl: "Link naar brand book / huisstijl", en: "Link to brand book / brand guidelines" }, type: "multilink", placeholder: { nl: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box of Mega...", en: "Google Drive, WeTransfer, Dropbox, OneDrive, iCloud, Box or Mega..." }, help: { nl: "Optioneel, voeg meerdere links toe als je huisstijldocumenten op verschillende plekken staan.", en: "Optional, add multiple links if your brand documents are in different places." } },
  { key: "brand_colors", label: { nl: "Huisstijl kleuren (HEX-codes)", en: "Brand colors (HEX codes)" }, type: "textarea", placeholder: "#0F172A\n#3A4DEA\n#F8FAFC" },
  { key: "brand_fonts", label: { nl: "Lettertypes (fonts)", en: "Fonts" }, type: "text", placeholder: { nl: "Bijv. Inter, Söhne, Helvetica Neue", en: "E.g. Inter, Söhne, Helvetica Neue" } },
  { key: "tone_of_voice", label: { nl: "Tone of voice / schrijfstijl", en: "Tone of voice / writing style" }, type: "textarea", placeholder: { nl: "Bijv. zakelijk, persoonlijk, speels, deskundig...", en: "E.g. business, personal, playful, expert..." }, coveredBy: ["meta_ads", "social_media"] },
  { key: "domain_dns_access", label: { nl: "Wie beheert het domein / DNS?", en: "Who manages the domain / DNS?" }, type: "select", options: [
    { nl: "Wij (klant)", en: "Us (client)" },
    { nl: "Externe partij", en: "External party" },
    { nl: "Webiro mag overnemen", en: "Webiro may take over" },
    { nl: "Weet ik niet", en: "Not sure" },
  ], coveredBy: ["website", "webshop", "email_marketing"] },
  { key: "extra_notes", label: { nl: "Overige opmerkingen of bestanden", en: "Other notes or files" }, type: "textarea", placeholder: { nl: "Alles wat we nog moeten weten.", en: "Anything else we should know." } },
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
