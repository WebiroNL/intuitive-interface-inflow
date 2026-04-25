import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

const AdminOverview = lazy(() => import('./admin/AdminOverview'));
const AdminOrders = lazy(() => import('./admin/AdminOrders'));
const AdminLeads = lazy(() => import('./admin/AdminLeads'));
const AdminStats = lazy(() => import('./admin/AdminStats'));
const AdminMessages = lazy(() => import('./admin/AdminMessages'));
const AdminProducts = lazy(() => import('./admin/AdminProducts'));
const AdminIntegrations = lazy(() => import('./admin/AdminIntegrations'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));
const AdminMoodboards = lazy(() => import('./admin/AdminMoodboards'));
const AdminBlog = lazy(() => import('./admin/AdminBlog'));
const AdminClients = lazy(() => import('./admin/AdminClients'));
const AdminPages = lazy(() => import('./admin/AdminPages'));
const AdminPartners = lazy(() => import('./admin/AdminPartners'));
const AdminPartnerCommissions = lazy(() => import('./admin/AdminPartnerCommissions'));
const AdminPartnerPayouts = lazy(() => import('./admin/AdminPartnerPayouts'));
const AdminPartnerTiers = lazy(() => import('./admin/AdminPartnerTiers'));
const AdminShowcase = lazy(() => import('./admin/AdminShowcase'));

function AdminFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Open op desktop + tablet landscape (>=900px), dicht daaronder
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  // Sluit automatisch bij route-wijziging op kleine schermen
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Reset bij resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 overflow-auto flex flex-col">
        {/* Mobile/tablet portrait topbar with hamburger */}
        <header className="h-[60px] sticky top-0 z-30 bg-card border-b border-border flex items-center px-4 gap-3 md:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Sluit menu' : 'Open menu'}
            className="w-9 h-9 -ml-1 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <HugeiconsIcon icon={sidebarOpen ? Cancel01Icon : Menu01Icon} size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-none">Webiro</p>
            <h1 className="text-[15px] font-semibold text-foreground leading-tight truncate">Admin</h1>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8">
          <Suspense fallback={<AdminFallback />}>
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="shop" element={<AdminProducts />} />
              <Route path="products" element={<Navigate to="/admin/shop" replace />} />
              <Route path="integrations" element={<AdminIntegrations />} />
              <Route path="moodboards" element={<AdminMoodboards />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="partner-commissions" element={<AdminPartnerCommissions />} />
              <Route path="partner-payouts" element={<AdminPartnerPayouts />} />
              <Route path="partner-tiers" element={<AdminPartnerTiers />} />
              <Route path="showcase" element={<AdminShowcase />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
