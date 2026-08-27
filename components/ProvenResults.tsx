import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ASSETS, srcSetOf, type ImageSource } from '../assets';
import Container from './ui/Container';
import Button from './ui/Button';
import SectionBadge from './ui/SectionBadge';
import CarouselDots from './ui/CarouselDots';
import Reveal, { RevealChild } from './ui/Reveal';
import { EASE, HEADER_H, MOTION, PINNED_H, SEC, STAGGER, STICKY_TOP, useMinWidth, useMotionEnabled } from '../lib/motion';
import { EXTERNAL, VIEW_ALL_WORK } from './navigation';

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
 * **Motion (item 10, nava-studio).** From lg, and on viewports tall enough to
 * hold the deck, the section pins and vertical scrolling drives the track
 * sideways. The deck holds still until the first card is fully read, then rolls;
 * a card entering from beyond the right edge fades and lifts into place, and the
 * cards already on screen are shown settled. No zoom — the review removed it. The
 * arrows go with the pin: Figma never drew them, so retiring them at that width
 * returns the section to what the artboards actually show. Below lg, and wherever
 * the pin will not fit, the swipe rail and its controls are exactly as shipped.
 *
 * One divergence, flagged. While pinned the deck **scales to fit the viewport
 * height**, budgeting the whole column — header, paddings and card — against the
 * space below the header it pins beneath. At 1920x1080 that is 1:1 with the
 * artboard; on a shorter laptop it is proportionally smaller, and once the
 * reduction would pass ~30% the section keeps the swipe rail instead. Transform
 * only, so the ratio the design approved is never distorted, only reduced.
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

/** The carousel is one card wide at 390 and 570 from lg. */
const CARD = 'w-[240px] shrink-0 lg:w-[570px]';
/** Project and View All cards share a footprint so the snap stays even. */
const CARD_H = 'h-[314px] lg:h-[800px]';

/** Figma 2943:1748 — a 100px star, drawn rotated. One path, so it inlines. */
const StarMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M36.8736 70.1062L49.9986 62.1895L63.1236 70.2103L59.6861 55.2103L71.2486 45.2103L56.0403 43.8562L49.9986 29.6895L43.9569 43.752L28.7486 45.1062L40.3111 55.2103L36.8736 70.1062ZM24.2694 87.502L31.0403 58.2312L8.33193 38.5437L38.3319 35.9395L49.9986 8.33533L61.6653 35.9395L91.6653 38.5437L68.9569 58.2312L75.7278 87.502L49.9986 71.9812L24.2694 87.502ZM71.8736 29.1687L74.0611 19.8978L66.6653 13.752L76.4569 12.9187L80.2069 4.16866L83.9569 12.9187L93.7486 13.752L86.3528 19.8978L88.5403 29.1687L80.2069 24.2728L71.8736 29.1687Z"
      fill="#FFCE00"
    />
  </svg>
);

/** The pale chips over the blue caption. */
const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="shrink-0 rounded-[2px] bg-pri-50 px-fig-4 py-fig-2 font-body text-[10px] font-semibold leading-[16px] text-text-primary lg:rounded-fig-xs lg:p-fig-8 lg:font-sans lg:text-btn-lg">
    {children}
  </span>
);

/** What one pinned deck needs to know about itself, all of it measured. */
interface Geometry {
  /** How far the track travels, in screen pixels after scaling. */
  travel: number;
  /** Proportional reduction so the whole deck fits the pinned frame. */
  scale: number;
  /**
   * The scaled track's visual height, reserved on the track's wrapper so the
   * reduction actually shrinks the column's *layout* — a CSS scale alone shrinks
   * only the paint, leaving the full card height in flow and the column still
   * overflowing the frame (the v5 bleed).
   */
  trackH: number;
  /** Total height of the scroll wrapper, in pixels. */
  height: number;
  /**
   * Per-card `[start, end]` in wrapper progress, or `null` for a card already on
   * screen when the pin engages — those are shown settled, not animated in.
   */
  windows: ([number, number] | null)[];
}

/**
 * Below this the deck would be too small to be worth pinning for, so the section
 * keeps the swipe rail instead. It is the honest floor: on a laptop short enough
 * to force more than a 30% reduction the pin isn't worth the page height.
 */
const MIN_SCALE = 0.7;
/** Track pixels per pixel of scroll — nava runs about 1.14. */
const RATE = 1.15;
/**
 * The deck holds still for the first slice of the runway, so the first card is
 * fully read before anything rolls — the arrival the review asked for, "only once
 * the first card is fully on screen". The per-card windows map through the same
 * hold so a card's fade begins exactly as it enters, not before.
 */
const HOLD = 0.08;

/**
 * Measures the deck. Everything here is layout geometry (`offsetLeft`,
 * `offsetWidth`), never `getBoundingClientRect`, because layout offsets ignore
 * transforms — so a measurement taken while the track is mid-scrub returns the
 * same answer as one taken at rest.
 */
const measureDeck = (track: HTMLElement, chrome: number): Geometry | null => {
  const kids = Array.from(track.children) as HTMLElement[];
  if (kids.length < 2) return null;

  const cs = getComputedStyle(track);
  const inner = track.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const cardH = kids[0].offsetHeight;
  if (!inner || !cardH) return null;

  // The scale must clear the *whole* pinned column, not just the card: the header
  // block, the section paddings and the dots row all take vertical space beside
  // the deck (`chrome`, measured), and the frame is the viewport less the header
  // it pins beneath. Budgeting the card alone is what let a 1,300px column pin
  // into a 900px frame and bleed into the neighbouring sections.
  // Budget against the tallest header (119, 3xl) so the check never promises a
  // fit the 3xl bar would eat; at lg the 6px slack just centres.
  const frame = window.innerHeight - HEADER_H.xl3;
  const scale = Math.min(1, (frame - chrome) / cardH);
  if (scale < MIN_SCALE) return null;
  // Reserved on the wrapper so the column's layout height drops with the scale,
  // not just its paint. Without this the column stays cardH tall and overflows.
  const trackH = cardH * scale;

  const origin = kids[0].offsetLeft;
  const last = kids[kids.length - 1];
  const contentW = (last.offsetLeft + last.offsetWidth - origin) * scale;
  const travel = contentW - inner;
  if (travel <= 0) return null;

  // A card already within the frame when the pin engages gets no window — it is
  // rendered settled. The rest open as their left edge crosses the right edge of
  // the frame and close once they are most of the way in, mapped through HOLD so
  // the fade begins exactly as the track brings the card into view.
  const windows = kids.map((kid) => {
    const left = (kid.offsetLeft - origin) * scale;
    if (left <= inner) return null;
    const startRaw = (left - inner) / travel;
    const start = HOLD + (1 - HOLD) * startRaw;
    const span = (Math.max(0.1, (kid.offsetWidth * scale * 0.7) / travel)) * (1 - HOLD);
    const end = Math.min(1, start + span);
    return [start, Math.max(end, start + 0.05)] as [number, number];
  });

  return { travel, scale, trackH, height: window.innerHeight + travel / RATE, windows };
};

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
  const [start, end] = win ?? [0, 1];
  const settle = start + (end - start) * 0.8;

  // Fade and lift only — no scale. Both hooks run unconditionally so the count
  // stays stable when a resize flips a card between windowed and settled.
  const imgOpacity = useTransform(progress, [start, settle], [0.35, 1], { clamp: true });
  const cardY = useTransform(progress, [start, end], [32, 0], { clamp: true });

  const imgCls = 'h-[220px] w-full object-cover lg:h-[550px]';
  const imgProps = {
    ...media,
    sizes: '(min-width: 1024px) 570px, 240px',
    loading: 'lazy' as const,
    decoding: 'async' as const,
    referrerPolicy: 'no-referrer' as const,
  };

  if (pinned) {
    // On screen when the pin engages (null window): shown settled, so the deck
    // never opens on a row of dimmed, half-arrived cards.
    if (!win) {
      return (
        <motion.article className={className}>
          <img {...imgProps} className={imgCls} />
          {children}
        </motion.article>
      );
    }
    return (
      <motion.article className={className} style={{ y: cardY }}>
        <motion.img {...imgProps} className={imgCls} style={{ opacity: imgOpacity }} />
        {children}
      </motion.article>
    );
  }

  return (
    <Reveal as="article" className={className} enabled={MOTION.work} y={60}>
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
      {children}
    </Reveal>
  );
};

const ProvenResults: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);
  const [geom, setGeom] = useState<Geometry | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const wantsPin = motionOn && wide && MOTION.work;
  const pinned = wantsPin && geom !== null;

  /**
   * Re-measured on mount, on resize, and whenever the track's own box changes —
   * the last of those is what catches the deck settling after the web fonts swap
   * and the card images decode. Until a measurement exists the wrapper has no
   * extra height at all, so the page is never briefly taller than it should be.
   */
  useLayoutEffect(() => {
    if (!wantsPin) {
      setGeom(null);
      return;
    }
    const track = trackRef.current;
    const col = columnRef.current;
    const header = headerRef.current;
    if (!track || !col || !header) return;

    // `chrome` is the persistent non-deck height when pinned: the column's own
    // top+bottom padding plus the header block and its bottom margin. Computed
    // from those parts directly rather than as `column - deck`, so it stays
    // invariant whether or not the deck is currently pinned or the dots row is
    // currently rendered — both of which would otherwise make the estimate chase
    // its own tail across re-measures.
    const read = () => {
      const cs = getComputedStyle(col);
      const hcs = getComputedStyle(header);
      const chrome =
        parseFloat(cs.paddingTop) +
        parseFloat(cs.paddingBottom) +
        header.offsetHeight +
        parseFloat(hcs.marginBottom);
      setGeom(measureDeck(track, Math.max(0, chrome)));
    };
    read();

    const ro = new ResizeObserver(read);
    ro.observe(track);
    ro.observe(col);
    ro.observe(header);
    window.addEventListener('resize', read);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', read);
    };
  }, [wantsPin]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  // Held for the first slice (HOLD) so the first card is read before the roll,
  // then springing the scrubbed value gives the deck nava's soft landing —
  // without the spring the track is welded to the scrollbar and stops dead.
  const trackX = useSpring(useTransform(scrollYProgress, [HOLD, 1], [0, -(geom?.travel ?? 0)]), {
    stiffness: 90,
    damping: 30,
    restDelta: 0.5,
  });

  /** Which ends the deck is resting against, so the arrows can go dim. */
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || pinned) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync, pinned]);

  /**
   * Page by exactly one card — the step is measured off the DOM so the gap can
   * differ by breakpoint without being repeated here.
   *
   * The target is computed and clamped up front and the arrow states are set
   * from it, rather than re-read afterwards. Scroll events are rAF-driven, so a
   * throttled tab can delay or withhold them and leave the arrows describing the
   * previous position — or, if none arrive at all, leave Previous dimmed for good
   * and the deck one-way. The listener above still keeps things honest when the
   * reader scrolls the track by hand.
   */
  const page = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const [first, second] = Array.from(el.children) as HTMLElement[];
    const step = second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.max(0, Math.min(el.scrollLeft + direction * step, max));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    el.scrollTo({ left: target, behavior: reduced ? 'auto' : 'smooth' });
    setAtStart(target <= 1);
    setAtEnd(target >= max - 1);
  }, []);

  const cardBase = `${CARD} ${CARD_H} overflow-hidden rounded-fig-xs bg-bg-primary shadow-fig-sm lg:rounded-fig-l`;
  const cardCls = pinned ? cardBase : `${cardBase} snap-start`;

  return (
    <section id="proven-results" className="bg-bg-secondary">
      <div ref={wrapRef} className="relative" style={pinned ? { height: geom.height } : undefined}>
        <div
          className={
            pinned
              ? `sticky ${STICKY_TOP} flex ${PINNED_H} flex-col justify-center overflow-x-clip`
              : ''
          }
        >
          {/* Compressed hard while pinning so the whole column — heading plus the
              800px card — clears the header on a maximised 1080p laptop (whose
              usable height is ~860-910px after the taskbar and browser chrome),
              not only on a full 1080; full flow rhythm otherwise. */}
          <div ref={columnRef} className={`flex flex-col py-fig-32 ${wantsPin ? 'lg:py-fig-16' : 'lg:py-fig-120'}`}>
            <Container innerRef={headerRef} className={`mb-fig-24 flex flex-col gap-fig-8 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32 ${wantsPin ? 'lg:mb-fig-24' : 'lg:mb-fig-100'}`}>
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
            </Container>

            {/* Full-bleed to 1920 so the padding lands on the same gutters Container
                uses, while the next card can still peek past the content edge. When
                pinned it reserves the scaled deck's height, so scaling the track
                shrinks the column's layout and not merely its paint. */}
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
                   killed globally in index.html, so the track needs no opt-out. */
                className={`flex gap-[22px] px-fig-16 lg:gap-fig-40 lg:px-fig-24 3xl:px-fig-64 ${
                  pinned
                    ? 'will-change-transform'
                    : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-pl-fig-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:scroll-pl-fig-24 3xl:scroll-pl-fig-64'
                }`}
                style={
                  pinned
                    ? { x: trackX, scale: geom.scale, transformOrigin: '0% 0%' }
                    : undefined
                }
              >
                {PROJECTS.map((project, i) => (
                  <WorkCard
                    key={project.name}
                    className={cardCls}
                    progress={scrollYProgress}
                    window={geom?.windows[i]}
                    pinned={pinned}
                    media={{
                      src: project.image[project.image.length - 1].url,
                      srcSet: srcSetOf(project.image),
                      alt: project.alt,
                    }}
                  >
                    <div className="flex flex-col gap-fig-6 px-fig-16 py-fig-20 lg:gap-fig-16 lg:p-fig-40">
                      <div className="flex flex-wrap items-center gap-[5px] lg:gap-fig-12">
                        {project.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                      <h3 className="font-sans font-semibold text-[24px] leading-[32px] text-white lg:font-medium lg:text-display-sm">
                        {project.name}
                      </h3>
                    </div>
                  </WorkCard>
                ))}

                {/* The deck's last slide. Only the 1440 frame draws it, and only at
                    desktop size — the 390 treatment is scaled from it. */}
                <article
                  className={`${CARD} ${CARD_H} flex flex-col justify-between overflow-hidden rounded-fig-xs bg-bg-primary px-fig-16 py-fig-20 shadow-fig-sm lg:rounded-fig-l lg:px-fig-24 lg:py-fig-32 ${
                    pinned ? '' : 'snap-start'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <StarMark className="h-[56px] w-[56px] rotate-[91deg] lg:h-[100px] lg:w-[100px]" />
                    <span className="shrink-0 rounded-[2px] bg-pri-50 px-fig-4 py-fig-2 font-body text-[10px] font-semibold leading-[16px] text-text-primary lg:rounded-fig-xs lg:px-[10px] lg:py-fig-8 lg:font-sans lg:text-btn-lg">
                      10+ Works
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-fig-12 lg:gap-fig-28">
                    <p className="font-body text-[12px] leading-[20px] text-white lg:max-w-[448px] lg:text-subtitle-1">
                      {VIEW_ALL_BLURB}
                    </p>
                    <Button
                      href={VIEW_ALL_WORK.target.kind === 'external' ? VIEW_ALL_WORK.target.href : EXTERNAL.about}
                      variant="secondary"
                      size="lg"
                      radius="m"
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

            {/* Dots at 390 as drawn. The arrows only exist for the hand-driven
                rail — once scrolling drives the deck there is nothing for them to
                do, and Figma never drew them in the first place. Hidden entirely
                while pinned: at lg the dots are already hidden and the arrows are
                gone, so this would otherwise be 40px of empty chrome the pin
                cannot afford. */}
            <Container className={`mt-fig-24 lg:mt-fig-40 ${pinned ? 'lg:hidden' : ''}`}>
              <CarouselDots
                containerRef={trackRef}
                count={PROJECTS.length + 1}
                variant="dot"
                className="lg:hidden"
              />

              {!pinned && (
                <div className="hidden justify-end gap-fig-8 lg:flex">
                  <Button
                    onClick={() => page(-1)}
                    variant="secondary"
                    size="icon"
                    radius="m"
                    disabled={atStart}
                    icon={<ArrowLeft className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
                  >
                    <span className="sr-only">Previous projects</span>
                  </Button>
                  <Button
                    onClick={() => page(1)}
                    variant="secondary"
                    size="icon"
                    radius="m"
                    disabled={atEnd}
                    icon={<ArrowRight className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
                  >
                    <span className="sr-only">Next projects</span>
                  </Button>
                </div>
              )}
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvenResults;
