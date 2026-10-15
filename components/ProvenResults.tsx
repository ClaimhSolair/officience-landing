import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ASSETS, srcSetOf, type ImageSource } from '../assets';
import Button, { HOME_BTN_ICON } from './ui/Button';
import StarMark from './ui/StarMark';
import CarouselDots from './ui/CarouselDots';
import Reveal from './ui/Reveal';
import { HomeColumn, SectionHeader } from './ui/HomeSection';
import { EASE, MOTION, PINNED_H, PIN_FOLLOW, SEC, STICKY_TOP, useMinWidth, useMotionEnabled } from '../lib/motion';
import { useCardEntrance, usePinnedTrack, useTrackDrag } from '../lib/pinnedTrack';
import { VIEW_ALL_WORK, ROUTES, workHref } from './navigation';

/**
 * "Success Stories", frame 4229:4651 node 4382:7136 (adapter 27f). The section
 * id stays `proven-results`, because it is the analytics key.
 *
 * The frame draws a Section Header (wide copy column, no eyebrow, no CTA), then
 * a row of three 640px cards with a 40px gap, 64px under the header. The build
 * adds the View All card at the end of the row (27f).
 *
 * **Motion (27f, 25b, 25c).** From lg, with motion on, the card row pins and the
 * vertical scroll moves it sideways. The track starts on the column's left edge
 * and stops when the right edge of the View All card is on the column's right
 * edge. Only the card row pins: the heading scrolls away above it. The fit check
 * leaves the header bar out (`ignoreHeader`). The cards have a fixed size (640 x
 * the scale `--u`). The "exactly three cards" width of 25a is gone.
 *
 * **Motion off, or below lg.** The row is a horizontal scroller with snap points.
 * Below lg, dots under the row show the position.
 *
 * Below lg there is no Figma frame. The tablet and mobile values are build
 * choices in the frame's proportions: a 440px card at md and a 300px card below
 * md. The image box keeps the 640:360 aspect at every width.
 */

interface Story {
  slug: string;
  /**
   * True when `/work/<slug>` has a case page (`hasCase` in content/work). Only
   * IOGA has one (adapter 20a). The flag is here, so the home page does not
   * load the case content.
   */
  linked: boolean;
  title: string;
  tags: [string, string];
  /** The gap between the chips: 4 on card 1 and 8 on cards 2 and 3, as drawn. */
  tagGap: string;
  image: ImageSource[];
  alt: string;
}

const TAG_GAP_4 = 'gap-[4px] lg:gap-[calc(4*var(--u))]';
const TAG_GAP_8 = 'gap-[8px] lg:gap-[calc(8*var(--u))]';

// FIGMA-SLIP: "Artisants Bâtisseur" is reproduced as drawn (adapter 27).
const STORIES: Story[] = [
  {
    slug: 'ioga',
    linked: true,
    title: 'IOGA video learning platform from construction',
    tags: ['Software Development', 'E-Learning Platform'],
    tagGap: TAG_GAP_4,
    image: ASSETS.home.stories.ioga,
    alt: 'Presenter filming a piece to camera on a phone rig',
  },
  {
    slug: 'cmp',
    linked: false,
    title: 'C.M.P e-trading precious metal within minutes',
    tags: ['E - commerce', 'Pricing Automation'],
    tagGap: TAG_GAP_8,
    image: ASSETS.home.stories.cmp,
    alt: 'Laptop showing the Gestion Métal & Négoce interface',
  },
  {
    slug: 'lab',
    linked: false,
    title: 'LAB Les Artisants Bâtisseur - a start-up building fast',
    tags: ['Software', 'E-Learning Platform'],
    tagGap: TAG_GAP_8,
    image: ASSETS.home.stories.lab,
    alt: 'Analytics dashboard with workload charts',
  },
];

/** The date and author line of the frame. The same text is on all three cards. */
const STORY_META = '23 Nov 2026 | Tram Anh';

const VIEW_ALL_BLURB =
  'Providing bespoke web development services that optimize user experience, elevate brand visibility, and drive measurable business results.';

/** The card width: 640 x `--u` from lg. 440 at md and 300 below md are build choices. */
const CARD_W = 'w-[300px] md:w-[440px] lg:w-[calc(640*var(--u))]';
const CARD_RADIUS = 'rounded-[12px] lg:rounded-[calc(12*var(--u))]';

/**
 * The chip (Montserrat Medium 14/20, #1F49BF on #ECF4FF, 8px padding, radius
 * 5.378). Below md it is 12/16 with 6px padding (build choice). From lg the text
 * has the 12px floor of ruling 27h: 12/17 keeps the 14/20 ratio. The padding and
 * the radius keep the plain step.
 */
const TAG =
  'shrink-0 whitespace-nowrap rounded-[4px] bg-pri-50 p-[6px] font-body text-[12px] font-medium leading-[16px] text-text-primary md:rounded-[5.378px] md:p-[8px] md:text-[14px] md:leading-[20px] lg:rounded-[calc(5.378*var(--u))] lg:p-[calc(8*var(--u))] lg:text-[length:max(12px,calc(14*var(--u)))] lg:leading-[max(17px,calc(20*var(--u)))]';

/** The image file widths for each step of the card width. */
const IMG_SIZES =
  '(min-width: 2560px) 1138px, (min-width: 1880px) 853px, (min-width: 1400px) 640px, (min-width: 1280px) 569px, (min-width: 1024px) 455px, (min-width: 768px) 440px, 300px';

/** The image fade of a card that is not pinned. The card's `Reveal` sets the state. */
const IMG_FADE = {
  hidden: { opacity: 0.1 },
  shown: { opacity: 1, transition: { duration: SEC.revealBase, ease: [...EASE.reveal] } },
};

/**
 * A story card. When pinned, the card comes in as a function of the track
 * progress. An observer does not work in a track that moves sideways, because
 * the card never crosses the viewport vertically. When not pinned, the card has
 * the timed entrance of the section.
 *
 * The arrival has no zoom (the review removed it). The image fades, and the card
 * lifts into position.
 */
const StoryCard: React.FC<{
  className: string;
  media: { src: string; srcSet: string; alt: string };
  progress: MotionValue<number>;
  window?: [number, number] | null;
  pinned: boolean;
  children: React.ReactNode;
}> = ({ className, media, progress, window: win, pinned, children }) => {
  const { imgOpacity, cardY } = useCardEntrance(progress, win);
  const motionOn = useMotionEnabled();

  // The frame draws a 640px image box in a 640px card that has 24px padding, so
  // the box goes to the card edges (the card centres it and clips it). The card
  // has no side padding here, and the caption has the 24px, so the result is
  // the same. The box keeps the 640:360 aspect at every width. The files have
  // this aspect, so `object-cover` does not crop.
  const boxCls = 'relative isolate aspect-[640/360] w-full shrink-0 overflow-hidden';
  // Hover zoom (ruling 23f): 1.06 over 700ms, clipped by the image box. Reduced
  // motion keeps the image still.
  const imgCls =
    'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100';
  const imgProps = {
    ...media,
    sizes: IMG_SIZES,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    referrerPolicy: 'no-referrer' as const,
  };
  // The blue tint of the frame: a #1F49BF layer in the "color" blend mode over
  // the photo. It does not zoom, so it always covers the box.
  const tint = <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#1F49BF] mix-blend-color" />;

  if (pinned) {
    // A card that is on screen when the pin starts (null window) shows settled.
    if (!win) {
      return (
        <motion.article className={className}>
          <div className={boxCls}>
            <img {...imgProps} className={imgCls} />
            {tint}
          </div>
          {children}
        </motion.article>
      );
    }
    return (
      <motion.article className={className} style={{ y: cardY }}>
        <div className={boxCls}>
          <motion.img {...imgProps} className={imgCls} style={{ opacity: imgOpacity }} />
          {tint}
        </div>
        {children}
      </motion.article>
    );
  }

  // The image fade has no observer of its own. It takes the "hidden" and "shown"
  // states of the card's `Reveal`, so the image shows when the card shows. A card
  // that is partly in the rail cannot keep a faded image. With motion off, the
  // image is a plain `img` at full opacity.
  return (
    <Reveal as="article" className={className} enabled={MOTION.work} y={60}>
      <div className={boxCls}>
        {MOTION.work && motionOn ? (
          <motion.img {...imgProps} className={imgCls} variants={IMG_FADE} />
        ) : (
          <img {...imgProps} className={imgCls} />
        )}
        {tint}
      </div>
      {children}
    </Reveal>
  );
};

const ProvenResults: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);

  const wantsPin = motionOn && wide && MOTION.work;
  // Only the card row pins (25b). The heading scrolls away above it. The header
  // bar hides on a scroll down, so the fit check leaves it out (25c).
  const { geom, progress, trackX } = usePinnedTrack(wantsPin, {
    wrapRef,
    columnRef,
    trackRef,
    ignoreHeader: true,
  });
  // A local value, so that TypeScript narrows `geom` where `pinned` is true.
  const pinned = wantsPin && geom !== null;
  // The track moves only with the page scroll, so a Tab onto a card past the
  // frame edge needs this focus handler (U-2). It scrolls the page until the
  // track shows the full card. The deck takes only the focus handler, not the drag.
  const { handlers: pinnedDrag } = useTrackDrag(pinned ? geom : null, wrapRef);

  // When pinned, the row is in the centre of a frame that is one window high. So
  // the frame has (100vh - row) / 2 of empty space above and below the row. The
  // heading margin and the wrapper margin remove that space. Then the gap is 64
  // from the heading to the row when the pin starts, and 24 from the row to the
  // logo band when the pin stops. The empty frame space goes over the heading
  // and over the logo band, which show through it.
  const frameSpare = pinned ? `(100vh - ${geom.trackH}px) / 2` : null;

  const cardBase = `group relative flex shrink-0 flex-col overflow-hidden ${CARD_W} ${CARD_RADIUS} ${pinned ? '' : 'snap-start'}`;

  // The page column gives the 120 section gap. In the frame, the block 4382:7135
  // adds 24 at its top and 4382:7136 adds 2 more (U-4). The section adds the 26.
  return (
    <section
      id="proven-results"
      aria-labelledby="proven-results-heading"
      className="bg-bg-secondary lg:pt-[calc(26*var(--u))]"
    >
      {/* The heading is out of the pinned column, so it scrolls away and the row
          gets the full window height. 64 to the row from lg; 32 and 48 below lg
          are build choices. */}
      <HomeColumn
        className="mb-[32px] md:mb-[48px] lg:mb-[calc(64*var(--u))]"
        style={frameSpare ? { marginBottom: `calc(64 * var(--u) - ${frameSpare})` } : undefined}
      >
        <SectionHeader
          headingId="proven-results-heading"
          headline="Success Stories"
          copyWidth="wide"
          subtitle="Across 10 industries - telecom, cybersecurity, finance & insurance, logistics, real estate, ecommerce, beauty & fashion - we serve more than 50+ missions daily."
        />
      </HomeColumn>

      <div
        ref={wrapRef}
        className="relative"
        style={pinned ? { height: geom.height, marginBottom: `calc(0px - ${frameSpare})` } : undefined}
      >
        <div
          className={
            pinned ? `sticky ${STICKY_TOP} ${PIN_FOLLOW} flex ${PINNED_H} flex-col justify-center overflow-x-clip` : ''
          }
        >
          <div ref={columnRef} className="flex flex-col">
            {/* When pinned, this box keeps the height of the scaled track, so the
                scale makes the layout smaller and not only the paint. */}
            <div className="w-full" style={pinned ? { height: geom.trackH } : undefined}>
              <motion.div
                ref={trackRef}
                onFocus={pinned ? pinnedDrag.onFocus : undefined}
                tabIndex={pinned ? undefined : 0}
                role="group"
                aria-label="Success stories"
                /* The side padding is the column gutter, so the first card starts on
                   the column edge. `scroll-padding` must be the same as the padding,
                   or the snap puts the first card on the scroller edge. The global
                   CSS hides the scrollbar. */
                className={`flex items-stretch gap-[16px] px-[16px] md:gap-[24px] md:px-[24px] lg:gap-[calc(40*var(--u))] lg:px-[calc(24*var(--u))] ${
                  pinned
                    ? 'will-change-transform'
                    : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-pl-[16px] md:scroll-pl-[24px] lg:scroll-pl-[calc(24*var(--u))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                }`}
                /* The scale turns on the left edge of the first card, not on the
                   track edge, so the deck stays on the column edge. */
                style={
                  pinned
                    ? { x: trackX, scale: geom.scale, transformOrigin: 'calc(24 * var(--u)) 0px' }
                    : undefined
                }
              >
                {STORIES.map((story, i) => {
                  const { linked } = story;
                  return (
                    <StoryCard
                      key={story.slug}
                      className={`${cardBase} bg-bg-default`}
                      progress={progress}
                      window={geom?.windows[i]}
                      pinned={pinned}
                      media={{
                        src: story.image[0].url,
                        srcSet: srcSetOf(story.image),
                        alt: story.alt,
                      }}
                    >
                      {/* 20 from the image to the title, 20 from the title to the
                          tags, 24 at the sides and the bottom. */}
                      <div className="flex flex-1 flex-col gap-[16px] p-[16px] md:gap-[20px] md:p-[20px] lg:gap-[calc(20*var(--u))] lg:px-[calc(24*var(--u))] lg:pb-[calc(24*var(--u))] lg:pt-[calc(20*var(--u))]">
                        <h3 className="font-sans text-[22px] font-semibold leading-[30px] text-text-default md:text-[28px] md:leading-[36px] lg:text-[length:calc(36*var(--u))] lg:leading-[calc(44*var(--u))]">
                          {linked ? (
                            /* The link covers the full card. Only IOGA has a case
                               page (adapter 20a). The other cards have no link, as
                               before. Set `linked` when their case page exists. */
                            <Link
                              to={workHref(story.slug)}
                              className="after:absolute after:inset-0 after:rounded-[12px] lg:after:rounded-[calc(12*var(--u))] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-primary"
                            >
                              {story.title}
                            </Link>
                          ) : (
                            story.title
                          )}
                        </h3>
                        {/* The tags stay on the right, as drawn. The cards in a
                            row have the same height, so the tags go to the
                            bottom of the card. */}
                        <div className="mt-auto flex items-center justify-end gap-[12px]">
                          {/* The date and author line is hidden (ruling 27f): it is
                              placeholder text. To show it, remove `hidden`. */}
                          <p className="mr-auto hidden whitespace-nowrap font-sans text-[16px] font-medium leading-[24px] text-subtitle lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(21px,calc(24*var(--u)))]">
                            {STORY_META}
                          </p>
                          <ul className={`flex flex-wrap items-center justify-end ${story.tagGap}`} aria-label="Services">
                            {story.tags.map((tag) => (
                              <li key={tag} className={TAG}>
                                {tag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </StoryCard>
                  );
                })}

                {/* The last card of the row. The frame does not draw it (27f keeps
                    it). It has the card size and radius of the new frame. */}
                <article
                  className={`${cardBase} justify-between bg-bg-primary p-[16px] md:p-[20px] lg:p-[calc(24*var(--u))]`}
                >
                  <div className="flex items-start justify-between">
                    <StarMark className="h-[56px] w-[56px] rotate-[91deg] md:h-[72px] md:w-[72px] lg:h-[calc(100*var(--u))] lg:w-[calc(100*var(--u))]" />
                    <span className={TAG}>10+ Works</span>
                  </div>

                  <div className="flex flex-col items-start gap-[12px] md:gap-[16px] lg:gap-[calc(28*var(--u))]">
                    <p className="font-body text-[14px] leading-[22px] text-white md:text-[18px] md:leading-[28px] lg:text-[length:calc(24*var(--u))] lg:leading-[calc(36*var(--u))]">
                      {VIEW_ALL_BLURB}
                    </p>
                    <Button
                      to={VIEW_ALL_WORK.target.kind === 'route' ? VIEW_ALL_WORK.target.to : ROUTES.work}
                      variant="secondary"
                      size="home"
                      onDark
                      className="w-full border-transparent"
                      icon={<ArrowUpRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
                    >
                      {VIEW_ALL_WORK.label}
                    </Button>
                  </div>
                </article>
              </motion.div>
            </div>

            {/* Dots below lg. The row also scrolls by swipe, wheel and keyboard. */}
            <HomeColumn className="mt-fig-24 lg:hidden">
              <CarouselDots
                containerRef={trackRef}
                count={STORIES.length + 1}
                variant="dot"
                itemName="story"
                label="Story navigation"
              />
            </HomeColumn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProvenResults;
