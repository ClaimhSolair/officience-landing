import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS, srcSetOf } from '../../assets';
import { EASE, MOTION, SEC, STAGGER, useMotionEnabled } from '../../lib/motion';
import Container from '../ui/Container';

/**
 * The About Us hero — Figma 3133:4425 (1440x780, directly under the header),
 * with the photo of 3779:5758.
 *
 * **The photo shows whole, at its own 1980:1080 (user, 2026-09-24).** The file
 * is the one the team made for 3779:5758: Figma's render of that frame, which
 * is the 1024x768 photo widened 1.375x, with the dark scrim in the pixels. The
 * user chose it as made. The band takes the file's ratio at every width, so the
 * photo never crops and no band shows, and the hero draws no scrim of its own.
 * There is no parallax: a parallax needs overdraw, and overdraw is a crop.
 *
 * From lg the copy sits on the last part of the photo: the headline on the
 * left gutter, the subtitle on the right, both on one baseline, 52px above the
 * photo's bottom edge. Below lg the band is too short for the copy (213px at
 * 390), so the copy sits under the photo on the dark ground.
 *
 * Only `lg` is the artboard. The file draws no 390 frame and no 1920 frame for
 * this page, so every other width is this build's own.
 */

const HEADLINE = ['About', 'Officience'];

const SUBTITLE = 'We don’t just build software. We empower the people who build the future.';

const ALT =
  "The Officience team in 2006, holding the company's first logo board outside the original Ho Chi Minh City office.";

// React 18 does not know the camelCase `fetchPriority` prop and warns about it,
// so the attribute goes in lowercase, which React passes through as it is.
const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>;

const COPY_VARIANTS = {
  hidden: { y: 32, opacity: 0 },
  shown: { y: 0, opacity: 1 },
} as const;

const COPY_VARIANTS_REDUCED = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
} as const;

const AboutHero: React.FC = () => {
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutHero;
  const variants = enabled ? COPY_VARIANTS : COPY_VARIANTS_REDUCED;
  const photo = ASSETS.aboutPage.hero;

  return (
    <section
      className="relative isolate w-full overflow-hidden rounded-fig-xs bg-black-900"
      aria-labelledby="about-hero-title"
    >
      {/* The file's own ratio, so `object-cover` has no effect. */}
      <div className="relative aspect-[1980/1080] w-full">
        <img
          src={photo[photo.length - 1].url}
          srcSet={srcSetOf(photo)}
          sizes="100vw"
          alt={ALT}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          {...HIGH_PRIORITY}
        />
      </div>

      <div className="relative pb-fig-32 pt-fig-24 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-[52px] lg:pt-0">
        <Container className="flex flex-col gap-fig-24 lg:flex-row lg:items-end lg:gap-fig-32">
          <motion.h1
            id="about-hero-title"
            className="font-sans text-h1 font-bold text-white lg:w-[424px] lg:shrink-0 lg:text-display-xl"
            variants={variants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true }}
            transition={{
              duration: SEC.revealBase,
              ease: EASE.reveal,
            }}
          >
            {HEADLINE.map((line, i) => (
              <React.Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </motion.h1>

          <motion.p
            className="font-body text-body-xl text-white lg:ml-auto lg:w-[658px] lg:min-w-0 lg:text-subtitle-2"
            variants={variants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true }}
            transition={{
              duration: SEC.revealFast,
              ease: EASE.reveal,
              delay: STAGGER.base,
            }}
          >
            {SUBTITLE}
          </motion.p>
        </Container>
      </div>
    </section>
  );
};

export default AboutHero;
