import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown, Eye } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const STATUS_OPTIONS = ['nieuw', 'in_behandeling', 'actief', 'afgerond', 'geannuleerd'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    fetchOrders();
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search || 
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.pakket?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      nieuw: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_behandeling: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      actief: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      afgerond: 'bg-muted text-muted-foreground',
      geannuleerd: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Beheer alle binnenkomende orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Zoek op ordernummer of pakket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground"
        >
          <option value="">Alle statussen</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card className="border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Pakket</TableHead>
              <TableHead>Totaal</TableHead>
              <TableHead>Maandelijks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Geen orders gevonden
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-foreground">{order.order_number}</TableCell>
                  <TableCell>{order.pakket || '—'}</TableCell>
                  <TableCell>€{Number(order.totaal).toFixed(2)}</TableCell>
                  <TableCell>€{Number(order.maandelijks).toFixed(2)}/mnd</TableCell>
                  <TableCell>{statusBadge(order.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(order.created_at).toLocaleDateString('nl-NL')}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(order)}>
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {selected?.order_number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Pakket</p>
                  <p className="font-medium">{selected.pakket || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CMS & Hosting</p>
                  <p className="font-medium">{selected.cms_hosting || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contract</p>
                  <p className="font-medium">{selected.contract_duur || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Totaal</p>
                  <p className="font-medium">€{Number(selected.totaal).toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Status wijzigen</p>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    updateStatus(selected.id, e.target.value);
                    setSelected({ ...selected, status: e.target.value });
                  }}
                  className="px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {selected.briefing && Object.keys(selected.briefing).length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1">Briefing</p>
                  <div className="bg-muted/30 p-3 rounded-lg space-y-1">
                    {Object.entries(selected.briefing).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-muted-foreground min-w-[120px]">{key}:</span>
                        <span className="text-foreground">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
