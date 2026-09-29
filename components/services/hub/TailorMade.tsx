import React from 'react';
import { SEC, STAGGER } from '../../../lib/motion';
import Container from '../../ui/Container';
import Reveal, { RevealChild } from '../../ui/Reveal';
import SectionBadge from '../../ui/SectionBadge';
import {
  DONE_PATH,
  MarkSvg,
  PASTEL_1,
  PASTEL_2,
  PASTEL_3,
  PASTEL_4,
  STRONG_1,
  STRONG_2,
  STRONG_3,
  STRONG_4,
  type MarkArt,
} from './marks';

/**
 * "Built For You / Tailor-made solutions" on the Services hub — Figma 3257:2809,
 * with the grid 3530:3351 (pastel) and its strong-colour set 3530:3299.
 *
 * **Pastel at rest, strong on hover (user, 2026-09-29).** The card fill, the
 * text and the marks change together with a 300ms transition, and only for a
 * real pointer (`hover: hover`), so a tap on a phone does not leave a card
 * stuck in its strong state. The cards are not links, so they take no focus.
 * The first card keeps its blue text on the strong yellow, as Figma draws it.
 *
 * Each mark is drawn at its Figma place, size and turn in the 684px card, in
 * container units (`cqw`), so the marks scale with the card width and keep
 * their composition at every width. The strong set moves and grows some marks,
 * so the two sets are two layers that cross-fade.
 *
 * A card is at least 373/684 of its width tall, and it grows when its copy
 * needs more (the fourth card at 1024 and 1280). The minimum comes from the
 * grid's width (a container unit), not from `aspect-ratio`, so both cards in a
 * row stretch to the taller one. The marks sit in their own clipped layer, so
 * the card can follow its content.
 */

/** One mark: its bounding box in the 684px card, the art box inside, and its turn. */
interface MarkPlace {
  art: MarkArt;
  x: number;
  y: number;
  bw: number;
  bh: number;
  rotate: number;
}

interface Card {
  title: string[];
  causes?: string[];
  pastel: string;
  strong: string;
  /** The text keeps Text/Primary in the strong state (the yellow card). */
  keepBlue?: boolean;
  /** The drawn width of the title text box. */
  titleW: number;
  /** Figma centres the first two titles 10px lower than the other two. */
  topPad: 'lg:pt-[50px]' | 'lg:pt-fig-40';
  rest: MarkPlace;
  hover: MarkPlace;
}

// Card 3's boxes come from Figma's insets (46.64%/-31.9%/-24.88%/-11.58% and
// 43.57%/-47.99%/-37.53%/-24.32% of 684x373).
const CARDS: Card[] = [
  {
    title: ['Made in Vietnam – the faster tech hub in ASEAN ', '(+6.5% yearly)'],
    pastel: '#FFF1E0',
    strong: '#FFCE00',
    keepBlue: true,
    titleW: 297,
    topPad: 'lg:pt-[50px]',
    rest: { art: PASTEL_1, x: 342, y: -133, bw: 533.323, bh: 533.322, rotate: 45.7 },
    hover: { art: STRONG_1, x: 323.51, y: -130.48, bw: 576.757, bh: 576.75, rotate: 52.58 },
  },
  {
    title: ['Serving 50+ corporates across 12 countries inc. FR, USA, SGP, JPN'],
    pastel: '#ECF4FF',
    strong: '#005157',
    titleW: 334,
    topPad: 'lg:pt-[50px]',
    rest: { art: PASTEL_2, x: 335, y: -127, bw: 520.983, bh: 571.125, rotate: 57.94 },
    hover: { art: STRONG_2, x: 342, y: -120, bw: 520.983, bh: 571.125, rotate: 57.94 },
  },
  {
    title: ['Small teams, people magic'],
    pastel: '#DDF9EC',
    strong: '#007982',
    titleW: 194,
    topPad: 'lg:pt-fig-40',
    rest: { art: PASTEL_3, x: 319.02, y: -118.99, bw: 535.16, bh: 535.18, rotate: -142.93 },
    hover: { art: STRONG_3, x: 298.02, y: -179.0, bw: 642.69, bh: 642.72, rotate: -142.93 },
  },
  {
    title: ['Dedicated to our 5 Causes, with impact at heart'],
    causes: ['Social Entrepreneurship', 'Sharing Knowledge', 'Sustainability', 'Tech for Good', 'Developing Vietnam'],
    pastel: '#FFF1F3',
    strong: '#1F49BF',
    titleW: 378,
    topPad: 'lg:pt-fig-40',
    rest: { art: PASTEL_4, x: 290, y: -245, bw: 708.39, bh: 706, rotate: 0 },
    hover: { art: STRONG_4, x: 290, y: -245, bw: 708.39, bh: 706, rotate: 0 },
  },
];

/** Figma px in the 684px card, as container units. */
const cq = (px: number) => `${(px / 684) * 100}cqw`;

const Mark: React.FC<{ place: MarkPlace; className: string }> = ({ place, className }) => (
  <div
    aria-hidden="true"
    className={`absolute flex items-center justify-center transition-opacity duration-300 motion-reduce:transition-none ${className}`}
    style={{ left: cq(place.x), top: cq(place.y), width: cq(place.bw), height: cq(place.bh) }}
  >
    <div
      className="shrink-0"
      style={{ width: cq(place.art.w), height: cq(place.art.h), transform: `rotate(${place.rotate}deg)` }}
    >
      <MarkSvg art={place.art} />
    </div>
  </div>
);

const HOVER = '[@media(hover:hover)]:group-hover';

const CardView: React.FC<{ card: Card }> = ({ card }) => (
  <RevealChild
    as="li"
    y={28}
    className="group relative isolate min-h-[calc(100cqw*373/684)] rounded-fig-xs [container-type:inline-size] lg:min-h-[calc((100cqw-24px)/2*373/684)]"
  >
    {/* The fill and the marks, clipped to the card. The copy stays outside this
        layer, so the card can grow with it. */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden rounded-fig-xs transition-colors duration-300 motion-reduce:transition-none"
      style={{ backgroundColor: card.pastel }}
    >
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 motion-reduce:transition-none ${HOVER}:opacity-100`}
        style={{ backgroundColor: card.strong }}
      />
      <Mark place={card.rest} className={`${HOVER}:opacity-0`} />
      <Mark place={card.hover} className={`opacity-0 ${HOVER}:opacity-100`} />
    </div>

    <div
      className={`flex flex-col gap-fig-16 p-fig-24 text-text-primary transition-colors duration-300 motion-reduce:transition-none lg:px-fig-40 lg:pb-fig-40 ${card.topPad} ${
        card.keepBlue ? '' : `${HOVER}:text-white`
      }`}
    >
      <h3 className="font-sans text-h2" style={{ maxWidth: card.titleW }}>
        {card.title.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </h3>
      {card.causes && (
        <ul className="flex flex-col gap-fig-8">
          {card.causes.map((cause) => (
            <li key={cause} className="flex items-center gap-[6px] font-sans text-h4">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d={DONE_PATH} fill="currentColor" />
              </svg>
              {cause}
            </li>
          ))}
        </ul>
      )}
    </div>
  </RevealChild>
);

const TailorMade: React.FC = () => (
  <section id="tailor-made" className="pt-fig-64 lg:pt-fig-120">
    <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
      <Reveal
        as="div"
        stagger={STAGGER.base}
        className="flex flex-col gap-fig-16 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-20"
      >
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <SectionBadge size="sm">Built For You</SectionBadge>
          </RevealChild>
          <RevealChild as="span" y={28}>
            <h2 className="font-sans text-h1 font-semibold text-text-default lg:max-w-[684px] lg:text-display-lg">
              Tailor-made solutions
            </h2>
          </RevealChild>
        </div>
        <RevealChild as="p" y={20} duration={SEC.revealFast} className="font-body text-body-xl text-subtitle lg:w-[564px] lg:shrink-0 lg:text-subtitle-1">
          Officience is a global IT player born in Paris (2006). Since 20 years, we provide solutions to empower
          international businesses and bring Vietnamese agility to speed up your growth.
        </RevealChild>
      </Reveal>

      <Reveal as="ul" stagger={STAGGER.loose} className="grid grid-cols-1 gap-fig-24 [container-type:inline-size] lg:grid-cols-2">
        {CARDS.map((card) => (
          <CardView key={card.title[0]} card={card} />
        ))}
      </Reveal>
    </Container>
  </section>
);

export default TailorMade;
