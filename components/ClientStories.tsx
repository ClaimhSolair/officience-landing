import React from 'react';
import { motion } from 'framer-motion';
import Container from './ui/Container';
import Reveal, { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import { EASE, MOTION, SEC, STAGGER, useMotionEnabled } from '../lib/motion';
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
    quote: '"Officience has become our main partner and I don\u2019t regret it a single day."',
    name: 'Dr. Jean Marcel Guillon',
    role: 'FV Hospital',
    image: ASSETS.testimonials.authors[1],
  },
  {
    quote: '"I really appreciate the team\u2019s availability & responsiveness."',
    name: 'Mr. Leurette',
    role: 'Program Director - Orange',
    image: ASSETS.testimonials.authors[0],
  },
  {
    // The 390 frame repeats the second quote here; 1920 carries the real one.
    quote: '\u201cWithout you, I just could not work.\u201d',
    name: 'L. Lemaire',
    role: 'Director of Sales',
    image: ASSETS.testimonials.authors[2],
  },
];

const ClientStories: React.FC = () => {
  const motionOn = useMotionEnabled();

  return (
  <section id="clients" className="bg-bg-secondary">
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
        className="flex w-full flex-col gap-fig-20 lg:max-w-[847px] lg:flex-1 lg:gap-fig-100"
      >
        {TESTIMONIALS.map((t) => (
          <RevealChild
            as="li"
            key={t.name}
            y={40}
            /* Both frames fix the card height — 174 at 390, 200 at 1920 — while
               their own contents measure a couple of pixels more. A min-height
               keeps the stack's rhythm without clipping the role's descenders,
               and squares up the third card, whose quote is a line shorter than
               the other two and would otherwise sit 20px low. */
            className="flex min-h-[174px] flex-col gap-fig-12 rounded-fig-xs bg-bg-default px-fig-24 py-[36px] lg:min-h-[200px] lg:gap-fig-20 lg:rounded-fig-l lg:p-fig-40 lg:shadow-fig-sm"
          >
            <p className="font-body text-body-md text-text-default lg:text-body-xl">{t.quote}</p>
            {/* The rule draws itself in from the left once the card has landed,
                which is what separates the quote from its attribution rather than
                the two simply appearing together. */}
            <motion.hr
              className="w-full origin-left border-0 border-t border-border-frame"
              initial={motionOn && MOTION.clients ? { scaleX: 0 } : false}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: SEC.revealFast, ease: [...EASE.reveal], delay: 0.25 }}
            />

            <div className="flex items-center gap-fig-8 lg:gap-fig-12">
              {/* The name sits next to the portrait, so the portrait repeating it
                  as alt text would double it up for a screen reader. */}
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
          </RevealChild>
        ))}
      </Reveal>
    </Container>
  </section>
  );
};

export default ClientStories;
