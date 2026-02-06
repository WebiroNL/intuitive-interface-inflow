import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const highlights = [
    "Informatica achtergrond met jarenlange ervaring",
    "Focus op privacy en veiligheid",
    "Persoonlijke aanpak en directe communicatie",
    "Resultaatgericht en transparant",
  ];

  return (
    <section id="over-ons" className="section-padding">
      <div className="container-webiro">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto lg:mx-0 relative">
              {/* Background shapes */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl transform rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-tl from-secondary to-transparent rounded-3xl transform -rotate-3" />
              
              {/* Main image placeholder */}
              <div className="relative h-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary">W</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Webiro Team</h3>
                  <p className="text-muted-foreground mt-2">Jouw digitale partners</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm font-semibold">5+ jaar ervaring</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              Over Ons
            </span>
            <h2 className="text-balance">
              Passie voor <span className="text-primary">perfecte</span> websites
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Webiro is opgericht vanuit een passie voor webdesign en technologie. 
              Met een achtergrond in informatica en jarenlange ervaring in webontwikkeling, 
              begrijpen we zowel de technische als creatieve aspecten van het bouwen van 
              succesvolle websites.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Wij geloven dat een goede website meer is dan alleen een mooi design. 
              Het moet snel zijn, veilig, en jouw bezoekers overtuigen om actie te ondernemen.
            </p>

            {/* Highlights */}
            <ul className="mt-8 space-y-4">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="#contact">Neem Contact Op</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
