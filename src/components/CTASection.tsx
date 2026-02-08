import { TypewriterText } from './TypewriterText';
import svgPaths from '../imports/svg-ykyby293jl';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  // Use subtitle or description
  const displayDescription = subtitle || description;
  // Use primaryButtonText/Link or buttonText/Link
  const displayButtonText = primaryButtonText || buttonText;
  const displayButtonLink = primaryButtonLink || buttonLink;

  // Auto-animate when not hovering
  useEffect(() => {
    if (!isHovering) {
      const animate = () => {
        setOffset((prev) => (prev + 1.5) % 1000);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isHovering]);

  // Mouse control when hovering
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const totalWidth = rect.width;
    const progress = (x / totalWidth) * 1000;
    setOffset(progress);
  };

  return (
    <section className="relative py-20 flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-full max-w-5xl mx-auto px-4"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <svg 
          className="block w-full h-auto" 
          viewBox="0 0 251 192" 
          fill="none" 
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            filter: 'drop-shadow(0 10px 40px rgba(58, 77, 234, 0.2))',
            pointerEvents: 'none',
            overflow: 'visible'
          }}
        >
          {/* Base W with subtle fill */}
          <path 
            d={svgPaths.p22d35f00} 
            fill="rgba(255, 255, 255, 0.05)"
            stroke="none"
          />
          
          {/* Static base stroke - light purple, always visible */}
          <path 
            d={svgPaths.p22d35f00} 
            fill="none"
            stroke="#B8BFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Glow layer behind for smooth effect */}
          <path 
            d={svgPaths.p22d35f00} 
            fill="none"
            stroke="#3A4DEA"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1000}
            strokeDasharray="120 880"
            strokeDashoffset={-offset}
            opacity="0.3"
            style={{
              transition: 'none',
              filter: 'blur(8px)'
            }}
          />
          
          {/* Main animated purple stroke highlight */}
          <path 
            d={svgPaths.p22d35f00} 
            fill="none"
            stroke="#3A4DEA"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1000}
            strokeDasharray="120 880"
            strokeDashoffset={-offset}
            style={{
              transition: 'none',
              filter: 'drop-shadow(0 0 12px rgba(58, 77, 234, 0.6))'
            }}
          />
        </svg>
        
        {/* Content positioned over the W */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 py-8 sm:py-12"
        >
          <h2 className="text-[#3A4DEA] mb-3 sm:mb-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg max-w-[280px] sm:max-w-md md:max-w-2xl pointer-events-none">
            <TypewriterText text={title} speed={60} delay={delay} />
          </h2>
          <p className="text-[#3A4DEA]/80 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base lg:text-lg max-w-[240px] sm:max-w-sm md:max-w-xl mx-auto drop-shadow-md pointer-events-none">
            {displayDescription}
          </p>
          <Link
            to={displayButtonLink}
            className="inline-block px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-[#3A4DEA] text-white rounded-full hover:bg-[#FFD75C] hover:text-[#110E13] transition-all hover:shadow-xl font-bold text-xs sm:text-sm md:text-base relative z-10"
            onMouseEnter={() => setIsHovering(true)}
          >
            {displayButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
