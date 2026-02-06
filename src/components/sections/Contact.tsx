import { useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Bericht verzonden!",
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
      value: "Op aanvraag",
      href: null,
    },
    {
      icon: MapPin,
      label: "Locatie",
      value: "Nederland",
      href: null,
    },
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container-webiro">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Contact
          </span>
          <h2 className="text-balance">
            Klaar voor een <span className="text-primary">nieuwe</span> website?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Neem contact met ons op voor een vrijblijvend adviesgesprek. 
            We bespreken graag de mogelijkheden voor jouw project.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border shadow-lg">
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

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Verzenden..."
                ) : (
                  <>
                    Verstuur Bericht
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
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
            <div className="bg-foreground text-background p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">Gratis Adviesgesprek</h3>
              <p className="text-webiro-gray-400 mb-6">
                Wil je direct bespreken wat we voor je kunnen betekenen? 
                Plan een vrijblijvend gesprek in.
              </p>
              <Button variant="secondary" className="w-full" asChild>
                <a href="mailto:info@webiro.nl">Gesprek Inplannen</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
