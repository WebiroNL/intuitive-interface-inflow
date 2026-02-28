import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, MessageCircle } from 'lucide-react';
import { useRef } from 'react';
import { CTATunnel } from '@/components/CTATunnel';

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
    icon: <Rocket size={18} className="text-primary" />,
    heading: 'Start vandaag nog',
    body: 'Plan een gratis intake en we bouwen jouw website binnen 2 weken.',
    linkLabel: 'Intake plannen',
    linkTo: '/intake',
  },
  {
    icon: <MessageCircle size={18} className="text-primary" />,
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
  const sectionRef = useRef<HTMLElement>(null);
  const displayDescription = subtitle || description;
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background">

      {/* Data tunnel canvas */}
      <CTATunnel />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: heading + buttons */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              {title}
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8 max-w-sm">
              {displayDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={displayButtonLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-all text-sm"
              >
                {displayButtonText}
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-md font-semibold hover:bg-muted transition-all text-sm"
              >
                Contact opnemen
              </Link>
            </div>
          </div>

          {/* Right: two feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {featureCards.map((card) => (
              <div key={card.heading} className="bg-card backdrop-blur-sm p-7 flex flex-col gap-4">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center bg-muted">
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
                  {card.linkLabel} <ArrowRight size={13} />
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
