import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import {
  EASE,
  MOTION,
  PINNED_H,
  PIN_FOLLOW,
  SEC,
  SPRING,
  STAGGER,
  STICKY_TOP,
  useMinWidth,
  useMotionEnabled,
} from '../../lib/motion';
import { useCardEntrance, usePinnedTrack, useTrackDrag } from '../../lib/pinnedTrack';

/**
 * Our Journey — Figma 3133:4460, with its scroll states in 3070:1902,
 * 3070:2037 and 3070:2157.
 *
 * The four frames are four positions of one track, not four sections: 2012,
 * 2016 and 2026 each appear in two of them. Ten events therefore make one
 * horizontal rail — 361px cards on a 100px gutter.
 *
 * **The images share one band.** Every card in every frame draws its picture at
 * the same y (698..960 inside the section), and only the text moves: above the
 * band on half the cards, below it on the other half. That is what makes the
 * row read as a timeline, so the band is pinned and the text alternates around
 * it, rather than each card being placed at a bespoke offset.
 *
 * **Motion (user, 2026-09-24): the Proven Results animation, plus drag.** From
 * lg with motion on, the rail pins under the header and the page's vertical
 * scroll moves it sideways. It uses the same code as Proven Results
 * (`lib/pinnedTrack.ts`): the first card holds, the track scrubs, the last card
 * dwells, a card from past the right edge fades and lifts in, and the rail
 * scales down if it does not fit the frame. A drag on the pinned rail moves the
 * page scroll, so the rail follows the pointer and the pin stays in step. The
 * arrows go while the rail is pinned, as they do on Proven Results.
 *
 * Only the rail pins, not the heading. The heading is three lines of 50px type,
 * and pinned with the 100px gap and the rail it would scale the cards far down
 * on a laptop screen. So the heading scrolls away in the normal flow above the
 * pin. Below lg, and with reduced motion, the rail is the swipe rail: snap,
 * mouse drag and arrows.
 *
 * Figma draws no arrows and no scrollbar — it just clips a track wider than the
 * artboard. The rail, its drag, and its arrows are this build's own.
 */

interface JourneyEvent {
  year: string;
  /** The part of the title Figma sets at 24px rather than 36px. */
  title: string;
  body: string;
  /** True when the picture comes first and the text sits under the band. */
  imageFirst: boolean;
  images: { src: string; alt: string }[];
  /**
   * 2011 is drawn with its whole title at 36px, where every other event splits
   * the year from the name. Reproduced, and flagged for the team.
   */
  oneSizeTitle?: boolean;
}

const EVENTS: JourneyEvent[] = [
  {
    year: '2006',
    title: 'Where It All Began',
    body: 'Founded in February 2006 (Ho Chi Minh City) with two founders and three staff.',
    imageFirst: false,
    images: [{ src: ASSETS.aboutPage.journey.y2006, alt: 'The founding team meeting in Ho Chi Minh City in 2006.' }],
  },
  {
    year: '2010',
    title: 'First Stop, Singapore',
    body: 'Our first step beyond Vietnam — a representative office in Southeast Asia.',
    imageFirst: true,
    images: [{ src: ASSETS.aboutPage.journey.y2010, alt: 'The Singapore office building.' }],
  },
  {
    year: '2011',
    title: 'Crunch Is Born',
    body: 'Our dedicated data powerhouse is born — based in Ho Chi Minh City.',
    imageFirst: false,
    oneSizeTitle: true,
    images: [{ src: ASSETS.aboutPage.journey.y2011, alt: 'The Crunch data team at work in Ho Chi Minh City.' }],
  },
  {
    year: '2012',
    title: 'Bonjour, Paris',
    body: 'The France-Vietnam bridge gets a home in Paris — Officaire.',
    imageFirst: true,
    images: [{ src: ASSETS.aboutPage.journey.y2012, alt: 'The Officaire team in Paris.' }],
  },
  {
    year: '2013',
    title: 'The TEAL Shift',
    body: 'We let go of the pyramid — and started building on Teal principles.',
    imageFirst: false,
    images: [{ src: ASSETS.aboutPage.journey.y2013, alt: 'A team workshop during the move to Teal ways of working.' }],
  },
  {
    year: '2015',
    title: 'Konnichiwa, Japan',
    body: 'A new office in Tokyo — deepening our roots across Asia.',
    imageFirst: true,
    images: [
      { src: ASSETS.aboutPage.journey.y2015a, alt: 'Colleagues at the Tokyo office.' },
      { src: ASSETS.aboutPage.journey.y2015b, alt: 'The team marking the opening in Japan.' },
    ],
  },
  {
    year: '2016',
    title: 'Hello, America',
    body: 'Officience reaches the other side of the world — A new office in the US',
    imageFirst: false,
    images: [{ src: ASSETS.aboutPage.journey.y2016, alt: 'The United States office.' }],
  },
  {
    year: '2017',
    title: 'Welcome to OffyPlex',
    body: 'A new home in Ho Chi Minh City — Offyplex.',
    imageFirst: true,
    images: [
      { src: ASSETS.aboutPage.journey.y2017a, alt: 'The OffyPlex building in Ho Chi Minh City.' },
      { src: ASSETS.aboutPage.journey.y2017b, alt: 'Inside the OffyPlex workspace.' },
    ],
  },
  {
    year: '2025',
    title: 'A Fresh Chapter',
    body: 'DIY Jam launches. Officience gets a new look. A new era begins.',
    imageFirst: false,
    images: [
      { src: ASSETS.aboutPage.journey.y2025a, alt: 'A DIY Jam session.' },
      { src: ASSETS.aboutPage.journey.y2025b, alt: 'The team at the launch of the new brand.' },
    ],
  },
  {
    year: '2026',
    title: 'Twenty Years. Still Going',
    body: 'Officience proudly celebrates 20 years. Here’s to the next chapter.',
    imageFirst: true,
    images: [{ src: ASSETS.aboutPage.journey.y2026, alt: 'The twentieth anniversary celebration.' }],
  },
];

/** One card's pitch on the rail: 361 of card plus the 100px gutter. */
const STEP_LG = 461;

/**
 * The dashed rule Figma runs down the inside edge of every text block:
 * 1px, #C6C6C6, on a 5/5 dash. A gradient reproduces the dash lengths exactly,
 * where a CSS `dashed` border would use the browser's own rhythm.
 */
const DASH =
  'bg-[repeating-linear-gradient(to_bottom,#C6C6C6_0_5px,transparent_5px_10px)]';

/** A card's box, in both modes. */
const CARD = 'flex w-[280px] shrink-0 flex-col gap-fig-24 sm:w-[320px] lg:w-[361px] lg:gap-0';

/** The rail's gutters and gap, in both modes. */
const RAIL = 'flex gap-fig-40 px-fig-16 lg:gap-[100px] lg:px-fig-24 3xl:px-fig-64';

const EventInfo: React.FC<{ event: JourneyEvent }> = ({ event }) => (
  <div className="relative flex flex-col gap-fig-14 pl-fig-16 lg:w-[345px]">
    {/* The connector, at the text block's leading edge. */}
    <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-px ${DASH}`} />
    <h3 className="font-sans font-medium text-text-primary">
      <span className="text-[28px] leading-[36px] lg:text-[36px] lg:leading-[44px]">{event.year} - </span>
      <span
        className={
          event.oneSizeTitle
            ? 'text-[28px] leading-[36px] lg:text-[36px] lg:leading-[44px]'
            : 'font-semibold text-[20px] leading-[26px] lg:text-[24px] lg:leading-[28px]'
        }
      >
        {event.title}
      </span>
    </h3>
    <p className="font-body text-body-lg text-text-default">{event.body}</p>
  </div>
);

/**
 * The picture box always keeps the artboard's 361:262. A fixed height on a
 * fluid card would make the box aspect follow the card width and re-crop the
 * pictures, whose crops are already baked at that exact ratio. A pair splits the
 * same box, so each half lands on 180:262 — again the ratio it was baked at.
 *
 * `opacity` is the pinned entrance. Without it the pictures are plain images.
 */
const EventImages: React.FC<{ event: JourneyEvent; opacity?: MotionValue<number> }> = ({ event, opacity }) => (
  <div className="flex aspect-[361/262] w-full gap-px">
    {event.images.map((img) =>
      opacity ? (
        <motion.img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="h-full min-w-0 flex-1 rounded-fig-xs object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ opacity }}
        />
      ) : (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="h-full min-w-0 flex-1 rounded-fig-xs object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
    )}
  </div>
);

/**
 * A card's content. One DOM order serves both layouts, rearranged with `order`
 * at lg. Branching into two arrangements would put every picture in the
 * document twice — 26 downloads, and every alt text announced twice.
 */
const EventBody: React.FC<{ event: JourneyEvent; opacity?: MotionValue<number> }> = ({ event, opacity }) => (
  <>
    {/* `flex-1` below lg is what keeps the pictures on one line there. The
        rail stretches every card to the tallest, and each card's copy wraps
        to a different depth, so without it the bands sat up to 52px apart and
        the row stopped reading as a timeline. Growing the text block pushes
        every picture to the card bottom, and equal widths and one ratio align
        their tops too. */}
    <div
      className={
        event.imageFirst
          ? 'flex-1 lg:order-3 lg:mt-fig-40 lg:flex-none'
          : 'flex-1 lg:order-1 lg:flex lg:h-[264px] lg:flex-none lg:items-end'
      }
    >
      <EventInfo event={event} />
    </div>

    {event.imageFirst && <div className="hidden lg:order-1 lg:block lg:h-[304px]" aria-hidden="true" />}

    <div className={event.imageFirst ? 'lg:order-2' : 'lg:order-2 lg:mt-fig-40'}>
      <EventImages event={event} opacity={opacity} />
    </div>
  </>
);

/**
 * A card on the pinned rail. Its arrival is a function of the rail's own
 * progress: an observer is no use inside a track that moves sideways, because
 * the card never crosses the viewport vertically. A card already on screen when
 * the pin engages (no window) is shown settled. This is its own component, so a
 * card never changes between MotionValue styles and the unpinned entrance.
 */
const PinnedEvent: React.FC<{
  event: JourneyEvent;
  progress: MotionValue<number>;
  win: [number, number] | null | undefined;
}> = ({ event, progress, win }) => {
  const { imgOpacity, cardY } = useCardEntrance(progress, win);
  if (!win) {
    return (
      <motion.article className={CARD}>
        <EventBody event={event} />
      </motion.article>
    );
  }
  return (
    <motion.article className={CARD} style={{ y: cardY }}>
      <EventBody event={event} opacity={imgOpacity} />
    </motion.article>
  );
};

const OurJourney: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutJourney;
  const wide = useMinWidth(1024);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // The rail is the track. The heading does not pin, so there is no header ref.
  const wantsPin = enabled && wide;
  const { geom, progress, trackX } = usePinnedTrack(wantsPin, { wrapRef, columnRef, trackRef: railRef });
  // Local, so that TypeScript narrows `geom` wherever `pinned` is true.
  const pinned = wantsPin && geom !== null;
  const { dragging, handlers: pinnedDrag } = useTrackDrag(pinned ? geom : null, wrapRef);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const watermarkRotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = railRef.current;
    if (!el) return;
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges]);

  /**
   * Drag with a mouse, on the swipe rail. Touch and trackpads already scroll the
   * rail natively; a mouse has no gesture for a horizontal overflow, so it gets
   * one here. Pointer capture keeps the drag alive when the cursor leaves the
   * rail. The pinned rail uses `useTrackDrag` instead.
   */
  const drag = useRef<{ x: number; left: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = railRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!drag.current || !el) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!drag.current || !el) return;
    drag.current = null;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  const step = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const amount = Math.min(STEP_LG, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: reduced ? 'auto' : 'smooth' });
  };

  // The watermark belongs to the section, not the track: all four Figma frames
  // draw it in the same place while the cards move past it. While the rail is
  // pinned it sits in the pinned frame, so it stays in view.
  const watermark = enabled ? (
    <motion.img
      src={ASSETS.aboutPage.journeyWatermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[869px] w-[869px] max-w-none select-none lg:block"
      loading="lazy"
      decoding="async"
      style={{ marginLeft: -434.5, marginTop: -434.5, y: watermarkY, rotate: watermarkRotate }}
    />
  ) : (
    <img
      src={ASSETS.aboutPage.journeyWatermark}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[869px] w-[869px] max-w-none -translate-x-1/2 -translate-y-1/2 select-none lg:block"
      loading="lazy"
      decoding="async"
    />
  );

  return (
    // `overflow-x-clip`, not `overflow-hidden`: a hidden overflow makes the
    // section a scroll container, and the pinned frame would then stick to the
    // section instead of the viewport.
    <section ref={sectionRef} id="our-journey" className="relative isolate overflow-x-clip bg-background py-fig-64 lg:py-fig-120">
      {!pinned && watermark}

      <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
        <Reveal className="flex flex-col gap-fig-24 lg:flex-row lg:justify-between lg:gap-fig-32">
          <RevealChild y={24} duration={SEC.revealFast} className="lg:shrink-0">
            <SectionBadge as="h2">Our Journey</SectionBadge>
          </RevealChild>
          {/* 801 of the artboard's 1392 column, flush right. The second clause
              is set in Text/Subtitle-2 grey, which is drawn, not emphasis. */}
          <RevealChild y={24} duration={SEC.revealFast} className="lg:w-[801px] lg:shrink-0">
            <p className="font-sans font-medium text-h2 text-text-default lg:text-display-sm">
              Take a walk down memory lane to see how a{' '}
              <span className="text-[#A0A0A0]">shared vision turned into a global journey.</span>
            </p>
          </RevealChild>
        </Reveal>
      </Container>

      {/* The rail bleeds past the content column on purpose — Figma draws the
          track 1744 wide inside a 1440 frame and clips it. Pinned, the wrapper
          takes the runway's height and the frame inside it sticks under the
          header (lib/pinnedTrack.ts). */}
      <div ref={wrapRef} className="relative mt-fig-40 lg:mt-fig-100" style={pinned ? { height: geom.height } : undefined}>
        <div
          className={
            pinned ? `sticky ${STICKY_TOP} ${PIN_FOLLOW} flex ${PINNED_H} flex-col justify-center overflow-clip` : ''
          }
        >
          {pinned && watermark}
          <div ref={columnRef} className={wantsPin ? 'py-fig-16' : ''}>
            {/* Pinned, this reserves the scaled rail's height, so the scale
                shrinks the column's layout and not merely its paint. */}
            <div style={pinned ? { height: geom.trackH } : undefined}>
              <motion.div
                ref={railRef}
                {...(pinned
                  ? pinnedDrag
                  : {
                      onScroll: syncEdges,
                      onPointerDown,
                      onPointerMove,
                      onPointerUp: endDrag,
                      onPointerCancel: endDrag,
                    })}
                // Unpinned: scroll-padding matches the rail's own padding.
                // Without it a snap-start card aligns to the container edge,
                // which scrolls the gutter away and leaves the first card flush
                // to the screen — the rail then rests at scrollLeft 24 rather
                // than 0. Pinned: `touch-action: pan-y` gives a horizontal
                // swipe to the drag and keeps a vertical swipe native.
                className={
                  pinned
                    ? `${RAIL} touch-pan-y select-none will-change-transform ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`
                    : `${RAIL} menu-scroll snap-x overflow-x-auto scroll-smooth pb-fig-16 scroll-pl-fig-16 motion-reduce:scroll-auto lg:scroll-pl-fig-24 3xl:scroll-pl-fig-64`
                }
                style={pinned ? { x: trackX, scale: geom.scale, transformOrigin: '0% 0%' } : undefined}
                tabIndex={pinned ? undefined : 0}
                role="group"
                aria-label="Officience milestones from 2006 to 2026"
              >
                {EVENTS.map((event, index) =>
                  pinned ? (
                    <PinnedEvent key={`p-${event.year}`} event={event} progress={progress} win={geom.windows[index]} />
                  ) : (
                    <motion.article
                      key={`r-${event.year}`}
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
                      <EventBody event={event} />
                    </motion.article>
                  ),
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {!pinned && (
          <Container className="mt-fig-24 flex justify-end gap-fig-16">
            <motion.button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              whileHover={enabled && !atStart ? { scale: 1.05 } : undefined}
              whileTap={enabled && !atStart ? { scale: 0.95 } : undefined}
              transition={{ type: 'spring', ...SPRING.hover }}
              className="flex h-[48px] w-[48px] items-center justify-center border border-primary text-text-primary transition-colors hover:bg-bg-secondary disabled:opacity-40 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="h-[24px] w-[24px]" aria-hidden="true" />
              <span className="sr-only">Show earlier milestones</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              whileHover={enabled && !atEnd ? { scale: 1.05 } : undefined}
              whileTap={enabled && !atEnd ? { scale: 0.95 } : undefined}
              transition={{ type: 'spring', ...SPRING.hover }}
              className="flex h-[48px] w-[48px] items-center justify-center border border-primary text-text-primary transition-colors hover:bg-bg-secondary disabled:opacity-40 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowRight className="h-[24px] w-[24px]" aria-hidden="true" />
              <span className="sr-only">Show later milestones</span>
            </motion.button>
          </Container>
        )}
      </div>
    </section>
  );
};

export default OurJourney;
