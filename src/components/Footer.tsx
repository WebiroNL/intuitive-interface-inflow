import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogoWebiro from '@/imports/LogoWebiro1';
import { HugeiconsIcon } from '@hugeicons/react';
import { Facebook01Icon, InstagramIcon, Linkedin01Icon, WhatsappIcon, Mail01Icon } from '@hugeicons/core-free-icons';
import { supabase } from '@/integrations/supabase/client';
import { useAppSettings } from '@/hooks/useAppSetting';

const SOCIAL_FALLBACKS = {
  social_facebook_url: 'https://www.facebook.com/webironl/',
  social_instagram_url: 'https://www.instagram.com/webiro.nl',
  social_linkedin_url: 'https://www.linkedin.com/company/webironl/',
  social_whatsapp_url: 'https://wa.me/31855055054',
  social_email_url: 'mailto:info@webiro.nl',
};

interface NavLink {
  label: string;
  to: string;
}

const dienstenLinks: NavLink[] = [
  { label: 'Webiro AI', to: '/moodboard' },
  { label: 'Oplossingen', to: '/oplossingen' },
  { label: 'Pakketten', to: '/pakketten' },
  { label: 'Shop', to: '/shop' },
];

const staticBedrijfLinks: NavLink[] = [
  { label: 'Over ons', to: '/over-ons' },
  { label: 'Documentatie', to: '/documentatie' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const [legalLinks, setLegalLinks] = useState<NavLink[]>([]);
  const [bedrijfDynamic, setBedrijfDynamic] = useState<NavLink[]>([]);
  const { values: socials } = useAppSettings(Object.keys(SOCIAL_FALLBACKS), SOCIAL_FALLBACKS);

  useEffect(() => {
    supabase
      .from('legal_pages')
      .select('title, slug, sort_order, category')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const legal: NavLink[] = [];
        const bedrijf: NavLink[] = [];
        data.forEach((p) => {
          const link = { label: p.title, to: `/${p.slug}` };
          if ((p as { category?: string }).category === 'bedrijf') bedrijf.push(link);
          else legal.push(link);
        });
        setLegalLinks(legal);
        setBedrijfDynamic(bedrijf);
      });
  }, []);

  const columns = [
    { heading: 'Diensten', links: dienstenLinks },
    { heading: 'Bedrijf', links: staticBedrijfLinks },
    { heading: 'Juridisch', links: legalLinks },
  ];

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
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook01Icon, href: socials.social_facebook_url, label: "Facebook", external: true },
              { icon: InstagramIcon, href: socials.social_instagram_url, label: "Instagram", external: true },
              { icon: Linkedin01Icon, href: socials.social_linkedin_url, label: "LinkedIn", external: true },
              { icon: WhatsappIcon, href: socials.social_whatsapp_url, label: "WhatsApp", external: true },
              { icon: Mail01Icon, href: socials.social_email_url, label: "Email", external: false },
            ].filter(({ href }) => !!href).map(({ icon, href, label, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={label}
                onClick={(e) => {
                  // Debug log: which URL is loaded from DB and is the external flag correct?
                  console.log("[Footer social click]", {
                    label,
                    href,
                    external,
                    expectedExternal: href?.startsWith("http"),
                    flagMatchesUrl: external === !!href?.startsWith("http"),
                    source: "app_settings",
                  });
                  if (!external) return;
                  // Force top-level navigation to bypass iframe sandbox restrictions
                  e.preventDefault();
                  window.open(href, "_blank", "noopener,noreferrer");
                }}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <HugeiconsIcon icon={icon} size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
