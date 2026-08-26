import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ASSETS, srcSetOf, type ImageSource } from '../assets';
import Container from './ui/Container';
import Button from './ui/Button';
import SectionBadge from './ui/SectionBadge';
import CarouselDots from './ui/CarouselDots';
import Reveal from './ui/Reveal';
import { EASE, MOTION, SEC, useMotionEnabled } from '../lib/motion';
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


/**
 * A work card arriving in the horizontal rail — nava-studio's entrance, kept
 * while our arrows-and-snap carousel stays exactly as it was ruled on
 * 2026-08-24 (`.claude/motion-catalog.md`, item 10). The reference pins the rail
 * and scrubs a 2000px track; at 390 it ships no pin at all and keeps only this
 * per-card arrival, which is the version adapted here.
 *
 * `whileInView` reads the real viewport, so a card still off to the right of the
 * rail simply has not arrived yet and animates when it is scrolled to.
 */
const WorkCardMedia: React.FC<{ src: string; srcSet: string; alt: string }> = ({ src, srcSet, alt }) => {
  const motionOn = useMotionEnabled();
  const cls = 'h-[220px] w-full object-cover lg:h-[550px]';
  const common = {
    src,
    srcSet,
    sizes: '(min-width: 1024px) 570px, 240px',
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    referrerPolicy: 'no-referrer' as const,
  };

  if (!MOTION.work) return <img {...common} className={cls} />;

  // Settles at 1, not at the reference's 1.1: our crop is the approved one, so
  // the zoom may only ever be a way in to it, never a permanent re-frame.
  // Reduced motion keeps the fade and drops the zoom, for the same reason the
  // shared reveal does.
  return (
    <motion.img
      {...common}
      className={cls}
      initial={motionOn ? { scale: 1.2, opacity: 0.1 } : { opacity: 0.1 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: SEC.reveal, ease: EASE.reveal }}
    />
  );
};

const WorkCard: React.FC<{ className: string; media: React.ReactNode; children: React.ReactNode }> = ({
  className,
  media,
  children,
}) => (
  <Reveal as="article" className={className} enabled={MOTION.work} y={60}>
    {media}
    {children}
  </Reveal>
);

const ProvenResults: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Which ends the deck is resting against, so the arrows can go dim. */
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

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

  return (
    <section id="proven-results" className="bg-bg-secondary">
      <div className="flex flex-col py-fig-32 lg:py-fig-120">
        <Container className="mb-fig-24 flex flex-col gap-fig-8 lg:mb-fig-100 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32">
          <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
            <SectionBadge>Proof Of Work</SectionBadge>
            <h2 className="font-sans text-h1 text-text-default lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
              Proven Results
            </h2>
          </div>

          {/* The 390 frame has no blurb at all — not different wording, none.
              Hidden rather than dropped, so restoring it is one class. */}
          <p className="hidden font-body text-subtitle lg:block lg:w-[600px] lg:min-w-0 lg:text-subtitle-1">
            Crafting solutions for global innovators. See our latest chapters.
          </p>
        </Container>

        {/* Full-bleed to 1920 so the padding lands on the same gutters Container
            uses, while the next card can still peek past the content edge. */}
        <div className="mx-auto w-full max-w-[1920px]">
          <div
            ref={trackRef}
            tabIndex={0}
            role="group"
            aria-label="Project highlights"
            /* `scroll-padding` has to mirror `padding`, or mandatory snapping
               aligns the first card to the scrollport edge and eats the gutter —
               the deck ends up a full gutter left of the heading. Scrollbars are
               killed globally in index.html, so the track needs no opt-out. */
            className="flex snap-x snap-mandatory gap-[22px] overflow-x-auto overscroll-x-contain px-fig-16 scroll-pl-fig-16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:gap-fig-40 lg:px-fig-24 lg:scroll-pl-fig-24 3xl:px-fig-64 3xl:scroll-pl-fig-64"
          >
            {PROJECTS.map((project) => (
              <WorkCard
                key={project.name}
                className={`${CARD} ${CARD_H} snap-start overflow-hidden rounded-fig-xs bg-bg-primary shadow-fig-sm lg:rounded-fig-l`}
                media={
                  <WorkCardMedia
                    src={project.image[project.image.length - 1].url}
                    srcSet={srcSetOf(project.image)}
                    alt={project.alt}
                  />
                }
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
              className={`${CARD} ${CARD_H} flex snap-start flex-col justify-between overflow-hidden rounded-fig-xs bg-bg-primary px-fig-16 py-fig-20 shadow-fig-sm lg:rounded-fig-l lg:px-fig-24 lg:py-fig-32`}
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
                  href={
                    VIEW_ALL_WORK.target.kind === 'external'
                      ? VIEW_ALL_WORK.target.href
                      : EXTERNAL.about
                  }
                  variant="secondary"
                  size="lg"
                  radius="m"
                  onDark
                  className="w-full border-transparent shadow-fig-xs lg:max-w-[448px] lg:gap-fig-14 lg:text-btn-lg"
                  icon={
                    <ArrowUpRight
                      className="h-[20px] w-[20px] shrink-0 lg:h-[24px] lg:w-[24px]"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  }
                >
                  {VIEW_ALL_WORK.label}
                </Button>
              </div>
            </article>
          </div>
        </div>

        {/* Dots at 390 as drawn; arrows from lg, which no frame draws. */}
        <Container className="mt-fig-24 lg:mt-fig-40">
          <CarouselDots
            containerRef={trackRef}
            count={PROJECTS.length + 1}
            variant="dot"
            className="lg:hidden"
          />

          <div className="hidden justify-end gap-fig-8 lg:flex">
            <Button
              onClick={() => page(-1)}
              variant="secondary"
              size="icon"
              radius="m"
              disabled={atStart}
              icon={
                <ArrowLeft
                  className="h-[24px] w-[24px] shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              }
            >
              <span className="sr-only">Previous projects</span>
            </Button>
            <Button
              onClick={() => page(1)}
              variant="secondary"
              size="icon"
              radius="m"
              disabled={atEnd}
              icon={
                <ArrowRight
                  className="h-[24px] w-[24px] shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              }
            >
              <span className="sr-only">Next projects</span>
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default ProvenResults;
