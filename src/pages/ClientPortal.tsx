import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyClient } from "@/hooks/useClient";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientTopBar } from "@/components/client/ClientTopBar";

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
    typeof window !== "undefined" ? window.innerWidth >= 900 : true
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
      setSidebarOpen(window.innerWidth >= 900);
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
              <Route index element={<ClientDashboard client={client} />} />
              <Route path="campaigns" element={<ClientCampaigns client={client} />} />
              <Route path="finance" element={<Navigate to="/dashboard/campaigns" replace />} />
              <Route path="reports" element={<ClientReports client={client} />} />
              <Route path="contract" element={<ClientContract client={client} />} />
              <Route path="invoices" element={<ClientInvoices client={client} />} />
              <Route path="files" element={<ClientFiles client={client} />} />
              <Route path="updates" element={<ClientUpdates client={client} />} />
              <Route path="account" element={<ClientAccount client={client} />} />
              <Route path="intake" element={<ClientIntakeForm client={client} />} />
              <Route path="website-intake" element={<ClientWebsiteIntakeForm client={client} />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
