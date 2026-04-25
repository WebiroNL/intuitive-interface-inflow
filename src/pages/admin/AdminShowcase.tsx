import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit02Icon, Delete02Icon, ArrowUp01Icon, ArrowDown01Icon, Link01Icon } from "@hugeicons/core-free-icons";

interface ShowcaseRow {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  services: string[];
  tint: string;
  sort_order: number;
  published: boolean;
}

const emptyForm: Omit<ShowcaseRow, "id"> = {
  title: "",
  category: "",
  url: "",
  description: "",
  services: [],
  tint: "234,82%,57%",
  sort_order: 0,
  published: true,
};

const TINT_PRESETS = [
  { label: "Blauw", value: "234,82%,57%" },
  { label: "Oranje", value: "16,85%,55%" },
  { label: "Donkerblauw", value: "215,55%,40%" },
  { label: "Geel", value: "44,90%,55%" },
  { label: "Roze", value: "330,75%,60%" },
  { label: "Rood", value: "0,75%,55%" },
  { label: "Groen", value: "150,65%,45%" },
  { label: "Paars", value: "270,70%,55%" },
];

export default function AdminShowcase() {
  const { toast } = useToast();
  const [items, setItems] = useState<ShowcaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [servicesInput, setServicesInput] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("showcase_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Fout bij laden", description: error.message, variant: "destructive" });
    } else {
      setItems((data ?? []) as ShowcaseRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: (items[items.length - 1]?.sort_order ?? 0) + 10 });
    setServicesInput("");
    setOpen(true);
  };

  const openEdit = (row: ShowcaseRow) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      category: row.category,
      url: row.url,
      description: row.description,
      services: row.services,
      tint: row.tint,
      sort_order: row.sort_order,
      published: row.published,
    });
    setServicesInput(row.services.join(", "));
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.url.trim() || !form.category.trim()) {
      toast({ title: "Vul minimaal titel, categorie en URL in", variant: "destructive" });
      return;
    }
    setSaving(true);
    const services = servicesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = { ...form, services };

    const { error } = editingId
      ? await supabase.from("showcase_items").update(payload).eq("id", editingId)
      : await supabase.from("showcase_items").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingId ? "Bijgewerkt" : "Toegevoegd" });
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Verwijder dit item?")) return;
    const { error } = await supabase.from("showcase_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Verwijderen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const move = async (row: ShowcaseRow, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === row.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from("showcase_items").update({ sort_order: swap.sort_order }).eq("id", row.id);
    await supabase.from("showcase_items").update({ sort_order: row.sort_order }).eq("id", swap.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end flex-wrap gap-3">
        <Button onClick={openNew} className="gap-2">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          Nieuw item
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Nog geen items.</div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((row, idx) => (
              <div key={row.id} className="flex items-start gap-4 p-4 hover:bg-muted/30">
                <div
                  className="w-12 h-12 rounded-lg shrink-0 border border-border"
                  style={{
                    background: `linear-gradient(135deg, hsla(${row.tint},0.6), hsla(${row.tint},0.2))`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {row.category}
                    </p>
                    {!row.published && <Badge variant="outline" className="text-[10px]">Concept</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{row.title}</h3>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline"
                  >
                    <HugeiconsIcon icon={Link01Icon} size={12} />
                    {row.url.replace(/^https?:\/\//, "")}
                  </a>
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">{row.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {row.services.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => move(row, -1)}
                    disabled={idx === 0}
                    aria-label="Omhoog"
                  >
                    <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => move(row, 1)}
                    disabled={idx === items.length - 1}
                    aria-label="Omlaag"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(row)} aria-label="Bewerk">
                    <HugeiconsIcon icon={Edit02Icon} size={14} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(row.id)} aria-label="Verwijder">
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Item bewerken" : "Nieuw item"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Bedrijfsnaam"
                />
              </div>
              <div>
                <Label htmlFor="category">Categorie</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Bijv. Sport & Fitness"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://www.voorbeeld.nl"
              />
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Korte omschrijving van het project..."
              />
            </div>

            <div>
              <Label htmlFor="services">Tags / services (komma-gescheiden)</Label>
              <Input
                id="services"
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
                placeholder="Website, Branding, SEO, Google Ads"
              />
            </div>

            <div>
              <Label>Kleur tint</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {TINT_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setForm({ ...form, tint: p.value })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px] transition ${
                      form.tint === p.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: `hsl(${p.value})` }}
                    />
                    {p.label}
                  </button>
                ))}
              </div>
              <Input
                className="mt-2"
                value={form.tint}
                onChange={(e) => setForm({ ...form, tint: e.target.value })}
                placeholder="HSL triplet, bv. 234,82%,57%"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sort_order">Sorteervolgorde</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="published">Gepubliceerd op homepage</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuleren</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
