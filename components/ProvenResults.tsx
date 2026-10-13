import React, { useRef } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ASSETS, srcSetOf, type ImageSource } from '../assets';
import Container from './ui/Container';
import Button from './ui/Button';
import SectionBadge from './ui/SectionBadge';
import StarMark from './ui/StarMark';
import CarouselDots from './ui/CarouselDots';
import Reveal, { RevealChild } from './ui/Reveal';
import { EASE, MOTION, PINNED_H, PIN_FOLLOW, SEC, STAGGER, STICKY_TOP, useMinWidth, useMotionEnabled } from '../lib/motion';
import { useCardEntrance, usePinnedTrack } from '../lib/pinnedTrack';
import { ROUTES, VIEW_ALL_WORK } from './navigation';

/**
 * Figma 3137:2069 (1920), 2943:1579 (1440, the only frame holding the View All
 * card) and 3137:2448 (390).
 *
 * The three frames disagree — 1920 draws a static row of three, 1440 draws one
 * project beside the View All card, 390 draws a three-card track under four
 * dots. Contract settled with the user 2026-08-24: **five slides — four
 * projects then the View All card — as a carousel with arrows.**
 *
 * One card width and one gap produce all three artboards' behaviour, because
 * the number visible is just what the gutters leave room for: three at 1920
 * (570 x 3 + 40 x 2 = 1790 of 1792, so no peek, as drawn), two plus a peek at
 * 1440, one plus a 112px peek at 390 — which is exactly what the mobile frame
 * shows. The track is padded rather than wrapped in `Container` so the peek can
 * run to the viewport edge instead of being clipped at the content column.
 *
 * Figma draws no arrow control at any width, so the pair below the track is
 * invention, built from the button system and flagged.
 *
 * **Motion (item 10, nava-studio).** From lg the section pins and vertical
 * scrolling drives the track sideways. The deck holds still until the first card
 * is fully read, then rolls; a card entering from beyond the right edge fades and
 * lifts into place, and the cards already on screen are shown settled. No zoom —
 * the review removed it. The arrows go with the pin: Figma never drew them, so
 * retiring them at that width returns the section to what the artboards show.
 * Below lg the swipe rail and its controls are exactly as shipped.
 *
 * **Exactly three cards (user decision 2026-10-14, adapter 25a).** From lg the
 * cards are sized by WIDTH: three cards and two gaps fill the content column, as
 * frame 3137:2069 draws them (3 x 586.67 + 2 x 40 = 1840 at 1920). The height
 * follows the frame's 586.67:800 aspect. Only the card row pins. The heading
 * scrolls away above it, so the row has the full window height. If the row is
 * still too tall for the window, `measureTrack` scales it down, and three cards
 * still show. This replaces the 2026-09-18 "fit wins" ruling (height-sized cards,
 * the 751px cap), which showed 3.3 to 5 cards on common laptops.
 */

interface Project {
  name: string;
  tags: [string, string];
  image: ImageSource[];
  alt: string;
}

const PROJECTS: Project[] = [
  {
    name: 'IOGA',
    tags: ['Software Development', 'E-Learning'],
    image: ASSETS.works.ioga,
    alt: 'Presenter filming a piece to camera on a phone rig',
  },
  {
    name: 'C.M.P',
    tags: ['E-commerce', 'Pricing Automation'],
    image: ASSETS.works.cmp,
    alt: 'Laptop showing the Gestion Métal & Négoce interface',
  },
  {
    name: 'LAB',
    tags: ['AI Lab Space', 'Data Engine'],
    image: ASSETS.works.lab,
    alt: 'Analytics dashboard with workload charts',
  },
  {
    name: 'FunPass',
    tags: ['Operation Support', 'Data Collection'],
    image: ASSETS.works.funpass,
    alt: 'Hands holding a tablet with a rising performance chart',
  },
];

const VIEW_ALL_BLURB =
  'Providing bespoke web development services that optimize user experience, elevate brand visibility, and drive measurable business results.';

/**
 * Card sizing:
 *  - 390: one fixed 240x314 card, one peek. No change.
 *  - md (tablet, no pin): three cards share the track on a 48px gap.
 *  - lg and up: three cards and two gaps fill the track, `--card-w` below. The
 *    height comes from the frame's 586.67:800 aspect, `--card-h`.
 * `--card-w` uses `100vw`, which equals the page width because the site hides
 * its scrollbars. Above 1920 the track stops at 1920, so the cards stay at the
 * frame's 586.67 x 800.
 */
const CARD = 'w-[240px] shrink-0 md:w-[calc((100%_-_2*var(--pr-gap))/3)] lg:w-[var(--card-w)]';
/** Project and View All cards share the frame's 586.67:800 footprint. */
const CARD_H = 'h-[314px] md:h-auto md:aspect-[586.67/800] lg:aspect-auto lg:h-[var(--card-h)]';

/**
 * The section gutter (D6, user 2026-10-13), in steps: 16 below lg, 24 from lg
 * (2943:1579 at 1440), 40 from fhd (3137:2069 at 1920). Above 1920 the header
 * stops at 1840px and the track at 1920px, so both edges stay in line. The card
 * gap is 48 below fhd (2943:1579) and 40 from fhd (3137:2069).
 */
const PR_MAX = 'max-w-[1840px]';
const PR_GUTTER =
  '[--pr-gutter:16px] [--pr-gap:22px] md:[--pr-gap:48px] lg:[--pr-gutter:24px] fhd:[--pr-gutter:40px] fhd:[--pr-gap:40px]';
/** The card box from lg, set on the section so the heading can read it too. */
const PR_CARD_VARS =
  'lg:[--card-w:calc((min(100vw,1920px)_-_2*var(--pr-gutter)_-_2*var(--pr-gap))/3)] lg:[--card-h:calc(var(--card-w)*800/586.67)]';

/**
 * The pale chips over the blue caption. The card is narrower than the frame below
 * fhd (293px at 1024, 432px at 1440), so the chip type steps down with it:
 * 12/16 from lg, 14/20 from xl, and the frame's Button-lg 16/24 from fhd.
 */
const TAG_STEPS =
  'lg:rounded-fig-xs lg:px-fig-6 lg:py-fig-4 lg:font-sans lg:text-[12px] lg:leading-[16px] xl:px-fig-8 xl:py-fig-6 xl:text-[14px] xl:leading-[20px] fhd:p-fig-8 fhd:text-btn-lg';
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className={`shrink-0 rounded-[2px] bg-pri-50 px-fig-4 py-fig-2 font-body text-[10px] font-semibold leading-[16px] text-text-primary ${TAG_STEPS}`}
  >
    {children}
  </span>
);

/**
 * The pin itself (measurement, scale-to-fit, hold, dwell and the per-card
 * windows) is in `lib/pinnedTrack.ts`, which Our Journey on the About Us page
 * also uses (2026-09-24). This file keeps the deck's own layout and cards.
 */

/**
 * A work card. Pinned, its arrival is a function of the deck's own progress —
 * observers are no use inside a track that is being translated sideways, since
 * the card's box never crosses the viewport vertically. Unpinned, it keeps the
 * timed entrance the section shipped with.
 *
 * No zoom: the review removed nava's zoom-settle outright, so a card only fades
 * and lifts into place and its crop never changes. Recorded in the catalog as a
 * user override of the measured reference law.
 */
const WorkCard: React.FC<{
  className: string;
  media: { src: string; srcSet: string; alt: string };
  progress: MotionValue<number>;
  window?: [number, number] | null;
  pinned: boolean;
  children: React.ReactNode;
}> = ({ className, media, progress, window: win, pinned, children }) => {
  // Fade and lift only — no scale (lib/pinnedTrack.ts).
  const { imgOpacity, cardY } = useCardEntrance(progress, win);

  // The image is 550 of the frame's 800-tall card (3137:2069). From md the
  // caption takes its own height (at least 250/800 of the card from lg) and the
  // image takes the rest, so a narrow card with wrapped chips loses image, not
  // caption. At 768 the card is 213px wide and the chips wrap to two lines. The
  // box clips the image, so the hover zoom stays inside it.
  const boxCls = 'h-[220px] w-full shrink-0 overflow-hidden md:h-auto md:min-h-0 md:flex-1';
  // Hover zoom (tracker row 12, as the elytetemplate reference does). It is a
  // hover state, not a scroll effect, so the "no zoom" rule above still holds
  // for the arrival. Reduced motion keeps the image still.
  const imgCls =
    'h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100';
  const imgProps = {
    ...media,
    sizes: '(min-width: 1024px) 680px, (min-width: 768px) 320px, 240px',
    loading: 'lazy' as const,
    decoding: 'async' as const,
    referrerPolicy: 'no-referrer' as const,
  };

  if (pinned) {
    // On screen when the pin engages (null window): shown settled, so the deck
    // never opens on a row of dimmed, half-arrived cards.
    if (!win) {
      return (
        <motion.article className={`group ${className}`}>
          <div className={boxCls}>
            <img {...imgProps} className={imgCls} />
          </div>
          {children}
        </motion.article>
      );
    }
    return (
      <motion.article className={`group ${className}`} style={{ y: cardY }}>
        <div className={boxCls}>
          <motion.img {...imgProps} className={imgCls} style={{ opacity: imgOpacity }} />
        </div>
        {children}
      </motion.article>
    );
  }

  return (
    <Reveal as="article" className={`group ${className}`} enabled={MOTION.work} y={60}>
      <div className={boxCls}>
        {MOTION.work ? (
          <motion.img
            {...imgProps}
            className={imgCls}
            initial={{ opacity: 0.1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: SEC.revealBase, ease: [...EASE.reveal] }}
          />
        ) : (
          <img {...imgProps} className={imgCls} />
        )}
      </div>
      {children}
    </Reveal>
  );
};

const ProvenResults: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);

  const wantsPin = motionOn && wide && MOTION.work;
  // Only the card row pins. The heading scrolls away above it, so it is not
  // chrome. The header bar hides on a scroll down, so the fit check leaves it out.
  const { geom, progress, trackX } = usePinnedTrack(wantsPin, {
    wrapRef,
    columnRef,
    trackRef,
    ignoreHeader: true,
  });
  // Local, so that TypeScript narrows `geom` wherever `pinned` is true.
  const pinned = wantsPin && geom !== null;

  const cardBase = `${CARD} ${CARD_H} overflow-hidden rounded-fig-xs bg-bg-primary md:flex md:flex-col lg:rounded-fig-m`;
  const cardCls = pinned ? cardBase : `${cardBase} snap-start`;

  return (
    /* The seam to Our Approach is 120px, which the user set on 2026-09-10. The
       two pinned sections' own paddings give 40px, so the balance sits here.
       The unpinned branch already runs 100 + 120 and needs nothing. */
    <section
      id="proven-results"
      className={`bg-bg-secondary ${PR_GUTTER} ${PR_CARD_VARS} ${wantsPin ? 'lg:pt-[80px]' : ''}`}
    >
      {/* The heading is outside the pinned column, so it scrolls away and the
          card row gets the full window height. Not `Container`: this section
          uses a 40px gutter at 1920 (3137:2069, 3151:2815) and 24 at 1440
          (2943:1579). See PR_GUTTER. */}
      <div className={`w-full px-[var(--pr-gutter)] pt-fig-32 ${wantsPin ? 'lg:pt-fig-16' : 'lg:pt-fig-120'}`}>
        {/* 100px from the title to the cards (3137:2069). When pinned, the row is
            centred in a frame of the window height, so the frame already puts
            (100vh - card) / 2 above the row. The margin takes that off, so the
            gap is 100px when the pin starts. It is negative on a tall window: the
            empty top of the frame then lies over the heading. */}
        <div
          className={`mx-auto w-full ${PR_MAX} mb-fig-24 flex flex-col gap-fig-8 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32 ${
            pinned ? 'lg:mb-[calc(100px_-_(100vh_-_var(--card-h))/2)]' : 'lg:mb-fig-100'
          }`}
        >
              <Reveal as="div" stagger={STAGGER.base} className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
                <RevealChild as="span" y={20} duration={SEC.revealFast}>
                  <SectionBadge>Proof Of Work</SectionBadge>
                </RevealChild>
                <RevealChild as="span" y={28}>
                  <h2 className="font-sans text-h1 text-text-default lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
                    Proven Results
                  </h2>
                </RevealChild>
              </Reveal>

              {/* The 390 frame has no blurb at all — not different wording, none.
                  Hidden rather than dropped, so restoring it is one class. */}
              <Reveal
                as="p"
                y={20}
                duration={SEC.revealFast}
                className="hidden font-body text-subtitle lg:block lg:w-[600px] lg:min-w-0 lg:text-subtitle-1"
              >
                Crafting solutions for global innovators. See our latest chapters.
              </Reveal>
        </div>
      </div>

      <div ref={wrapRef} className="relative" style={pinned ? { height: geom.height } : undefined}>
        <div
          className={
            pinned
              ? `sticky ${STICKY_TOP} ${PIN_FOLLOW} flex ${PINNED_H} flex-col justify-center overflow-x-clip`
              : ''
          }
        >
          {/* No vertical padding while pinned: the row is centred in the frame,
              and the whole window height is for the cards. */}
          <div ref={columnRef} className={`flex flex-col pb-fig-32 ${wantsPin ? 'lg:pb-0' : 'lg:pb-fig-120'}`}>
            {/* Full-bleed to 1920 so the padding lands on the same gutter as the
                heading above. When pinned it reserves the scaled deck's height,
                so scaling the track shrinks the column's layout and not merely
                its paint. */}
            <div
              ref={deckRef}
              className="mx-auto w-full max-w-[1920px]"
              style={pinned ? { height: geom.trackH } : undefined}
            >
              <motion.div
                ref={trackRef}
                tabIndex={pinned ? undefined : 0}
                role="group"
                aria-label="Project highlights"
                /* `scroll-padding` has to mirror `padding`, or mandatory snapping
                   aligns the first card to the scrollport edge and eats the gutter —
                   the deck ends up a full gutter left of the heading. Scrollbars are
                   killed globally in index.html, so the track needs no opt-out.
                   The gutter and the gap come from the section (PR_GUTTER). */
                className={`flex items-start gap-[var(--pr-gap)] px-[var(--pr-gutter)] ${
                  pinned
                    ? 'will-change-transform'
                    : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-pl-[var(--pr-gutter)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                }`}
                /* The pinned scale turns on the first card's left edge, not on the
                   track's edge. With '0% 0%' the scale also shrank the gutter, so the
                   deck started 3.7px left of the heading at 1920x1080. `measureTrack`
                   already measures from the first card. */
                style={
                  pinned
                    ? { x: trackX, scale: geom.scale, transformOrigin: 'var(--pr-gutter) 0px' }
                    : undefined
                }
              >
                {PROJECTS.map((project, i) => (
                  <WorkCard
                    key={project.name}
                    className={cardCls}
                    progress={progress}
                    window={geom?.windows[i]}
                    pinned={pinned}
                    media={{
                      src: project.image[project.image.length - 1].url,
                      srcSet: srcSetOf(project.image),
                      alt: project.alt,
                    }}
                  >
                    {/* From lg the caption is top-aligned, as 2943:1739 and 3151:2833 draw:
                        48 above the tags at an 800 card, 14 between tags and title. The
                        48 scales with the card height. The caption is at least 250/800
                        of the card; on a narrow card it grows and the image gives way.
                        The padding and the title step down below fhd with the card. */}
                    <div className="flex flex-1 flex-col justify-center gap-fig-6 px-fig-16 py-fig-20 md:flex-none lg:min-h-[calc(var(--card-h)*250/800)] lg:justify-start lg:gap-fig-8 lg:px-fig-20 lg:pb-fig-20 lg:pt-[calc(var(--card-h)*48/800)] xl:gap-fig-12 xl:px-fig-32 fhd:gap-fig-14 fhd:px-fig-40 fhd:pb-0">
                      <div className="flex flex-wrap items-center gap-[5px] lg:gap-fig-8 fhd:gap-fig-12">
                        {project.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                      <h3 className="font-sans font-semibold text-[24px] leading-[32px] text-white lg:font-medium lg:text-[28px] lg:leading-[36px] xl:text-[40px] xl:leading-[48px] fhd:text-display-sm">
                        {project.name}
                      </h3>
                    </div>
                  </WorkCard>
                ))}

                {/* The deck's last slide. Only the 1440 frame draws it, and only at
                    desktop size — the 390 treatment is scaled from it. */}
                {/* The type and the star step down below fhd with the card width:
                    the card is 293px at 1024 and 432px at 1440. */}
                <article
                  className={`${CARD} ${CARD_H} flex flex-col justify-between overflow-hidden rounded-fig-xs bg-bg-primary px-fig-16 py-fig-20 lg:rounded-fig-m lg:px-fig-20 lg:py-fig-24 fhd:px-fig-24 fhd:py-fig-32 ${
                    pinned ? '' : 'snap-start'
                  }`}
                >
                  {/* 2943:1747 and 3151:2841 draw this row 522.83 wide, not 532, so the
                      pill ends 33 from the card edge. The star box sits 2.6px lower than
                      a top-aligned 100px box gives. */}
                  <div className="flex items-start justify-between fhd:pr-[9.17px]">
                    <StarMark className="h-[56px] w-[56px] rotate-[91deg] xl:h-[72px] xl:w-[72px] fhd:mt-[2.6px] fhd:h-[100px] fhd:w-[100px]" />
                    <span className={`shrink-0 rounded-[2px] bg-pri-50 px-fig-4 py-fig-2 font-body text-[10px] font-semibold leading-[16px] text-text-primary ${TAG_STEPS} fhd:px-[10px]`}>
                      10+ Works
                    </span>
                  </div>

                  {/* The drawn block is 524 wide (2943:1752), so the blurb and the button
                      start 62 from the card edge, not 66. */}
                  <div className="flex flex-col items-center gap-fig-12 lg:gap-fig-16 xl:gap-fig-20 fhd:gap-fig-28 fhd:pr-fig-8">
                    <p className="font-body text-[12px] leading-[20px] text-white lg:max-w-[448px] lg:text-[14px] lg:leading-[22px] xl:text-[18px] xl:leading-[28px] fhd:text-subtitle-1">
                      {VIEW_ALL_BLURB}
                    </p>
                    <Button
                      to={VIEW_ALL_WORK.target.kind === 'route' ? VIEW_ALL_WORK.target.to : ROUTES.work}
                      variant="secondary"
                      size="lg"
                      onDark
                      className="w-full border-transparent shadow-fig-xs lg:max-w-[448px] lg:gap-fig-14 lg:text-btn-lg"
                      icon={
                        <ArrowUpRight className="h-[20px] w-[20px] shrink-0 lg:h-[24px] lg:w-[24px]" strokeWidth={2} aria-hidden="true" />
                      }
                    >
                      {VIEW_ALL_WORK.label}
                    </Button>
                  </div>
                </article>
              </motion.div>
            </div>

            {/* Dots at 390, which is what that artboard draws. No arrows at any
                width: Figma draws none, and the pair that used to sit here was
                this build's own invention. The desktop track is still scrollable
                by wheel, drag and keyboard. */}
            <Container className={`mt-fig-24 lg:hidden`}>
              <CarouselDots
                containerRef={trackRef}
                count={PROJECTS.length + 1}
                variant="dot"
              />
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvenResults;
