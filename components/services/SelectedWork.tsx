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
import type { WorkCard } from '../../content/services/types';
import { ArrowRightIcon, TagChip } from './parts';

/**
 * "Selected Work" — Software 3707:5974, and the cards Figma places to the right
 * of each page (3707:6041 and others).
 *
 * The badge and "View All Brochure" sit on one line, and 64px below them a row
 * of 571x800 cards runs past the right edge of the page. Each card is a 550px
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
 * The pin needs a row wider than the column. Three cards fit a 1792px column,
 * so at 1920 a three-card page shows the plain row (`measureTrack` returns
 * null). Below lg, and with reduced motion, the row is a swipe rail with snap.
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
        <h3 className="line-clamp-2 font-sans text-h2 font-medium text-white lg:text-display-sm">{card.title}</h3>
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

const SelectedWork: React.FC<{ cards: WorkCard[]; label: string }> = ({ cards, label }) => {
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
    <section id="selected-work" className="relative overflow-x-clip bg-surface py-fig-64 lg:py-fig-120">
      <Container>
        <Reveal as="div" stagger={STAGGER.base} className="flex items-center justify-between gap-fig-16">
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <SectionBadge as="h2" size="sm">
              Selected Work
            </SectionBadge>
          </RevealChild>
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <Button
              to={ROUTES.services}
              variant="tertiary"
              size="lg"
              className="px-fig-8 lg:px-fig-24 lg:text-btn-lg"
              icon={<ArrowRightIcon />}
            >
              View All Brochure
            </Button>
          </RevealChild>
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
              <motion.div
                ref={railRef}
                {...(pinned ? pinnedDrag : {})}
                className={
                  pinned
                    ? `${RAIL} touch-pan-y select-none will-change-transform ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`
                    : `${RAIL} menu-scroll snap-x snap-mandatory overflow-x-auto pb-fig-16 scroll-pl-fig-16 lg:scroll-pl-fig-24 3xl:scroll-pl-fig-64`
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
                      viewport={{ once: true, amount: 0.3 }}
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
