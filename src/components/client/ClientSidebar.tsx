import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import webiroLogo from "@/assets/logo-webiro.svg";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ChartBarLineIcon,
  Money02Icon,
  File02Icon,
  Invoice01Icon,
  FolderLibraryIcon,
  Notification02Icon,
  UserCircleIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import type { Client } from "@/hooks/useClient";
import { useClientSections } from "@/hooks/useClientSections";

interface Props {
  client: Client;
}

export function ClientSidebar({ client }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const sections = useClientSections(client);
  const base = `/dashboard`;

  const allItems = [
    { label: "Dashboard", href: base, icon: DashboardSquare01Icon, exact: true, show: true },
    { label: "Campagnes", href: `${base}/campaigns`, icon: ChartBarLineIcon, show: sections.hasMonthlyData },
    { label: "Financieel", href: `${base}/finance`, icon: Money02Icon, show: sections.hasMonthlyData },
    { label: "Rapporten", href: `${base}/reports`, icon: File02Icon, show: sections.hasMonthlyData },
    { label: "Contract & Facturen", href: `${base}/invoices`, icon: Invoice01Icon, show: sections.hasInvoices || sections.hasContracts },
    { label: "Bestanden", href: `${base}/files`, icon: FolderLibraryIcon, show: sections.hasFiles },
    { label: "Updates", href: `${base}/updates`, icon: Notification02Icon, show: sections.hasActivity },
    { label: "Account", href: `${base}/account`, icon: UserCircleIcon, show: true },
  ];
  const items = allItems.filter((i) => i.show);

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-[240px] h-screen bg-card border-r border-border flex flex-col flex-shrink-0 sticky top-0">
      <div className="h-[60px] flex items-center px-5 border-b border-border">
        <Link to={base} className="flex items-center gap-2">
          <img src={webiroLogo} alt="Webiro" className="h-[22px]" />
        </Link>
        <span className="ml-2 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Portaal
        </span>
      </div>

      <div className="px-5 py-4 border-b border-border">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Bedrijf</p>
        <p className="text-[13px] font-semibold text-foreground truncate">{client.company_name}</p>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <HugeiconsIcon icon={item.icon} size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <div className="px-3 py-1.5">
          <p className="text-[12px] font-medium text-foreground truncate">{client.email}</p>
          <p className="text-[11px] text-muted-foreground">Klantaccount</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} />
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
