import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { ASSETS } from '../assets';
import { useModalA11y } from '../lib/modal';
import { MENU, SOCIALS, scrollToSection, type NavItem, type NavTarget } from './navigation';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Made inert while the panel is open, so Tab and screen readers stay inside. */
  backgroundRef?: React.RefObject<HTMLElement>;
}

const SOCIAL_ICON: Record<string, string> = {
  LinkedIn: ASSETS.footer.linkedin,
  Facebook: ASSETS.footer.facebook,
  TikTok: ASSETS.footer.tiktok,
  YouTube: ASSETS.footer.youtube,
};

/**
 * Renders a nav destination as the right element for its kind, and closes the
 * menu on the way out. A section target scrolls rather than navigating, so the
 * panel has to be gone before the scroll starts or the page moves underneath it.
 */
const useNavigate = (onClose: () => void) => (target: NavTarget) => {
  onClose();
  if (target.kind === 'section') {
    // After the close transition has released the body scroll lock.
    window.setTimeout(() => scrollToSection(target.id), 320);
  }
};

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose, backgroundRef }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>('Services');
  const idPrefix = useId();

  useModalA11y({ isOpen, onClose, containerRef: panelRef, backgroundRef });

  // Reopening should show the design's default state, not wherever it was left.
  useEffect(() => {
    if (isOpen) setExpanded('Services');
  }, [isOpen]);

  const go = useNavigate(onClose);

  const renderLeaf = (item: NavItem, className: string, children: React.ReactNode) => {
    if (item.target.kind === 'external') {
      return (
        <a href={item.target.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClose}>
          {children}
        </a>
      );
    }
    if (item.target.kind === 'route') {
      return (
        <Link to={item.target.to} className={className} onClick={onClose}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" className={`${className} text-left`} onClick={() => go(item.target)}>
        {children}
      </button>
    );
  };

  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    // Above the cookie banner (z-90), below the survey (z-100). The banner is
    // persistent rather than modal, and at z-90 it sat on top of the menu and
    // covered two of its items.
    <div
      className={`fixed inset-0 z-[95] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel — 658px at desktop per Figma, full-bleed on small screens where
          no artboard exists. 100dvh so mobile browser chrome can't clip it. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        className={`absolute right-0 top-0 h-[100dvh] w-full md:w-[658px] bg-bg-primary
                    flex flex-col overflow-hidden
                    transition-transform duration-300 ease-out motion-reduce:transition-none
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end shrink-0 p-fig-8 lg:pr-[10px] lg:pt-[10px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`h-[44px] w-[44px] lg:h-[56px] lg:w-[56px] inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors motion-reduce:transition-none ${focusRing}`}
          >
            <X className="h-[28px] w-[28px] lg:h-[32px] lg:w-[32px]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrolling body. .menu-scroll re-enables the scrollbar that index.html
            hides document-wide, styled to the one Figma draws. */}
        <nav className="menu-scroll flex-1 overflow-y-auto overscroll-contain px-fig-24 lg:px-fig-64 pb-fig-40">
          <ul className="flex flex-col gap-fig-24 lg:gap-fig-40">
            {MENU.map((item) => {
              const isExpandable = Boolean(item.children?.length);
              const isExpanded = expanded === item.label;
              const panelId = `${idPrefix}-${item.label.replace(/\s+/g, '-')}`;
              const topLevel =
                'font-sans font-medium text-white text-h1 lg:text-[64px] lg:leading-[58px] hover:text-pri-100 transition-colors motion-reduce:transition-none';

              return (
                <li key={item.label}>
                  {isExpandable ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : item.label)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className={`inline-flex items-center gap-fig-12 ${topLevel} ${focusRing}`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-[32px] w-[32px] lg:h-[40px] lg:w-[40px] shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                            isExpanded ? '-rotate-180' : ''
                          }`}
                          strokeWidth={2}
                        />
                      </button>

                      {/* Two columns filled down-then-across at desktop, one on
                          mobile where 233+47+221 cannot fit 342px of content. */}
                      <div
                        id={panelId}
                        hidden={!isExpanded}
                        className="mt-fig-20 lg:mt-[16px] grid grid-cols-1 md:grid-cols-2 gap-x-[47px] gap-y-fig-14"
                      >
                        {item.children!.map((child) =>
                          renderLeaf(
                            child,
                            `block group ${focusRing}`,
                            <>
                              <span className="block font-sans font-semibold text-white text-h3 group-hover:text-pri-100 transition-colors motion-reduce:transition-none">
                                {child.label}
                              </span>
                              {child.description && (
                                <span className="block mt-fig-6 font-body text-white text-body-md">
                                  {child.description}
                                </span>
                              )}
                            </>,
                          ),
                        )}
                      </div>
                    </>
                  ) : (
                    renderLeaf(item, `block ${topLevel} ${focusRing}`, item.label)
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer socials — right-aligned, 38px targets 2px apart per Figma. */}
        <div className="shrink-0 flex justify-end gap-fig-2 px-fig-20 py-fig-16">
          {SOCIALS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`h-[44px] w-[44px] inline-flex items-center justify-center hover:opacity-80 transition-opacity motion-reduce:transition-none ${focusRing}`}
            >
              <img src={SOCIAL_ICON[label]} alt="" aria-hidden="true" className="h-[20px] w-auto" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
