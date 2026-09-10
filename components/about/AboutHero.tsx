import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ASSETS } from '../../assets';
import { EASE, MOTION, SEC, STAGGER, useMotionEnabled } from '../../lib/motion';
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
 * this page, so every other ratio is this build's own.
 */

const HEADLINE = ['About', 'Officience'];

const SUBTITLE = 'We don’t just build software. We empower the people who build the future.';

const COPY_VARIANTS = {
  hidden: { y: 32, opacity: 0 },
  shown: { y: 0, opacity: 1 },
} as const;

const COPY_VARIANTS_REDUCED = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
} as const;

const AboutHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutHero;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const variants = enabled ? COPY_VARIANTS : COPY_VARIANTS_REDUCED;

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden rounded-fig-xs bg-black-900 aspect-[390/520] sm:aspect-[640/560] md:aspect-[768/480] lg:aspect-[1440/780] 2xl:aspect-[1920/900]"
      aria-labelledby="about-hero-title"
    >
      {enabled ? (
        <motion.img
          src={ASSETS.aboutPage.hero}
          alt="The Officience team in 2006, holding the company's first logo board outside the original Ho Chi Minh City office."
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ y: photoY }}
        />
      ) : (
        <img
          src={ASSETS.aboutPage.hero}
          alt="The Officience team in 2006, holding the company's first logo board outside the original Ho Chi Minh City office."
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      )}

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.5)] from-[45.673%] to-[rgba(102,102,102,0)]"
        initial={enabled ? { opacity: 0 } : undefined}
        whileInView={enabled ? { opacity: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: SEC.revealBase, ease: EASE.reveal }}
      />

      <div className="absolute inset-x-0 bottom-0 pb-fig-32 lg:pb-[52px]">
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
