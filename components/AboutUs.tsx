import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ASSETS, srcSetOf } from '../assets';
import Container from './ui/Container';
import Odometer from './ui/Odometer';
import Reveal, { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import { MOTION, SEC, STAGGER, STICKY_TOP, useMotionEnabled } from '../lib/motion';
import { DISCOVER_OUR_STORY, EXTERNAL } from './navigation';

/**
 * Figma 3144:3187 (1920) and 3187:4452 (390).
 *
 * Three parts: a manifesto with an eyebrow, a row of milestones, and three
 * full-width photo cards. The desktop cards lay the caption over the photo in
 * an inset tinted band; at 390 the same band sits below the image instead,
 * because a 358px-wide overlay would bury the picture.
 *
 * The photo box is sized by **aspect ratio, not a fixed height**. A fixed height
 * against a fluid width makes the box aspect a function of the viewport: h-220 gave
 * 1.63 at 390 but 4.50 by 1023, so a cover-crop threw away 70% of the picture on a
 * tablet, and h-860 gave 1.43 at 1280 against 2.08 at 1920, so the same photo looked
 * horizontally squeezed on a scaled laptop. Constant ratios per breakpoint — 358/220
 * (358/237 on card 3) from the 390 frame, 1792/860 from the 1920 frame — make every
 * width inside a breakpoint proportionally identical.
 *
 * The two artboards **frame** these photos differently, not merely size them
 * differently, so this is art direction and needs <picture>; srcset only varies
 * resolution. 1920 stretches the whole frame into its 1792x860 box (sources of 1.33
 * and 1.50 against a 2.08 box, where a cover-crop would cut the subjects' heads off
 * — ruled 2026-08-26: match the artboard and accept that people render wide). 390
 * instead zoom-crops each photo 1.4-1.7x past what object-fit: cover would use and
 * offsets it, which is why trying to serve one file to both ends in a stretch on the
 * phone. The mobile files carry that crop baked in at exactly the artboard's box
 * aspect, so object-cover is a no-op there and CSS distorts nothing.
 *
 * Card 1's mobile fill is drawn with a 0.915 horizontal squeeze in Figma — that is
 * the artboard's, reproduced in the file rather than corrected.
 */

/** Emphasised opening, then the remainder in grey. */
const MANIFESTO_LEAD = "We don't just build software. We architect";
const MANIFESTO_REST = ' the future by empowering units of specialized technical talents.';

const MILESTONES = [
  { value: '6', label: 'Global Offices' },
  { value: '200', label: 'Special Talents' },
  { value: '20', label: 'Years milestone' },
  { value: '500+', label: 'Projects Done' },
];

interface StoryCard {
  title: string;
  body: string;
  /** Band tint. Each card gets its own. */
  tint: string;
  /**
   * The complete object-fit treatment. Written out per card rather than composed
   * from a shared base, because object-fit is one CSS property and two unprefixed
   * Tailwind utilities for it would collide on stylesheet order, not on the order
   * they appear in the class list.
   */
  fit: string;
  /** The 390 box aspect. Card 3's photo is drawn 237 tall where the others are 220. */
  aspect: string;
  alt: string;
}

const STORY_CARDS: StoryCard[] = [
  {
    title: '20 Years of Delivery',
    body: "Since 2006, we've completed hundreds of projects for clients across Europe, Asia and beyond",
    tint: 'bg-pri-100',
    fit: 'object-cover object-[49%_64%]',
    aspect: 'aspect-[358/220]',
    alt: 'Officience team members gathered around a meeting-room table',
  },
  {
    title: 'Shared Value',
    body: "Our model is built on mutual growth. We empower our technical units so they can empower your vision. It's a cosmic cycle of technical excellence.",
    tint: 'bg-green-100',
    fit: 'object-cover lg:object-fill',
    aspect: 'aspect-[358/220]',
    alt: 'Officience colleagues working together',
  },
  {
    title: 'Global Reach',
    body: 'Connect with our teams in Vietnam, France, USA, Japan, Singapore.',
    tint: 'bg-sec-100',
    fit: 'object-cover lg:object-fill',
    aspect: 'aspect-[358/237]',
    alt: 'Officience team collaborating across offices',
  },
];

/**
 * Splits copy into per-character spans for the scroll sweep, wrapping each word
 * in an inline-block so a line can only ever break between words. The reference
 * animates bare characters and consequently breaks them mid-word ("d/eserves");
 * that is a flaw rather than a feature and is not worth reproducing.
 *
 * Each span carries only its index. The frontier is published once per frame as
 * a CSS variable on the paragraph and every character compares itself against it
 * in CSS, so a hundred-character sweep costs one style write per frame instead
 * of a hundred.
 */
const scrubbedWords = (text: string, startIndex: number, toneClass: string) => {
  const nodes: React.ReactNode[] = [];
  const words = text.split(' ');
  let index = startIndex;

  words.forEach((word, w) => {
    nodes.push(
      <span key={`w${startIndex}-${w}`} className={`inline-block ${toneClass}`}>
        {[...word].map((ch, c) => {
          const i = index;
          index += 1;
          return (
            <span key={c} className="manifesto-char" style={{ '--i': i } as React.CSSProperties}>
              {ch}
            </span>
          );
        })}
      </span>,
    );
    if (w < words.length - 1) {
      nodes.push(<React.Fragment key={`sp${startIndex}-${w}`}> </React.Fragment>);
      index += 1;
    }
  });

  return { nodes, next: index };
};

const MANIFESTO_CHARS = MANIFESTO_LEAD.length + 1 + MANIFESTO_REST.trim().length;

/**
 * One story card. It pins under the header while the next card slides over it,
 * scaling to 0.90 by the time the group releases, and its photo settles out of a
 * 1.2x zoom as the card arrives (`.claude/motion-catalog.md`, items 4 and 7).
 *
 * The zoom **ends at 1.0**, so the resting frame is exactly the crop the design
 * approved — only a tighter view is ever shown on the way in. That is why this is
 * nexvio's zoom-settle rather than archiste's parallax, which needs vertical
 * overdraw and would have re-cut every photo against a settled ruling.
 *
 * Pinning costs no page height: the cards are already stacked in flow, so the
 * flow height is the runway.
 */
const StoryCardArticle: React.FC<{
  card: StoryCard;
  index: number;
  total: number;
  stack: MotionValue<number>;
}> = ({ card, index, total, stack }) => {
  const ref = useRef<HTMLElement>(null);
  const motionOn = useMotionEnabled();
  const img = ASSETS.about.cards[index];

  // Every card aims at the same release point, so later ones compress the same
  // 1.0 -> 0.90 into a shorter runway. That is the reference's behaviour rather
  // than an approximation of it.
  const from = index / total;
  const scale = useTransform(stack, (p) => {
    const t = Math.min(1, Math.max(0, (p - from) / (1 - from)));
    return 1 - 0.1 * t;
  });

  // Ends at 'center 0.6' rather than dead centre. Running the settle all the way
  // to the middle of the viewport means the last and most legible part of it —
  // the arrival at 1.0 — happens while the card is still travelling, and the
  // reader mostly sees a photo that is already still. Finishing a little early
  // puts the settle where it can be watched.
  const { scrollYProgress: arrival } = useScroll({
    target: ref,
    offset: ['start end', 'center 0.6'],
  });
  const photoScale = useTransform(arrival, [0, 1], [1.2, 1]);

  const stacking = motionOn && MOTION.aboutStack;
  const zooming = motionOn && MOTION.photoZoom;

  return (
    <motion.article
      ref={ref}
      className={`overflow-hidden rounded-fig-xs bg-bg-secondary xl:rounded-fig-l ${
        stacking ? `sticky ${STICKY_TOP}` : ''
      }`}
      style={stacking ? { scale } : undefined}
    >
      <div className="relative">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet={`${img.small} 900w, ${img.large} ${img.largeWidth}w`}
            sizes="(min-width: 1920px) 1792px, calc(100vw - 48px)"
          />
          <motion.img
            src={img.mobile[img.mobile.length - 1].url}
            srcSet={srcSetOf(img.mobile)}
            sizes="calc(100vw - 32px)"
            alt={card.alt}
            className={`block w-full ${card.aspect} lg:aspect-[1792/860] ${card.fit}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            style={zooming ? { scale: photoScale } : undefined}
          />
        </picture>

        {/* One band, two positions: stacked under the photo, or floating over
            it — inset 200px each side and 60px from the bottom, as the artboard
            draws it. The overlay starts at xl, not lg. Its geometry is the
            artboard's fixed pixels, so at 1024 the band is only 576px wide and
            its copy needs 288px of height against a fixed 176 — it spilled over
            the photo. At 1280 it fits with 104px to spare. */}
        <div
          className={`flex flex-col gap-fig-8 p-fig-16 xl:absolute xl:bottom-[60px] xl:left-[200px] xl:right-[200px] xl:h-[176px] xl:flex-row xl:items-center xl:justify-between xl:gap-fig-32 xl:rounded-fig-xs xl:p-0 xl:px-fig-64 ${card.tint}`}
        >
          <h3 className="font-sans font-semibold text-btn-lg text-text-primary xl:whitespace-nowrap xl:font-medium xl:text-h1">
            {card.title}
          </h3>
          <p className="font-body text-caption text-text-primary xl:w-[405px] xl:text-right xl:font-sans xl:font-medium xl:text-btn-md">
            {card.body}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

const AboutUs: React.FC = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);
  const motionOn = useMotionEnabled();

  const { scrollYProgress: stack } = useScroll({
    target: cardsRef,
    offset: ['start start', 'end end'],
  });

  // The frontier crosses the whole string across roughly eight tenths of a
  // viewport: it starts when the paragraph top is 72% down the screen and
  // finishes just after that top leaves. Expressed in viewport terms rather than
  // the reference's characters-per-pixel, which would make our sweep length an
  // accident of how long this copy happens to be.
  const { scrollYProgress: sweep } = useScroll({
    target: manifestoRef,
    offset: ['start 0.72', 'start -0.09'],
  });
  const frontier = useTransform(sweep, [0, 1], [0, MANIFESTO_CHARS + 2]);
  const sweeping = motionOn && MOTION.manifesto;

  const lead = scrubbedWords(MANIFESTO_LEAD, 0, 'text-text-default');
  const rest = scrubbedWords(MANIFESTO_REST.trim(), lead.next + 1, 'text-subtitle');

  return (
    <section id="about" className="bg-bg-secondary">
      <Container className="flex flex-col gap-fig-64 py-fig-64 lg:gap-fig-100 lg:py-fig-100">
        {/* Manifesto. The badge hugs the left edge while the text block sits on
            the right at desktop; they stack in reading order below xl. */}
        <Reveal
          as="div"
          stagger={STAGGER.base}
          className="flex flex-col gap-fig-24 xl:flex-row xl:items-start xl:justify-between xl:gap-fig-64"
        >
          <RevealChild as="span" y={24} duration={SEC.revealFast}>
            <SectionBadge as="h2">About Us</SectionBadge>
          </RevealChild>

          <div className="flex flex-col items-start gap-fig-24 xl:w-[1018px]">
            {/* Two-tone at rest, as Figma draws it: the sweep lights each half to
                its own approved colour rather than flattening both into one. */}
            <motion.p
              ref={manifestoRef}
              className="font-sans font-semibold text-h3 text-text-default lg:font-medium lg:text-display-sm"
              style={sweeping ? ({ '--frontier': frontier } as React.CSSProperties) : undefined}
            >
              {lead.nodes} {rest.nodes}
            </motion.p>
            <RevealChild as="span" y={20} duration={SEC.revealFast} className="inline-block">
            <a
              href={DISCOVER_OUR_STORY.target.kind === 'external' ? DISCOVER_OUR_STORY.target.href : EXTERNAL.about}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-fig-8 px-fig-24 font-sans font-semibold text-btn-lg text-text-primary transition-colors hover:text-[#000086] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {DISCOVER_OUR_STORY.label}
              <ArrowRight className="h-[20px] w-[20px] shrink-0" strokeWidth={2} aria-hidden="true" />
            </a>
            </RevealChild>
          </div>
        </Reveal>

        {/* Milestones — two columns at 390, four from lg. */}
        {/* The four arrive left to right, so the row reads as a row rather than
            as four numbers that happened to appear together. The odometers start
            their own roll on the same cue. */}
        <Reveal
          as="ul"
          stagger={STAGGER.loose}
          amount={0.4}
          className="grid grid-cols-2 gap-x-fig-20 gap-y-fig-20 lg:grid-cols-4 lg:gap-x-fig-32"
        >
          {MILESTONES.map(({ value, label }) => (
            <RevealChild as="li" key={label} y={28} duration={SEC.revealFast} className="flex flex-col items-center gap-fig-16 lg:gap-fig-8">
              <span className="font-sans font-medium text-display-sm text-text-primary lg:font-semibold lg:text-[86px] lg:leading-[74px] lg:tracking-[-0.03em]">
                {MOTION.counters ? <Odometer value={value} /> : value}
              </span>
              <span className="text-center font-body text-body-lg text-subtitle lg:text-body-xl">{label}</span>
            </RevealChild>
          ))}
        </Reveal>

        {/* Story cards */}
        <div ref={cardsRef} className="flex flex-col gap-fig-56 lg:gap-fig-64">
          {STORY_CARDS.map((card, i) => (
            <StoryCardArticle
              key={card.title}
              card={card}
              index={i}
              total={STORY_CARDS.length}
              stack={stack}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AboutUs;
