import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { updatePageMeta } from "@/utils/seo";

const articles: Record<string, {
  title: string;
  category: string;
  categoryEmoji: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  description: string;
  tags: string[];
  content: React.ReactNode;
  relatedSlugs: string[];
}> = {
  "5-redenen-waarom-jouw-bedrijf-website-nodig-heeft": {
    title: "5 Redenen waarom jouw bedrijf een professionele website nodig heeft",
    category: "Blog",
    categoryEmoji: "📝",
    date: "18 januari 2025",
    readTime: "5 min",
    author: "Team Webiro",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    description: "In 2024 is een website geen luxe meer, maar een noodzaak. Ontdek waarom jouw bedrijf niet zonder kan.",
    tags: ["Webdesign", "Business", "Tips"],
    relatedSlugs: ["webiro-is-van-start", "webdesign-trends-2024"],
    content: (
      <>
        <p className="text-lg leading-relaxed mb-6">
          In de digitale wereld van 2024 is een professionele website geen luxe meer - het is een <strong>absolute noodzaak</strong> voor elk bedrijf dat serieus genomen wil worden. Maar waarom eigenlijk? Laten we de 5 belangrijkste redenen bespreken.
        </p>

        <h2>1. 24/7 Online Bereikbaar 🌍</h2>
        <p>Jouw fysieke winkel sluit om 18:00, maar jouw website niet. Een website zorgt ervoor dat potentiële klanten je <strong>altijd</strong> kunnen vinden en informatie over je diensten kunnen opzoeken - zelfs om 3 uur 's nachts.</p>
        <ul>
          <li>Klanten kunnen op elk moment informatie vinden</li>
          <li>Internationale bezoekers kunnen je vinden in verschillende tijdzones</li>
          <li>Automatische verkoop via webshops zelfs als je slaapt</li>
        </ul>

        <h2>2. Eerste Indruk Telt 💼</h2>
        <p><strong>93% van de consumenten</strong> zoekt online informatie voordat ze een aankoop doen. Als zij jouw bedrijf niet kunnen vinden, of een ouderwetse website zien, ben je al afgevallen voordat je überhaupt een kans hebt gehad.</p>
        <p>Een moderne, professionele website laat zien dat:</p>
        <ul>
          <li>Je bedrijf up-to-date en betrouwbaar is</li>
          <li>Je investeert in kwaliteit</li>
          <li>Je klanten serieus neemt</li>
        </ul>

        <h2>3. Concurrentievoordeel 🚀</h2>
        <p>Terwijl jij dit leest, zijn jouw concurrenten online actief. Als zij wel een goede website hebben en jij niet, waar denk je dat klanten naartoe gaan?</p>
        <ul>
          <li>Hogere vindbaarheid in Google</li>
          <li>Meer vertrouwen bij potentiële klanten</li>
          <li>Een professionele uitstraling</li>
          <li>De mogelijkheid om je expertise te tonen</li>
        </ul>

        <h2>4. Marketing & Groei 📈</h2>
        <p>Een website is niet alleen een digitaal visitekaartje - het is jouw <strong>krachtigste marketingtool</strong>. Met een website kun je:</p>
        <ul>
          <li><strong>SEO</strong>: Gevonden worden in Google door lokale klanten</li>
          <li><strong>Social Media</strong>: Traffic genereren vanaf Instagram, Facebook, TikTok</li>
          <li><strong>Email Marketing</strong>: Bezoekers omzetten in subscribers en klanten</li>
          <li><strong>Analytics</strong>: Precies zien wat werkt en wat niet</li>
          <li><strong>Content Marketing</strong>: Blogs en artikelen delen die je expertise laten zien</li>
        </ul>

        <h2>5. Kosteneffectief 💰</h2>
        <p>Vergeleken met traditionele marketing (advertenties in kranten, folders, etc.) is een website <strong>ongelooflijk kosteneffectief</strong>.</p>
        <h3>Rekenvoorbeeld:</h3>
        <ul>
          <li>Krantadvertentie: €500-2000 per maand</li>
          <li>Website: €449 eenmalig + €49/maand hosting</li>
          <li>Bereik krantadvertentie: Lokaal, tijdelijk</li>
          <li>Bereik website: Wereldwijd, permanent</li>
        </ul>
        <p>Met Webiro heb je binnen 7 dagen een professionele website voor een fractie van wat je anders aan marketing zou uitgeven.</p>

        <h2>Klaar voor jouw website?</h2>
        <p>Bij Webiro maken we het simpel: jij vertelt ons wat je wilt, wij bouwen je droomsite binnen 7 dagen. Geen gedoe, geen technische rompslomp, gewoon een mooie website waar je trots op bent.</p>
        <p><strong>Bekijk onze pakketten</strong> of <strong>plan een gratis intake</strong> om te starten! 🚀</p>
      </>
    ),
  },
  "webdesign-trends-2024": {
    title: "Webdesign Trends 2024: Dit moet je weten",
    category: "Blog",
    categoryEmoji: "📝",
    date: "15 januari 2025",
    readTime: "6 min",
    author: "Team Webiro",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
    description: "Van minimalistisch design tot AI-integratie - ontdek de hotste webdesign trends van 2024 die je niet mag missen.",
    tags: ["Design", "Trends", "Inspiratie"],
    relatedSlugs: ["webiro-is-van-start", "5-redenen-waarom-jouw-bedrijf-website-nodig-heeft"],
    content: (
      <>
        <p className="text-lg leading-relaxed mb-6">
          Het digitale landschap verandert razendsnel, en webdesign is geen uitzondering. Als je in 2024 wilt opvallen met jouw website, is het belangrijk om op de hoogte te blijven van de laatste trends.
        </p>

        <h2>1. Minimalisme met Impact 🎨</h2>
        <p><strong>Less is more</strong> blijft de norm in 2024, maar met een twist:</p>
        <ul>
          <li>Veel witruimte voor focus</li>
          <li>Grote, gedurfde typografie</li>
          <li>Subtiele animaties die aandacht trekken</li>
          <li>Clean layouts zonder onnodige elementen</li>
        </ul>

        <h2>2. Dark Mode als Standaard 🌙</h2>
        <p>Dark mode is niet langer een optie - het is een verwachting. In 2024 verwachten gebruikers dat websites automatisch hun voorkeur detecteren en een toggle bieden om te wisselen.</p>
        <p><strong>Fun fact:</strong> Bij Webiro is elke website die we bouwen dark mode ready!</p>

        <h2>3. Micro-animaties & Interactiviteit ✨</h2>
        <p>Statische websites zijn verleden tijd. In 2024 verwachten bezoekers een <strong>interactieve ervaring</strong>:</p>
        <ul>
          <li>Hover effecten op buttons</li>
          <li>Smooth scroll animaties</li>
          <li>Loading states die daadwerkelijk mooi zijn</li>
          <li>Typewriter effecten (zoals onze homepage!)</li>
          <li>Animated icons en illustraties</li>
        </ul>

        <h2>4. AI & Personalisatie 🤖</h2>
        <p>Artificial Intelligence maakt zijn intrede in webdesign:</p>
        <ul>
          <li><strong>Chatbots</strong> die daadwerkelijk nuttig zijn</li>
          <li><strong>Personalized content</strong> op basis van gebruikersgedrag</li>
          <li><strong>AI-gegenereerde content</strong> voor SEO</li>
          <li><strong>Smart search</strong> die begrijpt wat je zoekt</li>
        </ul>

        <h2>5. Performance First ⚡</h2>
        <p>Snelheid is in 2024 niet meer optioneel. Google beoordeelt websites mede op laadtijd:</p>
        <ul>
          <li>Minder dan 2 seconden laadtijd is het nieuwe normaal</li>
          <li>Mobile-first is geen buzzword maar een must</li>
          <li>Optimized images en lazy loading</li>
          <li>Minimal JavaScript voor snellere performance</li>
        </ul>

        <h2>6. Grote, Gedurfde Typografie 🔤</h2>
        <ul>
          <li>Extra grote headers die statement maken</li>
          <li>Custom fonts die karakter toevoegen</li>
          <li>Variable fonts voor betere performance</li>
          <li>Mix van font weights voor hiërarchie</li>
        </ul>
        <p><strong>Pro tip:</strong> Bij Webiro gebruiken we Inter font - modern, clean en perfect leesbaar.</p>

        <h2>Klaar voor een trendy website?</h2>
        <p>Wil jij een website die niet alleen mooi is, maar ook helemaal <strong>up-to-date met 2024 trends</strong>? Bij Webiro zorgen we ervoor dat jouw website er niet uitziet alsof het uit 2010 komt.</p>
        <p><strong>Plan een gratis intake</strong> en laat ons je verrassen met wat er mogelijk is! 🚀</p>
      </>
    ),
  },
  "webiro-is-van-start": {
    title: "Webiro is officieel van start! 🎉",
    category: "Nieuws",
    categoryEmoji: "📢",
    date: "24 november 2024",
    readTime: "3 min",
    author: "Team Webiro",
    image: "https://images.unsplash.com/photo-1597329204992-214518c367b3?w=1200",
    description: "We zijn trots om aan te kondigen dat Webiro officieel live is! Professionele websites binnen 7 dagen, vanaf €449.",
    tags: ["Lancering", "Nieuws", "Webiro"],
    relatedSlugs: ["5-redenen-waarom-jouw-bedrijf-website-nodig-heeft", "webdesign-trends-2024"],
    content: (
      <>
        <h2>Welkom bij Webiro! 🎉</h2>
        <p>Na maanden van hard werken, testen en perfectioneren zijn we eindelijk zover: <strong>Webiro is officieel van start!</strong> We zijn ongelooflijk trots om jullie onze nieuwe webdesign service te kunnen presenteren.</p>

        <h2>Onze missie</h2>
        <p>Bij Webiro geloven we dat elke ondernemer recht heeft op een professionele, mooie website - zonder maandenlang te wachten of duizenden euro's uit te geven. We hebben onze diensten ontwikkeld met één doel voor ogen: <strong>jouw bedrijf binnen 7 dagen online krijgen met een website waar je trots op kunt zijn.</strong></p>

        <h2>Wat maakt Webiro anders?</h2>
        <ul>
          <li>⚡ <strong>Razendsnel</strong>: Binnen 7 dagen online</li>
          <li>💰 <strong>Eerlijke prijzen</strong>: Transparant vanaf €449 (Start pakket)</li>
          <li>🎨 <strong>Echt maatwerk</strong>: Geen templates, maar échte custom designs</li>
          <li>🤝 <strong>Persoonlijk contact</strong>: Direct contact met je eigen designer</li>
          <li>🔧 <strong>Moderne techniek</strong>: Gebouwd met React, Tailwind en de nieuwste tools</li>
          <li>🔒 <strong>SSL & Hosting</strong>: Alles geregeld, jij hoeft nergens over na te denken</li>
        </ul>

        <h2>Onze pakketten</h2>
        <h3>🌱 Webiro Start - €449</h3>
        <ul>
          <li>Perfect voor startende ondernemers</li>
          <li>1 pagina website</li>
          <li>Mobile responsive design</li>
          <li>SSL certificaat</li>
        </ul>

        <h3>🚀 Webiro Groei - €749</h3>
        <ul>
          <li>Voor groeiende bedrijven</li>
          <li>Tot 5 pagina's</li>
          <li>SEO optimalisatie</li>
          <li>Contact formulier</li>
        </ul>

        <h3>💎 Webiro Pro - €999</h3>
        <ul>
          <li>Complete websites</li>
          <li>Tot 10 pagina's</li>
          <li>Geavanceerde features</li>
          <li>Analytics & tracking</li>
        </ul>

        <h2>Klaar om te starten?</h2>
        <p>We kunnen niet wachten om jouw project te starten! Plan vandaag nog een gratis intake gesprek en ontdek hoe wij jouw bedrijf online kunnen brengen.</p>
        <p><strong>Geen verborgen kosten, geen gedoe, gewoon een mooie website binnen 7 dagen.</strong> ✨</p>
        <p>Tot snel,<br />Het Webiro Team</p>
      </>
    ),
  },
};

const allPosts = Object.entries(articles).map(([slug, article]) => ({
  slug,
  title: article.title,
  image: article.image,
  category: article.category,
  categoryEmoji: article.categoryEmoji,
  date: article.date,
  readTime: article.readTime,
}));

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articles[slug] : undefined;

  useEffect(() => {
    if (article) {
      updatePageMeta(article.title, article.description);
    }
  }, [article]);

  if (!article || !slug) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = allPosts.filter((p) => article.relatedSlugs.includes(p.slug));

  return (
    <main>
      <section className="pt-32 pb-12 bg-gradient-to-br from-secondary via-background to-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {article.categoryEmoji} {article.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime} lezen</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 bg-secondary text-muted-foreground rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <img src={article.image} alt={article.title} className="w-full rounded-3xl shadow-xl mb-12 aspect-video object-cover" />
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            {article.content}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-primary to-accent text-white p-8 md:p-12 rounded-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Klaar om jouw website te laten maken?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Plan een gratis intake gesprek en binnen 7 dagen staat jouw droomsite online!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/intake">🚀 Plan Gratis Intake</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/pakketten">💰 Bekijk Pakketten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">Meer Lezen?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group bg-background rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <span>{post.categoryEmoji} {post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default BlogArticle;
