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
 * **The whole photo shows, at its own 3:2 (user, 2026-09-24).** Figma 3133:4525
 * squeezes the 1024x683 file 1.25x into an 856x711 box. The picture box takes
 * the file's own ratio instead, so nothing stretches, crops or shows a band.
 * The row is 611 tall at 1536 (the artboard draws 711 at 1440).
 *
 * The card and the picture share one row height, and the picture sets it. The
 * card pins its buttons to its foot (`justify-between`), and the gap above them
 * can shrink to 24. Measured 2026-09-24: at 1440 the copy wraps to 5 lines and
 * the card needs 586px beside a 571px picture, so the gap would be 9px. At 1520
 * the copy takes 4 lines and 79px of gap is left, and at 1536 it is 85px. So the
 * row starts at 2xl (1536). Below that the section stacks, card first, as it did
 * below xl before.
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
          className="aspect-[1024/683] w-full self-start overflow-hidden rounded-fig-m 2xl:min-w-0 2xl:flex-1"
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
