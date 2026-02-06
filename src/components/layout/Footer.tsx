import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container-webiro section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="text-2xl font-bold">
              Web<span className="text-primary">iro</span>
            </span>
            <p className="mt-4 text-webiro-gray-400 text-sm leading-relaxed">
              Professionele websites die privacy combineren met professionaliteit. 
              Webdesign voor ambitieuze ondernemers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigatie</h4>
            <ul className="space-y-3">
              {["Home", "Diensten", "Over Ons", "Werkwijze", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-webiro-gray-400 hover:text-background transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Diensten</h4>
            <ul className="space-y-3">
              {["Webdesign", "SEO Optimalisatie", "Hosting & Onderhoud", "Branding"].map((service) => (
                <li key={service}>
                  <span className="text-webiro-gray-400 text-sm">{service}</span>
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
                <span className="text-webiro-gray-400 text-sm">Op aanvraag</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                <span className="text-webiro-gray-400 text-sm">Nederland</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-webiro-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-webiro-gray-400 text-sm">
              © {currentYear} Webiro. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-webiro-gray-400 hover:text-background transition-colors text-sm">
                Privacybeleid
              </a>
              <a href="#" className="text-webiro-gray-400 hover:text-background transition-colors text-sm">
                Algemene Voorwaarden
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
