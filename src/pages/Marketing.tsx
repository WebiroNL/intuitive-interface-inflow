import { useEffect } from "react";
import { Target, Mail, Bot, TrendingUp, Users, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/TypewriterText";
import { CTASection } from "@/components/CTASection";
import { updatePageMeta } from "@/utils/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Marketing = () => {
  useEffect(() => {
    updatePageMeta(
      "Marketing - Groei met online marketing",
      "Versterk je online aanwezigheid met onze marketing diensten. Van Google Ads tot social media campagnes en marketing automation."
    );
  }, []);

  const services = [
    {
      icon: Target,
      title: "Advertenties",
      color: "from-primary to-primary/80",
      items: ["Google Ads", "Meta (Instagram & Facebook)", "TikTok Ads", "Snapchat Ads"],
    },
    {
      icon: Mail,
      title: "Marketing Automation",
      color: "from-accent to-accent/80",
      items: ["E-mail flows & sequences", "Abandoned cart recovery", "Lead nurturing funnels", "WhatsApp automation"],
    },
    {
      icon: Bot,
      title: "AI & Support",
      color: "from-webiro-yellow to-webiro-yellow/80",
      items: ["Customer support AI chatbot", "Lead kwalificatie bot", "FAQ automation", "24/7 WhatsApp support bot"],
    },
  ];

  const results = [
    { stat: "+240%", label: "ROAS binnen 2 maanden", icon: TrendingUp },
    { stat: "+1.200", label: "gekwalificeerde leads per maand", icon: Users },
    { stat: "1.8x → 4.2x", label: "ROI verbetering", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary via-[hsl(250,80%,58%)] to-accent text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-webiro-yellow rounded-full blur-3xl" />
          </div>

          <div className="container-webiro relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium mb-6">
                Marketing Diensten
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Groei met marketing" speed={60} />
                <span className="text-webiro-yellow">.</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Versterk je online aanwezigheid en bereik meer klanten met onze bewezen marketing strategieën.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/intake">
                  Start met marketing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 md:py-28">
          <div className="container-webiro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                Onze Diensten
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Alles voor <span className="text-primary">online groei</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-20 md:py-28 bg-foreground text-background">
          <div className="container-webiro">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Resultaten die <span className="text-primary">tellen</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {results.map((result, index) => (
                <motion.div
                  key={result.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-8"
                >
                  <result.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{result.stat}</p>
                  <p className="text-webiro-gray-400">{result.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Marketing;
