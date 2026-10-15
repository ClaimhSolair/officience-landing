import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button, { HOME_BTN_ICON } from './ui/Button';
import { HomeColumn, SectionHeader } from './ui/HomeSection';
import { ROUTES } from './navigation';
import { EASE, MOTION, SEC, STAGGER, useMotionEnabled } from '../lib/motion';

/**
 * "Why Choose Us", Figma 4229:4963 in frame 4229:4651 (1440). Adapter 27.
 *
 * The blue band 4229:4962 holds Why Us and the Contact card. This section is
 * its top part: pt-24 and the Why Us container (py-24, 80 between the header
 * and the diagram). Contact.tsx supplies the 100 between the two.
 *
 * The diagram (4239:4962) is 1120 x 486 at 1440: four values around a
 * crosshair, with the mark on the crossing. The left pair is right-aligned and
 * the right pair left-aligned. Talents and Execution are #FFBFC7, the other
 * two white. From lg every position is the frame value times `--u`, so the
 * diagram is 796 wide at 1024 and fits the 990 column.
 *
 * FIGMA-SLIP (reproduced): the crosshair is not at the centre of the diagram.
 * It is at x 531 of 1120, so it sits 29px left of the page centre at 1440.
 *
 * Below lg the diagram is a 2 x 2 grid with the same crosshair (build choice:
 * there is no frame below 1440, and the drawn positions need 1120 x u).
 */
const VALUES = [
  {
    title: 'Talents',
    body: 'We are digital-citizens, hungry with new problems.',
    accent: true,
    left: true,
    top: true,
    // Card 4229:4979: left, top, width at 1440.
    pos: 'lg:left-[calc(150.06*var(--u))] lg:top-[calc(31*var(--u))] lg:w-[calc(351*var(--u))]',
  },
  {
    title: 'Flexible',
    body: 'We deliver ‘follow the sun’, agentic-backed - focusing on visible results.',
    accent: false,
    left: false,
    top: true,
    pos: 'lg:left-[calc(564*var(--u))] lg:top-[calc(31*var(--u))] lg:w-[calc(414*var(--u))]',
  },
  {
    title: 'International',
    // "strive" is the frame's word. It possibly is "thrive" (flagged).
    body: 'We’ve got a track record helping businesses strive, in dynamic markets.',
    accent: false,
    left: true,
    top: false,
    pos: 'lg:left-[calc(69.06*var(--u))] lg:top-[calc(290*var(--u))] lg:w-[calc(432*var(--u))]',
  },
  {
    // The frame renames "Value-Driven" to "Execution" (adapter 27).
    title: 'Execution',
    body: 'We provide affordable, transparent, value-driven pricing – for premium impact.',
    accent: true,
    left: false,
    top: false,
    pos: 'lg:left-[calc(563.06*var(--u))] lg:top-[calc(290*var(--u))] lg:w-[calc(437*var(--u))]',
  },
];

/**
 * The mark on the crossing (Item Icon 4229:5006, 117 at 1440). The frame
 * backs it with a #1F49BF square, the band colour. The backing span in the
 * diagram does that, so the two rules pass behind the mark.
 */
const Pinwheel: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 117 117" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M115.445 58.0755C115.445 58.0755 117.131 30.4023 101.192 14.3796C85.2523 -1.64329 57.7228 0.0516859 57.7228 0.0516859C57.7228 0.0516859 56.0365 27.7249 71.9762 43.7478C87.9157 59.7705 115.445 58.0755 115.445 58.0755Z"
      fill="#FFFFFF"
    />
    <path
      d="M0.0514164 58.076C0.0514164 58.076 27.581 59.7708 43.5206 43.7481C59.4602 27.7252 57.7741 0.0521233 57.7741 0.0521233C57.7741 0.0521233 30.2445 -1.64297 14.3048 14.3799C-1.63473 30.4026 0.0514164 58.076 0.0514164 58.076Z"
      fill="#FFBFC7"
    />
    <path
      d="M115.445 57.4213C115.445 57.4213 117.131 85.0946 101.192 101.117C85.2523 117.14 57.7228 115.445 57.7228 115.445C57.7228 115.445 56.0365 87.7719 71.9762 71.7491C87.9157 55.7264 115.445 57.4213 115.445 57.4213Z"
      fill="#FFBFC7"
    />
    <path
      d="M0.0514225 57.4209C0.0514225 57.4209 27.581 55.726 43.5206 71.7487C59.4602 87.7716 57.7741 115.445 57.7741 115.445C57.7741 115.445 30.2445 117.14 14.3048 101.117C-1.63473 85.0942 0.0514225 57.4209 0.0514225 57.4209Z"
      fill="#FFFFFF"
    />
  </svg>
);

/** Both rules are #F7F7F7 (Semantic/BG/Secondary), not white. */
const RULE = 'bg-[#F7F7F7]';

/**
 * The diagram motion. One parent observes and does not move. Its variants go
 * to the children: each value arrives from its corner, the rules draw from the
 * centre, and the mark turns into place.
 */
const valueVariants = (left: boolean, top: boolean): Variants => ({
  hidden: { opacity: 0, x: left ? -24 : 24, y: top ? -20 : 20 },
  shown: { opacity: 1, x: 0, y: 0, transition: { duration: SEC.revealBase, ease: [...EASE.reveal] } },
});
const ruleX: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: SEC.revealSlow, ease: [...EASE.reveal] } },
};
const ruleY: Variants = {
  hidden: { scaleY: 0 },
  shown: { scaleY: 1, transition: { duration: SEC.revealSlow, ease: [...EASE.reveal] } },
};
const markVariants: Variants = {
  hidden: { rotate: -90, scale: 0.6 },
  shown: { rotate: 0, scale: 1, transition: { duration: SEC.revealSlow, ease: [...EASE.roll], delay: 0.15 } },
};

const WhyOfficience: React.FC = () => {
  const motionOn = useMotionEnabled();
  const animating = motionOn && MOTION.whyUs;

  return (
    // overflow-x-clip: before the reveal, a value waits 24px to the side of its
    // place. On a phone that made the page 398px wide at 390 (E2E 2026-10-15).
    <section id="why-us" aria-labelledby="why-us-heading" className="overflow-x-clip bg-bg-primary">
      {/* The band's pt-24 plus the container's py-24. Below lg: build choice. */}
      <HomeColumn className="pt-[48px] md:pt-[64px] lg:pt-[calc(48*var(--u))]">
        <div className="flex flex-col items-center gap-[40px] pb-[8px] md:gap-[56px] md:pb-[16px] lg:gap-[calc(80*var(--u))] lg:pb-[calc(24*var(--u))]">
          <SectionHeader
            theme="dark"
            headline="Why Choose Us"
            subtitle="Connect with our AI-first teams, accessible globally, and start your project within 48 hours!"
            reveal={MOTION.whyUs}
            className="w-full"
            headingId="why-us-heading"
            // Header 4426:5701 (2026-10-16) adds this CTA. It is the on-blue
            // primary button of the hero: white, a #1F49BF label, hover pri-50,
            // pressed pri-100 and a white focus ring. The target is the old
            // "Meet our Team" target (ruling 27d).
            cta={
              <Button
                to={`${ROUTES.about}#our-team`}
                variant="secondary"
                size="home"
                onDark
                className="border-transparent"
                icon={<ArrowRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
              >
                Meet our teams
              </Button>
            }
          />

          {/* The observer: it never transforms. Its variants reach every motion
              child below. Off: it starts at "shown", so nothing waits for an
              animation. */}
          <motion.div
            className="relative w-full py-[8px] md:py-[12px] lg:h-[calc(486.371*var(--u))] lg:w-[calc(1120.125*var(--u))] lg:py-0"
            initial={animating ? 'hidden' : 'shown'}
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: STAGGER.base } } }}
          >
            {/* lg: the frame's rules. The vertical one is x 531 (288.5 + 242.5)
                and full height. The horizontal one is 486 wide from x 288.5,
                at y 242.87. */}
            <motion.span
              aria-hidden="true"
              variants={ruleY}
              className={`absolute top-0 hidden h-full w-px origin-center lg:left-[calc(531*var(--u)-0.5px)] lg:block ${RULE}`}
            />
            <motion.span
              aria-hidden="true"
              variants={ruleX}
              className={`absolute hidden h-px origin-center lg:left-[calc(288.5*var(--u))] lg:top-[calc(242.87*var(--u)-0.5px)] lg:block lg:w-[calc(486.371*var(--u))] ${RULE}`}
            />
            {/* Below lg: the vertical rule runs through the grid centre. */}
            <motion.span
              aria-hidden="true"
              variants={ruleY}
              className={`absolute inset-y-0 left-[calc(50%-0.5px)] w-px origin-center lg:hidden ${RULE}`}
            />

            {/* lg: the mark and its backing (Item Icon at 473.5, 185.37). The
                backing does not turn, so its corners never sweep over the rules. */}
            <span
              aria-hidden="true"
              className="absolute z-[1] hidden bg-bg-primary lg:left-[calc(473.5*var(--u))] lg:top-[calc(185.37*var(--u))] lg:block lg:h-[calc(117*var(--u))] lg:w-[calc(117*var(--u))]"
            >
              <motion.span className="block h-full w-full" variants={markVariants}>
                <Pinwheel className="h-full w-full" />
              </motion.span>
            </span>

            <ul className="relative z-10 grid grid-cols-2 grid-rows-[auto_0px_auto] gap-x-[20px] gap-y-[36px] md:gap-x-[48px] md:gap-y-[52px] lg:absolute lg:inset-0 lg:block">
              {VALUES.map((value, i) => (
                <motion.li
                  key={value.title}
                  variants={valueVariants(value.left, value.top)}
                  className={`flex flex-col gap-[4px] md:gap-[6px] lg:absolute lg:gap-[calc(8*var(--u))] lg:px-[calc(24*var(--u))] lg:py-[calc(20*var(--u))] ${value.pos} ${
                    value.left ? 'items-end text-right' : 'items-start text-left'
                  } ${i > 1 ? 'row-start-3' : 'row-start-1'} ${value.left ? 'col-start-1' : 'col-start-2'}`}
                >
                  <h3
                    className={`whitespace-nowrap font-sans font-medium tracking-[-0.03em] text-[20px] leading-[24px] md:text-[40px] md:leading-[40px] lg:text-[length:calc(64*var(--u))] lg:leading-[calc(58*var(--u))] ${
                      value.accent ? 'text-[#FFBFC7]' : 'text-white'
                    }`}
                  >
                    {value.title}
                  </h3>
                  {/* The 16/26 text has a floor of 14/23 on the step scale
                      (ruling 27h). */}
                  <p className="font-body font-normal text-[12px] leading-[18px] text-white md:text-[14px] md:leading-[22px] lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]">
                    {value.body}
                  </p>
                </motion.li>
              ))}

              {/* Below lg: row 2 of the grid is the horizontal rule, with the mark
                  on the crossing. Decorative, so hidden from the outline. */}
              <li
                aria-hidden="true"
                className="relative z-10 col-span-2 row-start-2 h-px w-full lg:hidden"
              >
                <motion.span variants={ruleX} className={`absolute inset-0 block origin-center ${RULE}`} />
                <span className="absolute left-1/2 top-1/2 z-[1] block h-[48px] w-[48px] -translate-x-1/2 -translate-y-1/2 bg-bg-primary md:h-[72px] md:w-[72px]">
                  <motion.span className="block h-full w-full" variants={markVariants}>
                    <Pinwheel className="h-full w-full" />
                  </motion.span>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </HomeColumn>
    </section>
  );
};

export default WhyOfficience;
