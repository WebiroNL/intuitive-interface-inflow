import { Shield, Zap, TrendingUp, Palette } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Privacy & Veiligheid",
      description: "Alle websites worden gebouwd met de hoogste veiligheidsstandaarden en AVG-compliance in gedachten.",
    },
    {
      icon: Zap,
      title: "Razendsnel",
      description: "Geoptimaliseerde code en moderne technologieën zorgen voor bliksemsnelle laadtijden.",
    },
    {
      icon: TrendingUp,
      title: "SEO Geoptimaliseerd",
      description: "Gevonden worden in Google is essentieel. Wij bouwen met SEO als fundament.",
    },
    {
      icon: Palette,
      title: "Uniek Design",
      description: "Geen templates, maar een volledig op maat gemaakt design dat bij jouw merk past.",
    },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-webiro">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            Waarom Webiro?
          </span>
          <h2 className="text-balance">
            Wat maakt ons <span className="text-primary">anders</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Wij combineren technische expertise met creatief design om websites te bouwen 
            die niet alleen mooi zijn, maar ook resultaat opleveren.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
