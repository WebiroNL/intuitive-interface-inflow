import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, RocketIcon, MessageMultiple01Icon } from '@hugeicons/core-free-icons';
import { WireframeTerrain } from '@/components/WireframeTerrain';

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

const featureCards = [
  {
    icon: <HugeiconsIcon icon={RocketIcon} size={18} className="text-primary" />,
    heading: 'Start vandaag nog',
    body: 'Plan een gratis intake en we bouwen jouw website binnen 2 weken.',
    linkLabel: 'Intake plannen',
    linkTo: '/intake',
  },
  {
    icon: <HugeiconsIcon icon={MessageMultiple01Icon} size={18} className="text-primary" />,
    heading: 'Liever eerst praten?',
    body: 'Stel al je vragen via WhatsApp of e-mail — we reageren snel.',
    linkLabel: 'Neem contact op',
    linkTo: '/contact',
  },
];

export function CTASection({
  title = "Klaar voor jouw nieuwe website?",
  description = "Neem contact op en we helpen je graag verder.",
  subtitle,
  buttonText = "Plan gratis intake",
  buttonLink = "/intake",
  primaryButtonText,
  primaryButtonLink,
}: CTASectionProps) {
  const displayDescription = subtitle || description;
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  return (
    <section className="relative bg-background border-t border-border overflow-hidden">

      {/* Aurora stripe animated background */}
      <WireframeTerrain />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: heading + buttons */}
          <div>
            {/* Frosted glass text effect */}
            <h2 className="aurora-text text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6" data-text={title}>
              {title}
            </h2>
            <div className="liquid-glass rounded-xl px-6 py-5 inline-block max-w-sm">
              <p className="text-foreground/80 text-base lg:text-lg leading-relaxed mb-5">
                {displayDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={displayButtonLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-all text-sm"
                >
                  {displayButtonText}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-foreground rounded-md font-semibold hover:bg-white/10 transition-all text-sm backdrop-blur-sm"
                >
                  Contact opnemen
                </Link>
              </div>
            </div>
          </div>

          {/* Right: two feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {featureCards.map((card) => (
              <div key={card.heading} className="bg-background/80 backdrop-blur-sm p-7 flex flex-col gap-4">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center bg-background">
                  {card.icon}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm mb-1.5">{card.heading}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
                </div>
                <Link
                  to={card.linkTo}
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline mt-auto"
                >
                  {card.linkLabel} <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default CTASection;
