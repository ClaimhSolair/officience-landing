import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

// Direct link to the Officience Logo as requested
const LOGO_URL = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Logo.png";

const navItems = [
  { label: 'What we do', href: '#capabilities' },
  { label: 'Clients', href: '#clients' },
  { label: 'Our approach', href: '#approach' },
  { label: 'Why choose us', href: '#why-us' },
];

interface HeaderProps {
  onOpenSurvey: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSurvey }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 border-b rounded-t-3xl md:rounded-t-[2.5rem] ${
        isScrolled || isMobileMenuOpen 
          ? 'bg-white/90 backdrop-blur-md border-gray-200 py-4 shadow-sm' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex flex-col">
          <a 
            href="#" 
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center gap-2"
          >
            <img 
              src={LOGO_URL} 
              alt="Officience" 
              className="h-10 md:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <a 
             href="https://demo.officience.com/brochure"
             target="_blank"
             rel="noopener noreferrer"
             className="text-base font-medium text-gray-600 hover:text-primary transition-colors font-body whitespace-nowrap"
          >
            About us
          </a>
          {navItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-base font-medium text-gray-600 hover:text-primary transition-colors font-body whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
          
          <div className="flex items-center gap-3">
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="bg-primary text-white px-7 py-3 text-base font-bold rounded-full hover:bg-blue-800 transition-all transform hover:scale-105 shadow-md whitespace-nowrap"
            >
              Let's Start!
            </a>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-8 flex flex-col space-y-6 shadow-2xl h-screen rounded-b-3xl">
          <a 
             href="https://demo.officience.com/brochure"
             target="_blank"
             rel="noopener noreferrer"
             className="text-xl font-medium text-gray-900 hover:text-primary font-body text-left"
          >
            About us
          </a>
          {navItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-xl font-medium text-gray-900 hover:text-primary font-body"
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-primary text-white w-full text-center py-4 text-xl font-bold rounded-full"
          >
            Let's Start!
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;