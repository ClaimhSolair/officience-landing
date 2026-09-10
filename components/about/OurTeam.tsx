import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import { EXTERNAL } from '../navigation';
import { MOTION, SEC, SPRING, STAGGER, useMotionEnabled } from '../../lib/motion';

/**
 * Our Team — Figma 3133:4583. (The frame is named "Our Values"; its badge says
 * "Our Team", and the badge is right.)
 *
 * Seven portraits and a CTA fill a 4x2 grid of 318px cards on a 40px gutter,
 * with 100px between the rows. Each card is a white picture box over a blue
 * band carrying the name and the role.
 *
 * **The cards are drawn inconsistently and are normalised here.** Six use a
 * 4.386px radius and one uses 3.78; card 1 carries `0 1px 2px #0F1219`, card 2
 * carries `0 4px 4px rgba(0,0,0,.25)`, and the other five carry no shadow at
 * all. These are siblings in one row, where a difference reads as a defect
 * rather than as intent, so the majority wins: a 4px radius and no shadow.
 * Recorded in figma-adapter 18f.
 *
 * The names are NOT `whitespace-nowrap` as Figma sets them. A card clips its
 * overflow, so a name that outgrew its box would be silently cut; letting it
 * wrap makes the row taller instead, which the grid absorbs.
 *
 * Animation (Sept-2026 motion pass): cards lift on hover with a spring
 * (SPRING.hover). The CTA button breathes gently to draw attention.
 */

interface Member {
  name: string;
  role: string;
  photo: string;
}

const MEMBERS: Member[] = [
  { name: 'Duc Ha Duong', role: 'Founder', photo: ASSETS.aboutPage.team.ducHaDuong },
  { name: 'Duong Cao Phuong', role: 'Founder', photo: ASSETS.aboutPage.team.duongCaoPhuong },
  { name: 'Nguyen Ngoc Ai Duyen', role: 'Account', photo: ASSETS.aboutPage.team.aiDuyen },
  { name: 'Nguyen Loc Thien Vi', role: 'HR', photo: ASSETS.aboutPage.team.thienVi },
  { name: 'Nguyen Thuy Dung', role: 'HR', photo: ASSETS.aboutPage.team.thuyDung },
  { name: 'Le Bach Trinh', role: 'Senior BI Consultant', photo: ASSETS.aboutPage.team.bachTrinh },
  { name: 'Tran Ha Minh Quyen', role: 'Engager & Data Analyst', photo: ASSETS.aboutPage.team.minhQuyen },
];

const OurTeam: React.FC = () => {
  const motionEnabled = useMotionEnabled();
  const enabled = motionEnabled && MOTION.aboutTeam;

  return (
    <section id="our-team" className="bg-background py-fig-64 lg:py-fig-120">
      <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
        <Reveal className="flex flex-col gap-fig-24 lg:flex-row lg:justify-between lg:gap-fig-32">
          <RevealChild y={24} duration={SEC.revealFast} className="lg:shrink-0">
            <SectionBadge as="h2">Our Team</SectionBadge>
          </RevealChild>
          {/* 801 of the artboard's 1392 column, flush right. */}
          <RevealChild y={24} duration={SEC.revealFast} className="lg:w-[801px] lg:shrink-0">
            <p className="font-sans font-medium text-h2 text-text-default lg:text-display-sm">
              Each Offie brings their own colour to the table. Together, we create the palette called
              Officience. Let's meet them!
            </p>
          </RevealChild>
        </Reveal>

        {/* Four columns only from xl. At 1024 four 318px cards plus their gutters
            need 1392px, and the column holds 976 — the 24px names would wrap
            three deep in a 214px card. */}
        {/* `amount` is a FRACTION OF THIS LIST, not of the screen. Stacked into
            one column the list is about 3,900px tall, so the default 0.2 asks for
            780px of it to be visible — more than any phone viewport — and the
            cards would never appear at all. A small fraction fires as soon as the
            top edge arrives, which is what a long grid wants. */}
        <Reveal
          as="ul"
          stagger={STAGGER.loose}
          amount={0.05}
          className="grid grid-cols-1 gap-fig-40 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-fig-64 xl:grid-cols-4 xl:gap-y-fig-100"
        >
          {MEMBERS.map((m) => (
            <RevealChild
              as="li"
              key={m.name}
              y={28}
              duration={SEC.revealFast}
            >
              <motion.div
                className="flex flex-col overflow-hidden rounded-fig-xs"
                whileHover={enabled ? { y: -6, boxShadow: '0 12px 24px rgba(0,0,0,0.10)' } : undefined}
                transition={{ type: 'spring', ...SPRING.hover }}
              >
                {/* The picture box is white: these are cut-out portraits, and the
                    crop is baked in at this ratio, so object-cover changes nothing. */}
                <div className="aspect-[318/356] w-full bg-white">
                  <img
                    src={m.photo}
                    alt={`${m.name}, ${m.role} at Officience.`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-col gap-fig-8 bg-bg-primary px-fig-20 py-fig-24 text-white">
                  <h3 className="font-sans text-h3">{m.name}</h3>
                  <p className="font-body text-body-lg">{m.role}</p>
                </div>
              </motion.div>
            </RevealChild>
          ))}

          {/* The eighth cell holds the CTA, centred in the space a card would
              occupy — the artboard puts it 207px down a 470px cell. */}
          <RevealChild as="li" y={28} duration={SEC.revealFast} className="flex items-center justify-center">
            <motion.div
              animate={enabled ? { scale: [1, 1.02, 1] } : undefined}
              transition={enabled ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
            >
              <Button
                href={EXTERNAL.career}
                variant="secondary"
                size="xl"
                radius="m"
                className="w-full sm:w-[270px]"
                icon={<ArrowRight className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
              >
                Join our team
              </Button>
            </motion.div>
          </RevealChild>
        </Reveal>
      </Container>
    </section>
  );
};

export default OurTeam;
