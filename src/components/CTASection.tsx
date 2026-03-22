import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { SunburstBackground } from '@/components/SunburstBackground';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'default' | 'gradient' | 'dark';
  delay?: number;
}

const services = [
  {
    label: 'Websites & Apps',
    description: 'Custom webdesign, development en hosting. Live binnen 7 dagen.',
    link: '/pakketten',
    linkLabel: 'Meer info',
  },
  {
    label: 'Marketing & Ads',
    description: 'Google & Meta Ads, e-mail automation en leadgeneratie.',
    link: '/pakketten',
    linkLabel: 'Meer info',
  },
  {
    label: 'AI & Automations',
    description: 'Chatbots, workflows en slimme integraties die tijd besparen.',
    link: '/contact',
    linkLabel: 'Meer info',
  },
];

export function CTASection({
  title = "Laten we samen groeien",
  description = "Of je nu een website, marketingstrategie of slimme automations nodig hebt, wij helpen je verder.",
}: CTASectionProps) {

  return (
    <section className="relative bg-background border-t border-border overflow-hidden">
      <SunburstBackground />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <h2
            className="font-bold tracking-tight text-foreground leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
          >
            {title}<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Service cards — liquid glass */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {services.map((s) => (
            <div key={s.label} className="liquid-glass rounded-xl p-7 flex flex-col gap-3">
              <p className="text-foreground font-semibold text-sm relative z-10">{s.label}</p>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 relative z-10">{s.description}</p>
              <Link
                to={s.link}
                className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-auto relative z-10"
              >
                {s.linkLabel} <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
              </Link>
            </div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/intake">
            <LiquidButton size="lg" className="text-sm font-semibold">
              Plan een gratis intake
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
            </LiquidButton>
          </Link>
          <Link to="/contact">
            <LiquidButton variant="outline" size="lg" className="text-sm font-semibold">
              Contact opnemen
            </LiquidButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
