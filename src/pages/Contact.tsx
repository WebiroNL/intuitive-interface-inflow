import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SentIcon,
  Mail01Icon,
  CallIcon,
  Location01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updatePageMeta } from "@/utils/seo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  {
    icon: Mail01Icon,
    label: "E-mail",
    value: "info@webiro.nl",
    href: "mailto:info@webiro.nl",
  },
  {
    icon: CallIcon,
    label: "Telefoon",
    value: "085 505 505 4",
    href: "tel:0855055054",
  },
  {
    icon: Location01Icon,
    label: "Locatie",
    value: "Nederland",
    href: null,
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    updatePageMeta(
      "Contact – Neem contact op | Webiro",
      "Stel je vraag of plan een gratis gesprek. We reageren dezelfde werkdag. Bel, mail of vul het formulier in."
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const { error } = await supabase.from("leads").insert({
        naam: formData.get("name") as string,
        email: formData.get("email") as string,
        telefoon: (formData.get("phone") as string) || null,
        bedrijfsnaam: (formData.get("company") as string) || null,
        bericht: formData.get("message") as string,
        bron: "contact-formulier",
      });

      if (error) throw error;

      toast({
        title: "Bericht verzonden ✓",
        description: "We nemen binnen 1 werkdag contact met je op.",
      });
      form.reset();
    } catch {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het opnieuw of mail ons direct op info@webiro.nl.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background pt-[60px]">
      {/* ══════ HERO ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">
              Contact
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.08] mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
            >
              <span className="text-foreground">Laten we kennismaken.</span>{" "}
              <span className="text-muted-foreground font-bold">
                We reageren dezelfde werkdag.
              </span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl">
              Vul het formulier in, bel ons of stuur een e-mail. Geen
              verplichtingen — we denken graag met je mee.
            </p>
          </div>
        </div>
      </section>

      {/* ══════ FORM + SIDEBAR ══════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_340px] gap-16">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[13px] font-medium text-foreground mb-2"
                  >
                    Naam *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Jouw naam"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-foreground mb-2"
                  >
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

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[13px] font-medium text-foreground mb-2"
                  >
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
                <div>
                  <label
                    htmlFor="company"
                    className="block text-[13px] font-medium text-foreground mb-2"
                  >
                    Bedrijfsnaam
                  </label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Jouw bedrijf"
                    className="bg-background"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[13px] font-medium text-foreground mb-2"
                >
                  Bericht *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Vertel ons over je project of stel je vraag..."
                  className="bg-background resize-none"
                />
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-input"
                  />
                  <span className="text-[13px] text-muted-foreground">
                    Ik ga akkoord met het{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-primary hover:underline"
                    >
                      privacybeleid
                    </Link>
                    . *
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? (
                  "Verzenden..."
                ) : (
                  <>
                    Verstuur bericht
                    <HugeiconsIcon
                      icon={SentIcon}
                      className="ml-2 h-4 w-4"
                    />
                  </>
                )}
              </Button>
            </form>

            {/* Sidebar — contact info */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon
                      icon={info.icon}
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-[14px] font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-[14px] font-medium text-foreground">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-8 p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-[15px] font-semibold text-foreground mb-2">
                  Liever direct praten?
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                  Plan een gratis strategiegesprek van 15 minuten en bespreek je
                  project.
                </p>
                <Link
                  to="/intake"
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all"
                >
                  Gesprek inplannen{" "}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
