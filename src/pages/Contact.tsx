import { useEffect, useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypewriterText } from "@/components/TypewriterText";
import { updatePageMeta } from "@/utils/seo";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    updatePageMeta(
      "Contact - Neem contact op",
      "Neem contact op met Webiro. Stuur een bericht of bel ons direct. We reageren binnen 24 uur."
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Bericht verzonden! ✓",
      description: "We nemen zo snel mogelijk contact met je op.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "E-mail",
      value: "info@webiro.nl",
      href: "mailto:info@webiro.nl",
    },
    {
      icon: Phone,
      label: "Telefoon",
      value: "085 505 505 4",
      href: "tel:0855055054",
    },
    {
      icon: MapPin,
      label: "Locatie",
      value: "Nederland",
      href: null,
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
                Contact
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <TypewriterText text="Neem contact op" speed={60} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Vul het formulier in en we nemen zo snel mogelijk contact met je op. Of bel ons direct!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 md:py-28">
          <div className="container-webiro">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6">Neem contact op</h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Naam *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Jouw naam"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        E-mail *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="jouw@email.nl"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefoon
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="06 12345678"
                      className="bg-background"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                      Bedrijfsnaam
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Jouw bedrijf"
                      className="bg-background"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="package" className="block text-sm font-medium text-foreground mb-2">
                      Interesse in pakket
                    </label>
                    <select
                      id="package"
                      name="package"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Selecteer een pakket</option>
                      <option value="start">Webiro Start - €449</option>
                      <option value="groei">Webiro Groei - €749</option>
                      <option value="pro">Webiro Pro - €999</option>
                      <option value="business">Webiro Business - Op aanvraag</option>
                      <option value="shop">Webiro Shop - Op aanvraag</option>
                      <option value="anders">Anders / Nog niet zeker</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Bericht *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Vertel ons over je project..."
                      className="bg-background resize-none"
                    />
                  </div>

                  <div className="space-y-3 mb-6">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" required className="mt-1 rounded border-input" />
                      <span className="text-sm text-muted-foreground">Ik geef toestemming om contact met mij op te nemen over deze aanvraag. *</span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 rounded border-input" />
                      <span className="text-sm text-muted-foreground">Ik wil graag op de hoogte blijven van nieuwe pakketten en aanbiedingen.</span>
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Verzenden..."
                    ) : (
                      <>
                        Verstuur bericht
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 space-y-6"
              >
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-lg font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-primary to-accent text-white p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-3">Liever direct praten?</h3>
                  <p className="text-white/80 mb-6">
                    Plan een gratis adviesgesprek in en bespreek je project met ons.
                  </p>
                  <Button variant="secondary" className="w-full" asChild>
                    <a href="/intake">Gesprek Inplannen</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
