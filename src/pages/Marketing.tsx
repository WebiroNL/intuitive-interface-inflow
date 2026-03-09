import { useEffect } from "react";
import { Target, Mail, Bot, TrendingUp, CheckCircle, ArrowRight, Users, MessageCircle, BarChart3, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketingConfigurator } from '@/components/MarketingConfigurator';
import { CTASection } from "@/components/CTASection";
import { updatePageMeta } from '@/utils/seo';

const Marketing = () => {
  useEffect(() => {
    updatePageMeta(
      "Marketing - Groei met online marketing",
      "Versterk je online aanwezigheid met onze marketing diensten. Van Google Ads tot social media campagnes en marketing automation."
    );
  }, []);

  const services = [
    {
      icon: Target,
      title: 'Advertenties',
      items: ['Google Ads', 'Meta (Instagram & Facebook)', 'TikTok Ads', 'Snapchat Ads'],
    },
    {
      icon: Mail,
      title: 'Marketing Automation',
      items: ['E-mail flows & sequences', 'Abandoned cart recovery', 'Lead nurturing funnels', 'WhatsApp automation'],
    },
    {
      icon: Bot,
      title: 'AI & Support',
      items: ['Customer support AI chatbot', 'Lead kwalificatie bot', 'FAQ automation', '24/7 WhatsApp support bot'],
    },
  ];

  const results = [
    { stat: '+240%', label: 'ROAS binnen 2 maanden', icon: TrendingUp },
    { stat: '+1.200', label: 'gekwalificeerde leads per maand', icon: Users },
    { stat: '1.8x → 4.2x', label: 'ROI verbetering', icon: BarChart3 },
  ];

  const benefits = [
    'Volledige strategie & opzet',
    'Wekelijkse campagne optimalisatie',
    'Maandelijkse rapportage & analytics',
    'Direct contact met je marketeer',
    'A/B testing & conversion tracking',
  ];

  return (
    <main className="bg-background">
      {/* ══════ HERO ══════ */}
      <section className="border-b border-border bg-background pt-[100px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
              Marketing Services
            </p>
            <h1
              className="font-bold tracking-[-0.03em] leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.4rem, 4.8vw, 4rem)" }}
            >
              <span className="text-foreground">Meer klanten uit je</span>
              <br />
              <span className="text-primary/70">bestaande website.</span>
            </h1>
            <p className="text-[16px] text-muted-foreground leading-relaxed mb-8 max-w-[520px]">
              Wij draaien je ads, funnels en marketing automation. Jij focust op je bedrijf.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
              >
                Plan een strategiecall <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#configurator"
                className="inline-flex items-center gap-2 px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
              >
                Bekijk pakketten
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ VOOR WIE ══════ */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">Voor wie is dit?</span>{" "}
              <span className="text-muted-foreground font-bold">Ondernemers die al een solide basis hebben en nu willen schalen.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, text: 'Bedrijven met al een goede website die meer conversie willen' },
              { icon: Target, text: 'Ondernemers die weinig resultaat uit hun huidige ads halen' },
              { icon: Bot, text: 'Merken die marketing automation en AI-support willen toevoegen' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[14px] text-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ DIENSTEN ══════ */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">Marketingdiensten.</span>{" "}
              <span className="text-muted-foreground font-bold">Van advertenties tot AI-gedreven automation.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-8 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[18px] font-bold text-foreground mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Configurator */}
          <div id="configurator">
            <MarketingConfigurator />
          </div>
        </div>
      </section>

      {/* ══════ INTRODUCTIE AANBIEDING ══════ */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid md:grid-cols-[1fr_1fr] gap-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">⚡ Introductie Aanbieding</p>
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.08] mb-6"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.6rem)" }}
              >
                <span className="text-foreground">€500/maand per platform.</span>
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 max-w-[480px]">
                Ex. BTW, exclusief advertentiebudget. Geen verborgen kosten.
              </p>

              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <h4 className="text-[13px] font-bold text-foreground mb-4">📅 Contractkortingen:</h4>
                <div className="space-y-3 text-[13px]">
                  <div>
                    <span className="font-semibold text-primary">12 maanden:</span>{" "}
                    <span className="text-muted-foreground">1 maand gratis + 2 maanden €250/mnd, daarna €500/mnd</span>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">24 maanden:</span>{" "}
                    <span className="text-muted-foreground">2 maanden gratis + 3 maanden €250/mnd, daarna €500/mnd</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-foreground mb-4">Wat is inbegrepen:</h4>
              <ul className="space-y-3 mb-8">
                {benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[14px] text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Send, label: "Snel live", desc: "Binnen 7 werkdagen" },
                  { icon: BarChart3, label: "Volledig inzicht", desc: "Real-time dashboards" },
                  { icon: MessageCircle, label: "Direct contact", desc: "Via WhatsApp" },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card p-4 text-center">
                    <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-[12px] font-bold text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ RESULTATEN ══════ */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-3xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">Resultaten waar we trots op zijn.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 divide-x divide-border">
            {results.map((result, idx) => (
              <div key={idx} className="px-8 py-4 first:pl-0">
                <p
                  className="font-bold text-primary mb-2"
                  style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)" }}
                >
                  {result.stat}
                </p>
                <p className="text-[14px] text-muted-foreground">{result.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Marketing;
