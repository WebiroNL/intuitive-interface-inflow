import { useEffect } from "react";
import { Handshake, Palette, Rocket, MessageCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { TimelineIcon } from "@/components/TimelineIcon";
import { CTASection } from "@/components/CTASection";
import { updatePageMeta } from "@/utils/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Proces = () => {
  useEffect(() => {
    updatePageMeta(
      "Proces - Hoe wij werken in 4 stappen",
      "Ontdek hoe wij binnen 7 dagen jouw professionele website realiseren. Van intake tot oplevering in 4 duidelijke stappen."
    );
  }, []);

  const steps = [
    {
      number: "01",
      icon: Handshake,
      title: "Kennismaking",
      duration: "Dag 1",
      description:
        "We plannen een gratis intake gesprek waarin we jouw wensen, doelen en budget bespreken. Geen verplichtingen, gewoon kennismaken.",
      features: [
        "Gratis intake gesprek",
        "Bespreking van wensen en doelgroep",
        "Advies over het juiste pakket",
        "Vrijblijvend offerte",
      ],
    },
    {
      number: "02",
      icon: Palette,
      title: "Designfase",
      duration: "Dag 2-4",
      description:
        "Na akkoord gaan we aan de slag met het design. Je ontvangt een eerste opzet en we verfijnen totdat je volledig tevreden bent.",
      features: [
        "Eerste designvoorstel binnen 3 dagen",
        "Revisierondes inbegrepen",
        "Eigen foto's en logo integreren",
        "Feedback via persoonlijk contact",
      ],
    },
    {
      number: "03",
      icon: Rocket,
      title: "Oplevering",
      duration: "Dag 5-6",
      description:
        "Je website wordt gebouwd, getest en online gezet. Je ontvangt een volledige uitleg over het beheer en gebruik.",
      features: [
        "Testen op alle apparaten",
        "SEO optimalisatie",
        "Domein & hosting hulp",
        "Instructie voor CMS",
      ],
    },
    {
      number: "04",
      icon: MessageCircle,
      title: "Support",
      duration: "Doorlopend",
      description:
        "Ook na de lancering blijven we beschikbaar. Bij elk pakket zit support inbegrepen en we bieden optionele onderhoudspakketten.",
      features: [
        "Support periode inbegrepen",
        "Hulp bij vragen en aanpassingen",
        "Optionele Webiro Care",
        "Snelle responstijd",
      ],
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
                Ons Proces
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Van idee naar website" speed={60} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                In 4 duidelijke stappen realiseren we jouw professionele website. Transparant, efficiënt en zonder gedoe.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 md:py-28">
          <div className="container-webiro">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative mb-12 last:mb-0"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-primary to-primary/20 -z-10" />
                  )}

                  <div className="flex gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <TimelineIcon icon={step.icon} isActive={index === 0} delay={index * 0.1} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow pb-12">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {step.number}
                        </span>
                        <span className="text-sm text-muted-foreground">{step.duration}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>

                      <ul className="grid sm:grid-cols-2 gap-3">
                        {step.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection variant="dark" />
      </main>

      <Footer />
    </div>
  );
};

export default Proces;
