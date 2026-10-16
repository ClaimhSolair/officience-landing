import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal, { RevealChild } from './ui/Reveal';
import Button, { HOME_BTN_ICON } from './ui/Button';
import { HomeColumn, SectionHeader } from './ui/HomeSection';
import ServiceShape, { type ShapeName } from './home/ServiceShapes';
import { MOTION, STAGGER } from '../lib/motion';
import { ROUTES, serviceHref } from './navigation';

/**
 * "Our Work" (before: "What we do") — node 4317:13574 of frame 4229:4651
 * (adapter 27c). The header text and the card lists follow the frame of
 * 2026-10-16 (header 4317:13575, grid 4459:5903).
 *
 * The section header, then a 2 x 2 grid of white cards. Each card has a title,
 * a blurb, a short offering list and an outline "View Brochure" button. A pale
 * shape sits at the bottom-right of each card, and the card clips it.
 *
 * From lg every value is the 1440 value x `--u` (adapter 27b). Each card has
 * the 688:462 aspect of the frame (688 x 462 at 1440), so its shape does not
 * change with the width inside a step (U-7). The aspect sets the minimum
 * height: long text makes the card taller, and the two cards of a row stay
 * equal. The card has 48 of padding on all sides. The content column is 440
 * wide at most, with gaps of 12 (title to blurb), 20 (blurb to list) and 32
 * (list to button) on all four cards.
 *
 * The button is at the bottom of the content on every card. The frame does
 * this on Data Processing (a 366 content box with space-between). On the other
 * three cards the content is exactly 366 at 1440, so the button is at y 310 on
 * all four cards.
 *
 * The blurb and the list are 16/26. They have a floor of 14/23 (ruling 27h),
 * so the lg step does not make them 11.4px. At 1024 the floor makes the
 * content taller than the aspect box, and the card grows to fit it.
 *
 * Below lg there is no Figma frame. These are build choices: 2 columns from md
 * and 1 column below md, the card height follows its content, the title is
 * 28/36 (32/40 from md), and the shapes are 0.55x (0.6x from md) of the frame.
 * The list has the frame's style (Medium 16/26, disc bullets) at all widths.
 */

interface Service {
  title: string;
  /** The shown title, when it differs from `title` (a forced line break). */
  display?: React.ReactNode;
  blurb: string;
  offerings: string[];
  /** The service page. The site calls a service page a "brochure". */
  to: string;
  shape: ShapeName;
}

/**
 * The text and the order that the frame draws (adapter 27c, grid 4459:5903):
 * Design and Software in the first row, Data Processing and Business
 * Intelligence in the second row. The Services hub keeps its own lists.
 */
const SERVICES: Service[] = [
  {
    title: 'Design Digital Experiences',
    blurb: 'Craft visual identities and digital products across every online touchpoint.',
    offerings: ['Branding', 'UX/UI', 'Web product'],
    to: serviceHref('design-digital'),
    shape: 'design',
  },
  {
    title: 'Software Development',
    blurb: 'Build the technology that runs your enterprise.',
    offerings: ['Web applications', 'E-commerce', 'SaaS platforms', 'Mobile apps'],
    to: serviceHref('software-web-development'),
    shape: 'software',
  },
  {
    title: 'Data Processing',
    // The frame breaks the title after "Data" from lg. At 1440 the title fits
    // the 440 column on one line, so the break must be forced. Below lg the
    // title wraps freely.
    display: (
      <>
        Data <br className="hidden lg:inline" />
        Processing
      </>
    ),
    // FIGMA-SLIP: the frame writes "worflows". The build writes "workflows".
    blurb: 'Engineer & drive workflows to support your operations.',
    offerings: ['Data entry / collection / cleaning', 'Pipelines', 'Support'],
    to: serviceHref('data-engineering-processing'),
    shape: 'data',
  },
  {
    title: 'Business Intelligence',
    blurb: 'Turn your data into actionable insights.',
    offerings: ['Analytics', 'KPI dashboards', 'Automation', 'Machine Learning'],
    to: serviceHref('business-intelligence-analytics'),
    shape: 'bi',
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
  data: { w: 349, h: 333, right: -100, bottom: -96 },
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
      // The card is a flex column at all widths, so the content fills the card
      // height and the button goes to the bottom. The buttons of one row align
      // (U-22). From lg the 688:462 aspect is the minimum height, and the
      // padding is 48 on all sides. `self-stretch` makes the cards of one row
      // the same height when the text makes one taller. `w-full` keeps the
      // width on the column: without it, the grid gets the width from the
      // stretched height through the aspect.
      className="relative flex flex-col overflow-clip rounded-[4px] bg-bg-default px-fig-24 py-fig-32 [--k:0.55px] md:[--k:0.6px] lg:aspect-[688/462] lg:w-full lg:self-stretch lg:p-[calc(48*var(--u))] lg:[--k:var(--u)]"
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

      {/* Content 4459:5905: 440 wide at most, 32 above the button. */}
      <div
        className="relative flex w-full flex-1 flex-col items-start lg:max-w-[calc(440*var(--u))]"
        style={{ gap: s(32) }}
      >
        <div className="flex w-full flex-col items-start" style={{ gap: s(20) }}>
          <div className="flex w-full flex-col items-start" style={{ gap: s(12) }}>
            <h3 className="font-sans text-[28px] font-semibold leading-[36px] text-text-default md:text-[32px] md:leading-[40px] lg:text-[length:calc(50*var(--u))] lg:leading-[calc(58*var(--u))]">
              {/* The frame draws no title link. The button is the only link to
                  the service page, so the keyboard has one stop per card (U-30). */}
              {service.display ?? service.title}
            </h3>
            <p className="w-full font-body text-[16px] font-normal leading-[26px] text-text-default lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]">
              {service.blurb}
            </p>
          </div>
          {/* Service List: Montserrat Regular 16/26 (Body-lg-regular), #0F1219,
              disc bullets in a 24 indent, no gap between the items (user,
              2026-10-16). */}
          <ul className="w-full list-disc pl-[24px] font-body text-[16px] font-normal leading-[26px] text-text-default lg:pl-[calc(24*var(--u))] lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]">
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
             of the shape on a narrow card. The hover is the Hover state of
             the Buttons component: a #1F49BF fill and a white label and icon
             (user, 2026-10-16; this replaces the pri-50 hover of 24aa here).
             The `!` is necessary because the variant's hover fill comes later
             in the stylesheet. `mt-auto` puts the button at the bottom of the
             content at all widths. */
          className="mt-auto hover:!bg-primary hover:!text-white"
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
  <section id="capabilities" aria-labelledby="capabilities-heading">
    <HomeColumn className="flex flex-col gap-fig-40 md:gap-fig-48 lg:gap-[calc(80*var(--u))]">
      {/* Header 4317:13575. The subtitle is right-aligned from lg, as drawn. */}
      <SectionHeader
        headingId="capabilities-heading"
        headline="Our Work"
        subtitle="We build AI-first solutions tailored to you."
        copyAlign="right"
        cta={
          <Button
            to={ROUTES.services}
            size="home"
            icon={<ArrowRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
          >
            Discover our services
          </Button>
        }
      />

      {/* The list is the observer and does not move. The cards move. Under
          reduced motion the cards only fade (Reveal). */}
      <Reveal
        as="ul"
        stagger={STAGGER.base}
        enabled={MOTION.services}
        className="grid grid-cols-1 gap-fig-16 [--s:1px] md:grid-cols-2 lg:grid-rows-2 lg:gap-[calc(16*var(--u))] lg:[--s:var(--u)]"
      >
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </Reveal>
    </HomeColumn>
  </section>
);

export default Capabilities;
