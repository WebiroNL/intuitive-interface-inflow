import {
  DashboardSquare01Icon,
  ChartBarLineIcon,
  File02Icon,
  Invoice01Icon,
  FolderLibraryIcon,
  Notification02Icon,
  UserAccountIcon,
  PackageIcon,
  ActivityIcon,
  TaskDaily01Icon,
} from "@hugeicons/core-free-icons";

export interface ClientMenuDef {
  id: string;
  label: string;
  icon: any;
}

/** Alle menu-items die in de zijbalk van het klantportaal kunnen verschijnen. */
export const CLIENT_MENUS: ClientMenuDef[] = [
  { id: "dashboard", label: "Info (Dashboard)", icon: DashboardSquare01Icon },
  { id: "account", label: "Account", icon: UserAccountIcon },
  { id: "contract", label: "Diensten / Contract", icon: PackageIcon },
  { id: "campaigns", label: "Maanddata / Campagnes", icon: ChartBarLineIcon },
  { id: "reports", label: "Rapporten", icon: File02Icon },
  { id: "invoices", label: "Facturen", icon: Invoice01Icon },
  { id: "files", label: "Bestanden", icon: FolderLibraryIcon },
  { id: "updates", label: "Activiteit / Updates", icon: Notification02Icon },
  { id: "intake", label: "Intake formulier", icon: TaskDaily01Icon },
];

export const ALL_MENU_IDS = CLIENT_MENUS.map((m) => m.id);
export const ALL_MENUS_SENTINEL = "__all__";

/**
 * Zichtbaarheidregel voor menu-items:
 * - null/undefined        -> alles zichtbaar
 * - ["__all__"]           -> alles zichtbaar (default sentinel)
 * - []                    -> niets zichtbaar
 * - ["dashboard", ...]    -> alleen genoemde menu-items
 */
export function isMenuVisible(enabled: string[] | null | undefined, id: string): boolean {
  if (enabled === null || enabled === undefined) return true;
  if (enabled.length === 1 && enabled[0] === ALL_MENUS_SENTINEL) return true;
  return enabled.includes(id);
}
