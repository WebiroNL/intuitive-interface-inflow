import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart01Icon,
  UserGroup01Icon,
  ChartIncreaseIcon,
  DollarCircleIcon,
  ArrowUpRight01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

interface Stats {
  totalOrders: number;
  totalLeads: number;
  totalRevenue: number;
  monthlyRecurring: number;
  newLeadsToday: number;
  pendingOrders: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalLeads: 0,
    totalRevenue: 0,
    monthlyRecurring: 0,
    newLeadsToday: 0,
    pendingOrders: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    const [ordersRes, leadsRes] = await Promise.all([
      supabase.from('orders').select('totaal, maandelijks, status'),
      supabase.from('leads').select('id, created_at'),
    ]);

    const orders = ordersRes.data || [];
    const leads = leadsRes.data || [];
    const today = new Date().toISOString().split('T')[0];

    setStats({
      totalOrders: orders.length,
      totalLeads: leads.length,
      totalRevenue: orders.reduce((sum, o) => sum + Number(o.totaal || 0), 0),
      monthlyRecurring: orders
        .filter((o) => o.status === 'actief')
        .reduce((sum, o) => sum + Number(o.maandelijks || 0), 0),
      newLeadsToday: leads.filter((l) => l.created_at?.startsWith(today)).length,
      pendingOrders: orders.filter((o) => o.status === 'nieuw' || o.status === 'in_behandeling').length,
    });
  };

  const fetchRecent = async () => {
    const [leadsRes, ordersRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    ]);
    setRecentLeads(leadsRes.data || []);
    setRecentOrders(ordersRes.data || []);
  };

  const statCards = [
    { label: 'Totaal omzet', value: `€${stats.totalRevenue.toLocaleString('nl-NL')}`, icon: DollarCircleIcon, color: 'text-emerald-600' },
    { label: 'Maandelijks terugkerend', value: `€${stats.monthlyRecurring.toLocaleString('nl-NL')}/mnd`, icon: ChartIncreaseIcon, color: 'text-primary' },
    { label: 'Totaal orders', value: stats.totalOrders.toString(), icon: ShoppingCart01Icon, color: 'text-orange-500' },
    { label: 'Totaal leads', value: stats.totalLeads.toString(), icon: UserGroup01Icon, color: 'text-violet-500' },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      nieuw: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_behandeling: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      offerte_verstuurd: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      gewonnen: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      actief: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      verloren: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${styles[status] || 'bg-muted text-muted-foreground'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overzicht van je bedrijfsactiviteiten</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-5 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                <HugeiconsIcon icon={stat.icon} size={18} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 border border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{stats.newLeadsToday} nieuwe leads vandaag</p>
            <p className="text-xs text-muted-foreground">Binnenkomende aanvragen</p>
          </div>
        </Card>
        <Card className="p-4 border border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <HugeiconsIcon icon={Clock01Icon} size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{stats.pendingOrders} openstaande orders</p>
            <p className="text-xs text-muted-foreground">Wachten op actie</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recente leads</h2>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Nog geen leads binnengekomen</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.naam}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                  {statusBadge(lead.status)}
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recente orders</h2>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Nog geen orders binnengekomen</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{order.pakket} — €{Number(order.totaal).toFixed(2)}</p>
                  </div>
                  {statusBadge(order.status)}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
