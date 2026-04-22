import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyPartner } from "@/hooks/usePartner";
import { Button } from "@/components/ui/button";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { PartnerTopBar } from "@/components/partner/PartnerTopBar";

const PartnerDashboard = lazy(() => import("./partner/PartnerDashboard"));

export default function PartnerPortal() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { partner, loading } = useMyPartner();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 900 : true
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div className="flex min-h-screen bg-background">
      <PartnerSidebar
        partner={partner}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 min-w-0 overflow-auto flex flex-col">
        <PartnerTopBar
          partner={partner}
          isSidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <div className="flex-1 p-6 lg:p-8">
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
