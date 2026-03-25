import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon, Sun01Icon, Moon01Icon, ArrowDown01Icon, User03Icon, Globe02Icon, MegaphoneIcon } from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import webiroLogoDark from '@/assets/logo-webiro-dark.svg';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: "Oplossingen", href: "/oplossingen", dropdown: true },
  { label: "Diensten",    href: "/pakketten",    dropdown: true },
  { label: "Proces",      href: "/proces",       dropdown: false },
  { label: "Webiro AI",   href: "/moodboard",    dropdown: false, highlight: true },
  { label: "Blog",        href: "/blog",         dropdown: false },
  { label: "Shop",        href: "/shop",         dropdown: false },
];

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
    </header>
  );
}
