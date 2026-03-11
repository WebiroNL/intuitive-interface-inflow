import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  tags: string[];
  author: string;
  read_time: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const emptyPost: Omit<BlogPost, "id" | "created_at" | "updated_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  image_url: "",
  category: "Blog",
  tags: [],
  author: "Team Webiro",
  read_time: "5 min",
  published: false,
  published_at: null,
};

const AdminBlog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyPost);
  const [tagsInput, setTagsInput] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (post: typeof form & { id?: string }) => {
      const payload = {
        ...post,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        published_at: post.published ? (post.published_at || new Date().toISOString()) : null,
      };

      if (post.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", post.id);
        if (error) throw error;
      } else {
        const { id: _, ...insertPayload } = payload as any;
        const { error } = await supabase
          .from("blog_posts")
          .insert(insertPayload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Opgeslagen ✓" });
      setEditing(null);
      setCreating(false);
      setForm(emptyPost);
      setTagsInput("");
    },
    onError: (err: any) => {
      toast({ title: "Fout", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Verwijderd" });
    },
  });

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setCreating(false);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      image_url: post.image_url || "",
      category: post.category,
      tags: post.tags,
      author: post.author,
      read_time: post.read_time || "5 min",
      published: post.published,
      published_at: post.published_at,
    });
    setTagsInput(post.tags?.join(", ") || "");
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyPost);
    setTagsInput("");
  };

  const cancel = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyPost);
    setTagsInput("");
  };

  const handleSave = () => {
    if (!form.title || !form.slug || !form.content) {
      toast({ title: "Vul titel, slug en content in", variant: "destructive" });
      return;
    }
    saveMutation.mutate(editing ? { ...form, id: editing.id } : form);
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setForm({ ...form, slug });
  };

  const isEditorOpen = creating || editing;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            {posts.length} artikel{posts.length !== 1 ? "en" : ""}
          </p>
        </div>
        {!isEditorOpen && (
          <Button onClick={startCreate} size="sm">
            <HugeiconsIcon icon={Add01Icon} size={16} className="mr-1.5" />
            Nieuw artikel
          </Button>
        )}
      </div>

      {/* Editor */}
      {isEditorOpen && (
        <Card className="p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">
              {editing ? "Artikel bewerken" : "Nieuw artikel"}
            </h2>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground">
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Titel *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Artikel titel"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Slug *</label>
              <div className="flex gap-2">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="artikel-slug"
                />
                <Button variant="outline" size="sm" onClick={generateSlug} type="button">
                  Auto
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">Excerpt</label>
            <Textarea
              value={form.excerpt || ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Korte samenvatting..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">Content (Markdown) *</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Schrijf je artikel in Markdown..."
              rows={12}
              className="font-mono text-[13px]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Afbeelding URL</label>
              <Input
                value={form.image_url || ""}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Categorie</label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Blog"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Tags (komma-gescheiden)</label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="SEO, Tips, Design"
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Auteur</label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">Leestijd</label>
              <Input
                value={form.read_time || ""}
                onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                placeholder="5 min"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-[13px] text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded border-input"
              />
              Gepubliceerd
            </label>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={cancel}>
                Annuleren
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Opslaan..." : "Opslaan"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Posts list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt=""
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[14px] font-semibold text-foreground truncate">
                    {post.title}
                  </h3>
                  {post.published ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} /> Live
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground">Concept</span>
                  )}
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {post.category} · {post.author} · /blog/{post.slug}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <HugeiconsIcon icon={EyeIcon} size={16} />
                </a>
                <button
                  onClick={() => startEdit(post)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <HugeiconsIcon icon={Edit01Icon} size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Weet je zeker dat je dit artikel wilt verwijderen?")) {
                      deleteMutation.mutate(post.id);
                    }
                  }}
                  className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
