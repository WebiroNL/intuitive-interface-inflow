import { Link } from 'react-router-dom';
import LogoWebiro from '@/imports/LogoWebiro1';

const columns = [
  {
    heading: 'Diensten',
    links: [
      { label: 'Pakketten', to: '/pakketten' },
      { label: 'Marketing', to: '/marketing' },
      { label: 'Shop', to: '/shop' },
      { label: 'Documentatie', to: '/documentatie' },
    ],
  },
  {
    heading: 'Bedrijf',
    links: [
      { label: 'Over ons', to: '/' },
      { label: 'Proces', to: '/proces' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Juridisch',
    links: [
      { label: 'Algemene Voorwaarden', to: '/algemene-voorwaarden' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">

        {/* Top: logo + columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="w-24 h-6 mb-6 [--fill-0:#3A4DEA] [--fill-1:hsl(var(--foreground))]">
              <LogoWebiro />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px]">
              Moderne websites voor ondernemers die verder willen groeien.
            </p>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-foreground text-sm font-semibold mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map(({ label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Webiro. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:info@webiro.nl"
              className="text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              info@webiro.nl
            </a>
            <a
              href="https://wa.me/31855055054"
              className="text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
