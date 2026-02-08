import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import LogoWebiro from '@/imports/LogoWebiro1';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  // Optimized scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    // Cancel previous frame if it hasn't run yet
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Schedule update for next frame
    rafRef.current = requestAnimationFrame(() => {
      const scrollPosition = window.scrollY;
      
      // Determine scroll direction
      if (scrollPosition > lastScrollY.current) {
        scrollDirection.current = 'down';
      } else if (scrollPosition < lastScrollY.current) {
        scrollDirection.current = 'up';
      }
      
      // Only update if scroll position actually changed significantly (threshold: 5px)
      if (Math.abs(scrollPosition - lastScrollY.current) > 5) {
        lastScrollY.current = scrollPosition;
        const maxScroll = 50;
        
        // When scrolling up and near the top, quickly expand the navbar
        if (scrollDirection.current === 'up' && scrollPosition < 20) {
          setScrollProgress(0);
        } else {
          const progress = Math.min(scrollPosition / maxScroll, 1);
          setScrollProgress(progress);
        }
      }
      
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [location.pathname, handleScroll]);

  const isScrolled = scrollProgress > 0.5;
  const isPakkettenActive = location.pathname === '/pakketten' || location.pathname === '/marketing';

  return (
    <header className="sticky top-0 z-50">
      <div 
        style={{
          paddingLeft: `${16 * scrollProgress}px`,
          paddingRight: `${16 * scrollProgress}px`,
          paddingTop: `${16 * scrollProgress}px`,
          transition: 'padding 0s linear',
        }}
      >
        <nav 
          className="relative"
          style={{
            maxWidth: scrollProgress > 0 ? '1280px' : '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: `${16 - 4 * scrollProgress}px`,
            paddingBottom: `${16 - 4 * scrollProgress}px`,
            borderRadius: `${42 * scrollProgress}px`,
            transition: 'max-width 700ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 700ms cubic-bezier(0.4, 0, 0.2, 1), padding 700ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#3A4DEA] via-[#6B5FED] to-[#8B4FE8] shadow-lg"
            style={{
              opacity: 1 - scrollProgress,
              borderRadius: `${42 * scrollProgress}px`,
              transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          ></div>

          {/* Simple Glass Effect - replacing complex Figma layers */}
          <div 
            className="absolute inset-0 bg-white/15 dark:bg-[#1a1719]/85 border-white/25 dark:border-white/10"
            style={{
              opacity: scrollProgress,
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
              borderWidth: '1px',
              borderRadius: `${42 * scrollProgress}px`,
              boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2)`,
              transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity, border-radius',
            }}
          ></div>
          
          {/* Animated gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              opacity: 0.3 * (1 - scrollProgress),
              transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-blue-500/50 to-purple-600/50 animate-pulse"></div>
          </div>
          
          <div className="flex items-center justify-between relative z-10 container mx-auto max-w-7xl">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              style={{
                '--fill-0': isScrolled ? (theme === 'dark' ? 'white' : '#110E13') : 'white',
                '--fill-1': isScrolled ? '#3A4DEA' : 'white',
              } as React.CSSProperties}
            >
              <div className="h-8 w-32">
                <LogoWebiro />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`transition-all duration-300 relative group ${ 
                  isScrolled 
                    ? (location.pathname === '/' ? 'text-[#3A4DEA]' : `${theme === 'dark' ? 'text-white' : 'text-[#110E13]'} hover:text-[#3A4DEA]`)
                    : 'text-white hover:text-[#FFD75C]'
                }`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                  isScrolled ? 'bg-[#3A4DEA]' : 'bg-white'
                } ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              
              {/* Pakketten Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`transition-all duration-300 relative group flex items-center gap-1 ${ 
                    isScrolled 
                      ? (isPakkettenActive ? 'text-[#3A4DEA]' : `${theme === 'dark' ? 'text-white' : 'text-[#110E13]'} hover:text-[#3A4DEA]`)
                      : 'text-white hover:text-[#FFD75C]'
                  }`}
                >
                  Pakketten
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                    isScrolled ? 'bg-[#3A4DEA]' : 'bg-white'
                  } ${isPakkettenActive || isDropdownOpen ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 w-48 z-50" style={{ top: 'calc(100% + 8px)' }}>
                    <div className="bg-white dark:bg-[#1a1719] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/pakketten"
                        className="block px-5 py-3 text-[#110E13] dark:text-white hover:bg-[#EAF0FF] dark:hover:bg-[#3A4DEA]/20 hover:text-[#3A4DEA] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="font-semibold">Website</div>
                        <div className="text-xs text-[#110E13]/60 dark:text-gray-400">Website pakketten</div>
                      </Link>
                      <Link
                        to="/marketing"
                        className="block px-5 py-3 text-[#110E13] dark:text-white hover:bg-[#EAF0FF] dark:hover:bg-[#3A4DEA]/20 hover:text-[#3A4DEA] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="font-semibold">Marketing</div>
                        <div className="text-xs text-[#110E13]/60 dark:text-gray-400">Marketing pakketten</div>
                      </Link>
                    </div>
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute bottom-full left-0 right-0 h-2"></div>
                  </div>
                )}
              </div>
              
              <Link
                to="/proces"
                className={`transition-all duration-300 relative group ${ 
                  isScrolled 
                    ? (location.pathname === '/proces' ? 'text-[#3A4DEA]' : `${theme === 'dark' ? 'text-white' : 'text-[#110E13]'} hover:text-[#3A4DEA]`)
                    : 'text-white hover:text-[#FFD75C]'
                }`}
              >
                Proces
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                  isScrolled ? 'bg-[#3A4DEA]' : 'bg-white'
                } ${location.pathname === '/proces' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              
              <Link
                to="/contact"
                className={`transition-all duration-300 relative group ${ 
                  isScrolled 
                    ? (location.pathname === '/contact' ? 'text-[#3A4DEA]' : `${theme === 'dark' ? 'text-white' : 'text-[#110E13]'} hover:text-[#3A4DEA]`)
                    : 'text-white hover:text-[#FFD75C]'
                }`}
              >
                Contact
                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                  isScrolled ? 'bg-[#3A4DEA]' : 'bg-white'
                } ${location.pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 ${ isScrolled
                    ? theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-[#EAF0FF] text-[#3A4DEA] hover:bg-[#3A4DEA] hover:text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                aria-label={theme === 'dark' ? 'Wissel naar licht thema' : 'Wissel naar donker thema'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <Link
                to="/intake"
                className={`px-6 py-2.5 rounded-full transition-all duration-300 text-center ${
                  isScrolled
                    ? 'bg-[#3A4DEA] text-white hover:bg-[#2f3ec7]'
                    : 'bg-white text-[#3A4DEA] hover:bg-[#EAF0FF]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Plan gratis intake
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-3 hover:scale-110 transition-transform duration-300 rounded-lg ${ isScrolled ? (theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-[#110E13] hover:bg-[#EAF0FF]') : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-300 relative z-10 container mx-auto max-w-7xl">
              <Link
                to="/"
                className={`transition-colors ${
                  isScrolled
                    ? (location.pathname === '/' ? 'text-[#3A4DEA]' : (theme === 'dark' ? 'text-white' : 'text-[#110E13]'))
                    : 'text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Pakketten Dropdown */}
              <div>
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className={`flex items-center gap-1 transition-colors w-full text-left ${
                    isScrolled
                      ? (isPakkettenActive ? 'text-[#3A4DEA]' : (theme === 'dark' ? 'text-white' : 'text-[#110E13]'))
                      : 'text-white'
                  }`}
                >
                  Pakketten
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileDropdownOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/pakketten"
                      className={`transition-colors ${
                        isScrolled
                          ? (location.pathname === '/pakketten' ? 'text-[#3A4DEA]' : (theme === 'dark' ? 'text-white/80' : 'text-[#110E13]/80'))
                          : 'text-white/80'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileDropdownOpen(false);
                      }}
                    >
                      → Website
                    </Link>
                    <Link
                      to="/marketing"
                      className={`transition-colors ${
                        isScrolled
                          ? (location.pathname === '/marketing' ? 'text-[#3A4DEA]' : (theme === 'dark' ? 'text-white/80' : 'text-[#110E13]/80'))
                          : 'text-white/80'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileDropdownOpen(false);
                      }}
                    >
                      → Marketing
                    </Link>
                  </div>
                )}
              </div>
              
              <Link
                to="/proces"
                className={`transition-colors ${
                  isScrolled
                    ? (location.pathname === '/proces' ? 'text-[#3A4DEA]' : (theme === 'dark' ? 'text-white' : 'text-[#110E13]'))
                    : 'text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Proces
              </Link>
              
              <Link
                to="/contact"
                className={`transition-colors ${
                  isScrolled
                    ? (location.pathname === '/contact' ? 'text-[#3A4DEA]' : (theme === 'dark' ? 'text-white' : 'text-[#110E13]'))
                    : 'text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 transition-colors ${
                  isScrolled ? (theme === 'dark' ? 'text-white' : 'text-[#110E13]') : 'text-white'
                }`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === 'dark' ? 'Licht thema' : 'Donker thema'}</span>
              </button>
              
              <Link
                to="/intake"
                className={`px-6 py-2.5 rounded-full transition-colors text-center ${
                  isScrolled
                    ? 'bg-[#3A4DEA] text-white hover:bg-[#2f3ec7]'
                    : 'bg-white text-[#3A4DEA] hover:bg-[#EAF0FF]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Plan gratis intake
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
