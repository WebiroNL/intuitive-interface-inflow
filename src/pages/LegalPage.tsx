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

  // After render: assign ids to h2 elements, prepend numeric labels & set up scrollspy
  useEffect(() => {
    if (!articleRef.current || !page) return;
    const h2s = articleRef.current.querySelectorAll("h2");
    h2s.forEach((h, i) => {
      // Remove any previously injected label so we can recompute id from clean text
      h.querySelector("[data-doc-label]")?.remove();
      const id = slugify(h.textContent ?? "");
      h.id = id;
      // Style the H2 itself as a flex container so label sits next to title
      h.classList.add("flex", "items-baseline", "gap-4");
      const label = document.createElement("span");
      label.setAttribute("data-doc-label", "");
      label.className =
        "shrink-0 text-[11px] font-mono text-muted-foreground/50 tracking-tight not-prose font-normal";
      label.textContent = String(i + 1).padStart(2, "0");
      h.prepend(label);
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-16 pb-24 lg:pb-32">
        {/* Hero */}
        <div className="max-w-3xl mb-20 lg:mb-28">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-6 font-mono">
            {CATEGORY_LABEL[page.category] ?? "Pagina"}
          </p>
          <h1 className="text-[40px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] font-semibold text-foreground mb-6">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-[17px] leading-[1.6] text-muted-foreground/90 max-w-2xl font-light">
              {page.subtitle}
            </p>
          )}
          {page.updated_at && (
            <p className="mt-6 text-[11px] text-muted-foreground/70 font-mono tracking-tight">
              Bijgewerkt {formatDate(page.updated_at)}
            </p>
          )}
        </div>

        {/* Two col: side nav + content + TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-12 lg:gap-20">
          {/* Left sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            {orderedCats.map((cat, i) => (
              <div key={cat} className={i > 0 ? "mt-8 pt-8 border-t border-border/60" : ""}>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-3 font-mono">
                  {CATEGORY_LABEL[cat] ?? cat}
                </p>
                <nav className="flex flex-col">
                  {grouped[cat].map((item) => {
                    const active = item.slug === page.slug;
                    return (
                      <Link
                        key={item.slug}
                        to={`/${item.slug}`}
                        className={`group relative -ml-px border-l py-[7px] pl-3 text-[13.5px] leading-snug transition-all ${
                          active
                            ? "border-primary text-foreground font-medium"
                            : "border-transparent text-muted-foreground/80 hover:text-foreground hover:border-border"
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
          <main className="min-w-0 max-w-[680px]">
            {/* Mobile: page nav */}
            <div className="lg:hidden mb-10 -mx-2">
              {orderedCats.map((cat) => (
                <div key={cat} className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-2 px-2 font-mono">
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
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-semibold prose-headings:tracking-[-0.015em] prose-headings:text-foreground
                prose-h2:text-[19px] prose-h2:lg:text-[21px] prose-h2:leading-[1.3] prose-h2:mt-20 prose-h2:pt-14 prose-h2:mb-8 prose-h2:scroll-mt-28
                prose-h2:border-t prose-h2:border-border/60 first:prose-h2:border-t-0 first:prose-h2:pt-0 first:prose-h2:mt-0
                prose-h3:text-[16px] prose-h3:lg:text-[17px] prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-foreground prose-h3:leading-[1.4]
                prose-p:text-[15px] prose-p:leading-[1.78] prose-p:text-muted-foreground prose-p:my-7
                prose-a:text-primary prose-a:font-medium prose-a:no-underline prose-a:underline-offset-4 hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-5 prose-ol:my-5 prose-ul:pl-5 prose-ol:pl-5 prose-ul:space-y-1.5 prose-ol:space-y-1.5
                prose-li:text-[15px] prose-li:text-muted-foreground prose-li:leading-[1.78] prose-li:my-0 prose-li:marker:text-foreground/30
                prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:not-italic prose-blockquote:text-foreground prose-blockquote:font-normal prose-blockquote:pl-5 prose-blockquote:my-6
                prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[12.5px] prose-code:font-mono prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                prose-hr:border-border/60 prose-hr:my-14"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </main>

          {/* Right TOC */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start text-sm">
            {toc.length > 0 && (
              <>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-3 font-mono">
                  Op deze pagina
                </p>
                <nav className="flex flex-col">
                  {toc.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (!el) return;
                          const top = el.getBoundingClientRect().top + window.scrollY - 96;
                          window.scrollTo({ top, behavior: "smooth" });
                          history.replaceState(null, "", `#${item.id}`);
                          setActiveId(item.id);
                        }}
                        className={`group relative -ml-px border-l py-[7px] pl-3 text-[13.5px] leading-snug transition-all ${
                          active
                            ? "border-primary text-foreground font-medium"
                            : "border-transparent text-muted-foreground/80 hover:text-foreground hover:border-border"
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
    </div>
  );
}
