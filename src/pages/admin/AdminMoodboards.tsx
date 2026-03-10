import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Eye, Palette, ExternalLink } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const STATUS_OPTIONS = ['nieuw', 'bekeken', 'gecontacteerd', 'afgerond'];

const AdminMoodboards = () => {
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async () => {
    const { data } = await supabase
      .from('moodboard_results' as any)
      .select('*')
      .order('created_at', { ascending: false });
    setResults((data as any[]) || []);
  };

  const updateResult = async (id: string, updates: Record<string, any>) => {
    await supabase
      .from('moodboard_results' as any)
      .update(updates as any)
      .eq('id', id);
    fetchResults();
  };

  const filtered = results.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.naam?.toLowerCase().includes(s) ||
      r.email?.toLowerCase().includes(s) ||
      r.bedrijfsnaam?.toLowerCase().includes(s)
    );
  });

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      nieuw: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      bekeken: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      gecontacteerd: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      afgerond: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${styles[status] || 'bg-muted text-muted-foreground'}`}>
        {status}
      </span>
    );
  };

  const getPackageAdvice = (r: any) => {
    try {
      return r.ai_result?.pakketAdvies?.aanbevolen || '—';
    } catch {
      return '—';
    }
  };

  const getQuizSummary = (r: any) => {
    try {
      const qa = r.quiz_answers || {};
      return Object.entries(qa).map(([k, v]) => `${k}: ${v}`).join(' | ');
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Moodboards</h1>
        <p className="text-sm text-muted-foreground mt-1">Bekijk AI moodboard resultaten en contactgegevens</p>
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 border border-border">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Totaal</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{results.length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Met contactgegevens</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{results.filter(r => r.email).length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Nieuw</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{results.filter(r => r.status === 'nieuw').length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Vandaag</p>
          <p className="text-2xl font-semibold text-foreground mt-1">
            {results.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Bedrijf</TableHead>
              <TableHead>Pakketadvies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Geen moodboard resultaten gevonden
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.naam || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{item.email || '—'}</TableCell>
                  <TableCell>{item.bedrijfsnaam || '—'}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {getPackageAdvice(item)}
                    </span>
                  </TableCell>
                  <TableCell>{statusBadge(item.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(item.created_at).toLocaleDateString('nl-NL')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelected(item); setNotes(item.notities || ''); }}
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Moodboard Details
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6 text-sm">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Naam</p>
                  <p className="font-medium">{selected.naam || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selected.email || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefoon</p>
                  <p className="font-medium">{selected.telefoon || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bedrijf</p>
                  <p className="font-medium">{selected.bedrijfsnaam || '—'}</p>
                </div>
              </div>

              {/* Quiz answers */}
              <div>
                <p className="text-muted-foreground mb-2 font-medium">Quiz antwoorden</p>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  {selected.quiz_answers && Object.entries(selected.quiz_answers).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-medium text-foreground">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Result summary */}
              {selected.ai_result && (
                <>
                  <div>
                    <p className="text-muted-foreground mb-2 font-medium">Kleurenpalet</p>
                    <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                      {selected.ai_result.moodboard?.kleuren?.map((c: string, i: number) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-muted-foreground">Pakketadvies</p>
                      <p className="font-medium text-primary">{selected.ai_result.pakketAdvies?.aanbevolen}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Typografie</p>
                      <p className="font-medium">
                        {selected.ai_result.moodboard?.typografie?.heading} / {selected.ai_result.moodboard?.typografie?.body}
                      </p>
                    </div>
                  </div>

                  {selected.ai_result.samenvatting && (
                    <div>
                      <p className="text-muted-foreground mb-1">AI Samenvatting</p>
                      <p className="bg-muted/30 p-3 rounded-lg">{selected.ai_result.samenvatting}</p>
                    </div>
                  )}
                </>
              )}

              {/* Status */}
              <div>
                <p className="text-muted-foreground mb-1">Status wijzigen</p>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    updateResult(selected.id, { status: e.target.value });
                    setSelected({ ...selected, status: e.target.value });
                  }}
                  className="px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
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
                    updateResult(selected.id, { notities: notes });
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

export default AdminMoodboards;
