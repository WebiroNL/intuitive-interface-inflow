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

export interface CmsHostingTier {
  id: string;
  name: string;
  price: number | string;
  period: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number | string;
  period: "eenmalig" | "per maand";
  description: string;
  icon: string;
  category: string;
  features?: string[];
}

export type ContractDuration = "maandelijks" | "jaarlijks" | "2jaar";

export interface MarketingService {
  id: string;
  name: string;
  setupPrice?: number;
  monthlyPrice: number;
  description: string;
  features: string[];
  category: "ads" | "automation" | "ai";
}

export interface BriefingData {
  naam: string;
  bedrijfsnaam: string;
  kvkNummer?: string;
  btwNummer?: string;
  email: string;
  telefoon: string;
  website?: string;
  doelWebsite: string;
  doelgroep: string;
  inspiratieWebsites?: string;
  gewensteOpleverdatum?: string;
  opmerkingen?: string;
  kortingscode?: string;
  emailUpdates: boolean;
  akkoord: boolean;
}

export interface ConfiguratorState {
  step: number;
  selectedPackage: string | null;
  selectedCmsHosting: string | null;
  contractDuration: ContractDuration;
  selectedAddOns: string[];
  briefing: BriefingData;
}
