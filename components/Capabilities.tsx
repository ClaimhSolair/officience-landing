import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Container from './ui/Container';
import Reveal, { RevealChild } from './ui/Reveal';
import Button from './ui/Button';
import SectionBadge from './ui/SectionBadge';
import { HEADER_H, MOTION, SEC, STAGGER, useMinWidth, useMotionEnabled } from '../lib/motion';
import { EXTERNAL } from './navigation';

/**
 * Figma 3137:1931 (1920) and 3187:4345 (390).
 *
 * Four services on a shared rule. Desktop splits each row in two: the name and
 * its one-line promise on the left, the offering list and the brochure link
 * right-aligned in a 350px rail. At 390 those four pieces stack in one column
 * and the type drops a whole step — 64px titles become 24px, the promise turns
 * grey, the offerings shrink to 12px.
 *
 * The rules differ between the two frames: 1920 draws one above every row, so a
 * rule also separates the header from the first service; 390 draws them only
 * between rows. Both are reproduced.
 */

interface Service {
  title: string;
  /** The single line under the name. */
  promise: string;
  offerings: string[];
  brochure: string;
}

/**
 * Copy follows the 1920 artboard, which wins wherever the two frames disagree —
 * and they disagree in several places, all listed in the Step 4 checkpoint.
 * Order is the artboards': analytics comes before data engineering, the reverse
 * of the 20th-anniversary build.
 */
const SERVICES: Service[] = [
  {
    title: 'Design & Digital Experience',
    promise: 'Design the look and experience of your brand and digital products.',
    offerings: ['Product design', 'Branding & visual identity', 'UX/UI design', 'Web design'],
    brochure: EXTERNAL.brochureCreativeTribe,
  },
  {
    title: 'Software & Web Development',
    promise: 'Build the technology behind your business.',
    offerings: [
      'Web applications',
      'E-commerce platforms',
      'SaaS platforms',
      'Mobile apps',
      'System integrations',
    ],
    brochure: EXTERNAL.brochureItCraft,
  },
  {
    title: 'Business Intelligence & Analytics',
    promise: 'Turn your data into business insights.',
    offerings: [
      'Data analytics',
      'Business intelligence dashboards',
      'Automation solutions',
      'AI & Machine Learning',
    ],
    brochure: EXTERNAL.brochureAnalytics,
  },
  {
    title: 'Data Engineering & Processing',
    promise: 'Manage and process data to support your business operations.',
    offerings: [
      'Data entry & processing',
      'Data cleaning and enrichment',
      'CRM management',
      'Process outsourcing',
    ],
    brochure: EXTERNAL.brochureCrunch,
  },
];


/**
 * How much of a covered row still shows. The peek is the row's own top padding
 * plus its title line, so what stays visible is the service name — the deck reads
 * as a list of names with the current one opened.
 */
const PEEK = 112;

/**
 * One service row. From lg it pins under the header and the next row slides over
 * it, easing back slightly as it goes so the covered rows read as behind rather
 * than merely underneath.
 *
 * The row needs an opaque fill to do that, which is a visible departure from the
 * artboard: Figma draws these rows on the section background with nothing behind
 * them, because Figma draws them never overlapping. Flagged in the catalog.
 *
 * Two elements, not one: the `li` owns the sticky position and the entrance, the
 * inner box owns the scrub. Both write to `transform`, and one element cannot
 * take a variant and a MotionValue for the same property.
 */
const ServiceRow: React.FC<{
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  decking: boolean;
  children: React.ReactNode;
}> = ({ index, total, progress, decking, children }) => {
  const from = index / total;
  // Spring the raw cover value before deriving the scale and dim, so both ease
  // between wheel notches instead of snapping a step at each one — the jagging
  // the review reported. Overdamped, so a covered row never bounces.
  const coverRaw = useTransform(progress, (p) => Math.min(1, Math.max(0, (p - from) / (1 - from))));
  const cover = useSpring(coverRaw, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const scale = useTransform(cover, [0, 1], [1, 0.98]);
  const filter = useTransform(cover, (t) => `brightness(${1 - 0.03 * t})`);

  const first = index === 0;
  const last = index === total - 1;

  return (
    <RevealChild
      as="li"
      y={44}
      className={decking ? 'sticky' : ''}
      /* The offset is the header plus one peek per row above, so every row lands
         clear of the bar and clear of its predecessors. */
      style={decking ? { top: HEADER_H.lg + index * PEEK, zIndex: index } : undefined}
    >
      <motion.div
        className={`border-border-field ${first ? 'border-t-0 lg:border-t' : 'border-t'} ${
          decking ? 'bg-bg-secondary' : ''
        }`}
        style={decking ? { scale, filter, transformOrigin: '50% 0%' } : undefined}
      >
        {children}
      </motion.div>
    </RevealChild>
  );
};

const Capabilities: React.FC = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);
  const decking = motionOn && wide && MOTION.services;

  // One progress value for the whole deck; each row reads its own slice of it.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start start', 'end end'] });

  return (
  <section id="capabilities" className="bg-bg-secondary">
    <Container className="flex flex-col gap-fig-40 py-fig-32 lg:gap-fig-100 lg:py-fig-100">
      {/* Header. Two columns from lg — name on the left, the promise and the
          catch-all brochure right-aligned on the right. */}
      <Reveal
        as="div"
        stagger={STAGGER.base}
        className="flex flex-col gap-fig-24 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32"
      >
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <SectionBadge>What We Do</SectionBadge>
          </RevealChild>
          {/* 86px over a 74px line box, which is Display-xl's size on Display-md's
              leading — an override the artboard draws directly, not a named style. */}
          <RevealChild as="span" y={28}>
            <h2 className="font-sans text-h1 text-text-default lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
              Our Services
            </h2>
          </RevealChild>
        </div>

        <div className="flex flex-col gap-fig-24 lg:items-end lg:gap-fig-32">
          <RevealChild as="p" y={20} duration={SEC.revealFast} className="font-body text-body-md text-subtitle lg:text-right lg:text-subtitle-1">
            Comprehensive solutions tailored to your needs
          </RevealChild>

          {/* The wrapper carries the alignment the Button used to get from
              `self-center`: it is the flex item now, so the alignment has to
              live on it. Never `display: contents` here — a box that generates
              no box cannot be transformed, and the entrance would silently do
              nothing. */}
          <RevealChild
            as="span"
            y={20}
            duration={SEC.revealFast}
            className="flex w-full flex-col items-center lg:w-auto lg:items-end"
          >
          <Button
            href={EXTERNAL.brochureIndex}
            size="lg"
            radius="none"
            className="w-[336px] max-w-full self-center shadow-fig-xs lg:w-auto lg:self-auto lg:gap-fig-14 lg:rounded-fig-m lg:text-btn-lg"
            icon={
              <>
                {/* The artboards use different arrows for the same button: a
                    straight one at 390, a diagonal at 1920. */}
                <ArrowRight
                  className="h-[24px] w-[24px] shrink-0 lg:hidden"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <ArrowUpRight
                  className="hidden h-[24px] w-[24px] shrink-0 lg:block"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </>
            }
          >
            View All Brochure
          </Button>
          </RevealChild>
        </div>
      </Reveal>

      {/* One observer on the list, not one per row. The list never moves, so its
          visibility is an honest reading of where the reader is, and the rows can
          travel as far as they like without changing the answer. */}
      {/* One observer on the list, not one per row: the list itself never moves,
          so its visibility is an honest reading of where the reader is. The rules
          are drawn by the row now, since a covered row has to carry its own edge.
          1920 rules every row including the first; 390 only rules between. */}
      <Reveal
        as="ul"
        innerRef={listRef}
        stagger={STAGGER.base}
        amount={0.1}
        enabled={MOTION.services}
        className="flex flex-col"
      >
        {SERVICES.map((service, i) => {
          const first = i === 0;
          const last = i === SERVICES.length - 1;
          return (
          <ServiceRow
            key={service.title}
            service={service}
            index={i}
            total={SERVICES.length}
            progress={scrollYProgress}
            decking={decking}
          >
            {/* At 390 a rule sits in 32px of air — the row's own 16px of padding
                plus the 16px the artboard's list puts between row and rule — so
                only the two outer edges of the list get the bare 16. */}
            <div
              className={`flex flex-col gap-fig-20 px-fig-16 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32 lg:px-0 lg:pb-fig-48 lg:pt-fig-64 ${
                first ? 'pt-fig-16' : 'pt-fig-32'
              } ${last ? 'pb-fig-16' : 'pb-fig-32'}`}
            >
              {/* Name + promise. The column takes the slack up to 800px, which
                  leaves the artboard's 642px trough at 1920 and closes it as the
                  viewport narrows. */}
              <div className="flex flex-col gap-fig-12 lg:flex-1 lg:gap-fig-100 lg:max-w-[800px]">
                <h3 className="font-sans text-h3 text-text-primary lg:text-display-md">
                  {service.title}
                </h3>
                <p className="font-body text-body-md text-subtitle lg:text-subtitle-2 lg:text-text-default">
                  {service.promise}
                </p>
              </div>

              {/* Offerings + brochure link, in a fixed rail so the four buttons
                  line up down the section. It arrives a beat after the name, so a
                  row reads left-to-right rather than landing all at once. */}
              <RevealChild
                as="div"
                y={24}
                delay={0.1}
                duration={SEC.revealFast}
                className="flex flex-col gap-fig-12 lg:w-[350px] lg:shrink-0 lg:gap-fig-100"
              >
                <ul className="flex flex-col gap-fig-2 font-body text-caption text-subtitle lg:gap-fig-4 lg:text-right lg:text-body-xl">
                  {service.offerings.map((offering) => (
                    <li key={offering}>{offering}</li>
                  ))}
                </ul>

                <Button
                  href={service.brochure}
                  variant="secondary"
                  size="lg"
                  radius="m"
                  className="w-full shadow-fig-xs lg:w-[350px] lg:text-btn-lg"
                  icon={
                    <ArrowRight
                      className="h-[20px] w-[20px] shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  }
                >
                  View Brochure
                  {/* All four links read "View Brochure"; name the service for
                      anyone listing links out of context. */}
                  <span className="sr-only"> — {service.title}</span>
                </Button>
              </RevealChild>
            </div>
          </ServiceRow>
          );
        })}
      </Reveal>
    </Container>
  </section>
  );
};

export default Capabilities;
