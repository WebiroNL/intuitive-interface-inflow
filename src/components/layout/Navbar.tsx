import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import webiroLogo from "@/assets/logo-webiro.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Pakketten", href: "/pakketten" },
    { label: "Proces", href: "/proces" },
    { label: "Marketing", href: "/marketing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? "top-4 px-4 md:px-8" : ""
      }`}
    >
      <div
        className={`transition-all duration-500 ease-out ${
          isScrolled
            ? "liquid-glass mx-auto max-w-5xl rounded-2xl md:rounded-full"
            : "bg-transparent"
        }`}
      >
        <div className={`mx-auto transition-all duration-500 ${isScrolled ? 'px-6' : 'container-webiro'}`}>
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={webiroLogo} alt="Webiro" className={`transition-all duration-500 ${isScrolled ? 'h-6 md:h-8' : 'h-8 md:h-10'}`} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href)
                      ? "text-primary"
                      : isScrolled ? "text-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-white/20' : 'hover:bg-muted'} text-muted-foreground hover:text-foreground`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* CTA Button */}
              <div className="hidden md:block">
                <Button asChild size={isScrolled ? "sm" : "default"} className="rounded-full">
                  <Link to="/intake">Gratis Adviesgesprek</Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-foreground"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`lg:hidden py-4 border-t animate-fade-in ${isScrolled ? 'border-white/20' : 'border-border bg-background/95 backdrop-blur-md'}`}>
            <div className="container-webiro flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-base font-medium py-3 px-4 rounded-xl transition-colors ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Button asChild className="w-full rounded-xl">
                  <Link to="/intake" onClick={() => setIsOpen(false)}>
                    Gratis Adviesgesprek
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
