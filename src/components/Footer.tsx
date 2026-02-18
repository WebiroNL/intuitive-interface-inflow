import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram, Linkedin, MessageCircle, Send } from 'lucide-react';
import LogoWebiro from '@/imports/LogoWebiro1';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Voer een geldig e-mailadres in');
      return;
    }
    setIsSubmitting(true);
    try {
      toast.success('🎉 Bedankt voor je inschrijving!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Kon niet verbinden met de server. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="w-32 h-8 mb-5 [--fill-0:#3A4DEA] [--fill-1:white]">
              <LogoWebiro />
            </div>
            <p className="text-background/50 text-sm leading-relaxed mb-6">
              Moderne websites voor ondernemers die geen tijd of zin hebben om alles zelf te bouwen.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/webironl"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-xl bg-background/10 hover:bg-[#1877F2]/20 flex items-center justify-center border border-background/10 hover:border-[#1877F2]/40 transition-all"
                aria-label="Facebook"
              >
                <Facebook size={17} className="text-background/50 group-hover:text-[#1877F2] transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/webiro.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-xl bg-background/10 hover:bg-[#E4405F]/20 flex items-center justify-center border border-background/10 hover:border-[#E4405F]/40 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={17} className="text-background/50 group-hover:text-[#E4405F] transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/webironl"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-xl bg-background/10 hover:bg-[#0A66C2]/20 flex items-center justify-center border border-background/10 hover:border-[#0A66C2]/40 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} className="text-background/50 group-hover:text-[#0A66C2] transition-colors" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-5 uppercase tracking-wider">Menu</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Pakketten', to: '/pakketten' },
                { label: 'Proces', to: '/proces' },
                { label: 'Contact', to: '/contact' },
                { label: 'Blog & Nieuws', to: '/blog' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-background/50 hover:text-background transition-colors text-sm"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-5 uppercase tracking-wider">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@webiro.nl"
                className="group flex items-center gap-3 text-background/50 hover:text-background transition-colors bg-background/5 hover:bg-background/10 px-4 py-3 rounded-xl border border-background/10 hover:border-background/20"
              >
                <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                  <Mail size={15} className="text-primary-foreground" />
                </div>
                <span className="text-sm">info@webiro.nl</span>
              </a>
              <a
                href="https://wa.me/31855055054"
                className="group flex items-center gap-3 text-background/50 hover:text-background transition-colors bg-background/5 hover:bg-background/10 px-4 py-3 rounded-xl border border-background/10 hover:border-background/20"
              >
                <div className="bg-[#25D366] p-2 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle size={15} className="text-white" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-5 uppercase tracking-wider">Blijf op de hoogte</h4>
            <div className="bg-background/5 p-5 rounded-2xl border border-background/10">
              <p className="text-background/50 text-sm mb-4 leading-relaxed">
                Ontvang tips en updates over websites & online marketing
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.nl"
                  className="w-full bg-background/10 text-background text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-background/30 border border-background/10 focus:border-primary/50 transition-colors"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-4 py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  {isSubmitting ? 'Bezig...' : (
                    <>
                      <Send size={15} />
                      <span>Inschrijven</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/40 text-sm">
              © {new Date().getFullYear()} Webiro. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link to="/algemene-voorwaarden" className="text-background/40 hover:text-background transition-colors text-sm">
                Algemene Voorwaarden
              </Link>
              <Link to="/privacy-policy" className="text-background/40 hover:text-background transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
