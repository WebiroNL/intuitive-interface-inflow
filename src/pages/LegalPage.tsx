import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { updatePageMeta } from "@/utils/seo";

interface LegalPage {
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  published: boolean;
  category: string;
  sort_order: number;
  updated_at: string;
}

interface NavItem {
  slug: string;
  title: string;
  category: string;
}

interface TocItem {
  id: string;
  text: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  legal: "Juridisch",
  bedrijf: "Bedrijf",
};

const CATEGORY_ORDER = ["bedrijf", "legal"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function LegalPageView() {
  const params = useParams<{ slug?: string }>();
  const location = useLocation();
  const slug = params.slug ?? location.pathname.replace(/^\//, "").split("/").pop() ?? "";
  const [page, setPage] = useState<LegalPage | null>(null);
  const [siblings, setSiblings] = useState<NavItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    Promise.all([
      supabase
        .from("legal_pages")
        .select("slug, title, subtitle, content, published, category, sort_order, updated_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle(),
      supabase
        .from("legal_pages")
        .select("slug, title, category, sort_order")
        .eq("published", true)
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
      if (allRes.data) setSiblings(allRes.data as NavItem[]);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, [slug]);

  // Build TOC + add ids to h2s
  const toc = useMemo<TocItem[]>(() => {
    if (!page?.content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(page.content, "text/html");
    const items: TocItem[] = [];
    doc.querySelectorAll("h2").forEach((h) => {
      const text = h.textContent ?? "";
      if (text.trim()) items.push({ id: slugify(text), text });
    });
    return items;
  }, [page?.content]);

  // After render: assign ids to h2 elements & set up scrollspy
  useEffect(() => {
    if (!articleRef.current || !page) return;
    const h2s = articleRef.current.querySelectorAll("h2");
    h2s.forEach((h) => {
      const id = slugify(h.textContent ?? "");
      h.id = id;
    });

    if (h2s.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 }
    );
    h2s.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <Navigate to="/404" replace />;
  if (!page) return null;

  const grouped = siblings.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});
  const orderedCats = CATEGORY_ORDER.filter((c) => grouped[c]);

  return (
    <div className="bg-background pt-24 lg:pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-12 lg:gap-16 pt-10 lg:pt-16 pb-24 lg:pb-32">
        {/* Left sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start text-sm">
          {orderedCats.map((cat, i) => (
            <div key={cat} className={i > 0 ? "mt-10" : ""}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-4">
                {CATEGORY_LABEL[cat] ?? cat}
              </p>
              <nav className="space-y-px">
                {grouped[cat].map((item) => {
                  const active = item.slug === page.slug;
                  return (
                    <Link
                      key={item.slug}
                      to={`/${item.slug}`}
                      className={`block py-1.5 text-[13.5px] transition-colors ${
                        active
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-5">
            {CATEGORY_LABEL[page.category] ?? "Pagina"}
            {page.updated_at && (
              <>
                <span className="mx-2 text-muted-foreground/50">·</span>
                <span className="text-muted-foreground font-medium normal-case tracking-normal">
                  Bijgewerkt {formatDate(page.updated_at)}
                </span>
              </>
            )}
          </p>
          <h1 className="text-[36px] lg:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-foreground mb-6">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-[16px] lg:text-[17px] leading-relaxed text-muted-foreground mb-14 lg:mb-16 max-w-2xl">
              {page.subtitle}
            </p>
          )}

          {/* Mobile: page nav as select-like list */}
          <div className="lg:hidden mb-10 -mx-2">
            {orderedCats.map((cat) => (
              <div key={cat} className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-2 px-2">
                  {CATEGORY_LABEL[cat] ?? cat}
                </p>
                <div className="flex flex-wrap gap-1.5 px-2">
                  {grouped[cat].map((item) => {
                    const active = item.slug === page.slug;
                    return (
                      <Link
                        key={item.slug}
                        to={`/${item.slug}`}
                        className={`text-[12.5px] px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <article
            ref={articleRef}
            className="max-w-2xl prose prose-neutral dark:prose-invert
              prose-headings:font-semibold prose-headings:tracking-[-0.01em] prose-headings:text-foreground
              prose-h2:text-[22px] prose-h2:mt-12 prose-h2:mb-3 prose-h2:scroll-mt-28
              prose-h3:text-[17px] prose-h3:mt-8 prose-h3:mb-2
              prose-p:text-[15.5px] prose-p:leading-[1.75] prose-p:text-muted-foreground prose-p:my-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-4 prose-ol:my-4
              prose-li:text-[15.5px] prose-li:text-muted-foreground prose-li:leading-[1.75] prose-li:my-1
              prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:not-italic prose-blockquote:text-foreground prose-blockquote:font-normal
              prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              prose-hr:border-border prose-hr:my-12"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </main>

        {/* Right TOC */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start text-sm">
          {toc.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-3">
                Op deze pagina
              </p>
              <nav className="space-y-2 border-l border-border pl-4">
                {toc.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-[13px] leading-snug transition-colors ${
                        active
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.text}
                    </a>
                  );
                })}
              </nav>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
