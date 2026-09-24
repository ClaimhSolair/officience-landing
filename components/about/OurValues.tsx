import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import ValueMark, { type ValueId } from './ValueMarks';
import { EASE, MOTION, SEC, SPRING, STAGGER, useMinWidth, useMotionEnabled } from '../../lib/motion';

/**
 * Our Values — the section is Figma 3489:3191, and the cards are 3363:3591
 * (the card design of 2026-09-24).
 *
 * COMIC, as five panels of one accordion. The artboard draws Caring open: its
 * panel is 448 wide and the other four are 214, on a 20px gutter, which fills
 * the 1384 row exactly.
 *
 * **The card design (user, 2026-09-24).** The accordion and its animation stay.
 * Each card follows 3363:3591:
 *  - a 589px panel;
 *  - the open panel is BG/Default (white), and a closed panel is BG/Secondary,
 *    the same fill as the section;
 *  - the title is Display-sm in Text/Primary and the body is Body-lg-medium in
 *    Text/Default, in every panel, as the frame draws them;
 *  - each mark sits at the panel's top-left, at its own size and offset, in
 *    both states. The frame draws only that one position, so the mark does not
 *    move when a panel opens (it moved from left to right before).
 * A closed panel still clips its text block, which is 407 wide in a 214 panel.
 *
 * Below lg the file draws nothing. Five 214px panels cannot share a phone
 * screen, so the accordion is a plain stack there with every panel open.
 *
 * Animation (Sept-2026 motion pass): the panel resize uses spring physics
 * (SPRING.panel). Each panel staggers in on first viewport entry. Marks pop
 * from scale 0.6 / rotate -45 with EASE.roll overshoot.
 */

/** The text block's top edge inside the 589px panel (frame 3363:3591). */
const TEXT_TOP = 342;

/**
 * The row as the artboard draws it: four 214px panels, one 448px panel, and
 * four 20px gutters. The panels are sized by their SHARE of the row rather than
 * by those pixels, so the proportions hold at 1440 and still fit at 1024.
 */
const GAP_TOTAL = 4 * 20;
const PANEL_SUM = 4 * 214 + 448;
const CLOSED_SHARE = (214 / PANEL_SUM).toFixed(6);
const OPEN_SHARE = (448 / PANEL_SUM).toFixed(6);

interface ValueItem {
  id: ValueId;
  title: string;
  body: string;
  /** The mark's top-left corner inside the panel, from frame 3363:3591. */
  markAt: { x: number; y: number };
}

const VALUES: ValueItem[] = [
  {
    id: 'commitment',
    title: 'Commitment',
    body: 'Actions speak louder than words, and together with consistency, they go a long way. So be a man of actions yourself, not just a man of words.',
    markAt: { x: -98, y: -121 },
  },
  {
    id: 'openness',
    title: 'Open & Sincerity',
    body: 'In the end, we’re all human, and our thoughts and feelings need to be appreciated, hence the need for an environment of trust where constructive criticisms are encouraged.',
    markAt: { x: -55, y: -62 },
  },
  {
    id: 'merit',
    title: 'Merit',
    body: 'In Maslow’s hierarchy of needs, self-esteem is the second-highest need to give meaning to our contributions and respects we need to be more than we are today.',
    markAt: { x: -45, y: -86 },
  },
  {
    // The frame puts a 336 box at (-76, -104) and the art 4.57px inside it.
    id: 'innovation',
    title: 'Innovation',
    body: 'Creativity and innovation are vital to our social and global development, and the root of the continuous improvement which we promised.',
    markAt: { x: -71.43, y: -99.43 },
  },
  {
    id: 'caring',
    title: 'Caring',
    body: 'No one is the exact same as anyone but through empathy and compassion, we can understand each other in order to build a strong and connected society.',
    markAt: { x: -38, y: -65 },
  },
];

/** The artboard opens Caring. */
const DEFAULT_OPEN: ValueId = 'caring';

const panelBasis = (isOpen: boolean) =>
  `calc((100% - ${GAP_TOTAL}px) * ${isOpen ? OPEN_SHARE : CLOSED_SHARE})`;

const OurValues: React.FC = () => {
  const [open, setOpen] = useState<ValueId>(DEFAULT_OPEN);
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutValues;
  const isLg = useMinWidth(1024);

  const spring = enabled
    ? { type: 'spring' as const, ...SPRING.panel }
    : { duration: 0 };

  return (
    <section id="our-values" className="bg-background py-fig-64 lg:pb-fig-100 lg:pt-fig-64">
      <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
        <Reveal className="flex flex-col gap-fig-24 lg:flex-row lg:justify-between lg:gap-fig-32">
          <RevealChild y={24} duration={SEC.revealFast} className="lg:shrink-0">
            <SectionBadge as="h2">Our Values</SectionBadge>
          </RevealChild>
          {/* 801 of the artboard's 1392 column, flush right. */}
          <RevealChild y={24} duration={SEC.revealFast} className="lg:w-[801px] lg:shrink-0">
            <p className="font-sans font-medium text-h2 text-text-default lg:text-display-sm">
              We define our Values as a large portrait representing our people.
            </p>
          </RevealChild>
        </Reveal>

        {/* Below lg: a plain stack, every panel open, no interaction.
            From lg: the accordion, one panel open at a time. */}
        <ul className="flex flex-col gap-fig-40 lg:h-[589px] lg:flex-row lg:gap-fig-20">
          {VALUES.map((item, index) => {
            const isOpen = open === item.id;

            return (
              <motion.li
                key={item.id}
                // The fill changes with the state: white when open, the section's
                // own BG/Secondary when closed. Only from lg, where the panels exist.
                className={`lg:h-full lg:shrink-0 lg:overflow-hidden lg:transition-colors lg:duration-300 motion-reduce:transition-none ${
                  isOpen ? 'lg:bg-surface' : 'lg:bg-bg-secondary'
                }`}
                initial={enabled ? { y: 40, opacity: 0 } : { opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                animate={isLg ? { flexBasis: panelBasis(isOpen) } : undefined}
                transition={{
                  y: enabled
                    ? { duration: SEC.revealBase, ease: EASE.reveal, delay: index * STAGGER.base }
                    : { duration: 0 },
                  opacity: {
                    duration: SEC.revealFast,
                    ease: EASE.reveal,
                    delay: enabled ? index * STAGGER.base : 0,
                  },
                  flexBasis: spring,
                }}
              >
                {/*
                  Hover opens the panel for a pointer, focus opens it for a
                  keyboard, and a tap opens it on a touch screen, which has no
                  hover at all. The pointer handlers sit on the whole panel, but
                  the control itself is a button around the TITLE only: with the
                  body inside it, every button's accessible name became the full
                  150-word paragraph.
                */}
                <div
                  onMouseEnter={() => setOpen(item.id)}
                  onClick={() => setOpen(item.id)}
                  className="relative block w-full text-left lg:h-full"
                >
                  {/* The mark keeps one position in both states, at the panel's
                      top-left. It is drawn past the panel edge, and the panel
                      clips it. It pops in once, on first entry. */}
                  <motion.div
                    aria-hidden="true"
                    data-value-mark={item.id}
                    className="pointer-events-none absolute hidden select-none lg:block"
                    style={{ left: item.markAt.x, top: item.markAt.y }}
                    initial={enabled ? { scale: 0.6, rotate: -45, opacity: 0 } : undefined}
                    whileInView={enabled ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{
                      scale: { duration: SEC.revealFast, ease: EASE.roll, delay: index * STAGGER.base + 0.15 },
                      rotate: { duration: SEC.revealFast, ease: EASE.roll, delay: index * STAGGER.base + 0.15 },
                      opacity: { duration: SEC.revealFast, ease: EASE.reveal, delay: index * STAGGER.base },
                    }}
                  >
                    <ValueMark id={item.id} />
                  </motion.div>

                  {/* The text block is 407 wide in both states. A closed panel
                      is 214, so the artboard clips it — that is drawn, not a
                      defect. */}
                  <div
                    className="block lg:absolute lg:left-fig-20 lg:w-[407px]"
                    style={{ top: TEXT_TOP }}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`value-body-${item.id}`}
                        onFocus={() => setOpen(item.id)}
                        className="block cursor-pointer text-left font-sans font-medium text-h2 text-text-primary lg:text-display-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p
                      id={`value-body-${item.id}`}
                      className="mt-fig-20 block font-body text-body-lg font-medium text-text-default"
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};

export default OurValues;
