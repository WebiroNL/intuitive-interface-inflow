import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(234, 82%, 57%)', 'hsl(259, 79%, 61%)', 'hsl(44, 100%, 67%)', 'hsl(160, 60%, 45%)', 'hsl(0, 84%, 60%)'];

const AdminStats = () => {
  const [leadsByStatus, setLeadsByStatus] = useState<any[]>([]);
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [leadsBySource, setLeadsBySource] = useState<any[]>([]);
  const [revenueByPackage, setRevenueByPackage] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [leadsRes, ordersRes] = await Promise.all([
      supabase.from('leads').select('*'),
      supabase.from('orders').select('*'),
    ]);

    const leads = leadsRes.data || [];
    const orders = ordersRes.data || [];

    // Leads by status
    const statusCounts: Record<string, number> = {};
    leads.forEach((l) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });
    setLeadsByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value })));

    // Leads by source
    const sourceCounts: Record<string, number> = {};
    leads.forEach((l) => { sourceCounts[l.bron || 'onbekend'] = (sourceCounts[l.bron || 'onbekend'] || 0) + 1; });
    setLeadsBySource(Object.entries(sourceCounts).map(([name, value]) => ({ name, value })));

    // Orders by month
    const monthCounts: Record<string, number> = {};
    orders.forEach((o) => {
      const month = new Date(o.created_at).toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    setOrdersByMonth(Object.entries(monthCounts).map(([name, orders]) => ({ name, orders })));

    // Revenue by package
    const pkgRevenue: Record<string, number> = {};
    orders.forEach((o) => {
      const pkg = o.pakket || 'Onbekend';
      pkgRevenue[pkg] = (pkgRevenue[pkg] || 0) + Number(o.totaal || 0);
    });
    setRevenueByPackage(Object.entries(pkgRevenue).map(([name, revenue]) => ({ name, revenue })));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders per maand */}
        <Card className="border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Orders per maand</h3>
          <div className="h-[250px]">
            {ordersByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(234, 82%, 57%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Nog geen data beschikbaar
              </div>
            )}
          </div>
        </Card>

        {/* Leads per status */}
        <Card className="border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Leads per status</h3>
          <div className="h-[250px]">
            {leadsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {leadsByStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Nog geen data beschikbaar
              </div>
            )}
          </div>
        </Card>

        {/* Omzet per pakket */}
        <Card className="border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Omzet per pakket</h3>
          <div className="h-[250px]">
            {revenueByPackage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByPackage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val: number) => `€${val.toFixed(2)}`} />
                  <Bar dataKey="revenue" fill="hsl(259, 79%, 61%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Nog geen data beschikbaar
              </div>
            )}
          </div>
        </Card>

        {/* Leads per bron */}
        <Card className="border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Leads per bron</h3>
          <div className="h-[250px]">
            {leadsBySource.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {leadsBySource.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Nog geen data beschikbaar
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
