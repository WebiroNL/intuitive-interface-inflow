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
} from "@hugeicons/core-free-icons";

export interface IntakeSectionDef {
  id: string;
  /** Titel zonder nummer-prefix. Het volgnummer wordt dynamisch toegevoegd. */
  title: string;
  icon: any;
}

export const INTAKE_SECTIONS: IntakeSectionDef[] = [
  { id: "bedrijf", title: "Bedrijf & Factuur", icon: Building03Icon },
  { id: "werkgebied", title: "Werkgebied", icon: Globe02Icon },
  { id: "dienst", title: "Dienst", icon: PackageIcon },
  { id: "doel", title: "Doel", icon: Target02Icon },
  { id: "doelgroep", title: "Doelgroep", icon: UserGroup02Icon },
  { id: "problemen", title: "Klantproblemen", icon: AlertCircleIcon },
  { id: "usp", title: "USP's", icon: StarIcon },
  { id: "vertrouwen", title: "Vertrouwen", icon: Shield01Icon },
  { id: "concurrentie", title: "Concurrentie", icon: Crown02Icon },
  { id: "materiaal", title: "Materiaal", icon: Image01Icon },
  { id: "dosdonts", title: "Do's & Don'ts", icon: CheckmarkCircle02Icon },
  { id: "faq", title: "Veelgestelde vragen", icon: HelpCircleIcon },
  { id: "planning", title: "Planning", icon: Calendar03Icon },
  { id: "uitstraling", title: "Uitstraling", icon: PaintBrushIcon },
  { id: "kanalen", title: "Kanalen & Budget", icon: Megaphone01Icon },
];

export const ALL_SECTION_IDS = INTAKE_SECTIONS.map((s) => s.id);

/** Sentinel: betekent "alles aan" (ook nieuwe toekomstige secties). */
export const ALL_SECTIONS_SENTINEL = "__all__";

/**
 * Zichtbaarheidregel:
 * - null/undefined  -> alles zichtbaar (legacy/nieuw)
 * - ["__all__"]     -> alles zichtbaar (sentinel, default)
 * - []              -> niets zichtbaar (expliciet "alles uit")
 * - ["bedrijf",...] -> alleen genoemde secties zichtbaar
 */
export function isSectionVisible(enabled: string[] | null | undefined, id: string): boolean {
  if (enabled === null || enabled === undefined) return true;
  if (enabled.length === 1 && enabled[0] === ALL_SECTIONS_SENTINEL) return true;
  return enabled.includes(id);
}

/**
 * Geeft de zichtbare secties terug, met dynamisch volgnummer (1..n).
 * `label` bevat het nummer + titel, `displayNumber` is het cijfer.
 */
export function getVisibleNumberedSections(enabled: string[] | null | undefined) {
  return INTAKE_SECTIONS
    .filter((s) => isSectionVisible(enabled, s.id))
    .map((s, i) => ({
      ...s,
      displayNumber: i + 1,
      label: `${i + 1}. ${s.title}`,
    }));
}
