import { useEffect } from "react";
import { Check, Star, Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { CTASection } from "@/components/CTASection";
import { updatePageMeta } from "@/utils/seo";

const Pakketten = () => {
  useEffect(() => {
    updatePageMeta(
      "Pakketten - Website pakketten vanaf €449",
      "Bekijk onze website pakketten. Van basic websites tot uitgebreide e-commerce oplossingen. Transparante prijzen en geen verborgen kosten. Vanaf €449."
    );
  }, []);

  const packages = [
    {
      id: "start",
      name: "Webiro Start",
      oldPrice: 599,
      price: 449,
      savings: 150,
      badge: "Oplevering binnen 1 week",
      description: "Snel online met een professionele website",
      whatYouGet: [
        "1 pagina website",
        "SEO Start (title tags + meta descriptions)",
        "1 revisieronde",
      ],
      whyChoose: [
        "Ideaal voor starters",
        "Snel en betaalbaar online",
        "Alles eenvoudig op één pagina",
      ],
    },
    {
      id: "groei",
      name: "Webiro Groei",
      oldPrice: 949,
      price: 749,
      savings: 200,
      badge: "Oplevering binnen 2 weken",
      description: "Alles wat je nodig hebt om klanten aan te trekken",
      popular: true,
      whatYouGet: [
        "Tot 5 pagina's",
        "SEO Groei (10 zoekwoorden + Google indexering)",
        "2 revisierondes",
      ],
      whyChoose: [
        "Meer ruimte voor diensten en info",
        "Professionelere uitstraling",
        "Perfect voor groeiende bedrijven",
      ],
    },
    {
      id: "pro",
      name: "Webiro Pro",
      oldPrice: 1299,
      price: 999,
      savings: 300,
      badge: "Oplevering binnen 3 weken",
      description: "Maximale impact met geavanceerde SEO",
      whatYouGet: [
        "Tot 10 pagina's",
        "SEO Pro (15+ zoekwoorden + maandrapport)",
        "3 revisierondes",
      ],
      whyChoose: [
        "Uniek, professioneel ontwerp",
        "Verhoogt vertrouwen en conversies",
        "Ideaal voor grotere ambities",
      ],
    },
    {
      id: "business",
      name: "Webiro Business",
      price: "Op aanvraag",
      badge: "Volledig maatwerk",
      description: "Voor bedrijven met specifieke eisen",
      whatYouGet: [
        "10-20 pagina's volledig maatwerk",
        "Webshop / ledenportal / reserveringen",
        "Content Management Systeem",
      ],
      whyChoose: [
        "Volledige vrijheid in design",
        "Koppelingen met externe systemen",
        "Dedicated projectmanager",
      ],
    },
  ];

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
                Pakketten & Prijzen
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Kies jouw pakket" speed={60} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transparante prijzen, geen verrassingen. Kies het pakket dat bij jouw ambities past.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-20 md:py-28">
          <div className="container-webiro">
            <div className="grid md:grid-cols-2 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-3xl border-2 transition-all ${
                    pkg.popular
                      ? "border-primary bg-primary/5 shadow-xl"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                        <Star className="w-4 h-4" /> Meest gekozen
                      </span>
                    </div>
                  )}

                  {pkg.savings && (
                    <div className="absolute top-6 right-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full dark:bg-green-900/30 dark:text-green-400">
                        <Flame className="w-4 h-4" /> Bespaar €{pkg.savings}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <span className="text-sm text-primary font-medium">{pkg.badge}</span>
                    <h3 className="text-2xl font-bold text-foreground mt-2">{pkg.name}</h3>
                    <p className="text-muted-foreground mt-1">{pkg.description}</p>
                  </div>

                  <div className="mb-8">
                    {typeof pkg.price === "number" ? (
                      <div className="flex items-baseline gap-2">
                        {pkg.oldPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            €{pkg.oldPrice}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-foreground">€{pkg.price}</span>
                        <span className="text-muted-foreground">eenmalig</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                    )}
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Wat je krijgt:</h4>
                      <ul className="space-y-2">
                        {pkg.whatYouGet.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Waarom kiezen:</h4>
                      <ul className="space-y-2">
                        {pkg.whyChoose.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link to="/intake">
                      Kies {pkg.name.split(" ")[1]}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
    </>
  );
};

export default Pakketten;
