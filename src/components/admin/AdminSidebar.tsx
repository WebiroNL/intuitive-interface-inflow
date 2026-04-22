import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import webiroLogo from '@/assets/logo-webiro.svg';
import webiroLogoDark from '@/assets/logo-webiro-dark.svg';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingCart01Icon,
  UserGroup02Icon,
  BarChartIcon,
  Settings01Icon,
  Logout01Icon,
  Package01Icon,
  MessageMultiple01Icon,
  PlugSocketIcon,
  PaintBrushIcon,
  TextIcon,
  UserMultiple02Icon,
  Cancel01Icon,
  File01Icon,
  UserGroupIcon,
  Coins01Icon,
  CreditCardIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: 'Overzicht', href: '/admin', icon: DashboardSquare01Icon },
  { label: 'Klanten', href: '/admin/clients', icon: UserMultiple02Icon },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart01Icon },
  { label: 'Leads', href: '/admin/leads', icon: UserGroup02Icon },
  { label: 'Statistieken', href: '/admin/stats', icon: BarChartIcon },
  { label: 'Berichten', href: '/admin/messages', icon: MessageMultiple01Icon },
  { label: 'Shop', href: '/admin/shop', icon: Package01Icon },
  { label: 'Partners', href: '/admin/partners', icon: UserGroupIcon },
  { label: 'Commissies', href: '/admin/partner-commissions', icon: Coins01Icon },
  { label: 'Uitbetalingen', href: '/admin/partner-payouts', icon: CreditCardIcon },
  { label: 'Partner tiers', href: '/admin/partner-tiers', icon: StarIcon },
  { label: 'Integraties', href: '/admin/integrations', icon: PlugSocketIcon },
  { label: 'Moodboards', href: '/admin/moodboards', icon: PaintBrushIcon },
  { label: 'Blog', href: '/admin/blog', icon: TextIcon },
  { label: "Pagina's", href: '/admin/pages', icon: File01Icon },
  { label: 'Instellingen', href: '/admin/settings', icon: Settings01Icon },
];

interface Props {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onClose }: Props) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const isDark = document.documentElement.classList.contains('dark');

  const isActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href);

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
        <Link to="/admin">
          <img src={isDark ? webiroLogoDark : webiroLogo} alt="Webiro" className="h-[22px]" />
        </Link>
        <span className="ml-2 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Admin
        </span>
        <button
          onClick={onClose}
          aria-label="Sluit menu"
          className="ml-auto md:hidden w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <HugeiconsIcon icon={item.icon} size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <div className="px-3 py-1.5">
          <p className="text-[12px] font-medium text-foreground truncate">{user?.email}</p>
          <p className="text-[11px] text-muted-foreground">Administrator</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} />
          Uitloggen
        </button>
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
        aria-label="Adminmenu"
      >
        {sidebarInner}
      </aside>
    </>
  );
}
