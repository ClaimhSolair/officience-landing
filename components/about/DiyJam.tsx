import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import { DIY_JAM_CTAS, ROUTES, sectionHref } from '../navigation';
import { EASE, MOTION, SEC, SPRING, STAGGER, useMotionEnabled } from '../../lib/motion';

/**
 * DIY Jam — Figma 3133:4506 (1440x951).
 *
 * A white card on the left gutter (496 wide, 48px of padding) beside a
 * photograph (856 wide). The two sit on the artboard's 40px gutter and fill the
 * 1392 column exactly.
 *
 * **The whole photo shows, at its own ratio.** On 2026-09-30 the user sent a
 * new file at 856x711, the size of the Figma box (3133:4525). So the picture box
 * is 856:711, as the artboard draws it, and nothing stretches or crops.
 *
 * The card and the picture share one row height, and the picture sets it. The
 * card pins its buttons to its foot (`justify-between`), and the gap above them
 * can shrink to 24. The row starts at 2xl (1536), a user ruling of 2026-09-24
 * for the old 3:2 file. Below that the section stacks, card first.
 */

/** The artboard's split of the 1392 column: a 496 card beside an 856 picture. */
const CARD_SHARE = (496 / (496 + 856)).toFixed(6);

const DESCRIPTION =
  'A space where Offies can turn ideas into playful experiments and smart prototypes. Fail fast, learn faster, and build things that leave a mark.';

const DiyJam: React.FC = () => {
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutDiyJam;

  return (
    <section id="diy-jam" className="bg-background py-fig-64 lg:py-fig-120">
    <Container>
      {/* The row starts at 2xl (see the file comment). Both columns are sized
          by their SHARE of the row, so the artboard's 496:856 holds at every
          width from there. */}
      <Reveal className="flex flex-col gap-fig-24 2xl:flex-row 2xl:gap-fig-40">
        {/* The card: 496 of the artboard's 1392 column. */}
        <div
          className="flex flex-col justify-between gap-fig-40 rounded-fig-m bg-surface p-fig-24 2xl:shrink-0 2xl:basis-[var(--card-basis)] 2xl:gap-fig-24 2xl:p-fig-48"
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
                to={ROUTES.diyJam}
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

        {/* The picture: 856 of the column, on the artboard's 8px radius. Its
            box has the file's own ratio, so `object-cover` has no effect. It
            keeps `self-start`: a stretched row would override the ratio. */}
        <RevealChild
          y={24}
          duration={SEC.revealFast}
          className="aspect-[856/711] w-full self-start overflow-hidden rounded-fig-m 2xl:min-w-0 2xl:flex-1"
        >
          <img
            src={ASSETS.aboutPage.diyJam}
            alt="Officience colleagues at the DIY Jam contest in Can Tho, behind a banner reading “Let’s Pitch & Chill”."
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </RevealChild>
      </Reveal>
    </Container>
  </section>
  );
};

export default DiyJam;
