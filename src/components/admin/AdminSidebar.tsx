import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  Globe02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

type NavItem =
  | { type?: 'item'; label: string; href: string; icon: any }
  | { type: 'group'; label: string; icon: any; basePath: string; children: { label: string; href: string; icon: any }[] };

const navItems: NavItem[] = [
  { label: 'Overzicht', href: '/admin', icon: DashboardSquare01Icon },
  { label: 'Klanten', href: '/admin/clients', icon: UserMultiple02Icon },
  { label: 'Partnerprogramma', href: '/admin/partners', icon: UserGroupIcon },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart01Icon },
  { label: 'Leads', href: '/admin/leads', icon: UserGroup02Icon },
  { label: 'Statistieken', href: '/admin/stats', icon: BarChartIcon },
  { label: 'Berichten', href: '/admin/messages', icon: MessageMultiple01Icon },
  { label: 'Shop', href: '/admin/shop', icon: Package01Icon },
  { label: 'Integraties', href: '/admin/integrations', icon: PlugSocketIcon },
  { label: 'Moodboards', href: '/admin/moodboards', icon: PaintBrushIcon },
  { label: 'Blog', href: '/admin/blog', icon: TextIcon },
  { label: 'Showcase', href: '/admin/showcase', icon: Globe02Icon },
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
  const [clientsBadge, setClientsBadge] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [mi, wi, so] = await Promise.all([
        supabase.from("marketing_intakes").select("client_id"),
        supabase.from("website_intakes" as any).select("client_id"),
        supabase.from("service_onboardings").select("client_id, submitted_at, created_at"),
      ]);
      const per: Record<string, { intake: number; website_intake: number; onboarding: number }> = {};
      const ensure = (id: string) => {
        if (!per[id]) per[id] = { intake: 0, website_intake: 0, onboarding: 0 };
        return per[id];
      };
      (mi.data ?? []).forEach((r: any) => { if (r.client_id) ensure(r.client_id).intake += 1; });
      ((wi as any).data ?? []).forEach((r: any) => { if (r.client_id) ensure(r.client_id).website_intake += 1; });
      const onbGroups: Record<string, Set<string>> = {};
      ((so as any).data ?? []).forEach((r: any) => {
        if (!r.client_id) return;
        if (!onbGroups[r.client_id]) onbGroups[r.client_id] = new Set();
        onbGroups[r.client_id].add(String(r.submitted_at ?? r.created_at ?? ""));
      });
      Object.entries(onbGroups).forEach(([id, s]) => { ensure(id).onboarding = s.size; });

      let total = 0;
      Object.entries(per).forEach(([id, t]) => {
        const si = Number(localStorage.getItem(`admin_seen_intake_${id}`) || 0);
        const sw = Number(localStorage.getItem(`admin_seen_website_intake_${id}`) || 0);
        const so2 = Number(localStorage.getItem(`admin_seen_onboarding_${id}`) || 0);
        total += Math.max(0, t.intake - si) + Math.max(0, t.website_intake - sw) + Math.max(0, t.onboarding - so2);
      });
      if (!cancelled) setClientsBadge(total);
    };
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    const interval = setInterval(load, 15000);
    return () => { cancelled = true; window.removeEventListener("storage", onStorage); clearInterval(interval); };
  }, [location.pathname]);

  const partnerPaths = ['/admin/partners', '/admin/partner-commissions', '/admin/partner-payouts', '/admin/partner-tiers'];
  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    if (href === '/admin/partners') return partnerPaths.some((p) => location.pathname.startsWith(p));
    return location.pathname.startsWith(href);
  };

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
        {navItems.map((item) => {
          if (item.type === 'group') return null;
          const showBadge = item.href === '/admin/clients' && clientsBadge > 0;
          return (
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
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold tabular-nums">
                  {clientsBadge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
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
