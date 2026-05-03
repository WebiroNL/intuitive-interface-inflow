import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Calendar03Icon, UserIcon, Tag01Icon, ViewIcon, Delete02Icon } from "@hugeicons/core-free-icons";

type Status = "todo" | "in_progress" | "waiting_client" | "blocked" | "done";
type Assignee = "even" | "mihran" | null;

interface Task {
  id: string;
  client_id: string;
  service_onboarding_id: string | null;
  category: string;
  service_type: string | null;
  template_key: string | null;
  title: string;
  description: string | null;
  status: Status;
  assignee: Assignee;
  position: number;
  due_date: string | null;
  visible_to_client: boolean;
  client_label: string | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

interface Client {
  id: string;
  company_name: string;
}

const STATUS_COLUMNS: { key: Status; label: string; color: string }[] = [
  { key: "todo", label: "Te doen", color: "bg-muted text-foreground" },
  { key: "in_progress", label: "Bezig", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { key: "waiting_client", label: "Wacht op klant", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { key: "blocked", label: "Geblokkeerd", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { key: "done", label: "Klaar", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
];

const CATEGORY_LABEL: Record<string, string> = {
  onboarding: "Onboarding",
  ads: "Ads",
  website: "Website",
  cms: "CMS / Hosting",
  general: "Algemeen",
};

const CATEGORY_COLOR: Record<string, string> = {
  onboarding: "bg-primary/10 text-primary",
  ads: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  website: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cms: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  general: "bg-muted text-muted-foreground",
};

export default function AdminPlanning() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [view, setView] = useState<"kanban" | "byclient">("kanban");
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [t, c] = await Promise.all([
      (supabase.from("tasks" as any).select("*").order("position", { ascending: true })),
      supabase.from("clients").select("id, company_name").order("company_name"),
    ]);
    setTasks(((t as any).data ?? []) as Task[]);
    setClients(((c as any).data ?? []) as Client[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("tasks-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.company_name ?? "Onbekend";

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterClient !== "all" && t.client_id !== filterClient) return false;
      if (filterAssignee !== "all") {
        if (filterAssignee === "none" && t.assignee) return false;
        if (filterAssignee !== "none" && t.assignee !== filterAssignee) return false;
      }
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      return true;
    });
  }, [tasks, filterClient, filterAssignee, filterCategory]);

  const updateTask = async (id: string, patch: Partial<Task>) => {
    const prev = tasks;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } as Task : t)));
    const { error } = await (supabase.from("tasks" as any).update(patch as any).eq("id", id));
    if (error) {
      setTasks(prev);
      toast.error("Update mislukt");
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Taak verwijderen?")) return;
    const { error } = await (supabase.from("tasks" as any).delete().eq("id", id));
    if (error) return toast.error("Verwijderen mislukt");
    setTasks((ts) => ts.filter((t) => t.id !== id));
    toast.success("Verwijderd");
  };

  const createTask = async (data: Partial<Task>) => {
    const { error, data: res } = await (supabase.from("tasks" as any).insert({
      client_id: data.client_id,
      title: data.title,
      description: data.description ?? null,
      category: data.category ?? "general",
      assignee: data.assignee ?? null,
      status: data.status ?? "todo",
      due_date: data.due_date ?? null,
      visible_to_client: data.visible_to_client ?? false,
      client_label: data.client_label ?? null,
      position: 999,
    } as any).select().single());
    if (error) return toast.error("Aanmaken mislukt");
    setTasks((ts) => [...ts, res as Task]);
    setCreating(false);
    toast.success("Taak toegevoegd");
  };

  // ----- Kanban view -----
  const renderCard = (t: Task) => (
    <div
      key={t.id}
      draggable
      onDragStart={() => setDraggingId(t.id)}
      onDragEnd={() => setDraggingId(null)}
      onClick={() => setEditing(t)}
      className="group bg-card border border-border rounded-lg p-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CATEGORY_COLOR[t.category] ?? CATEGORY_COLOR.general}`}>
            {CATEGORY_LABEL[t.category] ?? t.category}
          </span>
          {t.visible_to_client && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary inline-flex items-center gap-1">
              <HugeiconsIcon icon={ViewIcon} size={10} /> klant
            </span>
          )}
        </div>
      </div>
      <div className="text-sm font-medium text-foreground leading-snug mb-1">{t.title}</div>
      <div className="text-xs text-muted-foreground truncate">{clientName(t.client_id)}</div>
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {t.due_date && (
            <span className="inline-flex items-center gap-1"><HugeiconsIcon icon={Calendar03Icon} size={11} /> {new Date(t.due_date).toLocaleDateString("nl-NL", { day:"2-digit", month:"short" })}</span>
          )}
        </div>
        {t.assignee && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${t.assignee === "even" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-purple-500/10 text-purple-600 dark:text-purple-400"}`}>
            {t.assignee === "even" ? "Even" : "Mihran"}
          </span>
        )}
      </div>
    </div>
  );

  const kanban = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {STATUS_COLUMNS.map((col) => {
        const items = filtered.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggingId) {
                const t = tasks.find((x) => x.id === draggingId);
                if (t && t.status !== col.key) {
                  updateTask(draggingId, { status: col.key, completed_at: col.key === "done" ? new Date().toISOString() : null } as any);
                }
                setDraggingId(null);
              }
            }}
            className="bg-muted/30 rounded-xl p-3 min-h-[300px] flex flex-col gap-2"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${col.color}`}>{col.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{items.length}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {items.map(renderCard)}
              {items.length === 0 && (
                <div className="text-xs text-muted-foreground/60 text-center py-8">Sleep taken hier</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ----- Per-client view -----
  const byClient = useMemo(() => {
    const map: Record<string, Task[]> = {};
    filtered.forEach((t) => { (map[t.client_id] ??= []).push(t); });
    return map;
  }, [filtered]);

  const perClient = (
    <div className="space-y-6">
      {Object.entries(byClient).map(([cid, list]) => {
        const done = list.filter((t) => t.status === "done").length;
        return (
          <Card key={cid} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">{clientName(cid)}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="tabular-nums">{done}/{list.length} klaar</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(done / list.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {list.sort((a,b)=>a.position-b.position).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded" onClick={() => setEditing(t)}>
                  <input
                    type="checkbox"
                    checked={t.status === "done"}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateTask(t.id, { status: e.target.checked ? "done" : "todo", completed_at: e.target.checked ? new Date().toISOString() : null } as any)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</div>
                    <div className="flex gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLOR[t.category] ?? CATEGORY_COLOR.general}`}>{CATEGORY_LABEL[t.category] ?? t.category}</span>
                      {t.visible_to_client && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">klant ziet</span>}
                    </div>
                  </div>
                  <Select value={t.assignee ?? "none"} onValueChange={(v) => updateTask(t.id, { assignee: v === "none" ? null : (v as Assignee) })}>
                    <SelectTrigger className="h-7 w-28 text-xs" onClick={(e)=>e.stopPropagation()}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      <SelectItem value="even">Even</SelectItem>
                      <SelectItem value="mihran">Mihran</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={t.status} onValueChange={(v) => updateTask(t.id, { status: v as Status, completed_at: v === "done" ? new Date().toISOString() : null } as any)}>
                    <SelectTrigger className="h-7 w-36 text-xs" onClick={(e)=>e.stopPropagation()}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_COLUMNS.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
      {Object.keys(byClient).length === 0 && (
        <div className="text-center text-muted-foreground py-12">Geen taken voor deze filters.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Planning</h1>
          <p className="text-sm text-muted-foreground mt-1">Project management voor alle klantopdrachten. Taken worden automatisch aangemaakt bij onboarding.</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-2">
          <HugeiconsIcon icon={Add01Icon} size={16} /> Nieuwe taak
        </Button>
      </div>

      <Card className="p-3 flex items-center gap-3 flex-wrap">
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="h-9 w-56"><SelectValue placeholder="Klant" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle klanten</SelectItem>
            {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
          <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Toegewezen" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Iedereen</SelectItem>
            <SelectItem value="even">Even</SelectItem>
            <SelectItem value="mihran">Mihran</SelectItem>
            <SelectItem value="none">Niet toegewezen</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Categorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle categorieën</SelectItem>
            {Object.entries(CATEGORY_LABEL).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground">{filtered.length} taken</div>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="byclient">Per klant</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-4">{loading ? <div className="text-sm text-muted-foreground">Laden…</div> : kanban}</TabsContent>
        <TabsContent value="byclient" className="mt-4">{loading ? <div className="text-sm text-muted-foreground">Laden…</div> : perClient}</TabsContent>
      </Tabs>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Taak bewerken</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Titel</label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Beschrijving</label>
                <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Notities (intern)</label>
                <Textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS_COLUMNS.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Toegewezen</label>
                  <Select value={editing.assignee ?? "none"} onValueChange={(v) => setEditing({ ...editing, assignee: v === "none" ? null : (v as Assignee) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Niemand</SelectItem>
                      <SelectItem value="even">Even</SelectItem>
                      <SelectItem value="mihran">Mihran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Categorie</label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(CATEGORY_LABEL).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Deadline</label>
                  <Input type="date" value={editing.due_date ?? ""} onChange={(e) => setEditing({ ...editing, due_date: e.target.value || null })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.visible_to_client} onChange={(e) => setEditing({ ...editing, visible_to_client: e.target.checked })} />
                Zichtbaar voor klant in portaal
              </label>
              {editing.visible_to_client && (
                <div>
                  <label className="text-xs text-muted-foreground">Label voor klant (optioneel)</label>
                  <Input value={editing.client_label ?? ""} onChange={(e) => setEditing({ ...editing, client_label: e.target.value })} placeholder={editing.title} />
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="ghost" className="text-destructive" onClick={() => editing && (deleteTask(editing.id), setEditing(null))}>
              <HugeiconsIcon icon={Delete02Icon} size={14} /> Verwijderen
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Annuleren</Button>
              <Button onClick={async () => {
                if (!editing) return;
                const { id, created_at, completed_at, completed_by, ...rest } = editing as any;
                await updateTask(id, rest);
                setEditing(null);
                toast.success("Opgeslagen");
              }}>Opslaan</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create dialog */}
      <CreateTaskDialog open={creating} onOpenChange={setCreating} clients={clients} onCreate={createTask} />
    </div>
  );
}

function CreateTaskDialog({ open, onOpenChange, clients, onCreate }: { open: boolean; onOpenChange: (b: boolean)=>void; clients: Client[]; onCreate: (t: Partial<Task>)=>void }) {
  const [title, setTitle] = useState("");
  const [client_id, setClientId] = useState<string>("");
  const [category, setCategory] = useState("general");
  const [assignee, setAssignee] = useState<string>("none");
  const [visible, setVisible] = useState(false);
  const [due, setDue] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (open) { setTitle(""); setClientId(""); setCategory("general"); setAssignee("none"); setVisible(false); setDue(""); setDesc(""); }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Nieuwe taak</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Klant</label>
            <Select value={client_id} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Kies klant" /></SelectTrigger>
              <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Titel</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Beschrijving</label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Categorie</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(CATEGORY_LABEL).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Toegewezen</label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Niemand</SelectItem>
                  <SelectItem value="even">Even</SelectItem>
                  <SelectItem value="mihran">Mihran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground">Deadline</label>
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
            Zichtbaar voor klant
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuleren</Button>
          <Button disabled={!title || !client_id} onClick={() => onCreate({ title, client_id, category, assignee: assignee === "none" ? null : (assignee as Assignee), visible_to_client: visible, due_date: due || null, description: desc || null })}>Aanmaken</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
