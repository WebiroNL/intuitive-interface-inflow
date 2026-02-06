import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30 -z-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="container-webiro">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-up">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Webdesign Bureau
            </div>

            <h1 className="text-balance leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Websites die{" "}
              <span className="text-primary">privacy</span> combineren met{" "}
              <span className="text-primary">professionaliteit</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Wij ontwerpen en bouwen moderne, snelle websites voor ambitieuze ondernemers 
              die zich willen onderscheiden van de concurrentie.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" asChild className="group">
                <a href="#contact">
                  Gratis Adviesgesprek
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#diensten">
                  <Play className="mr-2 h-4 w-4" />
                  Bekijk Onze Diensten
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8 md:gap-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {[
                { value: "50+", label: "Projecten" },
                { value: "100%", label: "Tevreden klanten" },
                { value: "5+", label: "Jaar ervaring" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Abstract shape background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 bg-gradient-to-tl from-foreground/5 to-transparent rounded-3xl transform -rotate-3" />
              
              {/* Main visual container */}
              <div className="relative h-full bg-card rounded-2xl shadow-2xl border border-border overflow-hidden p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">W</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Webiro</h3>
                  <p className="text-muted-foreground mt-2">Jouw digitale partner</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: "3s" }}>
                <span className="text-primary-foreground text-2xl font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
