import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Calendar01Icon, Clock01Icon, User03Icon } from "@hugeicons/core-free-icons";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { updatePageMeta } from "@/utils/seo";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["blog-related", slug, article?.category],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, image_url, category, published_at, read_time")
        .eq("published", true)
        .neq("slug", slug!)
        .order("published_at", { ascending: false })
        .limit(2);
      return data || [];
    },
    enabled: !!article,
  });

  useEffect(() => {
    if (article) {
      updatePageMeta(
        `${article.title} | Webiro Blog`,
        article.excerpt || article.title,
        `/blog/${article.slug}`,
        article.image_url || undefined
      );
    }
  }, [article]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <main className="bg-background pt-[60px]">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <main className="bg-background pt-[60px]">
      {/* Structured data for this blog post */}
      <StructuredData
        type="BlogPosting"
        data={{
          title: article.title,
          excerpt: article.excerpt,
          image_url: article.image_url,
          author: article.author,
          published_at: article.published_at,
          updated_at: article.updated_at,
          slug: article.slug,
        }}
      />

      {/* ══════ HEADER ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Terug naar blog
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                {article.category}
              </span>
            </div>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={User03Icon} size={14} />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Calendar01Icon} size={14} />
                {formatDate(article.published_at)}
              </span>
              {article.read_time && (
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} size={14} />
                  {article.read_time} lezen
                </span>
              )}
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 bg-muted text-muted-foreground rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════ IMAGE ══════ */}
      {article.image_url && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-2xl aspect-video object-cover"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* ══════ CONTENT ══════ */}
      <section className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* ══════ RELATED ══════ */}
      {relatedPosts.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08] mb-10"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              Meer lezen
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map((post: any) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
                >
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-[12px] text-muted-foreground">
                      <span className="font-bold uppercase tracking-wide text-primary text-[11px]">{post.category}</span>
                      <span>·</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <h3 className="text-[18px] font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </main>
  );
};

export default BlogArticle;
