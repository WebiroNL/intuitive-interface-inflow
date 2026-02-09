import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Users, Clock, Star, CheckCircle, ChevronLeft, ChevronRight, Rocket, Globe, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { AnimatedWLogo } from "@/components/AnimatedWLogo";
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useTheme } from "@/contexts/ThemeContext";
import { updatePageMeta } from "@/utils/seo";

const Home = () => {
  const showcaseScrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const [selectedPackage, setSelectedPackage] = useState<'start' | 'groei' | 'pro'>('start');
  const { theme } = useTheme();
  
  const splineUrl = useMemo(() => 
    theme === 'dark' 
      ? 'https://my.spline.design/glassmorphlandingpagecopycopy-AwnDMbfEajcUOlYhoFpXNQxR/' 
      : 'https://my.spline.design/glassmorphlandingpagecopy-WQe0ukjPWyKibLiUv1pBNkXX/',
    [theme]
  );

  useEffect(() => {
    updatePageMeta(
      "Home - Moderne websites binnen 7 dagen",
      "Binnen 7 dagen online met jouw droomsite. Webiro maakt moderne, professionele websites voor ondernemers, salons, kappers en zzp'ers. Betaalbaar vanaf €449."
    );
  }, []);

  // Auto-scroll for showcase
  useEffect(() => {
    const container = showcaseScrollRef.current;
    if (!container) return;

    const scrollSpeed = 1;
    let animationId: number;

    const autoScroll = () => {
      if (!container || isPausedRef.current) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth / 2;
      
      if (currentScroll >= maxScroll - 10) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = currentScroll + scrollSpeed;
      }
      
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);
    return () => { if (animationId) cancelAnimationFrame(animationId); };
  }, []);

  const scrollShowcase = (direction: 'left' | 'right') => {
    if (showcaseScrollRef.current) {
      isPausedRef.current = true;
      const scrollAmount = 370;
      showcaseScrollRef.current.scrollTo({
        left: showcaseScrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
      setTimeout(() => { isPausedRef.current = false; }, 2000);
    }
  };

  const features = [
    { icon: <Zap className="w-8 h-8 text-primary" />, title: 'Snel online', description: 'Binnen 7 dagen online met jouw professionele website' },
    { icon: <Users className="w-8 h-8 text-primary" />, title: 'Betaalbaar', description: 'Transparante prijzen zonder verrassingen achteraf' },
    { icon: <Clock className="w-8 h-8 text-primary" />, title: 'Persoonlijke service', description: 'Direct contact met je designer en snelle support' },
  ];

  const showcaseItems = [
    { title: 'Matrix City', category: 'Fitness', url: 'https://www.matrixcity.nl', description: 'Moderne sportschool met strak design', icon: '💪' },
    { title: 'CKN Legal', category: 'Legal', url: 'https://www.cknlegal.com', description: 'ZZP\'er in rechten met professioneel design', icon: '⚖️' },
    { title: 'Elektroza', category: 'Techniek', url: 'https://www.elektroza.nl', description: 'Elektricien met heldere website', icon: '⚡' },
    { title: 'Coco De Rio', category: 'Fashion', url: 'https://cocoderio.com', description: 'Trendy bikini brand met stijlvol design', icon: '🏖️' },
    { title: 'Prokick Academie', category: 'Sport', url: 'https://www.prokickacademie.nl', description: 'Professionele voetbalschool', icon: '⚽' },
  ];

  const testimonials = [
    { name: 'Christina N.', role: 'CKN Legal', rating: 5, text: 'Professionele website die perfect aansluit bij mijn juridische diensten. De samenwerking verliep uitstekend.', avatar: 'CN' },
    { name: 'Nawid Z.', role: 'Prokick Academie', rating: 5, text: 'Onze voetbalschool heeft nu een website waar we echt trots op zijn! Professioneel, modern.', avatar: 'NZ' },
    { name: 'Rian M.', role: 'Elektroza', rating: 5, text: 'Helder en overzichtelijk, precies wat ik nodig had voor mijn elektriciensbedrijf.', avatar: 'RM' },
  ];

  return (
    <main>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="Service" />
      
      {/* HERO - FULLSCREEN WITH 3D BACKGROUND */}
      <section className="relative w-full h-[70vh] max-h-[600px] bg-background overflow-hidden">
        {/* Spline 3D Background */}
        <iframe 
          key={theme}
          src={splineUrl}
          frameBorder="0" 
          width="100%" 
          height="100%"
          className="absolute inset-0 w-full h-full"
          style={{ contain: 'layout style paint', isolation: 'isolate', willChange: 'auto' }}
          title="3D Background"
        />

        {/* Bottom fade for Spline logo */}
        <div className="absolute bottom-0 right-0 w-96 h-64 pointer-events-none z-[5]">
          <div className="absolute inset-0 bg-gradient-to-t from-background from-30% via-background/98 via-60% to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12 lg:py-16 relative z-10 h-full flex items-center pointer-events-none">
          <div className="max-w-4xl mx-auto text-center space-y-4 pointer-events-none">
            <div className="inline-block pointer-events-none">
              <span className="text-xs sm:text-sm font-semibold text-primary bg-card backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border-2 border-card">
                Websites & marketing die opleveren
              </span>
            </div>

            <h1 className="text-foreground pointer-events-none">
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Binnen 7 dagen een moderne website óf meer klanten uit je bestaande site
              </span>
            </h1>

            <div className="max-w-3xl mx-auto bg-card/10 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-border/20 pointer-events-none">
              <p className="text-xs sm:text-sm md:text-base text-foreground leading-relaxed">
                Webiro helpt ambitieuze ondernemers met snelle, conversiegerichte websites én slimme marketing. Of je nu vanaf nul start of al een website hebt: we zorgen dat online eindelijk voor je gaat werken.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-1 max-w-2xl mx-auto pointer-events-auto">
              <Link
                to="/pakketten"
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-2xl"
              >
                <span>Ik heb nog geen website</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/marketing"
                className="group flex items-center justify-center gap-2 px-6 py-4 bg-card hover:bg-card/80 text-foreground border-2 border-foreground rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-2xl"
              >
                <span>Ik heb al een website</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="pt-1 pb-4">
              <p className="text-xs sm:text-sm text-foreground flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+30 ondernemers geholpen aan meer omzet via webdesign en marketing.</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      </section>

      {/* 2 Doelgroep Tegels Section */}
      <section className="py-20 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-foreground text-4xl md:text-5xl font-bold mb-4 transition-colors">
              Kies wat bij jou past<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto transition-colors">
              Start je net of wil je meer uit wat je al hebt? Webiro sluit aan op waar jij nu staat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Geen website */}
            <div className="group bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-primary/10 hover:border-primary/40 flex flex-col">
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-lg">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground text-2xl font-bold mb-4 transition-colors">
                Ik heb nog geen website
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed transition-colors">
                Je hebt een sterk aanbod, maar nog geen professionele website. Wij ontwerpen en bouwen binnen 7 dagen een moderne site die vertrouwen wekt.
              </p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground transition-colors">Modern, snel en mobielvriendelijk design</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground transition-colors">Conversiegericht opgezet</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground transition-colors">Eenvoudig zelf te beheren</span>
                </li>
              </ul>

              <Link
                to="/pakketten"
                className="w-full group/btn flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all"
              >
                <span>Bekijk websitepakketten</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2 - Al een website */}
            <div className="group bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-accent/10 hover:border-accent/40 flex flex-col">
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-accent/20 group-hover:to-accent/30 transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-lg">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-foreground text-2xl font-bold mb-4 transition-colors">
                Ik heb al een website
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed transition-colors">
                Je hebt een website, maar het levert nog niet op wat je hoopt. Wij helpen met advertenties, automation en conversieoptimalisatie.
              </p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground transition-colors">Google en Meta Ads campagnes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground transition-colors">E-mail en WhatsApp automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground transition-colors">AI chatbots voor leadgeneratie</span>
                </li>
              </ul>

              <Link
                to="/marketing"
                className="w-full group/btn flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-semibold transition-all"
              >
                <span>Bekijk marketingdiensten</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-foreground text-4xl md:text-5xl font-bold mb-4 transition-colors">
              <TypewriterText text="Waarom Webiro" speed={50} delay={200} />
              <span className="text-primary">?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto transition-colors">
              Wij maken het verschil met snelheid, kwaliteit en persoonlijke aandacht.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-border"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-foreground text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-background transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-foreground text-4xl md:text-5xl font-bold mb-4 transition-colors">
              <TypewriterText text="Ons werk" speed={50} delay={200} />
              <span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto transition-colors">
              Bekijk een selectie van websites die we voor ondernemers hebben gemaakt.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollShowcase('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => scrollShowcase('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              ref={showcaseScrollRef}
              className="flex gap-6 overflow-x-hidden scroll-smooth px-16"
              onMouseEnter={() => { isPausedRef.current = true; }}
              onMouseLeave={() => { isPausedRef.current = false; }}
            >
              {[...showcaseItems, ...showcaseItems].map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-80 bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-border group"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-xs text-primary font-semibold mb-2">{item.category}</div>
                  <h3 className="text-foreground text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-foreground text-4xl md:text-5xl font-bold mb-4 transition-colors">
              <TypewriterText text="Wat klanten zeggen" speed={50} delay={200} />
              <span className="text-primary">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-3xl shadow-lg border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-webiro-yellow text-webiro-yellow" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Home;
