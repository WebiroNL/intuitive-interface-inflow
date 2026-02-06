import { MessageSquare, Paintbrush, Code, Rocket } from "lucide-react";

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Kennismaking",
      description: "We starten met een vrijblijvend gesprek om jouw wensen, doelen en doelgroep te begrijpen.",
    },
    {
      number: "02",
      icon: Paintbrush,
      title: "Ontwerp",
      description: "Op basis van jouw input creëren we een uniek design dat perfect past bij jouw merk en boodschap.",
    },
    {
      number: "03",
      icon: Code,
      title: "Ontwikkeling",
      description: "We bouwen je website met moderne technologieën, geoptimaliseerd voor snelheid en gebruiksvriendelijkheid.",
    },
    {
      number: "04",
      icon: Rocket,
      title: "Lancering",
      description: "Na grondige testing gaat je website live. We zorgen voor een soepele overgang en blijven ondersteunen.",
    },
  ];

  return (
    <section id="werkwijze" className="section-padding bg-foreground text-background">
      <div className="container-webiro">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-4">
            Onze Werkwijze
          </span>
          <h2 className="text-balance">
            Van idee naar <span className="text-primary">werkelijkheid</span>
          </h2>
          <p className="mt-4 text-lg text-webiro-gray-400">
            Een transparant proces waarin we nauw samenwerken om jouw perfecte website te realiseren.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-webiro-gray-800 group-hover:bg-primary/30 transition-colors" />
              )}

              <div className="relative bg-webiro-gray-900 rounded-2xl p-8 border border-webiro-gray-800 hover:border-primary/50 transition-all duration-300 hover-lift">
                {/* Step number */}
                <span className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {step.number}
                </span>

                <div className="w-14 h-14 bg-webiro-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-webiro-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
