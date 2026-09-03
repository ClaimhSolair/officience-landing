import React from 'react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';

/**
 * The About Us hero — Figma 3133:4425 (1440x780, directly under the header).
 *
 * The band is full-bleed and holds the photograph over a dark ground, with a
 * bottom-up black scrim above both. The copy sits on the last 190px: the
 * headline on the left gutter, the subtitle on the right, both aligned to the
 * same baseline, 52px above the band bottom.
 *
 * Only `lg` is the artboard. The file draws no 390 frame and no 1920 frame for
 * this page, so every other ratio is this build's own. Each one keeps the band
 * height inside a usable range across its whole width range — a single ratio
 * over a wide range is the trap the responsive rules describe:
 *
 *   base   0.750   320 → 427   639 →  852   portrait, copy under the picture
 *   sm     1.143   640 → 560   767 →  671
 *   md     1.600   768 → 480  1023 →  639
 *   lg     1.846  1024 → 555  1440 →  780   the artboard, exact
 *   2xl    2.133  1536 → 720  1920 →  900
 *
 * Holding the artboard's 1.846 up to 1920 would make the band 1040px tall and
 * push the copy under the fold of a 1080p screen, so the wide step is flatter.
 */

/** Figma hard-breaks the headline after "About". */
const HEADLINE = ['About', 'Officience'];

const SUBTITLE = 'We don’t just build software. We empower the people who build the future.';

const AboutHero: React.FC = () => (
  <section
    className="relative isolate w-full overflow-hidden rounded-fig-xs bg-black-900 aspect-[390/520] sm:aspect-[640/560] md:aspect-[768/480] lg:aspect-[1440/780] 2xl:aspect-[1920/900]"
    aria-labelledby="about-hero-title"
  >
    {/*
      The LCP element: it is the first paint of the page, so it never waits.

      `object-contain` is a ruling from 2026-09-03: show the whole photograph at
      its true proportions. The artboard stretches it 1.385x into the band
      (Figma draws the 1024x768 frame with object-fit: fill), and `object-cover`
      would crop the top 213px and cut off the logo board the team is holding —
      the subject of the picture. Neither is acceptable, so the box gives way to
      the picture instead of the picture giving way to the box.

      The image pins to the top, so the ground below it is deliberate space
      rather than a bar: at mobile it is exactly where the copy sits. From md up
      the picture is height-limited and centres itself, and the ground shows at
      the sides.

      A useful side effect: the picture now renders at or near 1:1 instead of
      0.71x at 1440 and 0.53x at 1920, so the low-resolution source reads far
      better than it did stretched.
    */}
    <img
      src={ASSETS.aboutPage.hero}
      alt="The Officience team in 2006, holding the company's first logo board outside the original Ho Chi Minh City office."
      className="absolute inset-0 h-full w-full object-contain object-top"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />

    {/* Figma's scrim: black at 50% from the bottom to 45.673%, then clear. It is
        what makes the white copy legible over the photograph. */}
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] from-[45.673%] to-[rgba(102,102,102,0)]"
    />

    {/* The band bottom, and the 52px of air the artboard leaves under the copy.
        Container must sit inside this: its gutter lives on an outer wrapper, so
        positioning Container itself would escape that padding. */}
    <div className="absolute inset-x-0 bottom-0 pb-fig-32 lg:pb-[52px]">
      <Container className="flex flex-col gap-fig-24 lg:flex-row lg:items-end lg:gap-fig-32">
        <h1
          id="about-hero-title"
          className="font-sans text-h1 font-bold text-white lg:w-[424px] lg:shrink-0 lg:text-display-xl"
        >
          {HEADLINE.map((line, i) => (
            <React.Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </h1>

        {/* 658 of the artboard's 1392 column, flush to the right gutter. */}
        <p className="font-body text-body-xl text-white lg:ml-auto lg:w-[658px] lg:min-w-0 lg:text-subtitle-2">
          {SUBTITLE}
        </p>
      </Container>
    </div>
  </section>
);

export default AboutHero;
