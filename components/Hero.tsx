import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ASSETS } from '../assets';
import Container from './ui/Container';
import { EASE, MOTION, SEC, useMotionEnabled } from '../lib/motion';

const HEADLINE = [
  { text: 'Building ', accent: false },
  { text: 'Data Driven', accent: true },
  { br: true },
  { text: '& Human-Centered', accent: true },
  { br: true },
  { text: 'Digital Products', accent: false },
] as const;
const SUBTITLE =
  'We integrate robust IT infrastructure, advanced analytics, and intuitive design to scale your business.';

/**
 * Figma 3928:4916 (1440x750): the banner image 3938:5217 fills the frame, the
 * header 3929:4939 sits on its top 113px, and the copy column 3929:4925 starts
 * at x 24, y 192. Figma has this frame at 1440 only (drift D2, 2026-10-13).
 *
 * From md, the section is the banner at 1440:750 and the copy sits on it. The
 * banner is an aspect box, so it fills the width at every width up to 2560
 * and nothing is cropped. All other values are fixed px per step (user, 2026-10-13):
 *
 *   step        pull-up  copy top  headline   subtitle         gap
 *   md   768    60       102       36/44      14/22, 280 wide  16
 *   lg   1024   80       137       50/58      20/28, 360 wide  24
 *   xl   1280   100      171       64/74      24/36, 448 wide  24
 *   1400        header   192       75/86      24/36, 448 wide  24   (the 1440 frame)
 *   fhd  1880   header   256       100/115    32/48, 597 wide  32   (1440 x 1.333)
 *
 * The pull-up moves the section under the header. Below 1400 it is less than
 * the header height, so the rocket tip stays out from under the fixed header.
 * The copy top is from the top of the banner. The 1400 step is the narrowest
 * width where the 75px headline keeps 24px or more from the otter. 2560 keeps
 * the fhd values. No value is behind 3xl.
 *
 * Below md, the copy is on the blue band and a 4:3 crop of the otter group
 * comes under it. This is art direction, so the crop is a second file in a
 * <picture> source (CLAUDE.md, Figma Fidelity Rules).
 *
 * The CTA button 3928:4887 is removed (D2). The header has the Contact CTA.
 *
 * **The headline and the banner never animate.** They are the LCP candidates.
 * Only the subtitle has an entrance.
 */

const COPY_VARIANTS: Variants = {
  hidden: { y: 24, opacity: 0 },
  shown: { y: 0, opacity: 1, transition: { duration: SEC.revealFast, delay: 0.1, ease: [...EASE.reveal] } },
};

// React 18 does not know the camelCase `fetchPriority` prop, so the attribute
// goes in lowercase, as in AboutHero.
const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>;

const srcSet = (sources: readonly { url: string; w: number }[]) => sources.map((s) => `${s.url} ${s.w}w`).join(', ');

const Hero: React.FC = () => {
  const motionOn = useMotionEnabled();
  const animating = motionOn && MOTION.hero;
  // The splash screen is gone (user, 2026-10-09), so the entrance starts on mount.
  const state = 'shown';
  const { banner, bannerMobile } = ASSETS.hero;

  return (
    <section className="relative overflow-hidden bg-bg-primary md:-mt-[60px] lg:-mt-[80px] xl:-mt-[100px] min-[1400px]:-mt-[var(--header-h)]">
      {/* The copy. Below md it is in the flow, above the picture. From md it is
          a layer on the picture, with the step values above. */}
      <div className="relative z-10 md:absolute md:inset-0 md:pt-[102px] lg:pt-[137px] xl:pt-[171px] min-[1400px]:pt-[192px] fhd:pt-[256px]">
        <Container className="flex flex-col gap-fig-24 pb-fig-16 pt-fig-40 md:gap-fig-16 md:p-0 lg:gap-fig-24 fhd:gap-fig-32">
          <h1 className="font-sans text-h2 font-semibold text-white md:text-h1 md:font-semibold md:tracking-[-0.03em] lg:text-display-sm lg:font-semibold lg:tracking-[-0.03em] xl:text-display-md xl:font-semibold min-[1400px]:text-display-lg fhd:text-[100px] fhd:leading-[115px]">
            {HEADLINE.map((part, i) =>
              'br' in part ? (
                // The space keeps the words apart in textContent, as in Figma.
                <React.Fragment key={i}>{' '}<br /></React.Fragment>
              ) : (
                <span key={i} className={part.accent ? 'text-off-yellow' : undefined}>
                  {part.text}
                </span>
              ),
            )}
          </h1>
          <motion.p
            variants={COPY_VARIANTS}
            initial={animating ? 'hidden' : false}
            animate={state}
            className="font-body text-[14px] font-medium leading-[22px] text-white md:w-[280px] lg:w-[360px] lg:text-body-xl lg:font-normal xl:w-[448px] xl:text-subtitle-1 fhd:w-[597px] fhd:text-[32px] fhd:leading-[48px]"
          >
            {SUBTITLE}
          </motion.p>
        </Container>
      </div>

      {/* Decorative: the headline carries the message, so the alt is empty.
          Not lazy and high priority, because the banner is the largest paint
          above the fold. The aspect classes equal the file aspects, so
          object-cover does nothing and CSS distorts nothing. The bottom of the
          mobile crop is the floor of the scene, and the flower band joins it. */}
      <picture>
        <source media="(min-width: 768px)" srcSet={srcSet(banner.sources)} sizes="100vw" />
        <img
          src={bannerMobile.sources[bannerMobile.sources.length - 1].url}
          srcSet={srcSet(bannerMobile.sources)}
          sizes="100vw"
          width={bannerMobile.w}
          height={bannerMobile.h}
          alt=""
          {...HIGH_PRIORITY}
          decoding="async"
          referrerPolicy="no-referrer"
          className="block aspect-[4/3] h-auto w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,#000_12%)] md:aspect-[1440/750] md:[mask-image:none]"
        />
      </picture>
    </section>
  );
};

export default Hero;
