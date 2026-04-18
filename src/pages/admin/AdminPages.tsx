import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  PencilEdit02Icon,
  FloppyDiskIcon,
  Cancel01Icon,
  Link01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  published: boolean;
  sort_order: number;
  category: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: 'legal', label: 'Juridisch' },
  { value: 'bedrijf', label: 'Bedrijf' },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function AdminPages() {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LegalPage | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("legal_pages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) toast.error("Kon pagina's niet laden");
    else setPages((data ?? []) as LegalPage[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async (page: Partial<LegalPage> & { id?: string }) => {
    const payload = {
      slug: page.slug || slugify(page.title || ""),
      title: page.title || "Nieuwe pagina",
      subtitle: page.subtitle || null,
      content: page.content || "",
      published: page.published ?? true,
      sort_order: page.sort_order ?? 99,
      category: page.category || "legal",
    };

    if (page.id) {
      const { error } = await supabase.from("legal_pages").update(payload).eq("id", page.id);
      if (error) return toast.error("Opslaan mislukt: " + error.message);
      toast.success("Pagina opgeslagen");
    } else {
      const { error } = await supabase.from("legal_pages").insert(payload);
      if (error) return toast.error("Aanmaken mislukt: " + error.message);
      toast.success("Pagina aangemaakt");
    }
    setEditing(null);
    setCreating(false);
    fetchPages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Pagina permanent verwijderen?")) return;
    const { error } = await supabase.from("legal_pages").delete().eq("id", id);
    if (error) return toast.error("Verwijderen mislukt");
    toast.success("Pagina verwijderd");
    fetchPages();
  };

  const togglePublished = async (page: LegalPage) => {
    const { error } = await supabase
      .from("legal_pages")
      .update({ published: !page.published })
      .eq("id", page.id);
    if (error) return toast.error("Update mislukt");
    fetchPages();
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pagina's</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beheer juridische en bedrijfspagina's. Pagina's verschijnen automatisch in de footer onder de gekozen categorie.
          </p>
        </div>
        <button
          onClick={() => {
            setCreating(true);
            setEditing({
              id: "",
              slug: "",
              title: "",
              subtitle: "",
              content: "",
              published: true,
              sort_order: pages.length + 1,
              category: "legal",
              updated_at: "",
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} /> Nieuwe pagina
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Laden...</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-foreground">Titel</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">URL</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Categorie</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Volgorde</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acties</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      <HugeiconsIcon icon={Link01Icon} size={12} /> /{p.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sort_order}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(p)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium ${
                        p.published
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <HugeiconsIcon icon={p.published ? ViewIcon : ViewOffSlashIcon} size={12} />
                      {p.published ? "Gepubliceerd" : "Verborgen"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                        aria-label="Bewerk"
                      >
                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                        aria-label="Verwijder"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nog geen pagina's. Klik op "Nieuwe pagina" om te beginnen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <PageEditor
          initial={editing}
          isNew={creating}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function PageEditor({
  initial,
  isNew,
  onClose,
  onSave,
}: {
  initial: LegalPage;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Partial<LegalPage> & { id?: string }) => void;
}) {
  const [form, setForm] = useState<LegalPage>(initial);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-stretch justify-end">
      <div className="w-full max-w-3xl h-full bg-card border-l border-border overflow-y-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isNew ? "Nieuwe pagina" : "Pagina bewerken"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 inline-flex items-center gap-2"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} /> Annuleren
            </button>
            <button
              onClick={() => onSave({ ...form, id: isNew ? undefined : form.id })}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 inline-flex items-center gap-2"
            >
              <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> Opslaan
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <Field label="Titel">
            <input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm({ ...form, title, slug: isNew && !form.slug ? slugify(title) : form.slug });
              }}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              placeholder="Bijv. Disclaimer"
            />
          </Field>

          <Field label="URL slug" hint="Wordt gebruikt als /jouw-slug">
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm font-mono"
              placeholder="bijv. disclaimer"
            />
          </Field>

          <Field label="Ondertitel" hint="Optioneel, getoond onder de titel">
            <input
              value={form.subtitle ?? ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              placeholder="Bijv. Versie: november 2025"
            />
          </Field>

          <Field label="Categorie" hint="Bepaalt onder welke kolom in de footer de pagina verschijnt">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Volgorde in footer" hint="Lager nummer = hoger in lijst">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="w-32 px-3 py-2 border border-input bg-background rounded-md text-sm"
            />
          </Field>

          <Field label="Status">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Gepubliceerd (zichtbaar in footer)</span>
            </label>
          </Field>

          <Field label="Inhoud" hint="HTML wordt ondersteund. Gebruik <h2>, <p>, <strong>, <a> etc.">
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={20}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm font-mono leading-relaxed"
              placeholder="<h2>Kop</h2><p>Tekst...</p>"
            />
          </Field>

          <Field label="Voorbeeld">
            <div
              className="prose prose-sm max-w-none border border-border rounded-md p-4 bg-background dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-muted-foreground'>Geen inhoud</p>" }}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
