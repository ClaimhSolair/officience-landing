import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Container from './ui/Container';
import Reveal, { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import { EASE, MOTION, SEC, STAGGER, useMinWidth, useMotionEnabled } from '../lib/motion';
import { ASSETS } from '../assets';

/**
 * Figma 3151:2378 (1920) and 3137:2470 (390).
 *
 * Three quotes on a fixed stack — neither artboard draws a carousel, so this is
 * the one deck on the page with no controls. 1920 sets the header beside the
 * quotes in a 600px column and gives the stack 847px; 390 puts the header above
 * and the cards run the full content width.
 *
 * The card is drawn twice with real differences, all reproduced below:
 *
 *   card      390: 4px radius, no shadow      1920: 12px radius, Shadow-sm
 *   quote     Montserrat Medium 14/20         Montserrat Regular 20/28
 *   name      Montserrat Bold 14/22           Lexend Medium 20/28
 *   role      Montserrat Regular 10/16        Montserrat Medium 14/22
 *   avatar    36px                            52px
 *
 * The family swap on the name is the artboards', not a simplification: 390 keeps
 * the author in the body face where 1920 promotes it to the heading face.
 */
const TESTIMONIALS = [
  {
    // 390 writes "had become"; 1920 writes "has". Following 1920 — it is the
    // frame the copy was set in, and the tense is right.
    quote: '"Officience has become our main partner and I don’t regret it a single day."',
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
    // The 390 frame repeats the second quote here; 1920 carries the real one.
    quote: '“Without you, I just could not work.”',
    name: 'L. Lemaire',
    role: 'Director of Sales',
    image: ASSETS.testimonials.authors[2],
  },
];

/**
 * Slide-in, adapted from the outsourceconsultants.com PROCESS deck (measured law
 * in `.claude/motion-catalog.md`, Item 13: x = 150·N, scrubbed to rest). The user
 * set a pure horizontal slide here: each card enters from the right, behind an
 * `overflow-x-clip`, and settles at its resting position — no rise and no tilt.
 * The reference is drawn on the site's own blue grid; the user chose a single
 * subtle neutral rule instead.
 *
 * One constant; tune here.
 */
const SLIDE_X = 160;

/**
 * Overdamped, so a straightening card glides between wheel notches and never
 * bounces past upright. Same shape as the Capabilities deck spring.
 */
const SCRUB_SPRING = { stiffness: 120, damping: 28, restDelta: 0.001 };

/**
 * The card box, shared by the static and the scrubbed branch. Capped at the
 * frame's 545px on lg (3129:3363) and left-aligned in the wider column, so the
 * open space on its right is the room the slide-in enters from.
 */
const CARD =
  'flex min-h-[174px] flex-col gap-fig-12 rounded-fig-xs bg-bg-default px-fig-24 py-[36px] lg:min-h-[200px] lg:max-w-[545px] lg:gap-fig-20 lg:rounded-fig-l lg:p-fig-40';

const Testimonial: React.FC<{
  t: (typeof TESTIMONIALS)[number];
  scrub: boolean;
  motionOn: boolean;
}> = ({ t, scrub, motionOn }) => {
  // The observed li never transforms, so its measured position stays honest —
  // the moving box is the inner div. (Capabilities ServiceRow, same reason.)
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const p = useSpring(scrollYProgress, SCRUB_SPRING);
  // Card slides in from the right and settles at its resting position; clamped at
  // rest after. No rise, no tilt — a pure horizontal slide.
  const x = useTransform(p, [0, 1], [SLIDE_X, 0]);

  const body = (
    <>
      <p className="font-body text-body-md text-text-default lg:text-body-xl">{t.quote}</p>
      {/* The rule draws itself in from the left once the card has landed, which
          separates the quote from its attribution rather than the two simply
          appearing together. */}
      <motion.hr
        className="w-full origin-left border-0 border-t border-border-frame"
        initial={motionOn && MOTION.clients ? { scaleX: 0 } : false}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: SEC.revealFast, ease: [...EASE.reveal], delay: 0.25 }}
      />

      <div className="flex items-center gap-fig-8 lg:gap-fig-12">
        {/* The name sits next to the portrait, so the portrait repeating it as alt
            text would double it up for a screen reader. */}
        <img
          src={t.image}
          alt=""
          aria-hidden="true"
          width={52}
          height={52}
          className="h-[36px] w-[36px] shrink-0 rounded-full object-cover lg:h-[52px] lg:w-[52px]"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col lg:gap-[4px]">
          <p className="font-body font-bold text-[14px] leading-[22px] text-text-default lg:font-sans lg:text-h4">
            {t.name}
          </p>
          <p className="font-body text-[10px] leading-[16px] text-subtitle lg:text-[14px] lg:font-medium lg:leading-[22px]">
            {t.role}
          </p>
        </div>
      </div>
    </>
  );

  // Reduced motion and mobile keep the approved static card exactly — its own
  // fade-rise entrance and nothing more. A scrub cannot reach this branch, so it
  // needs no MotionValue. Branch to keyed elements; never re-prop one node
  // between a variant entrance and a style-MotionValue transform.
  if (!scrub) {
    return (
      /* min-height keeps the stack rhythm without clipping the role descenders,
         and squares the shorter third card. */
      <RevealChild as="li" y={40} className={CARD}>
        {body}
      </RevealChild>
    );
  }

  return (
    <li ref={ref} className="relative z-10">
      <motion.div className={CARD} style={{ x }}>
        {body}
      </motion.div>
    </li>
  );
};

const ClientStories: React.FC = () => {
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);
  // The slide-tilt scrub runs on desktop only, and folds in reduced motion
  // through `motionOn`. Off ⇒ the approved static stack, unchanged.
  const scrub = motionOn && wide && MOTION.clients;

  return (
  // overflow-x-clip catches the cards while they are still slid to the right, so
  // the entrance never widens the page. It clips the x axis only, so the card
  // rule draw and the rest of the column are untouched.
  <section id="clients" className="overflow-x-clip bg-bg-secondary">
    {/* 1920 lays the two columns out at 600 / 146 / 847 inside the 1792 content
        width. The 146px gap belongs at lg, not 3xl: a maximised 1920x1080 browser
        reports about 1910px of viewport, so 3xl (1920px) never fires there and the
        cards used to sit 82px left of the artboard. Fixed step rather than a
        percentage, because breakpoints in this project swap values instead of
        interpolating them. */}
    <Container className="flex flex-col gap-fig-24 py-fig-32 lg:flex-row lg:items-start lg:gap-fig-146 lg:py-fig-100">
      {/* The heading is nowrap only from 2xl. Figma lets it overrun its own column
          — 632px of text in a 600px frame — which is fine at 1920 because the cards
          start 114px further right, but between lg and 2xl the column shrinks with
          the viewport while the 86px type does not, and the heading ran straight
          over the cards. Below 2xl it wraps inside its column instead. */}
      <Reveal
        as="div"
        stagger={STAGGER.base}
        enabled={MOTION.clients}
        className="flex flex-col items-start gap-fig-8 lg:w-[35%] lg:max-w-[600px] lg:shrink-0 lg:gap-fig-16"
      >
        <RevealChild as="span" y={20} duration={SEC.revealFast}>
          <SectionBadge>Client Review</SectionBadge>
        </RevealChild>
        <RevealChild as="span" y={28}>
          <h2 className="font-sans text-h1 text-text-default lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em] 2xl:whitespace-nowrap">
            People Trust Us
          </h2>
        </RevealChild>
      </Reveal>

      <Reveal
        as="ul"
        stagger={STAGGER.loose}
        enabled={MOTION.clients}
        className="relative flex w-full flex-col gap-fig-20 lg:max-w-[847px] lg:flex-1 lg:gap-fig-100"
      >
        {/* The spine. A single thin neutral rule down the centre of the 545px
            card, behind the cards (z-0 against their z-10), so it reads only in
            the gaps between them — the reference look, without its full blue
            grid. Centred on the card (273 ≈ 545/2), not the wider column, now
            the cards are left-aligned. Appears only when the scrub does. */}
        {scrub && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[273px] top-0 z-0 hidden h-full w-px -translate-x-1/2 bg-border-field lg:block"
          />
        )}
        {TESTIMONIALS.map((t) => (
          <Testimonial key={t.name} t={t} scrub={scrub} motionOn={motionOn} />
        ))}
      </Reveal>
    </Container>
  </section>
  );
};

export default ClientStories;
