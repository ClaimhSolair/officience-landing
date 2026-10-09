import React, { useRef } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { srcSetOf } from '../../assets';
import { EASE, MOTION, PINNED_H, PIN_FOLLOW, SEC, STAGGER, STICKY_TOP, useMinWidth, useMotionEnabled } from '../../lib/motion';
import { useCardEntrance, usePinnedTrack, useTrackDrag } from '../../lib/pinnedTrack';
import { ROUTES } from '../navigation';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import StarMark from '../ui/StarMark';
import type { WorkCard } from '../../content/services/types';
import { ArrowRightIcon, TagChip } from './parts';

/**
 * "Selected Work" — Software 3707:5974, and the cards Figma places to the right
 * of each page (3707:6041 and others).
 *
 * Figma puts the badge and "View All Brochure" on one line. Here the badge is
 * alone, and "View All Brochure" is a blue end card after the work cards, as on
 * Proven Results (user, 2026-09-30). 64px below the badge a row of 571x800 cards
 * runs past the right edge of the page. Each card is a 550px
 * picture over a 250px Primary panel with two chips and a Display-sm title,
 * with a 12px radius and Shadow-sm.
 *
 * **Motion (user, 2026-09-29): the Proven Results animation, plus drag.** From
 * lg with motion on, the row pins under the header and the page's vertical
 * scroll moves it sideways. It runs on `lib/pinnedTrack.ts`, as Our Journey
 * does: the first card holds, the row scrubs, the last card dwells, a card from
 * past the right edge fades and lifts in, and the row scales down to fit the
 * frame. A drag on the pinned row moves the page scroll. Only the row pins, not
 * the header line.
 *
 * The pin needs a row wider than the column. Without the end card, three cards
 * scaled to a 730px-high window fit a 1536px column, and the page did not pin.
 * With it, every deck has at least four cards and pins at every desktop size.
 * Below lg, and with reduced motion, the row is a swipe rail with snap.
 *
 * Figma cuts one AI Insurance title with an ellipsis. The title is built in
 * full and clamped to two lines, and the slip is flagged.
 */

/**
 * A card's box, in both modes. Figma's own numbers (3 x 571 + 2 x 40) are 1px
 * wider than the 1792px column, so at 3xl a card is 570 wide and three cards fit.
 */
const CARD =
  'flex w-[280px] shrink-0 flex-col overflow-hidden rounded-fig-l bg-bg-primary shadow-fig-sm sm:w-[360px] lg:h-[800px] lg:w-[571px] 3xl:w-[570px]';

/** The shortest travel, in screen px, that is worth a pin (a quarter of a card). */
const MIN_TRAVEL = 140;

/** The rail's gutters and gap, in both modes (the Container gutters). */
const RAIL = 'flex gap-fig-16 px-fig-16 lg:gap-fig-40 lg:px-fig-24 3xl:px-fig-64';

const CardBody: React.FC<{ card: WorkCard; opacity?: MotionValue<number> }> = ({ card, opacity }) => {
  const img = card.image;
  const widest = img.sources[img.sources.length - 1];
  const imgProps = {
    src: widest.url,
    srcSet: srcSetOf(img.sources),
    sizes: '(min-width: 1024px) 571px, 360px',
    alt: img.alt,
    className: 'absolute inset-0 h-full w-full object-cover',
    loading: 'lazy' as const,
    decoding: 'async' as const,
    draggable: false,
  };
  return (
    <>
      <div className="relative w-full shrink-0" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
        {opacity ? <motion.img {...imgProps} style={{ opacity }} /> : <img {...imgProps} />}
      </div>
      <div className="flex flex-1 flex-col gap-fig-12 p-fig-24 lg:gap-fig-16 lg:p-fig-40">
        <ul className="flex flex-wrap gap-fig-8 lg:gap-fig-12" aria-label="Services">
          {card.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </ul>
        {/* Three lines below md: at 232px two titles need three lines, and the
            two-line clamp cut them. From md every title fits in two. */}
        <h3 className="line-clamp-3 font-sans text-h2 font-medium text-white md:line-clamp-2 lg:text-display-sm">{card.title}</h3>
      </div>
    </>
  );
};

/**
 * A card on the pinned row. Its arrival is a function of the row's own
 * progress, and a card already on screen when the pin engages shows settled.
 * This is its own component, so a card never changes between MotionValue
 * styles and the unpinned entrance.
 */
const PinnedCard: React.FC<{
  card: WorkCard;
  progress: MotionValue<number>;
  win: [number, number] | null | undefined;
}> = ({ card, progress, win }) => {
  const { imgOpacity, cardY } = useCardEntrance(progress, win);
  if (!win) {
    return (
      <motion.article className={CARD}>
        <CardBody card={card} />
      </motion.article>
    );
  }
  return (
    <motion.article className={CARD} style={{ y: cardY }}>
      <CardBody card={card} opacity={imgOpacity} />
    </motion.article>
  );
};

/**
 * The deck's end card, as Proven Results has one (user, 2026-09-30). Figma
 * draws no such card: it puts "View All Brochure" in the header line. The card
 * makes the deck one card wider, so a three-card deck (Software, Crunch, IT Ops)
 * also overflows the column and pins, at 1280x720 and 1536x730 too.
 */
const VIEW_ALL = 'justify-between px-fig-24 py-fig-32 lg:px-fig-40 lg:py-fig-40';

/** Where the end card goes. The service pages go to the hub. */
interface ViewAllLink {
  label: string;
  to: string;
}

const BROCHURE: ViewAllLink = { label: 'View All Brochure', to: ROUTES.services };

const ViewAllBody: React.FC<{ link: ViewAllLink }> = ({ link }) => (
  <>
    <StarMark className="h-[56px] w-[56px] rotate-[91deg] lg:h-[100px] lg:w-[100px]" />
    <Button
      to={link.to}
      variant="secondary"
      size="lg"
      onDark
      className="w-full border-transparent shadow-fig-xs lg:text-btn-lg"
      icon={<ArrowRightIcon />}
    >
      {link.label}
    </Button>
  </>
);

/** The end card on the pinned row. It enters as the other cards do. */
const PinnedViewAll: React.FC<{
  progress: MotionValue<number>;
  win: [number, number] | null | undefined;
  link: ViewAllLink;
}> = ({ progress, win, link }) => {
  const { cardY } = useCardEntrance(progress, win);
  return win ? (
    <motion.article className={`${CARD} ${VIEW_ALL}`} style={{ y: cardY }}>
      <ViewAllBody link={link} />
    </motion.article>
  ) : (
    <motion.article className={`${CARD} ${VIEW_ALL}`}>
      <ViewAllBody link={link} />
    </motion.article>
  );
};

interface SelectedWorkProps {
  cards: WorkCard[];
  label: string;
  /** The section id, which is also the `section_view` key. */
  id?: string;
  /**
   * A Display-md heading in place of the "Selected Work" badge. A case study
   * draws "Discover Other Works" (3818:8794).
   */
  heading?: string;
  /** The end card's link. A case study goes to the Work listing (ruling 20d). */
  viewAll?: ViewAllLink;
}

const SelectedWork: React.FC<SelectedWorkProps> = ({ cards, label, id = 'selected-work', heading, viewAll = BROCHURE }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.serviceWork;
  const wide = useMinWidth(1024);

  const wantsPin = enabled && wide;
  const { geom, progress, trackX } = usePinnedTrack(wantsPin, { wrapRef, columnRef, trackRef: railRef });
  // Local, so that TypeScript narrows `geom` wherever `pinned` is true. A row
  // that travels less than MIN_TRAVEL does not pin: a very short scrub would
  // still add the full dwell, and the reader would scroll through a still row.
  const pinned = wantsPin && geom !== null && geom.travel >= MIN_TRAVEL;
  const { dragging, handlers: pinnedDrag } = useTrackDrag(pinned ? geom : null, wrapRef);

  return (
    // `overflow-x-clip`, not `overflow-hidden`: a hidden overflow makes the
    // section a scroll container, and the pinned frame would then stick to the
    // section instead of the viewport.
    <section id={id} className="relative overflow-x-clip bg-surface py-fig-64 lg:py-fig-120">
      <Container>
        {/* "View All Brochure" is the deck's end card now, so the header keeps
            only the badge (user, 2026-09-30), or the heading of a case study. */}
        <Reveal as="div" stagger={STAGGER.base} className="flex items-center">
          {heading ? (
            <RevealChild as="span" y={28}>
              <h2 className="font-sans text-h1 font-medium text-text-primary lg:text-display-md">{heading}</h2>
            </RevealChild>
          ) : (
            <RevealChild as="span" y={20} duration={SEC.revealFast}>
              <SectionBadge as="h2" size="sm">
                Selected Work
              </SectionBadge>
            </RevealChild>
          )}
        </Reveal>
      </Container>

      {/* The row bleeds past the column on purpose — Figma draws it wider than
          the page and clips it. Pinned, the wrapper takes the runway's height
          and the frame inside it sticks under the header. */}
      <div ref={wrapRef} className="relative mt-fig-32 lg:mt-fig-64" style={pinned ? { height: geom.height } : undefined}>
        <div
          className={
            pinned ? `sticky ${STICKY_TOP} ${PIN_FOLLOW} flex ${PINNED_H} flex-col justify-center overflow-clip` : ''
          }
        >
          <div ref={columnRef} className={wantsPin ? 'py-fig-16' : ''}>
            {/* Pinned, this reserves the scaled row's height, so the scale
                shrinks the column's layout and not merely its paint. */}
            <div style={pinned ? { height: geom.trackH } : undefined}>
              {/* The swipe rail scrolls on x only. A card past the right edge
                  waits for its entrance at y 28px, and without `overflow-y-hidden`
                  that offset gives the rail a vertical scrollbar. */}
              <motion.div
                ref={railRef}
                {...(pinned ? pinnedDrag : {})}
                className={
                  pinned
                    ? `${RAIL} touch-pan-y select-none will-change-transform ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`
                    : `${RAIL} menu-scroll snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-fig-16 scroll-pl-fig-16 lg:scroll-pl-fig-24 3xl:scroll-pl-fig-64`
                }
                style={pinned ? { x: trackX, scale: geom.scale, transformOrigin: '0% 0%' } : undefined}
                tabIndex={pinned ? undefined : 0}
                role="group"
                aria-label={label}
              >
                {cards.map((card, index) =>
                  pinned ? (
                    <PinnedCard key={`p-${card.title}`} card={card} progress={progress} win={geom.windows[index]} />
                  ) : (
                    <motion.article
                      key={`r-${card.title}`}
                      className={`${CARD} snap-start`}
                      initial={enabled ? { y: 28, opacity: 0 } : { opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      // Any visible pixel starts the entrance. The rail shows only
                      // a narrow edge of the next card (78 of 280px at 390), and
                      // that edge is the sign that the rail scrolls.
                      viewport={{ once: true, amount: 'some' }}
                      transition={{
                        y: enabled
                          ? { duration: SEC.revealFast, ease: EASE.reveal, delay: Math.min(index, 3) * STAGGER.base }
                          : { duration: 0 },
                        opacity: {
                          duration: SEC.revealFast,
                          ease: EASE.reveal,
                          delay: enabled ? Math.min(index, 3) * STAGGER.base : 0,
                        },
                      }}
                    >
                      <CardBody card={card} />
                    </motion.article>
                  ),
                )}
                {pinned ? (
                  <PinnedViewAll key="p-view-all" progress={progress} win={geom.windows[cards.length]} link={viewAll} />
                ) : (
                  <motion.article
                    key="r-view-all"
                    className={`${CARD} ${VIEW_ALL} snap-start`}
                    initial={enabled ? { y: 28, opacity: 0 } : { opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 'some' }}
                    transition={{
                      y: enabled
                        ? { duration: SEC.revealFast, ease: EASE.reveal, delay: Math.min(cards.length, 3) * STAGGER.base }
                        : { duration: 0 },
                      opacity: {
                        duration: SEC.revealFast,
                        ease: EASE.reveal,
                        delay: enabled ? Math.min(cards.length, 3) * STAGGER.base : 0,
                      },
                    }}
                  >
                    <ViewAllBody link={viewAll} />
                  </motion.article>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
