import { useEffect, useState } from "react";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { updatePageMeta } from "@/utils/seo";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

interface LegalPage {
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  published: boolean;
  category: string;
  sort_order: number;
}

interface NavItem {
  slug: string;
  title: string;
  category: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  legal: "Juridisch",
  bedrijf: "Bedrijf",
};

export default function LegalPageView() {
  const params = useParams<{ slug?: string }>();
  const location = useLocation();
  const slug = params.slug ?? location.pathname.replace(/^\//, "").split("/").pop() ?? "";
  const [page, setPage] = useState<LegalPage | null>(null);
  const [siblings, setSiblings] = useState<NavItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      supabase
        .from("legal_pages")
        .select("slug, title, subtitle, content, published, category, sort_order")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle(),
      supabase
        .from("legal_pages")
        .select("slug, title, category, sort_order")
        .eq("published", true)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
    ]).then(([pageRes, allRes]) => {
      if (pageRes.error || !pageRes.data) {
        setNotFound(true);
      } else {
        const data = pageRes.data as LegalPage;
        setPage(data);
        updatePageMeta(
          `${data.title} - Webiro`,
          data.subtitle ?? `${data.title} bij Webiro`
        );
      }
      if (allRes.data) {
        setSiblings(allRes.data as NavItem[]);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <Navigate to="/404" replace />;
  if (!page) return null;

  // Group siblings by category
  const grouped = siblings.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  // Find prev/next within same category
  const sameCat = grouped[page.category] ?? [];
  const idx = sameCat.findIndex((s) => s.slug === page.slug);
  const prev = idx > 0 ? sameCat[idx - 1] : null;
  const next = idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null;

  return (
    <div className="bg-background pt-24 lg:pt-28">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary mb-4">
            {CATEGORY_LABEL[page.category] ?? "Pagina"}
          </p>
          <h1 className="text-[36px] lg:text-[48px] leading-[1.1] tracking-[-0.02em] font-semibold text-foreground max-w-3xl">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-4 text-[16px] lg:text-[17px] leading-relaxed text-muted-foreground max-w-2xl">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Body with sidebar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <nav className="space-y-8">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                    {CATEGORY_LABEL[cat] ?? cat}
                  </p>
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const active = item.slug === page.slug;
                      return (
                        <li key={item.slug}>
                          <Link
                            to={`/${item.slug}`}
                            className={`block text-[13.5px] py-1.5 px-3 -mx-3 rounded-md transition-colors ${
                              active
                                ? "text-primary bg-primary/8 font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            }`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <article>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-semibold prose-headings:tracking-[-0.01em] prose-headings:text-foreground
                prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:pt-8 prose-h2:border-t prose-h2:border-border first:prose-h2:border-t-0 first:prose-h2:pt-0 first:prose-h2:mt-0
                prose-h3:text-[18px] prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-[15.5px] prose-p:leading-[1.75] prose-p:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-4 prose-li:text-[15.5px] prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:my-1
                prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:text-foreground prose-blockquote:not-italic
                prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none
                prose-hr:border-border prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            {/* Prev / Next */}
            {(prev || next) && (
              <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  {prev && (
                    <Link
                      to={`/${prev.slug}`}
                      className="group flex flex-col p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
                        Vorige
                      </span>
                      <span className="text-[14px] font-medium text-foreground mt-1.5 group-hover:text-primary transition-colors">
                        {prev.title}
                      </span>
                    </Link>
                  )}
                </div>
                <div>
                  {next && (
                    <Link
                      to={`/${next.slug}`}
                      className="group flex flex-col p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors text-right"
                    >
                      <span className="flex items-center justify-end gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Volgende
                        <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                      </span>
                      <span className="text-[14px] font-medium text-foreground mt-1.5 group-hover:text-primary transition-colors">
                        {next.title}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
