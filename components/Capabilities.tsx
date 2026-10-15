import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal, { RevealChild } from './ui/Reveal';
import Button, { HOME_BTN_ICON } from './ui/Button';
import { HomeColumn, SectionHeader } from './ui/HomeSection';
import ServiceShape, { type ShapeName } from './home/ServiceShapes';
import { MOTION, STAGGER } from '../lib/motion';
import { ROUTES, serviceHref } from './navigation';

/**
 * "What we do" — node 4317:13574 of frame 4229:4651 (adapter 27c).
 *
 * The section header, then a 2 x 2 grid of white cards. Each card has a title,
 * a blurb, a short offering list and an outline "View Brochure" button. A pale
 * shape sits at the bottom-right of each card, and the card clips it.
 *
 * From lg every value is the 1440 value x `--u` (adapter 27b). The grid is 872
 * tall at 1440, so each card is 688 x 428 and the two rows have equal height.
 *
 * Below lg there is no Figma frame. These are build choices: 2 columns from md
 * and 1 column below md, the card height follows its content, the title is
 * 28/36 (32/40 from md), and the shapes are 0.55x (0.6x from md) of the frame.
 */

interface Service {
  title: string;
  blurb: string;
  offerings: string[];
  /** The service page. The site calls a service page a "brochure". */
  to: string;
  shape: ShapeName;
  /** The width of the text column at 1440, in frame px. */
  textW: number;
  /** The blurb width at 1440, when it is narrower than the text column. */
  blurbW?: number;
  /** The frame gaps (frame px): blurb to list, and list to button. They differ per card. */
  gapList: number;
  gapBtn: number;
}

/** The text that the frame draws (adapter 27c). The Services hub keeps its own lists. */
const SERVICES: Service[] = [
  {
    title: 'Design & Digital Experience',
    blurb: 'Craft visual identities and digital products across every online touchpoint.',
    offerings: ['Branding', 'UX/UI', 'Web product'],
    to: serviceHref('design-digital'),
    shape: 'design',
    textW: 410.592,
    blurbW: 374.012,
    gapList: 16,
    gapBtn: 37,
  },
  {
    title: 'Business Intelligence',
    blurb: 'Turn your data into actionable insights.',
    offerings: ['Data analytics', 'KPI dashboards', 'Automation', 'AI & machine learning'],
    to: serviceHref('business-intelligence-analytics'),
    shape: 'bi',
    textW: 349.377,
    gapList: 17,
    gapBtn: 17,
  },
  {
    title: 'Data Processing',
    // FIGMA-SLIP: the frame writes "worflows". The build writes "workflows".
    blurb: 'Engineer & drive workflows to support your operations.',
    offerings: ['Data entry & collection', 'Pipeline streams', 'Support'],
    to: serviceHref('data-engineering-processing'),
    shape: 'data',
    textW: 355.349,
    gapList: 16,
    gapBtn: 37,
  },
  {
    title: 'Software Development',
    blurb: 'Build the technology that runs your enterprise.',
    offerings: ['Web applications', 'E-commerce', 'SaaS platforms', 'Mobile apps'],
    to: serviceHref('software-web-development'),
    shape: 'software',
    textW: 350.123,
    gapList: 16,
    gapBtn: 16,
  },
];

/**
 * The shape box of each card in frame px: its size and its offset from the
 * bottom-right corner of the card. A negative offset puts the shape past the
 * card edge, and the card clips it.
 *
 * Business Intelligence and Data Processing are a 120 box with an inset in
 * Figma. The values here are the image box that the inset gives.
 */
const SHAPE_BOX: Record<ShapeName, { w: number; h: number; right: number; bottom: number }> = {
  design: { w: 282, h: 282, right: -49, bottom: -57 },
  bi: { w: 337, h: 308, right: -88.5, bottom: -83 },
  data: { w: 349, h: 333, right: -100, bottom: -95 },
  software: { w: 298, h: 298, right: -35.5, bottom: -72 },
};

/** Frame px x the step factor: `--s` is 1px below lg and `--u` from lg. */
const s = (px: number) => `calc(${px} * var(--s))`;
/** The shape scale: `--k` is a build value below lg and `--u` from lg. */
const k = (px: number) => `calc(${px} * var(--k))`;

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const box = SHAPE_BOX[service.shape];
  return (
    <RevealChild
      as="li"
      y={40}
      className="relative overflow-clip rounded-[4px] bg-bg-default px-fig-24 py-fig-32 [--k:0.55px] md:[--k:0.6px] lg:py-0 lg:pl-[calc(45*var(--u))] lg:pr-0 lg:pt-[calc(48*var(--u))] lg:[--k:var(--u)]"
    >
      {/* The shape comes first, so the text paints on top of it. At 1440 the
          two do not touch. At other widths they can touch, and then the text
          must stay legible. The frame paints the shape last. */}
      <ServiceShape
        name={service.shape}
        className="pointer-events-none absolute block max-w-none"
        // Inline style: the four boxes differ, and each value scales with --k.
        style={{ width: k(box.w), height: k(box.h), right: k(box.right), bottom: k(box.bottom) }}
      />

      <div
        className="relative flex w-full flex-col items-start lg:w-[var(--text-w)]"
        style={{ gap: s(service.gapBtn), ['--text-w' as string]: `calc(${service.textW} * var(--u))` }}
      >
        <div className="flex w-full flex-col items-start" style={{ gap: s(service.gapList) }}>
          <div className="flex w-full flex-col items-start" style={{ gap: s(12) }}>
            <h3 className="font-sans text-[28px] font-medium leading-[36px] text-text-default md:text-[32px] md:leading-[40px] lg:text-[length:calc(50*var(--u))] lg:leading-[calc(58*var(--u))]">
              {/* The title also opens the service page. The link is a sibling of
                  the button, so no interactive element is in another one. */}
              <Link
                to={service.to}
                className="hover:underline hover:decoration-1 hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {service.title}
              </Link>
            </h3>
            <p
              className="w-full font-body text-[16px] font-normal leading-[26px] text-black lg:w-[var(--blurb-w)] lg:text-[length:calc(16*var(--u))] lg:leading-[calc(26*var(--u))]"
              style={{ ['--blurb-w' as string]: service.blurbW ? `calc(${service.blurbW} * var(--u))` : '100%' }}
            >
              {service.blurb}
            </p>
          </div>
          <ul
            className="flex flex-col font-body text-[12px] font-normal leading-[20px] text-subtitle lg:text-[length:calc(12*var(--u))] lg:leading-[calc(20*var(--u))]"
            style={{ gap: s(1) }}
          >
            {service.offerings.map((offering) => (
              <li key={offering}>{offering}</li>
            ))}
          </ul>
        </div>

        <Button
          to={service.to}
          variant="secondary"
          size="home"
          /* The frame draws a white fill at rest, the same white as the card.
             The variant's white fill gives that, and it keeps the button clear
             of the shape on a narrow card. The hover is pri-50 (ruling 24aa).
             The pressed fill does not change. */
          className="[&:hover:not(:active)]:bg-pri-50"
          icon={<ArrowRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
        >
          View Brochure
          {/* All four buttons read "View Brochure". The hidden name tells which
              service a button opens, for a reader who lists the links. */}
          <span className="sr-only"> — {service.title}</span>
        </Button>
      </div>
    </RevealChild>
  );
};

const Capabilities: React.FC = () => (
  <section id="capabilities">
    <HomeColumn className="flex flex-col gap-fig-40 md:gap-fig-48 lg:gap-[calc(80*var(--u))]">
      <SectionHeader
        headline="What we do"
        subtitle="Comprehensive solutions tailored to your needs"
        cta={
          <Button
            to={ROUTES.services}
            size="home"
            icon={<ArrowRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
          >
            View All Brochure
          </Button>
        }
      />

      {/* The list is the observer and does not move. The cards move. Under
          reduced motion the cards only fade (Reveal). */}
      <Reveal
        as="ul"
        stagger={STAGGER.base}
        enabled={MOTION.services}
        className="grid grid-cols-1 gap-fig-16 [--s:1px] md:grid-cols-2 lg:h-[calc(872*var(--u))] lg:grid-rows-2 lg:gap-[calc(16*var(--u))] lg:[--s:var(--u)]"
      >
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </Reveal>
    </HomeColumn>
  </section>
);

export default Capabilities;
