import {
  Building03Icon,
  Target02Icon,
  UserGroup02Icon,
  PuzzleIcon,
  PaintBrushIcon,
  File02Icon,
  CodeIcon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

export interface WebsiteIntakeSectionDef {
  id: string;
  title: string;
  icon: any;
}

export const WEBSITE_INTAKE_SECTIONS: WebsiteIntakeSectionDef[] = [
  { id: "bedrijf", title: "Bedrijf & Contact", icon: Building03Icon },
  { id: "doelen", title: "Doelen van de website", icon: Target02Icon },
  { id: "doelgroep", title: "Doelgroep", icon: UserGroup02Icon },
  { id: "functionaliteiten", title: "Functionaliteiten", icon: PuzzleIcon },
  { id: "design", title: "Design & Uitstraling", icon: PaintBrushIcon },
  { id: "content", title: "Content & Teksten", icon: File02Icon },
  { id: "technisch", title: "Technisch & Domein", icon: CodeIcon },
  { id: "planning", title: "Planning & Budget", icon: Calendar03Icon },
];

export const ALL_WEBSITE_SECTION_IDS = WEBSITE_INTAKE_SECTIONS.map((s) => s.id);
export const ALL_WEBSITE_SECTIONS_SENTINEL = "__all__";

export function isWebsiteSectionVisible(
  enabled: string[] | null | undefined,
  id: string
): boolean {
  if (enabled === null || enabled === undefined) return true;
  if (enabled.length === 1 && enabled[0] === ALL_WEBSITE_SECTIONS_SENTINEL) return true;
  return enabled.includes(id);
}

export function getVisibleWebsiteNumberedSections(enabled: string[] | null | undefined) {
  return WEBSITE_INTAKE_SECTIONS
    .filter((s) => isWebsiteSectionVisible(enabled, s.id))
    .map((s, i) => ({ ...s, displayNumber: i + 1, label: `${i + 1}. ${s.title}` }));
}
