import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TypewriterText } from "@/components/TypewriterText";
import { updatePageMeta } from "@/utils/seo";

interface LegalPage {
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  published: boolean;
}

export default function LegalPageView() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LegalPage | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    supabase
      .from("legal_pages")
      .select("slug, title, subtitle, content, published")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPage(data as LegalPage);
          updatePageMeta(`${data.title} - Webiro`, data.subtitle ?? `${data.title} bij Webiro`);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) return <Navigate to="/404" replace />;
  if (!page) return null;

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-background dark:from-[#1a1719] dark:to-background py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-foreground mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            <TypewriterText text={page.title} speed={60} />
            <span className="text-primary">.</span>
          </h1>
          {page.subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{page.subtitle}</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
    </div>
  );
}
