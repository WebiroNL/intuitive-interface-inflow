import { useEffect } from "react";
import { ArrowRight, Calendar, Zap, Clock, Palette, Smartphone, Rocket, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { AnimatedWLogo } from "@/components/AnimatedWLogo";
import { CTASection } from "@/components/CTASection";
import { updatePageMeta } from "@/utils/seo";

const Home = () => {
  useEffect(() => {
    updatePageMeta(
      "Home - Moderne websites binnen 7 dagen",
      "Binnen 7 dagen online met jouw droomsite. Webiro maakt moderne, professionele websites voor ondernemers, salons, kappers en zzp'ers. Betaalbaar vanaf €449."
    );
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const features = [
    { icon: Clock, title: "Binnen 7 dagen online", description: "Snel en efficiënt zonder in te leveren op kwaliteit" },
    { icon: Zap, title: "Betaalbaar vanaf €449", description: "Professionele websites voor elk budget" },
    { icon: Palette, title: "Modern design", description: "Strak, professioneel en op maat gemaakt" },
    { icon: Smartphone, title: "Volledig responsive", description: "Perfect op desktop, tablet en mobiel" },
    { icon: Rocket, title: "Razendsnel geladen", description: "Geoptimaliseerd voor snelheid en SEO" },
    { icon: Wrench, title: "Inclusief support", description: "We staan voor je klaar na oplevering" },
  ];

  const targetAudience = [
    { emoji: "💇‍♀️", title: "Kappers & Salons" },
    { emoji: "🏪", title: "Lokale ondernemers" },
    { emoji: "👨‍💼", title: "ZZP'ers & Freelancers" },
    { emoji: "🏋️", title: "Fitness & Wellness" },
    { emoji: "🍽️", title: "Restaurants & Cafés" },
    { emoji: "💼", title: "Dienstverleners" },
  ];

  const packages = [
    { name: "Start", price: "€449", period: "eenmalig", description: "Perfect voor starters" },
    { name: "Groei", price: "€749", period: "eenmalig", description: "Voor groeiende bedrijven", popular: true },
    { name: "Pro", price: "€999", period: "eenmalig", description: "Maximale impact" },
  ];

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background -z-10" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

          <div className="container-webiro">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <motion.div {...fadeInUp}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Webdesign Bureau
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <TypewriterText 
                    text="Jouw droomsite" 
                    speed={80} 
                    className="text-primary"
                  />
                  <br />
                  <span className="text-foreground">online binnen 7 dagen</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
                  Webiro maakt moderne, professionele websites voor ondernemers die zich willen onderscheiden. 
                  Betaalbaar, snel en zonder gedoe.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button size="lg" asChild className="group text-base">
                    <Link to="/intake">
                      <Calendar className="mr-2 h-5 w-5" />
                      Gratis Adviesgesprek
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-base">
                    <Link to="/pakketten">Bekijk Pakketten</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 md:gap-12">
                  {[
                    { value: "50+", label: "Projecten" },
                    { value: "100%", label: "Tevreden" },
                    { value: "7", label: "Dagen" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-foreground/5 to-transparent rounded-3xl transform -rotate-3" />
                  
                  <div className="relative h-full bg-card rounded-2xl shadow-2xl border border-border overflow-hidden p-8 flex items-center justify-center">
                    <div className="text-center">
                      <AnimatedWLogo size={120} className="mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-foreground">Webiro</h3>
                      <p className="text-muted-foreground mt-2">Jouw digitale partner</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-secondary/30">
          <div className="container-webiro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                Waarom Webiro?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Alles wat je nodig hebt voor <span className="text-primary">succes</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Van design tot oplevering, wij regelen het allemaal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover-lift"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-20 md:py-28">
          <div className="container-webiro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                Voor wie?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Websites voor <span className="text-primary">elke ondernemer</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {targetAudience.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-card rounded-2xl border border-border text-center hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <span className="text-4xl mb-3 block">{item.emoji}</span>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Preview */}
        <section className="py-20 md:py-28 bg-foreground text-background">
          <div className="container-webiro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-4">
                Pakketten
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Kies jouw <span className="text-primary">perfecte</span> pakket
              </h2>
              <p className="text-lg text-webiro-gray-400">
                Transparante prijzen, geen verrassingen
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl border transition-all ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-webiro-gray-900 border-webiro-gray-800 hover:border-primary/50"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                      Populair
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">Webiro {pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-sm opacity-80 ml-1">{pkg.period}</span>
                  </div>
                  <p className={pkg.popular ? "text-white/80" : "text-webiro-gray-400"}>
                    {pkg.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/pakketten">
                  Bekijk alle pakketten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
    </>
  );
};

export default Home;
