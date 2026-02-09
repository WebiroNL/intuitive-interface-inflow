import { Calendar, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TypewriterText } from '@/components/TypewriterText';
import { useEffect } from 'react';
import { updatePageMeta } from '@/utils/seo';

const Intake = () => {
  useEffect(() => {
    updatePageMeta(
      'Plan je gratis intake - Vrijblijvend kennismaken',
      'Plan een gratis 30-minuten intake gesprek met Webiro. Vrijblijvend kennismaken en ontdekken hoe wij jouw website binnen 7 dagen online krijgen.'
    );

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Only append if not already loaded
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (!existingScript) {
      document.body.appendChild(script);
    }

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    
    const existingLink = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]');
    if (!existingLink) {
      document.head.appendChild(link);
    }

    return () => {
      // Don't remove scripts on unmount to prevent reload issues
    };
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background transition-colors duration-300">
        {/* Back Button */}
        <div className="container mx-auto px-4 max-w-7xl pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Terug naar home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative py-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-foreground mb-4 text-4xl md:text-5xl font-bold transition-colors">
                <TypewriterText text="Plan je gratis intake" speed={80} delay={100} />
                <span className="text-primary">.</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto transition-colors">
                Kies een moment dat jou uitkomt en laten we kennismaken. Vrijblijvend en zonder verplichtingen.
              </p>
            </div>

            {/* What to Expect Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
              <div className="bg-card p-6 rounded-2xl shadow-md transition-colors border border-border">
                <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-bold mb-2 transition-colors">30 minuten</h3>
                <p className="text-muted-foreground text-sm transition-colors">
                  Een kort en efficiënt gesprek waarin we al je vragen beantwoorden.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl shadow-md transition-colors border border-border">
                <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-bold mb-2 transition-colors">Vrijblijvend</h3>
                <p className="text-muted-foreground text-sm transition-colors">
                  Geen verplichtingen. We bespreken je wensen en geven advies.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl shadow-md transition-colors border border-border">
                <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-bold mb-2 transition-colors">Direct gepland</h3>
                <p className="text-muted-foreground text-sm transition-colors">
                  Kies een tijdslot en ontvang direct een bevestiging.
                </p>
              </div>
            </div>

            {/* Calendly Widget */}
            <div className="max-w-6xl mx-auto bg-card rounded-3xl shadow-xl overflow-hidden transition-colors border border-border">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/webiromeet/30min?hide_gdpr_banner=1&primary_color=3A4DEA"
                style={{ minWidth: '320px', height: '700px' }}
              ></div>
            </div>

            {/* Alternative Contact */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Liever direct contact? Mail naar{" "}
                <a href="mailto:info@webiro.nl" className="text-primary hover:underline">
                  info@webiro.nl
                </a>{" "}
                of bel{" "}
                <a href="tel:0855055054" className="text-primary hover:underline">
                  085 505 505 4
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Intake;
