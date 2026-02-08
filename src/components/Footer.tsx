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
      // TODO: Add newsletter subscription endpoint
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
    <footer className="bg-[#110E13] dark:bg-[#0a0809] text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="w-32 h-8 mb-4 [--fill-0:#3A4DEA]">
              <LogoWebiro />
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
              Moderne websites voor ondernemers die geen tijd of zin hebben om alles zelf te bouwen.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/webironl" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#1a1719] dark:bg-[#1a1517] hover:bg-[#1877F2]/20 dark:hover:bg-[#1877F2]/30 p-3 rounded-xl transition-all hover:scale-110 border border-gray-700 dark:border-gray-800"
                aria-label="Facebook"
              >
                <Facebook size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-[#1877F2] transition-colors" />
              </a>
              <a 
                href="https://www.instagram.com/webiro.nl" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#1a1719] dark:bg-[#1a1517] hover:bg-[#E4405F]/20 dark:hover:bg-[#E4405F]/30 p-3 rounded-xl transition-all hover:scale-110 border border-gray-700 dark:border-gray-800"
                aria-label="Instagram"
              >
                <Instagram size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-[#E4405F] transition-colors" />
              </a>
              <a 
                href="https://www.linkedin.com/company/webironl" 
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#1a1719] dark:bg-[#1a1517] hover:bg-[#0A66C2]/20 dark:hover:bg-[#0A66C2]/30 p-3 rounded-xl transition-all hover:scale-110 border border-gray-700 dark:border-gray-800"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-[#0A66C2] transition-colors" />
              </a>
            </div>
          </div>

          {/* Navigatie */}
          <div>
            <h4 className="mb-4 font-semibold">Menu</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Home
              </Link>
              <Link to="/pakketten" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Pakketten
              </Link>
              <Link to="/proces" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Proces
              </Link>
              <Link to="/contact" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Contact
              </Link>
              <Link to="/blog" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Blog & Nieuws
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a 
                href="mailto:info@webiro.nl" 
                className="group flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors bg-[#1a1719] dark:bg-[#1a1517] hover:bg-[#3A4DEA]/20 dark:hover:bg-[#3A4DEA]/30 px-4 py-3 rounded-xl border border-gray-700 dark:border-gray-800"
              >
                <div className="bg-[#3A4DEA] p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail size={18} className="text-white" />
                </div>
                <span>info@webiro.nl</span>
              </a>
              <a 
                href="https://wa.me/31855055054" 
                className="group flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors bg-[#1a1719] dark:bg-[#1a1517] hover:bg-[#25D366]/20 dark:hover:bg-[#25D366]/30 px-4 py-3 rounded-xl border border-gray-700 dark:border-gray-800"
              >
                <div className="bg-[#25D366] p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="mb-4 font-semibold">Blijf op de hoogte</h4>
            <div className="bg-[#1a1719] dark:bg-[#1a1517] p-5 rounded-2xl border-2 border-gray-700 dark:border-gray-800 transition-all">
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                Ontvang tips en updates over websites & online marketing
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="je@email.nl"
                  className="w-full bg-[#110E13] dark:bg-[#0f0d0f] text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A4DEA] placeholder:text-gray-500 dark:placeholder:text-gray-600 transition-colors border border-gray-700 dark:border-gray-800"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3A4DEA] hover:bg-[#2A3DDA] disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Bezig...'
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Inschrijven</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center text-gray-400 dark:text-gray-500 text-sm transition-colors">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <Link to="/algemene-voorwaarden" className="hover:text-white dark:hover:text-gray-300 transition-colors">
              Algemene Voorwaarden
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/privacy-policy" className="hover:text-white dark:hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p>© {new Date().getFullYear()} Webiro. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
