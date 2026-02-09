import { useEffect, useState } from "react";
import { TypewriterText } from '@/components/TypewriterText';
import { AnimatedWLogo } from '@/components/AnimatedWLogo';
import { CTASection } from '@/components/CTASection';
import { Handshake, MessageCircle, Palette, Rocket, CheckCircle } from 'lucide-react';
import { updatePageMeta } from '@/utils/seo';
import { getTimelineAnimation } from '@/components/TimelineIcon';
import { motion } from 'framer-motion';

const Proces = () => {
  const [selectedPackage, setSelectedPackage] = useState<'start' | 'groei' | 'pro'>('start');

  useEffect(() => {
    updatePageMeta(
      'Proces - Hoe wij werken in 4 stappen',
      'Ontdek hoe wij binnen 7 dagen jouw professionele website realiseren. Van intake tot oplevering in 4 duidelijke stappen.'
    );
  }, []);

  const steps = [
    {
      number: '01',
      icon: <Handshake className="w-10 h-10" />,
      title: 'Kennismaking',
      description: 'We plannen een gratis intake gesprek waarin we jouw wensen, doelen en budget bespreken. Geen verplichtingen, gewoon kennismaken.',
      features: [
        'Gratis intake gesprek',
        'Bespreking van wensen en doelgroep',
        'Advies over het juiste pakket',
        'Vrijblijvend offerte',
      ],
    },
    {
      number: '02',
      icon: <Palette className="w-10 h-10" />,
      title: 'Designfase',
      description: 'Na akkoord gaan we aan de slag met het design. Je ontvangt een eerste opzet en we verfijnen totdat je volledig tevreden bent.',
      features: [
        'Eerste designvoorstel binnen 3 dagen',
        'Maximaal 2 revisierondes',
        'Eigen foto\'s en logo integreren',
        'Feedback via persoonlijk contact',
      ],
    },
    {
      number: '03',
      icon: <Rocket className="w-10 h-10" />,
      title: 'Oplevering',
      description: 'Je website wordt gebouwd, getest en online gezet. Je ontvangt een volledige uitleg over het beheer en gebruik van je nieuwe site.',
      features: [
        'Testen op alle apparaten',
        'SEO optimalisatie',
        'Domein & hosting hulp',
        'Instructie voor CMS (indien van toepassing)',
      ],
    },
    {
      number: '04',
      icon: <MessageCircle className="w-10 h-10" />,
      title: 'Support & onderhoud',
      description: 'Ook na de lancering blijven we beschikbaar. Bij elk pakket zit support inbegrepen en we bieden optionele onderhoudspakketten.',
      features: [
        'Support periode afhankelijk van pakket',
        'Hulp bij vragen en kleine aanpassingen',
        'Optionele Webiro Care voor doorlopend beheer',
        'Snelle reactietijd via e-mail of WhatsApp',
      ],
    },
  ];

  const timelines = {
    start: {
      name: 'Webiro Start',
      subtitle: 'One-pager - Binnen 1 week online',
      duration: '7 dagen',
      steps: [
        { day: 'Dag 1', title: 'Intake & offerte', description: 'Plan een gratis intake gesprek en ontvang een vrijblijvend offerte.' },
        { day: 'Dag 2-4', title: 'Design & revisies', description: 'Ontvang een eerste designvoorstel en maak 1 revisieronde indien nodig.' },
        { day: 'Dag 5-6', title: 'Bouw & testen', description: 'Je one-pager wordt gebouwd en getest op alle apparaten.' },
        { day: 'Dag 7', title: 'Lancering! 🚀', description: 'Je nieuwe website is online en klaar voor gebruik.' },
      ],
    },
    groei: {
      name: 'Webiro Groei',
      subtitle: 'Tot 5 pagina\'s - Binnen 2 weken online',
      duration: '14 dagen',
      steps: [
        { day: 'Dag 1-2', title: 'Intake & planning', description: 'Gratis intake gesprek, offertebespreking en planning van pagina\'s.' },
        { day: 'Dag 3-7', title: 'Design & 2 revisies', description: 'Ontwerp voor alle pagina\'s en uitgebreide revisiemogelijkheden.' },
        { day: 'Dag 8-12', title: 'Bouw & content', description: 'Alle pagina\'s worden gebouwd, content geoptimaliseerd voor SEO.' },
        { day: 'Dag 13-14', title: 'Testen & lancering', description: 'Uitgebreid testen en je website gaat live met 10 zoekwoorden geoptimaliseerd.' },
      ],
    },
    pro: {
      name: 'Webiro Pro',
      subtitle: 'Tot 10 pagina\'s - Binnen 3 weken online',
      duration: '21 dagen',
      steps: [
        { day: 'Dag 1-3', title: 'Intake & strategie', description: 'Uitgebreid intakegesprek, strategiebespreking en gedetailleerde planning.' },
        { day: 'Dag 4-10', title: 'Design & 3 revisies', description: 'Compleet design voor alle pagina\'s met 3 volledige revisierondes.' },
        { day: 'Dag 11-17', title: 'Bouw & SEO optimalisatie', description: 'Volledige website bouw met pro SEO: 15+ zoekwoorden, schema markup en meer.' },
        { day: 'Dag 18-21', title: 'Testen, training & lancering', description: 'Uitgebreid testen, CMS training en je website gaat live met maandrapportage setup.' },
      ],
    },
  };

  const faqs = [
    { question: 'Wat heb ik nodig om te starten?', answer: 'Je hebt alleen je bedrijfsgegevens, logo (indien aanwezig) en eventuele foto\'s nodig. Wij helpen je met de rest, inclusief teksten en domeinnaam.' },
    { question: 'Kan ik later zelf aanpassingen maken?', answer: 'Ja! Alle pakketten (Start, Groei en Pro) komen standaard met een gebruiksvriendelijk CMS waarmee je zelf content, teksten en afbeeldingen kunt aanpassen.' },
    { question: 'Wat als ik niet tevreden ben?', answer: 'We werken met revisierondes tijdens het designproces. Je krijgt controle bij elke stap, zodat het eindresultaat precies is wat je wilt.' },
    { question: 'Hoe zit het met hosting en domein?', answer: 'Wij kunnen de volledige hosting en domeinnaam voor je verzorgen! Dit zit standaard inbegrepen in alle CMS pakketten.' },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[30vh] flex items-center py-8 bg-gradient-to-b from-secondary via-background to-background overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-24 left-20 w-32 h-24 opacity-[0.15]">
            <AnimatedWLogo duration="13s" delay="0s" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none z-20" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-foreground mb-6 text-5xl md:text-6xl font-bold">
              <TypewriterText text="Hoe wij werken" speed={80} delay={100} />
              <span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
              Van eerste contact tot lancering in 4 duidelijke stappen. Transparant, efficiënt en zonder gedoe.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl" />
                    <div className="relative bg-gradient-to-br from-primary to-accent w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl">
                      {step.icon}
                    </div>
                  </div>
                  <div className="text-primary text-6xl font-bold text-center mt-4 opacity-20">{step.number}</div>
                </div>

                <div className="flex-1 bg-card p-8 rounded-3xl shadow-lg border border-border">
                  <h3 className="text-foreground text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Visualization */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-foreground text-center mb-4 text-4xl md:text-5xl font-bold">
            <TypewriterText text="Van start tot lancering" speed={50} delay={200} />
            <span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
            Kies een pakket om de specifieke tijdlijn te bekijken.
          </p>

          {/* Package Selector */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPackage('start')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                selectedPackage === 'start'
                  ? 'bg-gradient-to-br from-primary to-accent text-white shadow-xl scale-105'
                  : 'bg-card text-foreground hover:shadow-lg border-2 border-primary/30'
              }`}
            >
              <div className="text-lg">Webiro Start</div>
              <div className={`text-xs mt-1 ${selectedPackage === 'start' ? 'text-white/80' : 'text-muted-foreground'}`}>One-pager • 1 week</div>
            </button>
            
            <button
              onClick={() => setSelectedPackage('groei')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all relative ${
                selectedPackage === 'groei'
                  ? 'bg-gradient-to-br from-primary to-accent text-white shadow-xl scale-105'
                  : 'bg-card text-foreground hover:shadow-lg border-2 border-primary/30'
              }`}
            >
              <div className="absolute -top-2 -right-2 bg-webiro-yellow text-foreground px-2 py-0.5 rounded-full text-xs font-bold">Populair</div>
              <div className="text-lg">Webiro Groei</div>
              <div className={`text-xs mt-1 ${selectedPackage === 'groei' ? 'text-white/80' : 'text-muted-foreground'}`}>Tot 5 pagina's • 2 weken</div>
            </button>
            
            <button
              onClick={() => setSelectedPackage('pro')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                selectedPackage === 'pro'
                  ? 'bg-gradient-to-br from-primary to-accent text-white shadow-xl scale-105'
                  : 'bg-card text-foreground hover:shadow-lg border-2 border-primary/30'
              }`}
            >
              <div className="text-lg">Webiro Pro</div>
              <div className={`text-xs mt-1 ${selectedPackage === 'pro' ? 'text-white/80' : 'text-muted-foreground'}`}>Tot 10 pagina's • 3 weken</div>
            </button>
          </div>

          {/* Timeline Info */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-3xl p-6 mb-12 border-2 border-primary/30">
            <div className="text-center">
              <h3 className="text-primary font-bold text-2xl mb-2">{timelines[selectedPackage].name}</h3>
              <p className="text-muted-foreground text-lg mb-3">{timelines[selectedPackage].subtitle}</p>
              <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-foreground font-semibold">Totale doorlooptijd: {timelines[selectedPackage].duration}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block" />
            
            <div className="space-y-12">
              {timelines[selectedPackage].steps.map((step, index) => {
                const icons = [Handshake, Palette, Rocket, MessageCircle];
                const StepIcon = icons[index] || Rocket;
                
                return (
                  <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-card p-6 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-border">
                        <div className={`text-primary font-bold mb-2 ${index % 2 === 0 ? 'md:ml-auto md:text-right' : ''}`}>{step.day}</div>
                        <h4 className="text-foreground font-bold mb-2">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>

                    <motion.div 
                      {...getTimelineAnimation(index)}
                      className="hidden md:flex flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-background shadow-lg z-10 items-center justify-center text-white"
                    >
                      <StepIcon className="w-8 h-8" />
                    </motion.div>

                    <div className="flex-1 hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-foreground text-center mb-12 text-4xl md:text-5xl font-bold">
            <TypewriterText text="Veelgestelde vragen" speed={50} delay={200} />
            <span className="text-primary">.</span>
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl shadow-md border border-border">
                <h3 className="text-foreground text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Proces;
