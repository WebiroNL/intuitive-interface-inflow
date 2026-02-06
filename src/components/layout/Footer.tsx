import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigatie: [
      { label: "Home", href: "/" },
      { label: "Pakketten", href: "/pakketten" },
      { label: "Proces", href: "/proces" },
      { label: "Marketing", href: "/marketing" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    diensten: [
      { label: "Webdesign", href: "/pakketten" },
      { label: "SEO Optimalisatie", href: "/pakketten" },
      { label: "Marketing", href: "/marketing" },
      { label: "Onderhoud", href: "/pakketten" },
    ],
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container-webiro py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold">
                Web<span className="text-primary">iro</span>
              </span>
            </Link>
            <p className="mt-4 text-webiro-gray-400 text-sm leading-relaxed">
              Moderne websites voor ondernemers. Binnen 7 dagen online met jouw
              droomsite. Betaalbaar vanaf €449.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/webiro.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://linkedin.com/company/webiro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://facebook.com/webiro.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigatie</h4>
            <ul className="space-y-3">
              {footerLinks.navigatie.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Diensten</h4>
            <ul className="space-y-3">
              {footerLinks.diensten.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <a
                  href="mailto:info@webiro.nl"
                  className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
                >
                  info@webiro.nl
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <a
                  href="tel:0855055054"
                  className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
                >
                  085 505 505 4
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                <span className="text-webiro-gray-400 text-sm">Nederland</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-webiro-gray-400 text-sm">
              © {currentYear} Webiro. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy-policy"
                className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
              >
                Privacybeleid
              </Link>
              <Link
                to="/algemene-voorwaarden"
                className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
              >
                Algemene Voorwaarden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
