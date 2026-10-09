import React from 'react';
import { careerSources, srcSetOf } from '../../assets';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';

/**
 * The Career hero — Figma 3310:2393. A full-width photo (1440x839 on the
 * artboard), a dark gradient over its lower 467px, and the white headline and
 * subtitle at its bottom-left, 120px above the bottom edge.
 *
 * It follows the ServiceHero rules (ruling 18b): the photo shows whole, at its
 * own ratio, at every width, so it never crops. From lg the copy sits on the
 * photo. Below lg the photo is too short for the copy, so the copy sits under
 * the photo on the dark ground, and the gradient is not drawn.
 *
 * It is a separate component, not a ServiceHero option, because ServiceHero
 * draws a flat scrim and is being changed by the Work pages at the same time.
 */

const HERO = {
  sources: careerSources('hero', [800, 1280, 1643]),
  w: 1643,
  h: 957,
  alt: 'Two otter mascots in shirts and ties take photos with cameras in a bright office with plants.',
};

// React 18 does not know the camelCase `fetchPriority` prop, so the attribute
// goes in lowercase.
const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>;

/** The gradient covers the lower 467px of the 839px photo. */
const SCRIM_SHARE = 467 / 839;

const CareerHero: React.FC = () => (
  <section id="career-hero" className="relative isolate w-full overflow-hidden bg-black-900" aria-labelledby="career-hero-title">
    <div data-probe="hero-photo" className="relative w-full" style={{ aspectRatio: `${HERO.w} / ${HERO.h}` }}>
      <img
        src={HERO.sources[HERO.sources.length - 1].url}
        srcSet={srcSetOf(HERO.sources)}
        sizes="100vw"
        alt={HERO.alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        {...HIGH_PRIORITY}
      />
      <div
        data-probe="hero-scrim"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-b from-[rgba(15,18,25,0)] to-[rgba(15,18,25,0.6)] lg:block"
        style={{ height: `${SCRIM_SHARE * 100}%` }}
      />
    </div>

    <div className="relative pb-fig-32 pt-fig-24 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-fig-120 lg:pt-0">
      <Container>
        <Reveal stagger className="flex flex-col gap-fig-16 lg:gap-fig-24">
          {/* Figma breaks the title after "Build". The break is in the text, so
              the box needs no width: a width can only add a wrap, because
              Lexend sets about 6% wider here than in Figma. */}
          <RevealChild
            as="div"
            y={32}
            className="whitespace-pre-line font-sans text-h1 font-bold text-white lg:text-display-md lg:font-bold xl:text-display-xl"
          >
            <h1 id="career-hero-title">{'Build\nYour Career'}</h1>
          </RevealChild>
          <RevealChild as="p" y={32} className="max-w-[658px] font-body text-body-xl text-white lg:text-subtitle-2">
            When you find where you fit, work becomes more than just a job, it’s a passion!
          </RevealChild>
        </Reveal>
      </Container>
    </div>
  </section>
);

export default CareerHero;
