import { Link } from 'react-router-dom';
import svgPaths from '../imports/svg-ykyby293jl';
import { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

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

export function CTASection({
  title = "Klaar voor jouw nieuwe website?",
  description = "Neem contact op en we helpen je graag verder.",
  subtitle,
  buttonText = "Plan gratis intake",
  buttonLink = "/intake",
  primaryButtonText,
  primaryButtonLink,
  delay = 300
}: CTASectionProps) {
  const [offset, setOffset] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const displayDescription = subtitle || description;
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  useEffect(() => {
    if (!isHovering) {
      const animate = () => {
        setOffset((prev) => (prev + 1.2) % 1000);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isHovering]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = (x / rect.width) * 1000;
    setOffset(progress);
  };

  return (
    <section className="relative bg-background border-t border-border overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, hsl(234 82% 57% / 0.06) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Two-column Stripe-style header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-16">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              {title.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="text-primary">{title.split(' ').slice(-2).join(' ')}</span>
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {displayDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={displayButtonLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 text-sm"
              >
                {displayButtonText}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full font-semibold hover:bg-muted transition-all text-sm"
              >
                Contact opnemen
              </Link>
            </div>
          </div>
        </div>

        {/* Animated W SVG — full width, decorative */}
        <div
          ref={containerRef}
          className="relative w-full"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <svg
            className="block w-full h-auto"
            viewBox="0 0 251 192"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            style={{ pointerEvents: 'none', overflow: 'visible', maxHeight: '220px' }}
          >
            {/* Base fill */}
            <path
              d={svgPaths.p22d35f00}
              fill="hsl(234 82% 57% / 0.03)"
              stroke="none"
            />
            {/* Static light stroke */}
            <path
              d={svgPaths.p22d35f00}
              fill="none"
              stroke="hsl(234 82% 57% / 0.18)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glow layer */}
            <path
              d={svgPaths.p22d35f00}
              fill="none"
              stroke="hsl(234 82% 57%)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1000}
              strokeDasharray="140 860"
              strokeDashoffset={-offset}
              opacity="0.25"
              style={{ transition: 'none', filter: 'blur(8px)' }}
            />
            {/* Main animated stroke */}
            <path
              d={svgPaths.p22d35f00}
              fill="none"
              stroke="hsl(234 82% 57%)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1000}
              strokeDasharray="140 860"
              strokeDashoffset={-offset}
              style={{
                transition: 'none',
                filter: 'drop-shadow(0 0 10px hsl(234 82% 57% / 0.7))'
              }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
