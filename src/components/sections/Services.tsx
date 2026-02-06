import { Monitor, Search, Server, Brush, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: Monitor,
      title: "Webdesign & Ontwikkeling",
      description: "Van concept tot livegang. Wij ontwerpen en bouwen moderne, responsive websites die converteren.",
      features: ["Responsive design", "Snelle laadtijden", "Gebruiksvriendelijk CMS"],
    },
    {
      icon: Search,
      title: "SEO Optimalisatie",
      description: "Zorg dat je gevonden wordt. Wij optimaliseren je website voor zoekmachines met bewezen strategieën.",
      features: ["Technische SEO", "Content optimalisatie", "Lokale SEO"],
    },
    {
      icon: Server,
      title: "Hosting & Onderhoud",
      description: "Betrouwbare hosting met 99.9% uptime en proactief onderhoud voor een zorgeloze website.",
      features: ["SSL certificaat", "Dagelijkse backups", "24/7 monitoring"],
    },
    {
      icon: Brush,
      title: "Branding & Identiteit",
      description: "Een sterke visuele identiteit die je merk onderscheidt en vertrouwen wekt bij je doelgroep.",
      features: ["Logo ontwerp", "Huisstijl", "Brand guidelines"],
    },
  ];

  return (
    <section id="diensten" className="section-padding">
      <div className="container-webiro">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Onze Diensten
          </span>
          <h2 className="text-balance">
            Alles wat je nodig hebt voor een{" "}
            <span className="text-primary">succesvolle</span> online aanwezigheid
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Van design tot hosting, wij bieden een complete oplossing voor jouw digitale succes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative p-8 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover-lift overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>

                <h3 className="text-2xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-primary hover:bg-transparent">
                  Meer informatie
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
