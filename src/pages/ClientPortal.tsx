import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyClient } from "@/hooks/useClient";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientTopBar } from "@/components/client/ClientTopBar";
import { useClientSections } from "@/hooks/useClientSections";
import { isMenuVisible } from "@/components/client/menus";

const ClientDashboard = lazy(() => import("./client/ClientDashboard"));
const ClientCampaigns = lazy(() => import("./client/ClientCampaigns"));

const ClientReports = lazy(() => import("./client/ClientReports"));
const ClientInvoices = lazy(() => import("./client/ClientInvoices"));
const ClientContract = lazy(() => import("./client/ClientContract"));
const ClientFiles = lazy(() => import("./client/ClientFiles"));
const ClientUpdates = lazy(() => import("./client/ClientUpdates"));
const ClientAccount = lazy(() => import("./client/ClientAccount"));
const ClientIntakeForm = lazy(() => import("./client/ClientIntakeForm"));
const ClientWebsiteIntakeForm = lazy(() => import("./client/ClientWebsiteIntakeForm"));
const ClientOnboardingForm = lazy(() => import("./client/ClientOnboardingForm"));

function Fallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function ClientPortal() {
  const { user, isLoading: authLoading } = useAuth();
  const { client, loading } = useMyClient();
  const location = useLocation();

  // Open op desktop + tablet landscape (>=900px), dicht daaronder
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  // Sluit automatisch bij route-wijziging op kleine schermen
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Reset bij resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/client/login" replace />;
  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-foreground mb-2">Geen klantaccount gevonden</h1>
          <p className="text-sm text-muted-foreground">
            Dit account is nog niet gekoppeld aan een klant. Neem contact op met Webiro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar client={client} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 overflow-auto flex flex-col">
        <ClientTopBar
          client={client}
          isSidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <div className="flex-1">
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route index element={<DashboardIndex client={client} />} />
              <Route path="campaigns" element={<ClientCampaigns client={client} />} />
              <Route path="finance" element={<Navigate to="/dashboard/campaigns" replace />} />
              <Route path="reports" element={<ClientReports client={client} />} />
              <Route path="contract" element={<Navigate to="/dashboard/account" replace />} />
              <Route path="invoices" element={<ClientInvoices client={client} />} />
              <Route path="files" element={<ClientFiles client={client} />} />
              <Route path="updates" element={<ClientUpdates client={client} />} />
              <Route path="account" element={<ClientAccount client={client} />} />
              <Route path="intake" element={<ClientIntakeForm client={client} />} />
              <Route path="website-intake" element={<ClientWebsiteIntakeForm client={client} />} />
              <Route path="onboarding" element={<ClientOnboardingForm client={client} />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

/**
 * Toont het dashboard als zichtbaar; anders redirect naar het eerste beschikbare menu-item
 * in vaste volgorde (campagnes, rapporten, contract, facturen, bestanden, updates,
 * intake, website-intake, onboarding, account).
 */
function DashboardIndex({ client }: { client: any }) {
  const sections = useClientSections(client);
  const vm = (client.visible_menus as string[] | null | undefined) ?? null;
  const adminHasExplicitSelection =
    Array.isArray(vm) && !(vm.length === 1 && vm[0] === "__all__");

  if (sections.loading) return <Fallback />;

  if (isMenuVisible(vm, "dashboard")) {
    return <ClientDashboard client={client} />;
  }

  const candidates: { id: string; path: string; hasData: boolean }[] = [
    { id: "campaigns", path: "/dashboard/campaigns", hasData: sections.hasMonthlyData },
    { id: "reports", path: "/dashboard/reports", hasData: sections.hasMonthlyData },
    { id: "contract", path: "/dashboard/contract", hasData: sections.hasContracts || sections.hasServices },
    { id: "invoices", path: "/dashboard/invoices", hasData: sections.hasInvoices },
    { id: "files", path: "/dashboard/files", hasData: sections.hasFiles },
    { id: "updates", path: "/dashboard/updates", hasData: sections.hasActivity },
    { id: "intake", path: "/dashboard/intake", hasData: !!(client as any).show_intake_form },
    { id: "website_intake", path: "/dashboard/website-intake", hasData: !!(client as any).show_website_intake_form },
    { id: "onboarding", path: "/dashboard/onboarding", hasData: !!(client as any).show_onboarding_form },
    { id: "account", path: "/dashboard/account", hasData: true },
  ];

  for (const c of candidates) {
    if (!isMenuVisible(vm, c.id)) continue;
    if (adminHasExplicitSelection || c.hasData) {
      return <Navigate to={c.path} replace />;
    }
  }

  return <ClientDashboard client={client} />;
}
