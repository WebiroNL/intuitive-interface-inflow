import { useEffect } from "react";
import { Target, Mail, Bot, TrendingUp, CheckCircle2, Zap, ArrowRight, Users, MessageCircle, BarChart3, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MarketingConfigurator } from '@/components/MarketingConfigurator';
import { updatePageMeta } from '@/utils/seo';

const Marketing = () => {
  useEffect(() => {
    updatePageMeta(
      "Marketing - Groei met online marketing",
      "Versterk je online aanwezigheid met onze marketing diensten. Van Google Ads tot social media campagnes en marketing automation."
    );
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const services = [
    {
      icon: Target,
      title: 'Advertenties',
      color: 'hsl(var(--primary))',
      bgColor: 'hsl(var(--primary) / 0.1)',
      items: [
        'Google Ads',
        'Meta (Instagram & Facebook)',
        'TikTok Ads',
        'Snapchat Ads'
      ]
    },
    {
      icon: Mail,
      title: 'Marketing Automation',
      color: 'hsl(var(--accent))',
      bgColor: 'hsl(var(--accent) / 0.1)',
      items: [
        'E-mail flows & sequences',
        'Abandoned cart recovery',
        'Lead nurturing funnels',
        'WhatsApp automation'
      ]
    },
    {
      icon: Bot,
      title: 'AI & Support',
      color: 'hsl(var(--webiro-yellow))',
      bgColor: 'hsl(var(--webiro-yellow) / 0.1)',
      items: [
        'Customer support AI chatbot',
        'Lead kwalificatie bot',
        'FAQ automation',
        '24/7 WhatsApp support bot'
      ]
    }
  ];

  const results = [
    { stat: '+240%', label: 'ROAS binnen 2 maanden', icon: TrendingUp },
    { stat: '+1.200', label: 'gekwalificeerde leads per maand', icon: Users },
    { stat: '1.8x → 4.2x', label: 'ROI verbetering', icon: BarChart3 }
  ];

  const benefits = [
    'Volledige strategie & opzet',
    'Wekelijkse campagne optimalisatie',
    'Maandelijkse rapportage & analytics',
    'Direct contact met je marketeer',
    'A/B testing & conversion tracking'
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary via-[hsl(250,80%,58%)] to-accent text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-webiro-yellow rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
              🚀 Marketing Services
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Meer klanten uit je<br />bestaande website
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Wij draaien je ads, funnels en marketing automation.<br />Jij focust op je bedrijf.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-webiro-yellow hover:text-foreground transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Plan een strategiecall
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="#pakketten"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Bekijk marketingpakketten
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VOOR WIE IS DIT? */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Voor wie is dit?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Onze marketingdiensten zijn perfect voor ondernemers die al een solide basis hebben en nu willen schalen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                text: 'Bedrijven met al een goede website die meer conversie willen'
              },
              {
                icon: Target,
                text: 'Ondernemers die weinig resultaat uit hun huidige ads halen'
              },
              {
                icon: Sparkles,
                text: 'Merken die marketing automation en AI-support willen toevoegen'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex items-start gap-4 p-6 bg-background rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETINGDIENSTEN */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Marketingdiensten
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Van advertenties tot AI-gedreven automation – wij zorgen dat je marketing écht werkt.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-border"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: service.bgColor }}
                >
                  <service.icon className="w-8 h-8" style={{ color: service.color }} />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {service.title}
                </h3>
                
                <ul className="space-y-3">
                  {service.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Marketing Configurator */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
          >            
            <MarketingConfigurator />
          </motion.div>
        </div>
      </section>

      {/* PRIJSSECTIE */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Transparante prijzen
            </h2>
            <p className="text-lg text-muted-foreground">
              Geen verborgen kosten. Gewoon eerlijke marketing met resultaat.
            </p>
          </motion.div>

          {/* Main Pricing Box */}
          <motion.div
            id="pakketten"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="inline-block px-4 py-2 bg-webiro-yellow text-foreground rounded-full text-sm font-bold mb-6">
                ⚡ INTRODUCTIE AANBIEDING
              </div>
              
              <div className="mb-8">
                <div className="text-lg mb-2 opacity-90">Per platform</div>
                <div className="flex flex-wrap items-baseline gap-4 mb-2">
                  <div>
                    <span className="text-5xl md:text-6xl font-bold">€500</span>
                    <span className="text-2xl opacity-90"> /maand</span>
                  </div>
                </div>
                <div className="text-sm opacity-75 mb-4">
                  (ex. BTW, exclusief advertentiebudget)
                </div>
                
                {/* Contract Kortingen */}
                <div className="space-y-3 bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="text-base font-semibold">📅 Contractkortingen:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-webiro-yellow">12 maanden:</span>
                      <span>1 maand gratis + 2 maanden €250/mnd, daarna €500/mnd</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-webiro-yellow">24 maanden:</span>
                      <span>2 maanden gratis + 3 maanden €250/mnd, daarna €500/mnd</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-8 mb-8">
                <h4 className="text-xl font-bold mb-6">Wat is inbegrepen:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm opacity-75 border-t border-white/20 pt-6">
                <span className="font-semibold">Disclaimer:</span> Exclusief ad spend. Geen verborgen kosten.
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-background p-6 rounded-2xl text-center border border-border">
              <Zap className="w-8 h-8 text-webiro-yellow mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">
                Snel live
              </h4>
              <p className="text-sm text-muted-foreground">
                Eerste campagne binnen 7 werkdagen online
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-2xl text-center border border-border">
              <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">
                Volledige inzicht
              </h4>
              <p className="text-sm text-muted-foreground">
                Real-time dashboards en maandrapportages
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-2xl text-center border border-border">
              <MessageCircle className="w-8 h-8 text-accent mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">
                Direct contact
              </h4>
              <p className="text-sm text-muted-foreground">
                Persoonlijke marketeer via WhatsApp
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Resultaten waar we trots op zijn
            </h2>
            <p className="text-lg text-muted-foreground">
              Echte cijfers van echte klanten
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-border"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <result.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-3">
                  {result.stat}
                </div>
                <p className="text-muted-foreground">
                  {result.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-webiro-yellow rounded-full blur-3xl" />
        </div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Klaar om te groeien?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
            Plan een gratis strategiecall en ontdek wat advertenties en automation voor jouw bedrijf kunnen doen.
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary rounded-xl font-bold text-lg hover:bg-webiro-yellow hover:text-foreground transition-all shadow-2xl hover:scale-105"
          >
            <Send className="w-6 h-6" />
            Plan gratis intake
          </Link>
          
          <p className="mt-8 text-sm text-white/70">
            Geen verplichtingen • Reactie binnen 24 uur
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default Marketing;
