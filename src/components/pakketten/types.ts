export interface Package {
  id: string;
  name: string;
  oldPrice?: number;
  price: number | string;
  savings?: number;
  badge: string;
  description: string;
  popular?: boolean;
  whatYouGet: string[];
  whyChoose: string[];
  details?: string[];
}

export interface CmsOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface HostingOption {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  period: "eenmalig" | "per maand";
  description: string;
  icon: string;
  category: "seo" | "marketing" | "functionaliteit" | "onderhoud";
}

export interface BriefingData {
  bedrijfsnaam: string;
  contactpersoon: string;
  email: string;
  telefoon: string;
  website?: string;
  branche: string;
  doelgroep: string;
  doel: string;
  opmerkingen?: string;
}

export interface ConfiguratorState {
  step: number;
  selectedPackage: string | null;
  selectedCms: string | null;
  selectedHosting: string | null;
  selectedAddOns: string[];
  briefing: BriefingData;
}
