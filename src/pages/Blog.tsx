import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { updatePageMeta } from "@/utils/seo";
import { CTASection } from "@/components/CTASection";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  tags: string[];
  author: string;
  read_time: string | null;
  published_at: string | null;
}

const Blog = () => {
  useEffect(() => {
    updatePageMeta(
      "Blog – Tips, trends en updates | Webiro",
      "Ontdek handige webdesign tips, de laatste trends en nieuws over Webiro. Van SEO tot design — wij delen onze kennis."
    );
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, image_url, category, tags, author, read_time, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="bg-background pt-[60px]">
      {/* ══════ HERO ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">
              Blog & Nieuws
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
            >
              <span className="text-foreground">Inzichten en tips</span>{" "}
              <span className="text-muted-foreground font-bold">
                voor groeiende bedrijven.
              </span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl">
              Praktische tips over webdesign, marketing en online groei. Geschreven door ons team.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ POSTS ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">
              Nog geen artikelen gepubliceerd.
            </p>
          ) : (
            <div className="space-y-16">
              {/* Featured */}
              {featuredPost && (
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="group grid md:grid-cols-2 gap-8 rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
                >
                  {featuredPost.image_url && (
                    <div className="aspect-video md:aspect-auto overflow-hidden">
                      <img
                        src={featuredPost.image_url}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        {featuredPost.category}
                      </span>
                      <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                        <HugeiconsIcon icon={Calendar01Icon} size={12} />
                        {formatDate(featuredPost.published_at)}
                      </span>
                      {featuredPost.read_time && (
                        <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} size={12} />
                          {featuredPost.read_time}
                        </span>
                      )}
                    </div>
                    <h2 className="text-[22px] font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary group-hover:gap-3 transition-all">
                      Lees meer <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </span>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {otherPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all flex flex-col"
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
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            {post.category}
                          </span>
                          <span className="text-[12px] text-muted-foreground">
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <h3 className="text-[18px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2 py-0.5 bg-muted text-muted-foreground rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Blog;
