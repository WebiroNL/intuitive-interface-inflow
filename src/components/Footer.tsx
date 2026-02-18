import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram, Linkedin, MessageCircle, ArrowUpRight } from 'lucide-react';
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

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Pakketten', to: '/pakketten' },
    { label: 'Proces', to: '/proces' },
    { label: 'Marketing', to: '/marketing' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <footer style={{ backgroundColor: 'hsl(270 6% 7%)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand — 4 cols */}
          <div className="md:col-span-4">
            <div className="w-28 h-7 mb-5 [--fill-0:#3A4DEA] [--fill-1:white]">
              <LogoWebiro />
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-7 max-w-[260px]">
              Moderne websites voor ondernemers die geen tijd of zin hebben om alles zelf te bouwen.
            </p>
            <div className="flex gap-2">
              {[
                { href: 'https://www.facebook.com/webironl', icon: <Facebook size={15} />, label: 'Facebook' },
                { href: 'https://www.instagram.com/webiro.nl', icon: <Instagram size={15} />, label: 'Instagram' },
                { href: 'https://www.linkedin.com/company/webironl', icon: <Linkedin size={15} />, label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  style={{ backgroundColor: 'hsl(270 5% 12%)' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav — 2 cols */}
          <div className="md:col-span-2">
            <p className="text-white/30 text-xs font-medium mb-5 tracking-wide">Navigatie</p>
            <div className="flex flex-col gap-3">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-white/55 hover:text-white transition-colors text-sm"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — 3 cols */}
          <div className="md:col-span-3">
            <p className="text-white/30 text-xs font-medium mb-5 tracking-wide">Contact</p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:info@webiro.nl"
                className="flex items-center gap-3 text-white/55 hover:text-white transition-colors group text-sm py-2"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Mail size={14} className="text-primary" />
                </div>
                info@webiro.nl
              </a>
              <a
                href="https://wa.me/31855055054"
                className="flex items-center gap-3 text-white/55 hover:text-white transition-colors group text-sm py-2"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'hsl(142 69% 40% / 0.2)' }}>
                  <MessageCircle size={14} style={{ color: 'hsl(142 69% 50%)' }} />
                </div>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Newsletter — 3 cols */}
          <div className="md:col-span-3">
            <p className="text-white/30 text-xs font-medium mb-5 tracking-wide">Nieuwsbrief</p>
            <p className="text-white/45 text-sm leading-relaxed mb-4">
              Tips & updates over websites en online marketing.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@email.nl"
                className="w-full text-white text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-white/25 border border-white/10 focus:border-primary/50 transition-colors"
                style={{ backgroundColor: 'hsl(270 5% 12%)' }}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20"
              >
                {isSubmitting ? 'Bezig...' : 'Inschrijven'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderColor: 'hsl(270 5% 14%)' }}>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Webiro. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-5">
            <Link to="/algemene-voorwaarden" className="text-white/30 hover:text-white/60 transition-colors text-xs">
              Algemene Voorwaarden
            </Link>
            <Link to="/privacy-policy" className="text-white/30 hover:text-white/60 transition-colors text-xs">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
