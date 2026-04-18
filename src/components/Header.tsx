import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon, Sun01Icon, Moon01Icon, ArrowDown01Icon, User03Icon, Globe02Icon, MegaphoneIcon, WorkflowSquare01Icon } from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import webiroLogoDark from '@/assets/logo-webiro-dark.svg';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: "Oplossingen", href: "/oplossingen", dropdown: true },
  { label: "Diensten",    href: "/pakketten",    dropdown: true },
  { label: "Blog",        href: "/blog",         dropdown: false },
  { label: "Shop",        href: "/shop",         dropdown: false },
];

function OplossingenDropdown({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        to="/oplossingen"
        className={`inline-flex items-center gap-[3px] px-[13px] py-2 text-[14px] font-medium rounded-[5px] transition-colors whitespace-nowrap ${
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Oplossingen
        <HugeiconsIcon icon={ArrowDown01Icon} size={13} className={`mt-[1px] opacity-55 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="w-[300px] bg-popover border border-border rounded-lg shadow-lg p-2">
            <Link
              to="/moodboard"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                <svg width="18" height="18" viewBox="0 0 251 192" fill="currentColor" className="webiro-w-pulse">
                  <path d="M228.905 5.55661H187.613L161.404 48.6343L124.846 0L88.6007 48.2182L62.6459 5.55661H21.3537C9.57913 5.55661 0 15.1357 0 26.9097V77.3679C0 81.2749 1.10489 85.0849 3.19572 88.3857L62.3913 181.854C66.2892 188.008 72.965 191.719 80.2499 191.781C80.3114 191.782 80.3729 191.782 80.4349 191.782C87.6486 191.782 94.3072 188.193 98.2751 182.158L125.129 141.305L151.983 182.157C155.951 188.194 162.609 191.782 169.823 191.782C169.884 191.782 169.946 191.782 170.007 191.781C177.293 191.72 183.969 188.008 187.867 181.854L247.063 88.3857C249.153 85.0849 250.259 81.2749 250.259 77.3679V26.9097C250.259 15.1357 240.68 5.55661 228.905 5.55661ZM124.846 29.3752L151.527 64.8695L125.129 108.259L98.4781 64.4535L124.846 29.3752ZM17.6506 77.3679V26.9097C17.6506 24.8683 19.3117 23.2072 21.3537 23.2072H52.7243L77.1822 63.4084L39.7809 113.164L18.1074 78.9422C17.8086 78.4705 17.6506 77.9264 17.6506 77.3679ZM83.5261 172.462C82.5625 173.929 81.1572 174.135 80.3999 174.131C79.6461 174.124 78.2424 173.892 77.303 172.41L49.8782 129.107L87.0596 79.6438L114.688 125.056L83.5261 172.462ZM172.956 172.41C172.017 173.892 170.612 174.124 169.859 174.131C169.071 174.128 167.699 173.93 166.733 172.462L135.57 125.056L162.945 80.0599L200.121 129.517L172.956 172.41ZM232.608 77.3679C232.608 77.9264 232.451 78.4705 232.152 78.9422L210.219 113.574L172.823 63.8246L197.535 23.2072H228.905C230.947 23.2072 232.608 24.8683 232.608 26.9097V77.3679Z"/>
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                  Webiro AI
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full leading-none">Nieuw</span>
                </p>
                <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                  Genereer je moodboard & stijlgids met AI
                </p>
              </div>
            </Link>
            <Link
              to="/oplossingen"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                <HugeiconsIcon icon={Globe02Icon} size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Alle oplossingen</p>
                <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                  Bekijk ons volledige aanbod
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DienstenDropdown({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        to="/pakketten"
        className={`inline-flex items-center gap-[3px] px-[13px] py-2 text-[14px] font-medium rounded-[5px] transition-colors whitespace-nowrap ${
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Diensten
        <HugeiconsIcon icon={ArrowDown01Icon} size={13} className={`mt-[1px] opacity-55 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="w-[320px] bg-popover border border-border rounded-lg shadow-lg p-2">
            <Link
              to="/pakketten?flow=website"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                <HugeiconsIcon icon={Globe02Icon} size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Websites & Apps</p>
                <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                  Custom design, ontwikkeling & CMS op maat
                </p>
              </div>
            </Link>
            <Link
              to="/pakketten?flow=marketing"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                <HugeiconsIcon icon={MegaphoneIcon} size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Marketing & Ads</p>
                <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                  Google Ads, Meta Ads & advertentiebeheer
                </p>
              </div>
            </Link>
            <Link
              to="/proces"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                <HugeiconsIcon icon={WorkflowSquare01Icon} size={18} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Ons proces</p>
                <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                  Hoe we samen werken van briefing tot livegang
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isActive = (href: string) =>
    location.pathname === href || (href !== '/' && location.pathname.startsWith(href));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_1px_0_0_hsl(var(--border))]' : 'border-b border-border'
      }`}
    >
      {/* ── Constrained container — same width/padding as page content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center h-[60px] gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={theme === 'dark' ? webiroLogoDark : webiroLogo} alt="Webiro" className="h-[26px]" />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center flex-1">
            {navLinks.map((link) => {
              if (link.label === 'Oplossingen') {
                return (
                  <OplossingenDropdown key={link.label} isActive={isActive(link.href)} />
                );
              }
              if (link.label === 'Diensten') {
                return (
                  <DienstenDropdown key={link.label} isActive={isActive(link.href)} />
                );
              }
              return (
                <Link
                  key={link.label + link.href}
                  to={link.href}
                  className={`inline-flex items-center gap-[3px] px-[13px] py-2 text-[14px] font-medium rounded-[5px] transition-colors whitespace-nowrap ${
                    isActive(link.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {link.dropdown && (
                    <HugeiconsIcon icon={ArrowDown01Icon} size={13} className="mt-[1px] opacity-55" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions — desktop */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-[7px] text-muted-foreground hover:text-foreground transition-colors rounded-[5px] hover:bg-muted/40"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <HugeiconsIcon icon={Sun01Icon} size={15} /> : <HugeiconsIcon icon={Moon01Icon} size={15} />}
            </button>

            {/* Account / Sign in */}
            {user ? (
              <Link
                to="/account"
                className="inline-flex items-center gap-1.5 px-[14px] py-[7px] text-[14px] font-medium border border-input rounded-[6px] text-foreground hover:bg-muted/30 transition-colors leading-none"
              >
                <HugeiconsIcon icon={User03Icon} size={14} />
                Account
              </Link>
            ) : (
              <Link
                to="/account/login"
                className="px-[14px] py-[7px] text-[14px] font-medium border border-input rounded-[6px] text-foreground hover:bg-muted/30 transition-colors leading-none"
              >
                Inloggen
              </Link>
            )}

            {/* Filled CTA — "Contact sales" */}
            <Link
              to="/intake"
              className="inline-flex items-center gap-[5px] px-[14px] py-[7px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors leading-none"
            >
              Gratis gesprek <span className="text-[15px]" aria-hidden>›</span>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden ml-auto p-2 text-foreground rounded-[5px] hover:bg-muted/40 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HugeiconsIcon icon={Cancel01Icon} size={20} /> : <HugeiconsIcon icon={Menu01Icon} size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center justify-between py-2.5 px-3 text-[14px] font-medium rounded-[5px] transition-colors ${
                  isActive(link.href)
                    ? 'text-foreground bg-muted/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                }`}
              >
                {link.label}
                {link.dropdown && <HugeiconsIcon icon={ArrowDown01Icon} size={13} className="opacity-50" />}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 py-2.5 px-3 text-[14px] font-medium text-muted-foreground hover:text-foreground rounded-[5px] hover:bg-muted/20 transition-colors"
              >
                {theme === 'dark' ? <HugeiconsIcon icon={Sun01Icon} size={15} /> : <HugeiconsIcon icon={Moon01Icon} size={15} />}
                {theme === 'dark' ? 'Licht thema' : 'Donker thema'}
              </button>
              {user ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 py-2.5 px-3 text-[14px] font-medium border border-input rounded-[6px] text-center hover:bg-muted/20 transition-colors"
                >
                  <HugeiconsIcon icon={User03Icon} size={14} />
                  Mijn Account
                </Link>
              ) : (
                <Link
                  to="/account/login"
                  className="py-2.5 px-3 text-[14px] font-medium border border-input rounded-[6px] text-center hover:bg-muted/20 transition-colors"
                >
                  Inloggen
                </Link>
              )}
              <Link
                to="/intake"
                className="py-2.5 px-3 bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] text-center hover:bg-primary/90 transition-colors"
              >
                Gratis gesprek ›
              </Link>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .webiro-w-pulse {
          animation: webiroWPulse 2s ease-in-out infinite;
        }
        @keyframes webiroWPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>
    </header>
  );
}
