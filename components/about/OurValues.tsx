import React, { useState } from 'react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import { SEC } from '../../lib/motion';

/**
 * Our Values — Figma 3489:3191, with the unclipped copy in 3082:1777.
 *
 * COMIC, as five panels of one accordion. The artboard draws Caring open: its
 * panel is 448 wide and the other four are 214, on a 20px gutter, which fills
 * the 1384 row exactly.
 *
 * **The two panel states are mirrored, not one revealed.** A collapsed panel
 * puts the mark at its left (overflowing by 78) and clips the text; an open
 * panel puts the mark at its right and shows the text whole. So the mark moves
 * between the states — the collapsed panel is not the left slice of the open
 * one, and building it that way would hide the mark entirely.
 *
 * Colours are read off the two rendered states: a closed panel sets its title
 * and body in Text/Subtitle-2 grey, and an open one sets the title in
 * Text/Primary blue and the body in Text/Default.
 *
 * Below lg the file draws nothing. Five 214px panels cannot share a phone
 * screen, so the accordion is a plain stack there with every panel open.
 */

const PANEL_H = 523;
const MARK = 284;
/** Mark offsets from the panel's left edge, closed and open. */
const MARK_X_CLOSED = -78;
const MARK_X_OPEN = 242;

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
  id: string;
  title: string;
  body: string;
  /**
   * The mark's own colour. Each value owns one, and the exported SVG carries it
   * as a single flat fill — so these are not a dimmed or an active state.
   */
  colour: string;
  mark: string;
}

const VALUES: ValueItem[] = [
  {
    id: 'commitment',
    title: 'Commitment',
    body: 'Actions speak louder than words, and together with consistency, they go a long way. So be a man of actions yourself, not just a man of words.',
    colour: '#FFF1F3',
    mark: ASSETS.aboutPage.values.commitment,
  },
  {
    id: 'openness',
    title: 'Open & Sincerity',
    body: 'In the end, we’re all human, and our thoughts and feelings need to be appreciated, hence the need for an environment of trust where constructive criticisms are encouraged.',
    colour: '#FFEB97',
    mark: ASSETS.aboutPage.values.openness,
  },
  {
    id: 'merit',
    title: 'Merit',
    body: 'In Maslow’s hierarchy of needs, self-esteem is the second-highest need to give meaning to our contributions and respects we need to be more than we are today.',
    colour: '#FFBFC7',
    mark: ASSETS.aboutPage.values.merit,
  },
  {
    id: 'innovation',
    title: 'Innovation',
    body: 'Creativity and innovation are vital to our social and global development, and the root of the continuous improvement which we promised.',
    colour: '#CAF2E0',
    mark: ASSETS.aboutPage.values.innovation,
  },
  {
    id: 'caring',
    title: 'Caring',
    body: 'No one is the exact same as anyone but through empathy and compassion, we can understand each other in order to build a strong and connected society.',
    colour: '#1F49BF',
    mark: ASSETS.aboutPage.values.caring,
  },
];

/** The artboard opens Caring. */
const DEFAULT_OPEN = 'caring';

const OurValues: React.FC = () => {
  const [open, setOpen] = useState(DEFAULT_OPEN);

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
        <ul className="flex flex-col gap-fig-40 lg:h-[523px] lg:flex-row lg:gap-fig-20">
          {VALUES.map((item) => {
            const isOpen = open === item.id;
            // The basis travels through a custom property so it binds only at
            // lg. As a plain inline style it would apply below lg too, where the
            // list is a column — and a flex-basis in a column sets the panel's
            // HEIGHT, not its width.
            //
            // The widths are the artboard's PROPORTIONS, not its pixels. 214 and
            // 448 on four 20px gutters need 1384px, which fits the column only
            // from about 1432px up; at 1024 the row ran 384px past the screen,
            // clipped by `body { overflow-x: hidden }` and therefore invisible.
            // The shares reproduce the artboard exactly at 1440 and scale below.
            return (
              <li
                key={item.id}
                className="lg:h-full lg:shrink-0 lg:basis-[var(--panel-basis)] lg:overflow-hidden lg:transition-[flex-basis] lg:duration-500 lg:ease-out lg:motion-reduce:transition-none"
                style={
                  {
                    '--panel-basis': `calc((100% - ${GAP_TOTAL}px) * ${isOpen ? OPEN_SHARE : CLOSED_SHARE})`,
                  } as React.CSSProperties
                }
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
                  {/* The mark travels with the state: a closed panel holds it at
                      the panel's left edge, an open one at its right. Each file
                      is 284x284 and clips itself, because several petals are
                      drawn past that frame on purpose. */}
                  <img
                    src={item.mark}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                    data-value-mark={item.id}
                    data-mark-colour={item.colour}
                    // `max-w-none` matters: a global `img { max-width: 100% }`
                    // capped the mark to the panel width and squashed it to
                    // 215x284. The panel must CLIP the 284 square, not resize it.
                    className="pointer-events-none absolute hidden max-w-none select-none lg:block lg:transition-[left] lg:duration-500 lg:ease-out lg:motion-reduce:transition-none"
                    style={{
                      width: MARK,
                      height: MARK,
                      top: -75,
                      left: isOpen ? MARK_X_OPEN : MARK_X_CLOSED,
                    }}
                  />

                  {/* The text block is 407 wide in both states. A closed panel
                      is 214, so the artboard clips it — that is drawn, not a
                      defect. */}
                  <div
                    className="block lg:absolute lg:left-fig-20 lg:w-[407px]"
                    style={{ top: PANEL_H - 232 }}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`value-body-${item.id}`}
                        onFocus={() => setOpen(item.id)}
                        className={`block cursor-pointer text-left font-sans font-medium text-h2 transition-colors lg:text-display-sm motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          isOpen ? 'text-text-primary' : 'text-text-primary lg:text-[#A0A0A0]'
                        }`}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p
                      id={`value-body-${item.id}`}
                      className={`mt-fig-20 block font-body text-body-lg transition-colors motion-reduce:transition-none ${
                        isOpen ? 'text-text-default' : 'text-text-default lg:text-[#A0A0A0]'
                      }`}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};

export default OurValues;
