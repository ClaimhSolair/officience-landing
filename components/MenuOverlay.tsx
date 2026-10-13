import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { NavLink } from 'react-router-dom';
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

/**
 * Figma draws the open menu at one width only: 3275:2328, 1440 x 742. The panel
 * uses the 1440 values in fixed px from lg, and one step up at fhd (1880): each
 * value x1.333, rounded to whole px, because no 1920 menu frame exists. Wider
 * screens keep the fhd values (user decision, 2026-10-13: steps, not fluid).
 * Below lg the panel is full width and uses the mobile type styles.
 */
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
        // NavLink marks the current page with aria-current="page". A visible
        // state is for the design team (adapter section 22).
        <NavLink to={item.target.to} end className={className} onClick={onClose}>
          {children}
        </NavLink>
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
      {/* Backdrop: black at 60%, as Figma 3275:2337 draws it. */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity ${
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
        className="absolute right-0 top-0 h-[100dvh] w-full md:w-[658px] lg:w-[658px] fhd:w-[877px] bg-bg-primary
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
        {/* The close row ends at y 80 from lg (10 + 56 + 14), where Figma
            starts the nav list (`menu_body` padding-top 80). At fhd: 13 + 75 + 19 = 107. */}
        <div className="flex justify-end shrink-0 p-fig-8 lg:pr-[10px] fhd:pr-[13px] lg:pt-[10px] fhd:pt-[13px] lg:pb-[14px] fhd:pb-[19px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`h-[44px] w-[44px] lg:h-[56px] fhd:h-[75px] lg:w-[56px] fhd:w-[75px] inline-flex items-center justify-center text-white hover:bg-white/10 transition-colors motion-reduce:transition-none ${focusRing}`}
          >
            <motion.span
              className="inline-flex"
              initial={false}
              animate={{ rotate: cascading && isOpen ? 0 : -90 }}
              transition={{ duration: SEC.menu, ease: [...EASE.menu] }}
            >
              {/* A 46px box gives the drawn 28 x 28 ink at stroke 2.5. */}
              <X className="h-[28px] w-[28px] lg:h-[46px] fhd:h-[61px] lg:w-[46px] fhd:w-[61px]" strokeWidth={2.5} />
            </motion.span>
          </button>
        </div>

        {/* Scrolling body. .menu-scroll re-enables the scrollbar that index.html
            hides document-wide, styled to the one Figma draws (3275:2472): a 10px
            pill in 40% colours, set here through --sb-track / --sb-thumb, and
            13px at fhd through --sb-size. The right margin puts the bar 10px in
            from the panel edge. The stable gutter keeps the space for the bar
            also when the list does not scroll, so the columns stay at the drawn
            x: 64 + 530 + 44 + 10 + 10 = 658 (fhd: 85 + 707 + 59 + 13 + 13 = 877).
            data-lenis-prevent lets the wheel scroll this list natively, not the
            page behind it. */}
        <nav
          data-lenis-prevent
          className="menu-scroll flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] fhd:[--sb-size:13px] [--sb-track:rgba(60,141,251,0.4)] [--sb-thumb:rgba(177,209,253,0.4)] px-fig-24 pb-fig-40 lg:pl-[64px] fhd:pl-[85px] lg:pr-[44px] fhd:pr-[59px] lg:mr-[10px] fhd:mr-[13px] lg:pb-[40px] fhd:pb-[53px]"
        >
          <motion.ul
            className="flex flex-col gap-fig-24 lg:gap-[40px] fhd:gap-[53px]"
            variants={cascading ? LIST_VARIANTS : undefined}
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
          >
            {MENU.map((item) => {
              const isExpandable = Boolean(item.children?.length);
              const isExpanded = expanded === item.label;
              const panelId = `${idPrefix}-${item.label.replace(/\s+/g, '-')}`;
              const topLevel =
                'font-sans font-medium text-white text-h1 lg:text-[length:64px] fhd:text-[length:85px] lg:leading-[58px] fhd:leading-[77px] lg:tracking-[-0.03em] hover:text-pri-100 transition-colors motion-reduce:transition-none';

              return (
                <motion.li key={item.label} variants={cascading ? itemVariants : undefined}>
                  {isExpandable ? (
                    <>
                      {/* `align-top`: an inline-flex box on the baseline adds
                          1px of descender space to the 58px line. */}
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : item.label)}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className={`group inline-flex align-top items-center gap-fig-12 lg:gap-[12px] fhd:gap-[16px] ${topLevel} ${focusRing}`}
                      >
                        <RollText durationMs={MS.rollSlow}>{item.label}</RollText>
                        <ChevronDown
                          className={`h-[32px] w-[32px] lg:h-[40px] fhd:h-[53px] lg:w-[40px] fhd:w-[53px] shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                            isExpanded ? '-rotate-180' : ''
                          }`}
                          strokeWidth={2}
                        />
                      </button>

                      {/* Two equal columns with a 30px gap, filled down then
                          across, from md (Figma `sub_item_nav`: column 2 at x 280
                          in 530). One column on mobile, where 233 + 30 + 221
                          cannot fit 342px of content.

                          The closed state switches the display utility rather
                          than setting the `hidden` attribute. Preflight's
                          `[hidden]{display:none}` sits in the base layer and
                          `.grid` sits in utilities: same specificity, later
                          source order, so `grid` won and the attribute did
                          nothing. The toggle looked dead because the panel never
                          left. */}
                      <div
                        id={panelId}
                        className={`mt-fig-20 lg:mt-[32px] fhd:mt-[43px] grid-cols-1 md:grid-cols-2 gap-x-[30px] lg:gap-x-[30px] fhd:gap-x-[40px] gap-y-fig-14 lg:gap-y-[14px] fhd:gap-y-[19px] ${
                          isExpanded ? 'grid' : 'hidden'
                        }`}
                      >
                        {item.children!.map((child) =>
                          renderLeaf(
                            child,
                            `block group ${focusRing}`,
                            <>
                              <span className="block font-sans font-semibold text-white text-h3 lg:text-[length:24px] fhd:text-[length:32px] lg:leading-[28px] fhd:leading-[37px] group-hover:text-pri-100 transition-colors motion-reduce:transition-none">
                                <RollText durationMs={MS.rollSlow}>{child.label}</RollText>
                              </span>
                              {child.description && (
                                <span className="block mt-fig-6 lg:mt-[6px] fhd:mt-[8px] font-body text-white text-body-md lg:text-[length:14px] fhd:text-[length:19px] lg:leading-[20px] fhd:leading-[27px]">
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
        <div className="shrink-0 flex justify-end gap-fig-2 px-fig-20 py-fig-16 lg:gap-[2px] fhd:gap-[3px] lg:px-[20px] fhd:px-[27px] lg:py-[16px] fhd:py-[21px]">
          {SOCIALS.map(({ label, href }) => {
            const Icon = SOCIAL_ICON[label];
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`h-[38px] w-[38px] lg:h-[38px] fhd:h-[51px] lg:w-[38px] fhd:w-[51px] inline-flex items-center justify-center hover:opacity-80 transition-opacity motion-reduce:transition-none ${focusRing}`}
              >
                <Icon className="h-[38px] w-[38px] lg:h-[38px] fhd:h-[51px] lg:w-[38px] fhd:w-[51px]" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
