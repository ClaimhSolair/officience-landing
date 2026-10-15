import React, { useEffect, useRef } from 'react';
import Reveal, { RevealChild } from './ui/Reveal';
import { HomeColumn, HOME_H2, HOME_SUBTITLE } from './ui/HomeSection';
import { MOTION, SEC, STAGGER, useMotionEnabled } from '../lib/motion';
import { ASSETS } from '../assets';

/**
 * "People Trust Us", Figma 4366:9639 in frame 4229:4651 (1440). Adapter 27g.
 *
 * The intro column (572 wide) sits on the left, 80 from a window of cards. The
 * frame draws one card. The build shows the three cards in a continuous loop
 * that moves down, in a window about 1.6 cards tall with a soft fade at the top
 * and the bottom. With reduced motion, the three cards show as a static stack.
 *
 * From lg, every size is the 1440 value times `--u` (see HomeSection.tsx).
 * Below lg, the values are build choices (there is no frame below 1440).
 */
const TESTIMONIALS = [
  {
    // The 1440 frame writes "had become". The build used "has become" from the
    // 1920 frame until adapter 27. The new frame wins, so the tense changes here.
    // Figma sets a straight apostrophe in "don't". The build keeps the
    // typographic one (FIGMA-SLIP).
    quote: '"Officience had become our main partner and I don’t regret it a single day."',
    name: 'Dr. Jean Marcel Guillon',
    role: 'FV Hospital',
    image: ASSETS.testimonials.authors[1],
  },
  {
    quote: '"I really appreciate the team’s availability & responsiveness."',
    name: 'Mr. Leurette',
    role: 'Program Director - Orange',
    image: ASSETS.testimonials.authors[0],
  },
  {
    quote: '“Without you, I just could not work.”',
    name: 'L. Lemaire',
    role: 'Director of Sales',
    image: ASSETS.testimonials.authors[2],
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

/**
 * The loop parameters. Tune here.
 *
 * - `SECONDS_PER_CARD`: the time to move one card and one gap. The loop is one
 *   set of three cards, so one cycle is 3 x 5 = 15 s at every width. The speed
 *   in px follows the card size, so a quote stays on screen for the same time
 *   on a phone and on a 2560 screen.
 * - The gap between cards is 24 at 1440 (the frame's section padding).
 * - The window is 480 at 1440: the 296 card x 1.6 plus a gap, rounded.
 */
const SECONDS_PER_CARD = 5;
const LOOP_SECONDS = SECONDS_PER_CARD * TESTIMONIALS.length;

/** The gap between cards, in the loop and in the static stack. */
const GAP = 'gap-[16px] md:gap-[20px] lg:gap-[calc(24*var(--u))]';
/** The same gap as padding after the last card, so the -50% loop has no seam. */
const GAP_END = 'pb-[16px] md:pb-[20px] lg:pb-[calc(24*var(--u))]';

/**
 * The window height. 1.6 cards from lg (adapter 27g). Below lg the card is
 * taller for its width, so the window shows about 1.4 cards (build choice).
 */
const WINDOW_H = 'h-[340px] md:h-[380px] lg:h-[calc(480*var(--u))]';

/** The soft fade at the top and the bottom of the window, 15% at each end. */
const FADE = 'linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)';

/**
 * One card, as 4366:9649 draws it: white, no radius, no shadow, p-40, 20 between
 * the parts. The rule takes no height in the frame, so it takes back its 1px
 * with a negative margin. The card hugs its content, as the frame's auto
 * layout does: 296 tall at 1440 with a 2-line quote, 268 with a 1-line quote.
 */
const Card: React.FC<{ t: Testimonial }> = ({ t }) => (
  <div className="flex flex-col gap-[16px] bg-bg-default p-[24px] md:gap-[18px] md:p-[32px] lg:gap-[calc(20*var(--u))] lg:p-[calc(40*var(--u))]">
    {/* The frame draws the quote icon turned 180 degrees. */}
    <img
      src={ASSETS.testimonials.quote}
      alt=""
      aria-hidden="true"
      width={40}
      height={40}
      className="h-[32px] w-[32px] shrink-0 rotate-180 lg:h-[calc(40*var(--u))] lg:w-[calc(40*var(--u))]"
      decoding="async"
      referrerPolicy="no-referrer"
    />
    <p className="font-body font-normal text-[16px] leading-[24px] text-text-default md:text-[18px] md:leading-[26px] lg:text-[length:calc(20*var(--u))] lg:leading-[calc(28*var(--u))]">
      {t.quote}
    </p>
    {/* Line 6 of the frame: #E5E5E5. */}
    <hr className="-mb-px h-0 w-full border-0 border-t border-border-frame" />
    <div className="flex items-center gap-[12px] lg:gap-[calc(12*var(--u))]">
      {/* The name sits next to the portrait, so alt text on the portrait would
          say the name two times to a screen reader. The frame renders the
          portrait as a circle. */}
      <img
        src={t.image}
        alt=""
        aria-hidden="true"
        width={60}
        height={60}
        className="h-[48px] w-[48px] shrink-0 rounded-full object-cover lg:h-[calc(60*var(--u))] lg:w-[calc(60*var(--u))]"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <div className="flex min-w-0 flex-col gap-[2px] lg:gap-[calc(4*var(--u))]">
        <p className="font-sans font-semibold text-[18px] leading-[24px] text-text-default md:text-[20px] md:leading-[26px] lg:text-[length:calc(24*var(--u))] lg:leading-[calc(28*var(--u))]">
          {t.name}
        </p>
        <p className="font-body font-normal text-[14px] leading-[20px] text-subtitle md:text-[16px] md:leading-[24px] lg:text-[length:calc(20*var(--u))] lg:leading-[calc(28*var(--u))]">
          {t.role}
        </p>
      </div>
    </div>
  </div>
);

/** The three cards as a list. `hidden` = the second copy of the loop. */
const CardList: React.FC<{ hidden?: boolean; className?: string }> = ({ hidden = false, className = '' }) => (
  <ul aria-hidden={hidden || undefined} className={`flex flex-col ${GAP} ${className}`}>
    {TESTIMONIALS.map((t) => (
      <li key={t.name}>
        <Card t={t} />
      </li>
    ))}
  </ul>
);

/**
 * The loop. The track holds the list two times, with one gap of padding after
 * each copy, and moves from -50% to 0 (down). At 0 the first copy shows where
 * the second copy showed at -50%, so the wrap has no jump.
 *
 * It is a CSS animation, not rAF: rAF stops in a hidden pane. It uses the
 * `marquee-y` keyframes of index.html (0 to -50%) with `reverse`, which moves
 * down. Both the direction and the duration are inline, because an inline
 * value overrides the animation shorthand of the `?motion=on` rules.
 *
 * The loop stops on hover and when the window has the keyboard focus. The
 * cards have no links, so the window is in the tab order: Tab stops the loop
 * and Shift+Tab or Tab again starts it. Off screen, an IntersectionObserver
 * stops the loop. It writes an inline `paused` and clears it on screen, so the
 * hover and focus rules work again.
 *
 * The second copy is aria-hidden and has nothing to focus, so a screen reader
 * reads the three cards one time.
 */
const Loop: React.FC = () => {
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const win = windowRef.current;
    const track = trackRef.current;
    if (!win || !track || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
      },
      { threshold: 0 },
    );
    io.observe(win);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={windowRef}
      role="region"
      aria-label="Client testimonials"
      tabIndex={0}
      className={`group relative w-full overflow-hidden outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${WINDOW_H}`}
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <div
        ref={trackRef}
        data-loop-track=""
        className="flex animate-marquee-y flex-col group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={{ animationDuration: `${LOOP_SECONDS}s`, animationDirection: 'reverse' }}
      >
        <CardList className={GAP_END} />
        <CardList hidden className={GAP_END} />
      </div>
    </div>
  );
};

const ClientStories: React.FC = () => {
  const motionOn = useMotionEnabled();
  const loop = motionOn && MOTION.clients;

  return (
    <section id="clients" className="bg-bg-secondary">
      {/* The section draws p-24 at 1440. HomeColumn gives the 24 at the sides. */}
      <HomeColumn className="lg:py-[calc(24*var(--u))]">
        <div className="flex flex-col gap-[32px] md:gap-[40px] lg:flex-row lg:items-start lg:gap-[calc(80*var(--u))]">
          <Reveal
            as="div"
            stagger={STAGGER.base}
            enabled={MOTION.clients}
            className="flex flex-col items-start gap-[16px] md:gap-[20px] lg:w-[calc(572*var(--u))] lg:shrink-0 lg:gap-[calc(24*var(--u))]"
          >
            <RevealChild as="span" y={28}>
              <h2 className={`${HOME_H2} text-text-default lg:whitespace-nowrap`}>People Trust Us</h2>
            </RevealChild>
            <RevealChild as="p" y={20} duration={SEC.revealFast} className={`${HOME_SUBTITLE} text-subtitle`}>
              Here’s what changed for our customers. C-Level, directors, and managers - they talk with us. They
              talk about us.
            </RevealChild>
          </Reveal>

          {/* The card column takes the rest of the row: 740 at 1440. */}
          <div className="w-full min-w-0 lg:flex-1">
            {loop ? (
              <Loop />
            ) : (
              // Reduced motion: the three cards, static, with no window and no
              // second copy.
              <CardList />
            )}
          </div>
        </div>
      </HomeColumn>
    </section>
  );
};

export default ClientStories;
