import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Menu } from 'lucide-react';
import { ASSETS } from '../assets';
import Container from './ui/Container';
import { ROUTES, useGoToSection } from './navigation';
import { MOTION, MS, useScrolledPast } from '../lib/motion';

const LOGO_URL = ASSETS.header.logo;

interface HeaderProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

/**
 * Solid blue bar, fixed height per artboard (69 / 113 / 119px at 390 / 1440 /
 * 1920 — Figma 3133:6748, 3275:2336, 3137:1822). The heights are the logo
 * lockup plus its vertical padding, so nothing here scales with the viewport;
 * `scroll-padding-top` in index.html mirrors the same three values.
 *
 * All navigation lives in the overlay menu — the bar itself carries only the
 * logo, the contact CTA, and the hamburger. The menu is rendered by the layout
 * rather than here, so it sits outside the region it makes inert.
 *
 * Once the page scrolls past a bar's height the blue goes translucent over a
 * blur. It stays at 70% rather than the 30% a literal reading of "70% glass"
 * would give: the lockup and icons are white, and over the light page a mostly
 * transparent bar puts white on near-white. The alpha is applied only where
 * `backdrop-filter` is supported, so browsers without it keep the solid bar
 * instead of a washed-out one.
 */
const Header: React.FC<HeaderProps> = ({ onOpenMenu, isMenuOpen }) => {
  const { pathname } = useLocation();
  // Not a bare scroll: the bar is on the legal routes too, where there is no
  // contact section to scroll to and the button used to do nothing at all.
  const goToSection = useGoToSection();
  const goToContact = () => goToSection('contact');
  // One bar height at the narrowest breakpoint. The three heights differ by less
  // than a flick of the wheel, so a single threshold reads the same at all of them.
  const glass = useScrolledPast(69) && MOTION.headerGlass;

  return (
      <header
        className={`sticky top-0 z-50 bg-bg-primary transition-[background-color,backdrop-filter] motion-reduce:transition-none ${
          glass ? 'backdrop-blur-md supports-[backdrop-filter]:bg-bg-primary/70' : ''
        }`}
        style={{ transitionDuration: `${MS.glass}ms` }}
      >
        <Container className="h-[69px] lg:h-[113px] 3xl:h-[119px] flex items-center justify-between gap-fig-16">
          {/* The lockup art is a single blue-on-transparent PNG shared with the
              old header; on this blue bar it is inverted to solid white rather
              than shipping a second copy of the same artwork. */}
          {/* A real route link, so it works from the legal pages — where the old
              preventDefault-and-scroll left the logo inert. On the home page there
              is nowhere to navigate, so it keeps gliding to the top instead. */}
          <Link
            to={ROUTES.home}
            onClick={(e) => {
              if (pathname !== ROUTES.home) return;
              e.preventDefault();
              const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
            }}
            className="flex items-center shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            aria-label="Officience home"
          >
            <img
              src={LOGO_URL}
              alt="Officience — 20 Years Anniversary"
              className="h-[37px] lg:h-[65px] 3xl:h-[71px] w-auto object-contain [filter:brightness(0)_invert(1)]"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Mobile puts the contact affordance before the hamburger and shrinks
              it to an icon; desktop reverses the order and spells it out. */}
          <div className="flex items-center gap-fig-8 lg:gap-fig-32">
            <button
              type="button"
              onClick={goToContact}
              aria-label="Contact us"
              className="lg:hidden h-[32px] w-[32px] inline-flex items-center justify-center rounded-fig-xs border border-white text-white hover:bg-white/10 transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className="h-[32px] w-[32px] lg:h-[48px] lg:w-[48px] 3xl:h-[56px] 3xl:w-[56px] inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Menu className="h-[26px] w-[26px] lg:h-[32px] lg:w-[32px] 3xl:h-[36px] 3xl:w-[36px]" strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={goToContact}
              className="hidden lg:inline-flex w-[224px] 3xl:w-[336px] h-[56px] items-center justify-center bg-surface text-text-primary font-sans text-btn-md hover:bg-bg-secondary active:bg-pri-50 transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us
            </button>
          </div>
        </Container>
      </header>
  );
};

export default Header;
