import { useEffect } from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { updatePageMeta } from "@/utils/seo";

const Intake = () => {
  useEffect(() => {
    updatePageMeta(
      "Intake - Plan een gratis adviesgesprek",
      "Plan een gratis adviesgesprek met Webiro. Bespreek je wensen en ontvang vrijblijvend advies over je website project."
    );
  }, []);

  const benefits = [
    "Gratis en vrijblijvend",
    "Persoonlijk advies op maat",
    "Bespreken van je wensen",
    "Direct een offerte",
  ];

  return (
    <>
      <main>
        {/* Hero */}
        <section className="pt-32 pb-12 bg-gradient-to-br from-secondary via-background to-background">
          <div className="container-webiro text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                Gratis Adviesgesprek
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Plan je gesprek" speed={60} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Kies een moment dat jou uitkomt en we bespreken samen de mogelijkheden voor jouw website.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border"
                  >
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calendly Embed Placeholder */}
        <section className="py-12 md:py-20">
          <div className="container-webiro">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-card rounded-3xl border border-border p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Calendly Integratie
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Hier komt de Calendly widget waar bezoekers direct een gesprek kunnen inplannen. 
                  De integratie wordt later gekoppeld.
                </p>

                {/* Placeholder for Calendly */}
                <div className="bg-muted rounded-2xl p-12 border-2 border-dashed border-border">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    Calendly Widget Placeholder
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    De booking widget wordt hier getoond na koppeling
                  </p>
                </div>

                {/* Alternative Contact */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-muted-foreground mb-4">
                    Liever direct contact? Mail naar{" "}
                    <a href="mailto:info@webiro.nl" className="text-primary hover:underline">
                      info@webiro.nl
                    </a>{" "}
                    of bel{" "}
                    <a href="tel:0855055054" className="text-primary hover:underline">
                      085 505 505 4
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Intake;
