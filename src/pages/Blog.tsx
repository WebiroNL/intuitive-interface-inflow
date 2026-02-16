import { useEffect } from "react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { updatePageMeta } from "@/utils/seo";

const Blog = () => {
  useEffect(() => {
    updatePageMeta(
      "Blog & Nieuws - Tips, Trends en Updates",
      "Ontdek handige webdesign tips, de laatste trends, en nieuws over Webiro. Van SEO tot design trends - wij delen onze kennis met jou."
    );
  }, []);

  const blogPosts = [
    {
      slug: "5-redenen-waarom-jouw-bedrijf-website-nodig-heeft",
      title: "5 Redenen waarom jouw bedrijf een professionele website nodig heeft",
      excerpt: "In de digitale wereld van 2024 is een professionele website geen luxe meer - het is een absolute noodzaak voor elk bedrijf dat serieus genomen wil worden.",
      category: "Blog",
      categoryEmoji: "📝",
      date: "18 januari 2025",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
      tags: ["Webdesign", "Business", "Tips"],
    },
    {
      slug: "webdesign-trends-2024",
      title: "Webdesign Trends 2024: Dit moet je weten",
      excerpt: "Van minimalistisch design tot AI-integratie - ontdek de hotste webdesign trends van 2024 die je niet mag missen.",
      category: "Blog",
      categoryEmoji: "📝",
      date: "15 januari 2025",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
      tags: ["Design", "Trends", "Inspiratie"],
    },
    {
      slug: "webiro-is-van-start",
      title: "Webiro is officieel van start! 🎉",
      excerpt: "We zijn trots om aan te kondigen dat Webiro officieel live is! Professionele websites binnen 7 dagen, vanaf €449.",
      category: "Nieuws",
      categoryEmoji: "📢",
      date: "24 november 2024",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1597329204992-214518c367b3?w=1200",
      tags: ["Lancering", "Nieuws", "Webiro"],
    },
  ];

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <>
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-secondary via-background to-background">
          <div className="container-webiro text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                Blog & Nieuws
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Blog & Nieuws" speed={60} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ontdek handige tips, de laatste trends, en blijf op de hoogte van alle Webiro nieuwtjes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container-webiro">
            <h2 className="text-2xl font-bold text-foreground mb-8">Nieuwste Artikel</h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="group grid md:grid-cols-2 gap-8 bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {featuredPost.categoryEmoji} {featuredPost.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {featuredPost.date}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredPost.readTime} lezen
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    Lees meer <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Other Posts */}
        <section className="py-12 pb-20">
          <div className="container-webiro">
            <div className="grid md:grid-cols-2 gap-8">
              {otherPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all block"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {post.categoryEmoji} {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        <span className="text-xs text-muted-foreground">• {post.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-card">
          <div className="container-webiro text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Mis geen enkel artikel! ✨
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Wil je op de hoogte blijven van nieuwe blogs, tips en Webiro nieuws? Volg ons op social media!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.instagram.com/webiro.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                📸 Volg op Instagram
              </a>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  💬 Neem Contact Op
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
