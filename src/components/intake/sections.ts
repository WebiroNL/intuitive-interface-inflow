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
  label: string;
  icon: any;
}

export const INTAKE_SECTIONS: IntakeSectionDef[] = [
  { id: "bedrijf", label: "1. Bedrijf & Factuur", icon: Building03Icon },
  { id: "werkgebied", label: "2. Werkgebied", icon: Globe02Icon },
  { id: "dienst", label: "3. Dienst", icon: PackageIcon },
  { id: "doel", label: "4. Doel", icon: Target02Icon },
  { id: "doelgroep", label: "5. Doelgroep", icon: UserGroup02Icon },
  { id: "problemen", label: "6. Klantproblemen", icon: AlertCircleIcon },
  { id: "usp", label: "7. USP's", icon: StarIcon },
  { id: "vertrouwen", label: "8. Vertrouwen", icon: Shield01Icon },
  { id: "concurrentie", label: "9. Concurrentie", icon: Crown02Icon },
  { id: "materiaal", label: "10. Materiaal", icon: Image01Icon },
  { id: "dosdonts", label: "11. Do's & Don'ts", icon: CheckmarkCircle02Icon },
  { id: "faq", label: "12. Veelgestelde vragen", icon: HelpCircleIcon },
  { id: "planning", label: "13. Planning", icon: Calendar03Icon },
  { id: "uitstraling", label: "14. Uitstraling", icon: PaintBrushIcon },
  { id: "kanalen", label: "15. Kanalen & Budget", icon: Megaphone01Icon },
];

export const ALL_SECTION_IDS = INTAKE_SECTIONS.map((s) => s.id);

/** Lege array = alles zichtbaar. */
export function isSectionVisible(enabled: string[] | null | undefined, id: string): boolean {
  if (!enabled || enabled.length === 0) return true;
  return enabled.includes(id);
}
