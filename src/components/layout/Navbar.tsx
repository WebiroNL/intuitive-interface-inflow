import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import webiroLogo from "@/assets/logo-webiro.svg";

const navLinks = [
  { label: "Pakketten", href: "/pakketten" },
  { label: "Proces", href: "/proces" },
  { label: "Marketing", href: "/marketing" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const isActive = (href: string) =>
    location.pathname === href || (href !== "/" && location.pathname.startsWith(href));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_0_hsl(var(--border))]" : "border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo — left */}
          <Link to="/" className="flex-shrink-0 mr-10">
            <img src={webiroLogo} alt="Webiro" className="h-[26px]" />
          </Link>

          {/* Nav links — center (desktop) */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-[14px] py-2 text-[14px] font-medium rounded-[5px] transition-colors ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions — desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-[5px] hover:bg-muted/40"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Sign in — outlined */}
            <Link
              to="/contact"
              className="px-[14px] py-[7px] text-[14px] font-medium border border-input rounded-[6px] text-foreground hover:bg-muted/30 transition-colors"
            >
              Contact
            </Link>

            {/* Primary CTA — filled, Stripe "Contact sales" style */}
            <Link
              to="/intake"
              className="inline-flex items-center gap-1 px-[14px] py-[7px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
            >
              Gratis adviesgesprek
              <span className="ml-0.5 text-[16px] leading-none" aria-hidden>›</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-foreground rounded-[5px] hover:bg-muted/40 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`py-2.5 px-3 text-[14px] font-medium rounded-[5px] transition-colors ${
                  isActive(link.href)
                    ? "text-foreground bg-muted/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              <Link
                to="/contact"
                className="py-2.5 px-3 text-[14px] font-medium border border-input rounded-[6px] text-foreground text-center hover:bg-muted/30 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/intake"
                className="py-2.5 px-3 bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] text-center hover:bg-primary/90 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Gratis adviesgesprek ›
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
