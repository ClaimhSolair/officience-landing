import React from 'react';
import { srcSetOf } from '../../assets';
import { CULTURE_CARDS, type CultureCard } from '../../content/careers/culture';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';

/**
 * "Our Culture" — Figma 3321:2570. A badge and a two-tone headline, then three
 * 1392x860 photo cards, 100px apart. Each card carries a coloured caption band.
 *
 * Proportions (spec, derivation grid):
 * - The photo box keeps 1392/860 at every width. Each file is baked at that
 *   ratio with Figma's own fill (card 1 a top-anchored cover, card 2 a full
 *   stretch, card 3 an offset crop), so `object-cover` has no effect.
 * - From lg the band sits on the photo: 1156/1392 = 83.05% of the card wide,
 *   centred, 40px above the bottom edge. Its height follows its text, because
 *   the type stays a fixed size while the card shrinks. Below lg the band would
 *   not fit, so it sits under the photo at full width.
 *
 * Figma slips, flagged in the spec: card 2's band is 64px off the bottom (cards
 * 1 and 3 are 40px), and card 1's band is a fixed 200px for 216px of text. All
 * three use 40px and hug their text.
 */

const Card: React.FC<{ card: CultureCard }> = ({ card }) => {
  const widest = card.photo.sources[card.photo.sources.length - 1];
  return (
    <Reveal as="li" stagger>
      <RevealChild as="figure" y={40}>
        <div data-probe="culture-card" className="relative">
          <div
            data-probe="culture-photo"
            className="relative w-full overflow-hidden rounded-fig-xs bg-bg-secondary"
            style={{ aspectRatio: '1392 / 860' }}
          >
            <img
              src={widest.url}
              srcSet={srcSetOf(card.photo.sources)}
              sizes="(min-width: 1910px) 1792px, calc(100vw - 32px)"
              alt={card.photo.alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption
            data-probe="culture-band"
            className={`${card.band} flex flex-col gap-fig-8 rounded-fig-xs p-fig-24 lg:absolute lg:bottom-fig-40 lg:left-1/2 lg:w-[83.05%] lg:-translate-x-1/2 lg:flex-row lg:items-center lg:justify-between lg:gap-fig-24 lg:px-fig-40 lg:py-fig-48 xl:py-fig-64`}
          >
            <h3 className="font-sans text-h4 text-text-primary lg:min-w-0 lg:max-w-[395px] lg:flex-1 lg:text-h1">{card.title}</h3>
            <p className="font-sans text-btn-md text-text-primary lg:w-[452px] lg:shrink-0 lg:text-right">{card.body}</p>
          </figcaption>
        </div>
      </RevealChild>
    </Reveal>
  );
};

const OurCulture: React.FC = () => (
  <section id="our-culture" className="pt-fig-64 lg:pt-fig-120" aria-labelledby="our-culture-title">
    <Container className="flex flex-col gap-fig-40 lg:gap-fig-80">
      <Reveal stagger className="flex flex-col gap-fig-16 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-24">
        <RevealChild as="div" y={20}>
          <SectionBadge as="h2" size="sm">
            <span id="our-culture-title">Our Culture</span>
          </SectionBadge>
        </RevealChild>
        {/* 801/1392 of the column from lg. Display-sm needs the 1280 column; at
            1024 the 561px box takes Heading-H1. */}
        <RevealChild as="p" y={28} className="font-sans text-h1 lg:w-[57.54%] xl:text-display-sm xl:font-medium">
          <span className="text-text-default">Find Out Why Our Team Loves Working Here Every Day</span>{' '}
          <span className="text-gray-fig-400">and What Makes This More Than Just a Place to Work.</span>
        </RevealChild>
      </Reveal>

      <ul className="flex flex-col gap-fig-48 lg:gap-fig-100">
        {CULTURE_CARDS.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </ul>
    </Container>
  </section>
);

export default OurCulture;
