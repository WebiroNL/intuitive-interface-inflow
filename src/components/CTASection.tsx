import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'default' | 'gradient' | 'dark';
}

export function CTASection({
  title = "Start vandaag nog met jouw nieuwe website",
  subtitle = "Plan een gratis intake gesprek en ontdek wat Webiro voor jou kan betekenen.",
  primaryButtonText = "Plan een gesprek",
  primaryButtonLink = "/intake",
  secondaryButtonText = "Bekijk pakketten",
  secondaryButtonLink = "/pakketten",
  variant = 'gradient',
}: CTASectionProps) {
  const bgClasses = {
    default: 'bg-secondary',
    gradient: 'bg-gradient-to-br from-primary via-[hsl(250,80%,58%)] to-accent',
    dark: 'bg-foreground',
  };

  const textClasses = {
    default: 'text-foreground',
    gradient: 'text-white',
    dark: 'text-background',
  };

  return (
    <section className={`py-20 md:py-28 ${bgClasses[variant]}`}>
      <div className="container-webiro">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${textClasses[variant]}`}>
            {title}
          </h2>
          <p className={`text-lg md:text-xl mb-10 ${variant === 'default' ? 'text-muted-foreground' : 'text-white/80'}`}>
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant={variant === 'gradient' ? 'secondary' : 'default'}
              className="group text-base px-8"
              asChild
            >
              <Link to={primaryButtonLink}>
                <Calendar className="mr-2 h-5 w-5" />
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant={variant === 'gradient' ? 'outline' : 'outline'}
              className={`text-base px-8 ${variant === 'gradient' ? 'border-white/30 text-white hover:bg-white/10' : ''}`}
              asChild
            >
              <Link to={secondaryButtonLink}>
                {secondaryButtonText}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
