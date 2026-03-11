import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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

function AdminFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAuth();

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
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="integrations" element={<AdminIntegrations />} />
            <Route path="moodboards" element={<AdminMoodboards />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;
