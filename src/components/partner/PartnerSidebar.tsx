import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppSetting } from "@/hooks/useAppSetting";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";
import { useTheme } from "@/contexts/ThemeContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Coins01Icon,
  Link01Icon,
  Wallet01Icon,
  File01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

interface Partner {
  company_name: string;
  tier: string;
}

interface Props {
  partner: Partner;
  mobileOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: "Overzicht", href: "/partner/dashboard", icon: DashboardSquare01Icon, exact: true },
  { label: "Referrals", href: "/partner/dashboard/referrals", icon: Link01Icon },
  { label: "Commissies", href: "/partner/dashboard/commissions", icon: Coins01Icon },
  { label: "Uitbetalingen", href: "/partner/dashboard/payouts", icon: Wallet01Icon },
  { label: "Materiaal", href: "/partner/dashboard/assets", icon: File01Icon },
];

export function PartnerSidebar({ partner, mobileOpen = false, onClose }: Props) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const version = useAppSetting("partner_dashboard_version", "1.0.0");

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

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
        <Link to="/" className="flex items-center gap-2">
          <img src={isDark ? webiroLogoDark : webiroLogo} alt="Webiro" className="h-[22px]" />
        </Link>
        <span className="ml-2 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Partner
        </span>
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
        <p className="text-[13px] font-semibold text-foreground truncate">{partner.company_name}</p>
        <p className="text-[11px] text-muted-foreground capitalize mt-0.5">{partner.tier} partner</p>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
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

      <div className="border-t border-border p-4">
        <p className="text-[12px] font-semibold text-foreground leading-tight">Webiro Partner Dashboard</p>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Versie {version}</p>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-[240px] h-screen bg-card border-r border-border flex-col flex-shrink-0 sticky top-0">
        {sidebarInner}
      </aside>

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
