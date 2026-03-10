import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Eye, X } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const STATUS_OPTIONS = ['nieuw', 'in_behandeling', 'offerte_verstuurd', 'gewonnen', 'verloren'];

const AdminLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLeads(data || []);
  };

  const updateLead = async (id: string, updates: Record<string, any>) => {
    await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    fetchLeads();
  };

  const filtered = leads.filter((l) => {
    const matchSearch = !search ||
      l.naam?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.bedrijfsnaam?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      nieuw: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_behandeling: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      offerte_verstuurd: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      gewonnen: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
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
        <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">Beheer binnenkomende aanvragen en contactverzoeken</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Zoek op naam, email of bedrijf..."
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
              <TableHead>Naam</TableHead>
              <TableHead>Bedrijf</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Bron</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Geen leads gevonden
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-foreground">{lead.naam}</TableCell>
                  <TableCell>{lead.bedrijfsnaam || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{lead.bron}</span>
                  </TableCell>
                  <TableCell>{statusBadge(lead.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelected(lead); setNotes(lead.notities || ''); }}
                    >
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
            <DialogTitle>{selected?.naam}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Bedrijf</p>
                  <p className="font-medium">{selected.bedrijfsnaam || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selected.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefoon</p>
                  <p className="font-medium">{selected.telefoon || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Website</p>
                  <p className="font-medium">{selected.website || '—'}</p>
                </div>
              </div>

              {selected.bericht && (
                <div>
                  <p className="text-muted-foreground mb-1">Bericht</p>
                  <p className="bg-muted/30 p-3 rounded-lg">{selected.bericht}</p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground mb-1">Status wijzigen</p>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    updateLead(selected.id, { status: e.target.value });
                    setSelected({ ...selected, status: e.target.value });
                  }}
                  className="px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Notities</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Voeg interne notities toe..."
                  rows={3}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    updateLead(selected.id, { notities: notes });
                    setSelected({ ...selected, notities: notes });
                  }}
                >
                  Notities opslaan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;
