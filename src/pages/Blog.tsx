import { useEffect } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { updatePageMeta } from "@/utils/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Blog = () => {
  useEffect(() => {
    updatePageMeta(
      "Blog - Tips en nieuws over webdesign",
      "Lees onze blog artikelen over webdesign, SEO, online marketing en meer. Tips voor ondernemers die online willen groeien."
    );
  }, []);

  const blogPosts = [
    {
      slug: "website-laten-maken-kosten",
      title: "Wat kost een website laten maken in 2025?",
      excerpt: "Een overzicht van de kosten voor het laten maken van een website. Van budget opties tot premium maatwerk.",
      category: "Kosten",
      date: "14 december 2024",
      readTime: "5 min",
    },
    {
      slug: "waarom-je-geen-social-media-moet-gebruiken-als-enige-online-aanwezigheid",
      title: "Waarom alleen social media niet genoeg is",
      excerpt: "Social media is geweldig, maar het is niet genoeg als je enige online aanwezigheid. Ontdek waarom een website essentieel is.",
      category: "Marketing",
      date: "10 december 2024",
      readTime: "4 min",
    },
    {
      slug: "waarom-elke-schoonheidssalon-een-website-nodig-heeft",
      title: "Waarom elke schoonheidssalon een website nodig heeft",
      excerpt: "Als schoonheidssalon wil je gevonden worden door nieuwe klanten. Een professionele website is daarbij onmisbaar.",
      category: "Branche",
      date: "6 december 2024",
      readTime: "4 min",
    },
    {
      slug: "waarom-elke-kapper-een-website-nodig-heeft",
      title: "Waarom elke kapper een website nodig heeft",
      excerpt: "Ontdek waarom een website voor kappers essentieel is en hoe je daarmee meer klanten aantrekt.",
      category: "Branche",
      date: "2 december 2024",
      readTime: "4 min",
    },
    {
      slug: "webiro-is-van-start",
      title: "Webiro is van start! 🚀",
      excerpt: "Welkom bij Webiro! We zijn officieel gestart met onze missie om moderne websites te maken voor ondernemers.",
      category: "Nieuws",
      date: "24 november 2024",
      readTime: "2 min",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
                Blog
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Tips & Nieuws" speed={60} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Artikelen over webdesign, SEO en online marketing voor ondernemers.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 md:py-28">
          <div className="container-webiro">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  {/* Placeholder Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <span className="text-6xl">📝</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Lees meer <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-accent text-white">
          <div className="container-webiro text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Plan een gratis adviesgesprek en ontdek wat Webiro voor jou kan betekenen.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/intake">
                <Calendar className="mr-2 h-5 w-5" />
                Plan een gesprek
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
