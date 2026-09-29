import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { srcSetOf } from '../../assets';
import { EASE, MOTION, SEC, STAGGER, useMotionEnabled } from '../../lib/motion';
import { ROUTES } from '../navigation';
import Container from '../ui/Container';
import type { Picture } from '../../content/services/types';
import { ArrowLeftIcon } from './parts';

/**
 * The hero of a service page and of the Services hub. Figma draws it directly
 * under the header: a full-width photo about 1440x840, the white headline and
 * subtitle at its bottom-left, and "Back to All Brochure" at its top-left.
 *
 * **The photo shows whole, at its own ratio (user, 2026-09-29).** This is the
 * About hero rule (ruling 18b). The box takes the file's ratio at every width,
 * so the photo never crops and no band shows. There is no parallax, because a
 * parallax needs overdraw, and overdraw is a crop.
 *
 * From lg the copy sits on the photo: the back link 60px below its top edge,
 * and the copy block 116px above its bottom edge (Software 3716:12747). Below lg
 * the box is too short for the copy (228px at 390), so the copy sits under the
 * photo on the dark ground.
 *
 * At lg (1024-1279) the title is Display-md, not Display-xl. A three-line title
 * (BI, Crunch) at 86px needs about 613px of a 600px photo at 1024.
 *
 * Only `lg` is the artboard. No page draws a 390 frame or a 1920 frame.
 */

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

interface ServiceHeroProps {
  image: Picture;
  title: string;
  /** The hub draws no subtitle. */
  subtitle?: string;
  pill?: string;
  /** The drawn text-box widths at lg. Software draws 684 and 461. */
  titleWidth?: number;
  subtitleWidth?: number;
  /** Shows "Back to All Brochure". The hub has no back link. */
  back?: boolean;
  /** A black scrim over the photo, as an opacity. The hub draws 0.4. */
  scrim?: number;
  /**
   * The hub centres its copy box (1189 of the 1440 artboard, so it starts at
   * x 126). With this set, the copy box is that width and centred from lg.
   */
  centeredWidth?: number;
  /** The id of the h1, for `aria-labelledby`. */
  titleId?: string;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  image,
  title,
  subtitle,
  pill,
  titleWidth = 684,
  subtitleWidth = 461,
  back = true,
  scrim,
  centeredWidth,
  titleId = 'service-hero-title',
}) => {
  const motionEnabled = useMotionEnabled();
  const variants = motionEnabled && MOTION.serviceHero ? COPY_VARIANTS : COPY_VARIANTS_REDUCED;
  const widest = image.sources[image.sources.length - 1];

  return (
    <section
      id="service-hero"
      className="relative isolate w-full overflow-hidden bg-black-900"
      aria-labelledby={titleId}
    >
      {/* The file's own ratio, so `object-cover` has no effect. */}
      <div className="relative w-full" style={{ aspectRatio: `${image.w} / ${image.h}` }}>
        <img
          src={widest.url}
          srcSet={srcSetOf(image.sources)}
          sizes="100vw"
          alt={image.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          {...HIGH_PRIORITY}
        />
        {scrim ? <div aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: scrim }} /> : null}
      </div>

      {/* From lg a flex column over the photo: the back link at the top, the
          copy at the bottom. Each sits in its own Container, because the
          Container's outer box takes no height of its own. */}
      <div className="relative flex flex-col gap-fig-16 pb-fig-32 pt-fig-24 lg:absolute lg:inset-0 lg:justify-end lg:gap-0 lg:pb-[116px] lg:pt-[60px]">
        {back && (
          <div className="lg:mb-auto">
            <Container>
              <Link
                to={ROUTES.services}
                className="inline-flex h-[56px] items-center gap-fig-4 pl-fig-4 pr-fig-24 font-sans text-btn-md text-white drop-shadow-[0_1px_1px_#0F1219] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ArrowLeftIcon />
                Back to All Brochure
              </Link>
            </Container>
          </div>
        )}

        <Container>
          <motion.div
            className={`flex flex-col gap-fig-16 lg:gap-fig-24 ${centeredWidth ? 'mx-auto w-full' : ''}`}
            style={centeredWidth ? { maxWidth: centeredWidth } : undefined}
            variants={variants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true }}
            transition={{ duration: SEC.revealBase, ease: EASE.reveal, delay: STAGGER.base }}
          >
            {pill && (
              <span className="self-start rounded-fig-xs bg-pri-50 p-fig-8 font-sans text-btn-md text-text-primary lg:text-btn-lg">
                {pill}
              </span>
            )}
            <h1 id={titleId} className="whitespace-pre-line font-sans text-h1 font-bold text-white lg:text-display-md lg:font-bold xl:text-display-xl" style={{ maxWidth: titleWidth }}>
              {title}
            </h1>
            {subtitle && (
              <p className="font-body text-body-xl text-white lg:text-subtitle-2" style={{ maxWidth: subtitleWidth }}>
                {subtitle}
              </p>
            )}
          </motion.div>
        </Container>
      </div>
    </section>
  );
};

export default ServiceHero;
