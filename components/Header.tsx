import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ASSETS } from '../assets';

const LOGO_URL = ASSETS.header.logo;

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

const navItems: NavLink[] = [
  { label: 'What we do', href: '#capabilities' },     // → Capabilities "What We Do"
  { label: 'People Trust Us', href: '#clients' },     // → ClientStories "People Trust Us"
  { label: 'Our Approach', href: '#approach' },       // → HowWeEngage "Our Approach"
  { label: 'Why choose us', href: '#why-us' },        // → WhyOfficience "Why Choose Us"
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

  // Lock body scroll while the mobile menu is open (restore on close).
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isMobileMenuOpen
          ? 'bg-bg-secondary shadow-fig-exsm'
          : isScrolled
            ? 'bg-[#F7F7F7]/70 backdrop-blur-md shadow-fig-exsm'
            : 'bg-bg-secondary'
      }`}
    >
      {/* Figma: px-100 py-24, content-width, items-center justify-between */}
      <div className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] py-[8px] flex items-center justify-between">
        {/* Logo Area — FIXED logo height (no vw scaling, so header is identical at every window width):
            72px desktop / 56px mobile. With py-8 the header is a steady ~88px on desktop. */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          className="flex items-center shrink-0"
          aria-label="Officience home"
        >
          <img
            src={LOGO_URL}
            alt="Officience — 20 Years Anniversary"
            width={182}
            height={72.5}
            className="h-[56px] md:h-[72px] w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Nav — Figma: gap-40 between menu and CTA */}
        <nav className="hidden lg:flex items-center gap-[40px]">
          {/* Menu — Montserrat Regular 20px, color #0f1219, gap-36 */}
          <div className="flex items-center gap-[36px] font-body text-text-default text-[clamp(16px,1.2vw,20px)] leading-[28px] whitespace-nowrap">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text-primary transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="hover:text-text-primary transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* CTA — square blue button, py-12 so it matches the 48px logo (96px compact header), Lexend SemiBold 20px, shadow ex-sm */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-bg-primary text-white px-[32px] py-[12px] font-sans font-semibold text-[clamp(16px,1.2vw,20px)] leading-[24px] shadow-fig-exsm hover:bg-blue-800 transition-colors whitespace-nowrap"
          >
            Contact Us
          </a>
        </nav>

        {/* Mobile Toggle — p-3 gives a ~56px tap target; -mr-3 keeps the icon edge-aligned */}
        <button
          className="lg:hidden text-text-default p-3 -mr-3"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu — slide/fade in; ≥48px tap rows; body scroll locked while open */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col space-y-2 shadow-2xl h-screen overflow-y-auto rounded-b-3xl"
        >
          {navItems.map((item) => (
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-2 rounded-lg text-xl font-medium text-gray-900 hover:text-primary hover:bg-gray-50 font-body transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block py-3 px-2 rounded-lg text-xl font-medium text-gray-900 hover:text-primary hover:bg-gray-50 font-body transition-colors"
              >
                {item.label}
              </a>
            )
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mt-2 bg-bg-primary text-white w-full text-center py-4 text-xl font-sans font-semibold shadow-fig-exsm rounded-fig-m"
          >
            Contact Us
          </a>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
