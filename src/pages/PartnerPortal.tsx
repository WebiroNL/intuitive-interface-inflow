import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyPartner } from "@/hooks/usePartner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Coins01Icon,
  Link01Icon,
  Wallet01Icon,
  File01Icon,
  UserIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import webiroLogo from "@/assets/logo-webiro.svg";
import webiroLogoDark from "@/assets/logo-webiro-dark.svg";

const PartnerDashboard = lazy(() => import("./partner/PartnerDashboard"));

const navItems = [
  { label: "Overzicht", href: "/partner/dashboard", icon: DashboardSquare01Icon },
  { label: "Referrals", href: "/partner/dashboard/referrals", icon: Link01Icon },
  { label: "Commissies", href: "/partner/dashboard/commissions", icon: Coins01Icon },
  { label: "Uitbetalingen", href: "/partner/dashboard/payouts", icon: Wallet01Icon },
  { label: "Materiaal", href: "/partner/dashboard/assets", icon: File01Icon },
  { label: "Profiel", href: "/partner/dashboard/profile", icon: UserIcon },
];

export default function PartnerPortal() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { partner, loading } = useMyPartner();
  const location = useLocation();
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/partner/login" replace />;
  if (!partner) return <Navigate to="/partner/login" replace />;

  if (partner.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center rounded-2xl border border-border bg-card p-8">
          <h1 className="text-[22px] font-semibold text-foreground mb-2">
            {partner.status === "pending" ? "Aanmelding in behandeling" : "Account niet actief"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {partner.status === "pending"
              ? "We beoordelen je aanmelding binnen 1 werkdag. Je ontvangt bericht zodra je dashboard klaarstaat."
              : "Neem contact met ons op voor meer informatie."}
          </p>
          <Button onClick={signOut} variant="outline">Uitloggen</Button>
        </div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/partner/dashboard"
      ? location.pathname === "/partner/dashboard"
      : location.pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-[240px] h-screen sticky top-0 bg-card border-r border-border flex-col">
        <div className="h-[60px] flex items-center px-5 border-b border-border">
          <Link to="/">
            <img src={isDark ? webiroLogoDark : webiroLogo} alt="Webiro" className="h-[22px]" />
          </Link>
          <span className="ml-2 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Partner</span>
        </div>
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((it) => (
            <Link
              key={it.href}
              to={it.href}
              className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                isActive(it.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <HugeiconsIcon icon={it.icon} size={16} />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="px-3 py-1.5">
            <p className="text-[12px] font-medium text-foreground truncate">{partner.company_name}</p>
            <p className="text-[11px] text-muted-foreground capitalize">{partner.tier} partner</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} />
            Uitloggen
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 lg:p-8">
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" /></div>}>
            <Routes>
              <Route index element={<PartnerDashboard />} />
              <Route path="referrals" element={<PartnerDashboard tab="referrals" />} />
              <Route path="commissions" element={<PartnerDashboard tab="commissions" />} />
              <Route path="payouts" element={<PartnerDashboard tab="payouts" />} />
              <Route path="assets" element={<PartnerDashboard tab="assets" />} />
              <Route path="profile" element={<PartnerDashboard tab="profile" />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
