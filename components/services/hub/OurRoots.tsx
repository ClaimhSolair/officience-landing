import React from 'react';
import { serviceAsset, serviceSources, srcSetOf } from '../../../assets';
import { SEC, STAGGER } from '../../../lib/motion';
import Container from '../../ui/Container';
import Reveal, { RevealChild } from '../../ui/Reveal';
import SectionBadge from '../../ui/SectionBadge';

/**
 * "Our Roots / Born & raised in Paris" on the Services hub — Figma 3116:2333.
 *
 * The heading and the subtitle on one line, then a 684px column (the partner
 * logos, and 160px lower the body text with "400+ consultants" in blue) beside
 * the Station F photo at its own ratio.
 *
 * Figma places a fifth logo slot (3116:2345) outside the 684px column, where the
 * section clips it. Only the four visible logos are built, and the slot is
 * flagged in adapter section 19.
 */

const LOGOS = [
  { file: 'root-1.webp', alt: 'Le Wagon', w: 174.358, h: 62.634 },
  { file: 'root-2.webp', alt: 'Passerelles Numériques', w: 131, h: 55.599 },
  { file: 'root-3.webp', alt: 'Women in Tech', w: 127.579, h: 62.514 },
  { file: 'root-4.webp', alt: 'Campus Cyber', w: 131, h: 45 },
];

const PHOTO = serviceSources('hub', 'stationf', [683, 973]);

const OurRoots: React.FC = () => (
  <section id="our-roots" className="py-fig-64 lg:py-fig-120">
    <Container className="flex flex-col gap-fig-40 lg:gap-fig-64">
      <Reveal
        as="div"
        stagger={STAGGER.base}
        className="flex flex-col gap-fig-16 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32"
      >
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <SectionBadge size="sm">Our Roots</SectionBadge>
          </RevealChild>
          <RevealChild as="span" y={28}>
            <h2 className="font-sans text-h1 font-semibold text-text-default lg:text-display-lg">
              Born &amp; raised
              <br />
              in Paris
            </h2>
          </RevealChild>
        </div>
        <RevealChild as="p" y={20} duration={SEC.revealFast} className="font-body text-body-xl text-subtitle lg:w-[564px] lg:shrink-0 lg:text-subtitle-1">
          Digital Services Company at the heart of the French Tech ecosystem
        </RevealChild>
      </Reveal>

      <Reveal as="div" stagger={STAGGER.base} className="flex flex-col gap-fig-40 lg:flex-row lg:items-center lg:justify-between lg:gap-fig-24">
        <RevealChild as="div" y={28} className="flex flex-col gap-fig-40 lg:w-[684px] lg:min-w-0 lg:shrink lg:gap-fig-160">
          <ul className="flex flex-wrap items-center gap-x-fig-40 gap-y-fig-24" aria-label="Our partners in Paris">
            {LOGOS.map((logo) => (
              <li key={logo.file} className="shrink-0">
                <img
                  src={serviceAsset('hub', logo.file)}
                  alt={logo.alt}
                  width={Math.round(logo.w)}
                  height={Math.round(logo.h)}
                  style={{ width: logo.w, height: logo.h }}
                  className="max-w-none"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
          <p className="font-body text-body-xl text-text-default lg:max-w-[596px] lg:text-subtitle-2">
            In Paris, ‘les Eco-workers du 47’ gather our network of{' '}
            <span className="text-text-primary">400+ consultants</span> dedicated to innovation. Design, tech,
            data, product, infrastructure, organisation, coaching – ready to start with you.
          </p>
        </RevealChild>

        <RevealChild as="div" y={28} delay={0.1} className="w-full lg:max-w-[683px] lg:flex-1">
          <div className="relative w-full" style={{ aspectRatio: '973 / 645' }}>
            <img
              src={PHOTO[PHOTO.length - 1].url}
              srcSet={srcSetOf(PHOTO)}
              sizes="(min-width: 1024px) 683px, calc(100vw - 32px)"
              alt="The main hall of Station F in Paris, with its glass roof and open work areas."
              className="absolute inset-0 h-full w-full rounded-fig-xs object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </RevealChild>
      </Reveal>
    </Container>
  </section>
);

export default OurRoots;
