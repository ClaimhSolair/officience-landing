import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { HomeColumn, SectionHeader } from './ui/HomeSection';
import Reveal from './ui/Reveal';
import { MOTION, useMotionEnabled } from '../lib/motion';
import { ASSETS } from '../assets';

/**
 * "People Trust Us", Figma 4469:5926 ("Option 2 · Featured + List"), the review
 * text of 4359:6449 and the dev note 4496:5012 (adapter 27o).
 *
 * The section header, then a row of two equal columns with an 80 gap: the
 * author tabs on the left, the featured testimonial on the right. Below lg the
 * card is on top and the tabs are below it (dev note: one column).
 *
 * Motion (dev note):
 * - The card shows the next testimonial after `ADVANCE_MS`, and goes from 5 back
 *   to 1. A 2px progress line fills in the same time, linear.
 * - A click or an arrow key selects a tab. The line then starts again from 0.
 * - On hover and on keyboard focus in the section, the line stops where it is.
 *   It continues from that point when the pointer or the focus goes out. It
 *   also stops when the browser tab is hidden or the section is off screen.
 * - The quote and the author go out (opacity 0, up 10px, 300ms) and come in
 *   (opacity 0 to 1, from 14px down, 450ms).
 * - Reduced motion: no auto-advance, no transition and no fill. The tabs still
 *   select a testimonial.
 *
 * From lg, every size is the 1440 value times `--u` (see HomeSection.tsx).
 * Below lg, the values are build choices (there is no frame below 1440).
 */

/**
 * The time for one testimonial, the same for all five. The note draws 2000 and
 * proposes 5000-6000. The user chose 6000, then 4000 (2026-10-16).
 */
const ADVANCE_MS = 4000;

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
  /** Figma draws a 1px #E5E5E5 ring on a portrait with a white background. */
  ring?: boolean;
}

// The quotes use curly quotation marks and apostrophes (audit U-15), also where
// the frame draws straight ones.
// FIGMA-SLIP: card 5 writes "fune tuning" and "golive". The build reproduces
// the text as drawn (adapter 27o).
const TESTIMONIALS: Testimonial[] = [
  {
    quote: '“Officience had become our main partner and I don’t regret it a single day.”',
    name: 'Dr. Jean Marcel Guillon',
    role: 'FV Hospital',
    image: ASSETS.testimonials.people.guillon,
  },
  {
    quote: '“I really appreciate the team’s availability & responsiveness.”',
    name: 'Mr. Leurette',
    role: 'Program Director - Orange',
    image: ASSETS.testimonials.people.leurette,
    ring: true,
  },
  {
    quote: '“Without you, I just could not work.”',
    name: 'L. Lemaire',
    role: 'Director of Sales',
    image: ASSETS.testimonials.people.lemaire,
  },
  {
    quote:
      '“We work with Officience since 2013, our visuals are swiftly taken care of. Onboarding new clients, we feel confident every time.”',
    name: 'Bastien L.',
    role: 'Abaca',
    image: ASSETS.testimonials.people.bastien,
  },
  {
    quote:
      '“Amazing Trinh’s support! We are now fune tuning with beta testers before golive with full community of users.”',
    name: 'Adrien B.',
    role: 'Cyberdefense',
    image: ASSETS.testimonials.people.adrien,
  },
];

const COUNT = TESTIMONIALS.length;

/**
 * The state of one layer in the stacked quote and author cells. All layers sit
 * in one grid cell, so the cell is as tall as the tallest quote and the card
 * does not change height. Only the active layer is visible.
 * - `in`: the active layer. It comes in: 450ms, cubic-bezier(.2,.7,.2,1).
 * - `out`: the layer that was active. It goes out: 300ms ease. It becomes
 *   invisible at the end of the fade, so only the active layer stays visible.
 * - `idle`: the other layers wait 14px down, so the next one comes in from there.
 */
type LayerState = 'in' | 'out' | 'idle';

const LAYER: Record<LayerState, string> = {
  in: 'visible translate-y-0 opacity-100 [transition:opacity_450ms_cubic-bezier(.2,.7,.2,1),transform_450ms_cubic-bezier(.2,.7,.2,1)]',
  out: 'invisible -translate-y-[10px] opacity-0 [transition:opacity_300ms_ease,transform_300ms_ease,visibility_0s_linear_300ms]',
  idle: 'invisible translate-y-[14px] opacity-0',
};
/** With reduced motion, a layer is on or off. Nothing moves. */
const LAYER_STATIC: Record<LayerState, string> = {
  in: 'visible',
  out: 'invisible',
  idle: 'invisible',
};

/** A circle portrait. The name is next to it, so it has no alt text. */
const Portrait: React.FC<{ t: Testimonial; className: string }> = ({ t, className }) => (
  <img
    src={t.image}
    alt=""
    aria-hidden="true"
    width={192}
    height={192}
    className={`shrink-0 rounded-full object-cover ${t.ring ? 'ring-1 ring-inset ring-border-frame' : ''} ${className}`}
    loading="lazy"
    decoding="async"
    referrerPolicy="no-referrer"
  />
);

/** The quote icon of the frame (#1F49BF), turned 180 degrees as drawn. */
const QuoteIcon: React.FC = () => (
  <span
    aria-hidden="true"
    className="flex h-[48px] w-[48px] shrink-0 items-center justify-center md:h-[56px] md:w-[56px] lg:h-[calc(64*var(--u))] lg:w-[calc(64*var(--u))]"
  >
    <svg viewBox="0 0 39.8202 39.8202" className="h-[62.2%] w-[62.2%] rotate-180" fill="#1F49BF">
      <path d="M26.5469 4.97656C25.6668 4.97656 24.8227 5.32617 24.2004 5.94848C23.5781 6.57079 23.2285 7.41483 23.2285 8.29491V18.2499C23.2285 19.13 23.5781 19.9741 24.2004 20.5964C24.8227 21.2187 25.6668 21.5683 26.5469 21.5683C26.9869 21.5683 27.4089 21.7431 27.7201 22.0543C28.0312 22.3654 28.206 22.7874 28.206 23.2275V24.8866C28.206 25.7667 27.8564 26.6108 27.2341 27.2331C26.6118 27.8554 25.7678 28.205 24.8877 28.205C24.4476 28.205 24.0256 28.3798 23.7145 28.6909C23.4033 29.0021 23.2285 29.4241 23.2285 29.8642V33.1825C23.2285 33.6226 23.4033 34.0446 23.7145 34.3557C24.0256 34.6669 24.4476 34.8417 24.8877 34.8417C27.5279 34.8417 30.06 33.7929 31.927 31.9259C33.7939 30.059 34.8427 27.5269 34.8427 24.8866V8.29491C34.8427 7.41483 34.4931 6.57079 33.8708 5.94848C33.2485 5.32617 32.4045 4.97656 31.5244 4.97656H26.5469Z" />
      <path d="M8.29686 4.97656C7.41678 4.97656 6.57275 5.32617 5.95044 5.94848C5.32813 6.57079 4.97852 7.41483 4.97852 8.29491V18.2499C4.97852 19.13 5.32813 19.9741 5.95044 20.5964C6.57275 21.2187 7.41678 21.5683 8.29686 21.5683C8.7369 21.5683 9.15892 21.7431 9.47008 22.0543C9.78123 22.3654 9.95604 22.7874 9.95604 23.2275V24.8866C9.95604 25.7667 9.60643 26.6108 8.98412 27.2331C8.3618 27.8554 7.51777 28.205 6.63769 28.205C6.19765 28.205 5.77563 28.3798 5.46448 28.691C5.15332 29.0021 4.97852 29.4241 4.97852 29.8642V33.1825C4.97852 33.6226 5.15332 34.0446 5.46448 34.3557C5.77563 34.6669 6.19765 34.8417 6.63769 34.8417C9.27793 34.8417 11.81 33.7929 13.677 31.9259C15.5439 30.059 16.5927 27.5269 16.5927 24.8866V8.29491C16.5927 7.41483 16.2431 6.57079 15.6208 5.94848C14.9985 5.32617 14.1545 4.97656 13.2744 4.97656H8.29686Z" />
    </svg>
  </span>
);

const ClientStories: React.FC = () => {
  const motionOn = useMotionEnabled();
  const auto = motionOn && MOTION.clients;
  const idPrefix = useId();
  const tabId = (i: number) => `${idPrefix}-tab-${i}`;
  const panelId = `${idPrefix}-panel`;

  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  // The run counter starts the progress line again on each change, also when
  // the same tab is selected again.
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [offScreen, setOffScreen] = useState(true);
  const paused = hover || focusIn || docHidden || offScreen;

  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<Animation | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeRef = useRef(0);
  const select = useCallback((i: number) => {
    if (activeRef.current !== i) {
      setPrevious(activeRef.current);
      activeRef.current = i;
      setActive(i);
    }
    setRun((r) => r + 1);
  }, []);

  // The browser tab and the screen position.
  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOffScreen(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setOffScreen(!e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The progress line. Its end selects the next testimonial. A Web Animation
  // can pause and continue from the same point, which the dev note asks for.
  useEffect(() => {
    const fill = fillRef.current;
    if (!auto || !fill || typeof fill.animate !== 'function') return;
    const anim = fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: ADVANCE_MS,
      easing: 'linear',
      fill: 'forwards',
    });
    anim.onfinish = () => select((active + 1) % COUNT);
    animRef.current = anim;
    return () => {
      anim.onfinish = null;
      anim.cancel();
      animRef.current = null;
    };
    // `run` restarts the line on every selection.
  }, [auto, run, active, select]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;
    if (paused) anim.pause();
    else if (anim.playState === 'paused') anim.play();
  }, [paused, run]);

  /** Arrow keys, Home and End move between the tabs (WAI-ARIA tabs pattern). */
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const keys: Record<string, number> = {
      ArrowDown: (i + 1) % COUNT,
      ArrowRight: (i + 1) % COUNT,
      ArrowUp: (i - 1 + COUNT) % COUNT,
      ArrowLeft: (i - 1 + COUNT) % COUNT,
      Home: 0,
      End: COUNT - 1,
    };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const stateOf = (i: number): LayerState => (i === active ? 'in' : i === previous ? 'out' : 'idle');
  const layer = auto ? LAYER : LAYER_STATIC;

  return (
    <section
      ref={sectionRef}
      id="clients"
      aria-labelledby="clients-heading"
      className="bg-bg-secondary"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false);
      }}
    >
      {/* The frame draws p-24 and an 80 gap from the header to the row. */}
      <HomeColumn className="flex flex-col gap-[32px] md:gap-[48px] lg:gap-[calc(80*var(--u))] lg:py-[calc(24*var(--u))]">
        {/* The text of node 4469:5929. Figma sets a straight apostrophe in
            "Here's". The build keeps the typographic one (FIGMA-SLIP). */}
        <SectionHeader
          headingId="clients-heading"
          headline="People Trust Us"
          subtitle="C-Level, directors, and managers - they work with us, they talk with us. They talk about us. Here’s what changed for our customers."
          reveal={MOTION.clients}
        />

        <Reveal
          as="div"
          y={24}
          enabled={MOTION.clients}
          className="flex flex-col-reverse gap-[24px] md:gap-[32px] lg:grid lg:grid-cols-2 lg:gap-[calc(80*var(--u))]"
        >
          {/* Two equal columns from lg (656 at 1440). A grid, not flex-1:
              flex-1 adds the card padding to the card column.
              The author tabs. Default 60%, hover 85%, active 100% on white,
              350ms. The active tab has no bottom rule, as drawn. */}
          <div role="tablist" aria-label="Client testimonials" aria-orientation="vertical" className="flex min-w-0 flex-col">
            {TESTIMONIALS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.name}
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={tabId(i)}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={panelId}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`flex w-full items-center gap-[12px] px-[16px] py-[12px] text-left transition-[opacity,background-color] duration-[350ms] ease-[ease] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary md:gap-[16px] md:px-[20px] md:py-[16px] lg:gap-[calc(16*var(--u))] lg:px-[calc(20*var(--u))] lg:py-[calc(16*var(--u))] ${
                    on ? 'bg-bg-default opacity-100' : 'border-b border-border-frame opacity-60 hover:opacity-[0.85]'
                  }`}
                >
                  <Portrait t={t} className="h-[40px] w-[40px] md:h-[48px] md:w-[48px] lg:h-[calc(48*var(--u))] lg:w-[calc(48*var(--u))]" />
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px] lg:gap-[calc(2*var(--u))]">
                    <span className="font-sans text-[16px] font-semibold leading-[24px] text-text-default md:text-[18px] md:leading-[26px] lg:text-[length:calc(20*var(--u))] lg:leading-[calc(28*var(--u))]">
                      {t.name}
                    </span>
                    <span className="font-body text-[12px] font-medium leading-[18px] text-subtitle md:text-[14px] md:leading-[20px] lg:text-[length:max(12px,calc(14*var(--u)))] lg:leading-[max(17px,calc(20*var(--u)))]">
                      {t.role}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* The featured card: white, p-48, 32 between the parts. While the
              testimonials change by themselves, the live region is off, so a
              screen reader does not read each change. On focus in the section
              (the line stops) and with reduced motion, it reads the change. */}
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            aria-live={!auto || focusIn ? 'polite' : 'off'}
            className="flex min-w-0 flex-col gap-[20px] bg-bg-default p-[24px] md:gap-[24px] md:p-[32px] lg:gap-[calc(32*var(--u))] lg:p-[calc(48*var(--u))]"
          >
            <QuoteIcon />
            <div className="grid">
              {TESTIMONIALS.map((t, i) => (
                <blockquote
                  key={t.name}
                  aria-hidden={i !== active || undefined}
                  className={`[grid-area:1/1] font-sans text-[20px] font-semibold leading-[28px] text-text-default md:text-[24px] md:leading-[34px] lg:text-[length:calc(28*var(--u))] lg:leading-[calc(40*var(--u))] ${layer[stateOf(i)]}`}
                >
                  {t.quote}
                </blockquote>
              ))}
            </div>
            {/* The progress divider: a 2px #E5E5E5 track and a primary fill.
                With reduced motion, only the track shows. */}
            <span aria-hidden="true" className="relative block h-[2px] w-full overflow-hidden bg-border-frame">
              {auto && (
                <span
                  ref={fillRef}
                  className="absolute inset-0 origin-left bg-primary"
                  style={{ transform: 'scaleX(0)' }}
                />
              )}
            </span>
            <div className="grid">
              {TESTIMONIALS.map((t, i) => (
                <figure
                  key={t.name}
                  aria-hidden={i !== active || undefined}
                  className={`[grid-area:1/1] flex items-center gap-[12px] md:gap-[16px] lg:gap-[calc(16*var(--u))] ${layer[stateOf(i)]}`}
                >
                  <Portrait t={t} className="h-[48px] w-[48px] md:h-[56px] md:w-[56px] lg:h-[calc(64*var(--u))] lg:w-[calc(64*var(--u))]" />
                  <figcaption className="flex min-w-0 flex-col gap-[2px] lg:gap-[calc(4*var(--u))]">
                    <span className="font-sans text-[18px] font-semibold leading-[26px] text-text-default md:text-[20px] md:leading-[28px] lg:text-[length:calc(24*var(--u))] lg:leading-[calc(32*var(--u))]">
                      {t.name}
                    </span>
                    <span className="font-body text-[14px] font-normal leading-[20px] text-subtitle md:text-[16px] md:leading-[24px] lg:text-[length:calc(20*var(--u))] lg:leading-[calc(28*var(--u))]">
                      {t.role}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      </HomeColumn>
    </section>
  );
};

export default ClientStories;
