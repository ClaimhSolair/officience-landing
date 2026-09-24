import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { setInert, useModalA11y } from '../lib/modal';
import { CSS_EASE, EASE, MOTION, MS, SEC, STAGGER, useMotionEnabled } from '../lib/motion';
import { MENU, SOCIALS, useGoToSection, type NavItem, type NavTarget } from './navigation';
import RollText from './ui/RollText';
import { FacebookIcon, LinkedInIcon, TikTokIcon, YouTubeIcon } from './ui/FooterIcons';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Made inert while the panel is open, so Tab and screen readers stay inside. */
  backgroundRef?: React.RefObject<HTMLElement>;
}

/**
 * The menu's own social marks — Figma 3683:3556. That frame draws four 38x38
 * tiles on a 40px pitch, so the gap is 2px, and it places each glyph inside its
 * tile at the same coordinates the footer frame uses (TikTok, for one, sits at
 * 11.4932, 8.5195 in both). The inline components therefore reproduce this
 * frame exactly, and they replace the bucket images this menu used to draw:
 * those normalised every mark to one 45.385 square, which rendered LinkedIn
 * small and Facebook oversized.
 */
const SOCIAL_ICON: Record<string, React.FC<{ className?: string }>> = {
  LinkedIn: LinkedInIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
  YouTube: YouTubeIcon,
};

/**
 * Renders a nav destination as the right element for its kind, and closes the
 * menu on the way out. A section target scrolls rather than navigating, so the
 * panel has to be gone before the scroll starts or the page moves underneath it.
 */
const useNavigateTarget = (onClose: () => void) => {
  const goToSection = useGoToSection();
  const motionOn = useMotionEnabled();

  return (target: NavTarget) => {
    onClose();
    if (target.kind === 'section') {
      // After the close transition has released the body scroll lock. Off the
      // home page this navigates instead of scrolling, so Work and About Us
      // reach their sections from the legal routes too.
      //
      // The wait is the panel's own duration rather than a number of its own:
      // retuning the transition without retuning this scrolls the page while the
      // panel is still on screen. With motion off there is no transition left to
      // wait for.
      window.setTimeout(() => goToSection(target.id), motionOn ? MS.menu : 0);
    }
  };
};

/**
 * The items follow the panel in rather than being there the moment it opens.
 * `delayChildren` holds them until the clip has uncovered roughly the top third,
 * so nothing appears in a region the panel has not reached yet.
 *
 * Closing is not the reverse: the items drop out fast and the panel does the
 * visible work. Leaving should acknowledge the click, not perform for it.
 */
const LIST_VARIANTS: Variants = {
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  open: { transition: { staggerChildren: STAGGER.tight, delayChildren: 0.12 } },
};

const ITEM_VARIANTS: Variants = {
  closed: { y: 12, opacity: 0, transition: { duration: SEC.exit, ease: [...EASE.exit] } },
  open: { y: 0, opacity: 1, transition: { duration: SEC.menuItem, ease: [...EASE.reveal] } },
};

/** Reduced motion keeps the cascade's rhythm but drops the travel. */
const ITEM_VARIANTS_FLAT: Variants = {
  closed: { opacity: 0, transition: { duration: SEC.exit } },
  open: { opacity: 1, transition: { duration: SEC.menuItem } },
};

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose, backgroundRef }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  // JS rather than `motion-reduce:` so the review override can reach it; a CSS
  // media query cannot be overridden from script.
  const motionOn = useMotionEnabled();
  const dur = motionOn ? MS.menu : 0;
  const cascading = motionOn && MOTION.menuCascade;
  const itemVariants = motionOn ? ITEM_VARIANTS : ITEM_VARIANTS_FLAT;
  const idPrefix = useId();

  /**
   * Closed, the panel is only translated off-canvas — every link inside it stays
   * in the tab order, so Tab walks focus into an `aria-hidden` region and off the
   * side of the screen with nothing visible to show for it. `inert` takes the
   * whole subtree out of both the tab order and the accessibility tree.
   *
   * Declared before `useModalA11y` on purpose: effects run in declaration order,
   * and the focus it moves into the panel on open would fail against a subtree
   * that is still inert.
   */
  useEffect(() => {
    setInert(rootRef.current, !isOpen);
  }, [isOpen]);

  useModalA11y({ isOpen, onClose, containerRef: panelRef, backgroundRef });

  // The design default is all groups collapsed. Reset on reopen, so the menu does
  // not show a group the reader expanded on a previous open. Services opens on a
  // manual click only.
  useEffect(() => {
    if (isOpen) setExpanded(null);
  }, [isOpen]);

  const go = useNavigateTarget(onClose);

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
      ref={rootRef}
      className={`fixed inset-0 z-[95] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: `${dur}ms`, transitionTimingFunction: CSS_EASE.menu }}
      />

      {/* Panel — 658px at desktop per Figma, full-bleed on small screens where
          no artboard exists. 100dvh so mobile browser chrome can't clip it. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        className="absolute right-0 top-0 h-[100dvh] w-full md:w-[658px] bg-bg-primary
                    flex flex-col overflow-hidden transition-[clip-path]"
        style={{
          // Uncovering from the top-right corner rather than sliding the whole
          // slab in from the right: the panel grows out of the button that opened
          // it, so the two read as one gesture. `inset()` takes top/right/bottom/
          // left, so a fully-inset bottom and left is a zero-area box pinned to
          // that corner.
          clipPath: isOpen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 100%)',
          transitionDuration: `${dur}ms`,
          transitionTimingFunction: CSS_EASE.menu,
        }}
      >
        <div className="flex justify-end shrink-0 p-fig-8 lg:pr-[10px] lg:pt-[10px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`h-[44px] w-[44px] lg:h-[56px] lg:w-[56px] inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors motion-reduce:transition-none ${focusRing}`}
          >
            <motion.span
              className="inline-flex"
              initial={false}
              animate={{ rotate: cascading && isOpen ? 0 : -90 }}
              transition={{ duration: SEC.menu, ease: [...EASE.menu] }}
            >
              <X className="h-[28px] w-[28px] lg:h-[32px] lg:w-[32px]" strokeWidth={2.5} />
            </motion.span>
          </button>
        </div>

        {/* Scrolling body. .menu-scroll re-enables the scrollbar that index.html
            hides document-wide, styled to the one Figma draws. data-lenis-prevent
            lets the wheel scroll this list natively, not the page behind it. */}
        <nav data-lenis-prevent className="menu-scroll flex-1 overflow-y-auto overscroll-contain px-fig-24 lg:px-fig-64 pb-fig-40">
          <motion.ul
            className="flex flex-col gap-fig-24 lg:gap-fig-40"
            variants={cascading ? LIST_VARIANTS : undefined}
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
          >
            {MENU.map((item) => {
              const isExpandable = Boolean(item.children?.length);
              const isExpanded = expanded === item.label;
              const panelId = `${idPrefix}-${item.label.replace(/\s+/g, '-')}`;
              const topLevel =
                'font-sans font-medium text-white text-h1 lg:text-[64px] lg:leading-[58px] hover:text-pri-100 transition-colors motion-reduce:transition-none';

              return (
                <motion.li key={item.label} variants={cascading ? itemVariants : undefined}>
                  {isExpandable ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : item.label)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className={`group inline-flex items-center gap-fig-12 ${topLevel} ${focusRing}`}
                      >
                        <RollText durationMs={MS.rollSlow}>{item.label}</RollText>
                        <ChevronDown
                          className={`h-[32px] w-[32px] lg:h-[40px] lg:w-[40px] shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                            isExpanded ? '-rotate-180' : ''
                          }`}
                          strokeWidth={2}
                        />
                      </button>

                      {/* Two columns filled down-then-across at desktop, one on
                          mobile where 233+47+221 cannot fit 342px of content.

                          The closed state switches the display utility rather
                          than setting the `hidden` attribute. Preflight's
                          `[hidden]{display:none}` sits in the base layer and
                          `.grid` sits in utilities: same specificity, later
                          source order, so `grid` won and the attribute did
                          nothing. The toggle looked dead because the panel never
                          left. */}
                      <div
                        id={panelId}
                        className={`mt-fig-20 lg:mt-fig-32 grid-cols-1 md:grid-cols-2 gap-x-[47px] gap-y-fig-14 ${
                          isExpanded ? 'grid' : 'hidden'
                        }`}
                      >
                        {item.children!.map((child) =>
                          renderLeaf(
                            child,
                            `block group ${focusRing}`,
                            <>
                              <span className="block font-sans font-semibold text-white text-h3 group-hover:text-pri-100 transition-colors motion-reduce:transition-none">
                                <RollText durationMs={MS.rollSlow}>{child.label}</RollText>
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
                    renderLeaf(
                      item,
                      `block group ${topLevel} ${focusRing}`,
                      <RollText durationMs={MS.rollSlow}>{item.label}</RollText>,
                    )
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Footer socials — right-aligned, 38px tiles 2px apart per Figma. The
            tile is the artwork's own frame, so each glyph keeps the size and the
            position the artboard gives it. 38px clears the 24px WCAG 2.2 web
            target minimum. */}
        <div className="shrink-0 flex justify-end gap-fig-2 px-fig-20 py-fig-16">
          {SOCIALS.map(({ label, href }) => {
            const Icon = SOCIAL_ICON[label];
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`h-[38px] w-[38px] inline-flex items-center justify-center hover:opacity-80 transition-opacity motion-reduce:transition-none ${focusRing}`}
              >
                <Icon className="h-[38px] w-[38px]" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
