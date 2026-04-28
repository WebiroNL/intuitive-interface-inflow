import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppSetting } from "@/hooks/useAppSetting";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ChartBarLineIcon,
  File02Icon,
  Invoice01Icon,
  FolderLibraryIcon,
  Notification02Icon,
  Cancel01Icon,
  TaskDaily01Icon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import type { Client } from "@/hooks/useClient";
import { useClientSections } from "@/hooks/useClientSections";
import { isMenuVisible } from "@/components/client/menus";

interface Props {
  client: Client;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function ClientSidebar({ client, mobileOpen = false, onClose }: Props) {
  const location = useLocation();
  const sections = useClientSections(client);
  const version = useAppSetting("client_dashboard_version", "1.0.0");
  const base = `/dashboard`;
  const vm = (client.visible_menus as string[] | null | undefined) ?? null;

  // Heeft de admin een expliciete selectie gemaakt in admin → klant?
  // Zowel een handmatige selectie als de "__all__" sentinel (= "Alles aan" geklikt)
  // tellen als expliciete keuze. Alleen als er nooit iets is opgeslagen (null/undefined)
  // vallen we terug op de "verberg lege secties"-default.
  const adminHasExplicitSelection = Array.isArray(vm);

  const allItems = [
    { id: "dashboard", label: "Dashboard", href: base, icon: DashboardSquare01Icon, exact: true, hasData: true },
    { id: "campaigns", label: "Campagnes", href: `${base}/campaigns`, icon: ChartBarLineIcon, hasData: sections.hasMonthlyData },
    { id: "reports", label: "Rapporten", href: `${base}/reports`, icon: File02Icon, hasData: sections.hasMonthlyData },
    { id: "contract", label: "Contract", href: `${base}/contract`, icon: File02Icon, hasData: sections.hasContracts || sections.hasServices },
    { id: "invoices", label: "Facturen", href: `${base}/invoices`, icon: Invoice01Icon, hasData: sections.hasInvoices },
    { id: "files", label: "Bestanden", href: `${base}/files`, icon: FolderLibraryIcon, hasData: sections.hasFiles },
    { id: "updates", label: "Updates", href: `${base}/updates`, icon: Notification02Icon, hasData: sections.hasActivity },
  ];
  // Regel:
  // - Als admin expliciet menu-items aanvinkt → toon precies die items (ook zonder data).
  // - Anders (default "__all__") → toon alleen items met data, om lege secties te verbergen.
  const items = allItems.filter((i) => {
    if (!isMenuVisible(vm, i.id)) return false;
    if (adminHasExplicitSelection) return true;
    return i.hasData;
  });

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);


  // Lock body scroll when mobile drawer open (only below 900px)
  useEffect(() => {
    if (mobileOpen && window.matchMedia("(max-width: 767px)").matches) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);



  const sidebarInner = (
    <>
      <div className="h-[60px] flex items-center px-5 border-b border-border">
        <Link to={base} className="flex items-center gap-2">
          <img src={webiroLogo} alt="Webiro" className="h-[22px] block dark:hidden" />
          <img src={webiroLogoDark} alt="Webiro" className="h-[22px] hidden dark:block" />
        </Link>
        <span className="ml-2 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Portaal
        </span>
        {/* Close button only on tablet portrait/mobile */}
        <button
          onClick={onClose}
          aria-label="Sluit menu"
          className="ml-auto md:hidden w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>
      </div>

      <div className="px-5 py-4 border-b border-border">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Bedrijf</p>
        <p className="text-[13px] font-semibold text-foreground truncate">{client.company_name}</p>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto flex flex-col">
        <div className="space-y-0.5">
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
        </div>

        {(() => {
          const showIntake = !!client.show_intake_form && isMenuVisible(vm, "intake");
          const showWebsiteIntake = !!(client as any).show_website_intake_form && isMenuVisible(vm, "website_intake");
          const showOnboarding = !!(client as any).show_onboarding_form && isMenuVisible(vm, "onboarding");
          const formCount = [showIntake, showWebsiteIntake, showOnboarding].filter(Boolean).length;
          if (formCount === 0) return null;
          return (
          <div className={`mt-auto space-y-0.5 ${items.length > 0 ? "pt-3 border-t border-border" : ""}`}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-1">
              {formCount === 1 ? "Formulier" : "Formulieren"}
            </p>
            {client.show_intake_form && isMenuVisible(vm, "intake") && (
              <Link
                to={`${base}/intake`}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  isActive(`${base}/intake`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <HugeiconsIcon icon={TaskDaily01Icon} size={16} />
                Ads Intakeformulier
              </Link>
            )}
            {(client as any).show_website_intake_form && isMenuVisible(vm, "website_intake") && (
              <Link
                to={`${base}/website-intake`}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  isActive(`${base}/website-intake`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <HugeiconsIcon icon={TaskDaily01Icon} size={16} />
                Website Intakeformulier
              </Link>
            )}
            {(client as any).show_onboarding_form && isMenuVisible(vm, "onboarding") && (
              <Link
                to={`${base}/onboarding`}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  isActive(`${base}/onboarding`)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <HugeiconsIcon icon={RocketIcon} size={16} />
                Onboarding
              </Link>
            )}
          </div>
          );
        })()}
      </nav>

      <div className="border-t border-border p-4 text-center">
        <p className="text-[12px] font-semibold text-foreground leading-tight">Webiro Client Dashboard</p>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Versie {version}</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop + tablet landscape sidebar (>=900px) */}
      <aside className="hidden md:flex w-[240px] h-screen bg-card border-r border-border flex-col flex-shrink-0 sticky top-0">
        {sidebarInner}
      </aside>

      {/* Drawer + overlay (<900px) */}
      <div
        onClick={onClose}
        className={`md:hidden fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-[280px] max-w-[85vw] h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Hoofdmenu"
      >
        {sidebarInner}
      </aside>
    </>
  );
}
