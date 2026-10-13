import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Container from './ui/Container';
import Reveal, { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import { EASE, MOTION, SEC, STAGGER, useMinWidth, useMotionEnabled, useScrub } from '../lib/motion';
import { ASSETS } from '../assets';

/**
 * Figma 3151:2378 (1920) and 3137:2470 (390).
 *
 * Three quotes on a fixed stack — neither artboard draws a carousel, so this is
 * the one deck on the page with no controls. 1920 sets the header beside the
 * quotes in a 632px column and gives the stack 847px; 390 puts the header above
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
    // frame the copy was set in, and the tense is right. Figma sets a straight
    // apostrophe in "don't"; the build keeps the typographic one (FIGMA-SLIP).
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
 * in `.claude/motion-catalog.md`, Item 13: x = 150·N, scrubbed to rest). Each card
 * enters from the right, behind an `overflow-x-clip`, and settles at its resting
 * position. There is no rise and no tilt.
 *
 * Each card starts further right than the one above it, as the design team's
 * sketch draws (tracker row 13). Card 1 moves in a short distance, card 2 starts
 * at the edge of the column, and card 3 starts past the edge of the screen. The
 * values come from that sketch. Tune here.
 */
const SLIDE_X = [230, 540, 840];

/**
 * The card box, shared by the static and the scrubbed branch. It fills the
 * column, which is 847px at 1920, as frame 3151:2378 draws it. An earlier
 * 545px cap (from frame 3129:3363) left an empty band on the right of the
 * cards (tracker row 25).
 *
 * At 1920 the card is 200 tall, as 3151:2378 draws: 40 above the quote and 38
 * under the author row, because the drawn rule takes no height. The rule here
 * takes back its 1px with a negative margin (`RULE`). It is a min-height, not a
 * fixed height, so a quote that wraps at a narrower width grows the card.
 */
const CARD =
  'flex min-h-[174px] flex-col gap-fig-12 rounded-fig-xs bg-bg-default px-fig-24 py-[36px] lg:min-h-[200px] lg:gap-fig-20 lg:rounded-fig-l lg:px-fig-40 lg:pb-[38px] lg:pt-fig-40';

const Testimonial: React.FC<{
  t: (typeof TESTIMONIALS)[number];
  index: number;
  scrub: boolean;
  motionOn: boolean;
}> = ({ t, index, scrub, motionOn }) => {
  // The observed li never transforms, so its measured position stays honest —
  // the moving box is the inner div. (Capabilities ServiceRow, same reason.)
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  // Smoothed so the card glides between wheel notches; overdamped, so it never
  // overshoots its resting position.
  const p = useScrub(scrollYProgress);
  // The card slides in from the right and stops at its resting position. After
  // that, the value stays at rest. No rise, no tilt.
  const x = useTransform(p, [0, 1], [SLIDE_X[index] ?? SLIDE_X[SLIDE_X.length - 1], 0]);

  const body = (
    <>
      <p className="font-body text-body-md text-text-default lg:text-body-xl">{t.quote}</p>
      {/* The rule draws itself in from the left once the card has landed, which
          separates the quote from its attribution rather than the two simply
          appearing together. */}
      <motion.hr
        className="w-full origin-left border-0 border-t border-border-frame lg:-mb-px"
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
    {/* 1920 lays the two columns out at 632 / 146 / 847 inside the 1792 content
        width. The 146px gap belongs at lg, not 3xl: a maximised 1920x1080 browser
        reports about 1910px of viewport, so 3xl (1920px) never fires there and the
        cards used to sit 82px left of the artboard. Fixed step rather than a
        percentage, because breakpoints in this project swap values instead of
        interpolating them. */}
    <Container className="flex flex-col gap-fig-24 py-fig-32 lg:flex-row lg:items-start lg:gap-fig-146 lg:py-fig-100">
      {/* The column hugs the 632px heading (3137:2109, Figma changed), so the
          cards start at x 842 at 1920. 632 / 1792 = 35.27%. The heading is nowrap
          only from 2xl. Below 1920 the column shrinks with the viewport and the
          86px type does not. From 2xl the heading runs into the 146px gap, which
          has room for it. Below 2xl it wraps inside its column. */}
      <Reveal
        as="div"
        stagger={STAGGER.base}
        enabled={MOTION.clients}
        className="flex flex-col items-start gap-fig-8 lg:w-[35.27%] lg:max-w-[632px] lg:shrink-0 lg:gap-fig-16"
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
        {/* No rule behind the cards. The design team removed it (tracker row 13). */}
        {TESTIMONIALS.map((t, i) => (
          <Testimonial key={t.name} t={t} index={i} scrub={scrub} motionOn={motionOn} />
        ))}
      </Reveal>
    </Container>
  </section>
  );
};

export default ClientStories;
