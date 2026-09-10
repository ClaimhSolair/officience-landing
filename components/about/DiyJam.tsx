import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import { ABOUT_SECTION_IDS, DIY_JAM_CTAS, scrollToId, sectionHref } from '../navigation';
import { EASE, MOTION, SEC, SPRING, STAGGER, useMotionEnabled } from '../../lib/motion';

/**
 * DIY Jam — Figma 3133:4506 (1440x951).
 *
 * A white card on the left gutter (496 wide, 48px of padding) beside a
 * photograph (856 wide). The two sit on the artboard's 40px gutter and fill the
 * 1392 column exactly. Both are 711 tall.
 *
 * The picture keeps its true proportions, the same ruling as the hero
 * (figma-adapter 18b): Figma draws the 1024x683 frame with `object-fit: fill`
 * into an 856x711 box, which squeezes the group 1.25x. `object-contain` shows
 * the whole photograph instead and leaves a band above and below it.
 *
 * The artboard leaves 167px between the copy and the buttons, and pins the
 * buttons to the foot of the card. `justify-between` reproduces that at any
 * card height rather than reserving the gap as a fixed value.
 *
 * Below lg the file draws nothing: the card and the picture stack, and the
 * picture leads because it carries the section.
 */

/** The artboard's split of the 1392 column: a 496 card beside an 856 picture. */
const CARD_SHARE = (496 / (496 + 856)).toFixed(6);

const DESCRIPTION =
  'A space where Offies can turn ideas into playful experiments and smart prototypes. Fail fast, learn faster, and build things that leave a mark.';

const DiyJam: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutDiyJam;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section ref={sectionRef} id="diy-jam" className="bg-background py-fig-64 lg:py-fig-120">
    <Container>
      {/* The row starts at xl. The artboard's 496 card, 40 gutter and 856
          picture need 1392px; a 1024 viewport leaves 976, which squeezed the
          card's 75px title and flattened the picture box to 0.78.

          Both columns are sized by their SHARE of the row, not by 496px. A
          fixed card against a fluid picture drifted the artboard's 496:856 to
          496:1256 at 1920. The share reproduces 496 exactly at 1440. */}
      <Reveal className="flex flex-col gap-fig-24 xl:flex-row xl:gap-fig-40">
        {/* The card: 496 of the artboard's 1392 column. */}
        <div
          className="flex flex-col justify-between gap-fig-40 rounded-fig-m bg-surface p-fig-24 xl:shrink-0 xl:basis-[var(--card-basis)] xl:gap-0 xl:p-fig-48"
          style={{ '--card-basis': `calc((100% - 40px) * ${CARD_SHARE})` } as React.CSSProperties}
        >
          <motion.div
            className="flex flex-col gap-fig-16"
            initial={enabled ? { y: 20, opacity: 0 } : { opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              y: enabled ? { duration: SEC.revealFast, ease: EASE.reveal } : { duration: 0 },
              opacity: { duration: SEC.revealFast, ease: EASE.reveal },
            }}
          >
            <SectionBadge as="h2" className="self-start">
              Internal Contest
            </SectionBadge>
            <p className="font-sans text-h1 text-text-default lg:text-display-lg">DIY Jam</p>
            <p className="font-body text-body-lg text-subtitle lg:text-subtitle-1">{DESCRIPTION}</p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-fig-24"
            initial={enabled ? { y: 20, opacity: 0 } : { opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              y: enabled ? { duration: SEC.revealFast, ease: EASE.reveal, delay: STAGGER.tight * 3 } : { duration: 0 },
              opacity: { duration: SEC.revealFast, ease: EASE.reveal, delay: enabled ? STAGGER.tight * 3 : 0 },
            }}
          >
            <motion.div
              whileHover={enabled ? { y: -2 } : undefined}
              whileTap={enabled ? { scale: 0.97 } : undefined}
              transition={{ type: 'spring', ...SPRING.hover }}
            >
              <Button
                onClick={() => scrollToId(ABOUT_SECTION_IDS[5])}
                size="xl"
                className="w-full shadow-fig-xs"
                icon={<ArrowUpRight className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
              >
                {DIY_JAM_CTAS[0].label}
              </Button>
            </motion.div>
            <motion.div
              whileHover={enabled ? { y: -2 } : undefined}
              whileTap={enabled ? { scale: 0.97 } : undefined}
              transition={{ type: 'spring', ...SPRING.hover }}
            >
              <Button
                to={sectionHref('proven-results')}
                variant="secondary"
                size="xl"
                className="w-full"
                icon={<ArrowRight className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
              >
                {DIY_JAM_CTAS[1].label}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* The picture: 856 of the column, on the artboard's 8px radius. */}
        <RevealChild
          y={24}
          duration={SEC.revealFast}
          className="flex aspect-[856/711] w-full items-center justify-center overflow-hidden rounded-fig-m xl:min-w-0 xl:flex-1"
        >
          {enabled ? (
            <motion.img
              src={ASSETS.aboutPage.diyJam}
              alt="Officience colleagues at the DIY Jam contest in Can Tho, behind a banner reading “Let’s Pitch & Chill”."
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
              style={{ y: photoY }}
            />
          ) : (
            <img
              src={ASSETS.aboutPage.diyJam}
              alt="Officience colleagues at the DIY Jam contest in Can Tho, behind a banner reading “Let’s Pitch & Chill”."
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          )}
        </RevealChild>
      </Reveal>
    </Container>
  </section>
  );
};

export default DiyJam;
