import React from 'react';
import Container from './ui/Container';
import SectionBadge from './ui/SectionBadge';
import ApproachMark, { type MarkName } from './ui/ApproachMark';

/**
 * Figma 3144:3723 (1920) and 3137:2432 (390).
 *
 * Three steps, each opened by a vertical rule: a number, a pinwheel mark, then
 * the step's name and what happens in it. Desktop lays them in a row and aligns
 * the three text blocks to a common line — which is why the mark sits in a
 * fixed-height slot rather than being followed by a plain gap.
 *
 * The row starts at md, not lg: Figma only draws 390 and 1920, and taking the 390
 * stack all the way to 1023 left three full-width steps on a tablet where three
 * columns fit comfortably. The mark keeps a fixed slot at md for the same reason it
 * has one at lg — Engage's mark is 105px where the other two are 100, so without it
 * the three text blocks start on different lines. Below md the steps stack and the
 * marks get a plain gap, as the 390 artboard draws them.
 *
 * Nothing here is interactive: the artboards draw no CTA in this section, so the
 * survey entry points live only in Connect With Us.
 */

interface Step {
  number: string;
  name: string;
  body: string;
  mark: MarkName;
  /** The marks are drawn at different sizes; Engage's is the largest. */
  markClass: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    name: 'Engage',
    body: "Meet our engagers to understand your pain points, find solutions, and build a roadmap together. We're COSMIC.",
    mark: 'engage',
    markClass: 'h-[105px] w-[105px] lg:h-[169px] lg:w-[169px]',
  },
  {
    number: '02',
    name: 'Collaborate',
    body: 'Execute your project in agile mode — with proximity, transparency, and productivity. Small teams, people magic.',
    mark: 'collaborate',
    markClass: 'h-[100px] w-[100px] lg:h-[140px] lg:w-[140px]',
  },
  {
    number: '03',
    name: 'Run',
    body: 'Roll-out in production, adopt the products, and support your users. People first, tech second.',
    mark: 'run',
    markClass: 'h-[100px] w-[100px] lg:h-[140px] lg:w-[140px]',
  },
];

const HowWeEngage: React.FC = () => (
  <section id="approach" className="bg-bg-secondary">
    <Container className="flex flex-col gap-fig-32 py-fig-32 lg:gap-fig-146 lg:py-fig-100">
      {/* Header. The blurb sits bottom-aligned against the title at desktop,
          in a 600px block flush with the content edge. */}
      <div className="flex flex-col gap-fig-24 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32">
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <SectionBadge>How We Work</SectionBadge>
          <h2 className="font-sans text-h1 text-text-default lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
            Our Approach
          </h2>
        </div>

        <p className="font-body text-body-md text-subtitle lg:w-[600px] lg:min-w-0 lg:text-subtitle-1">
          How we transform your vision into seamless digital reality with agile speed.
        </p>
      </div>

      {/* Steps. `items-start` is load-bearing: each rule is its own step's
          height, and the artboard draws the third one shorter because Run's
          copy is shorter. Stretching them would flatten that. */}
      <ol className="flex flex-col gap-fig-40 md:flex-row md:items-start md:gap-fig-24 lg:gap-fig-120">
        {STEPS.map((step) => (
          <li
            key={step.number}
            /* At 390 the rules run past the copy: the artboard gives its three
               steps 340/350/350px regardless of how much text each holds, so the
               rule length is a constant, not a consequence. One min-height says
               that; Engage ends up 10px longer than drawn. From md the steps sit
               in a row and the rule is the content's own height again. */
            className="flex min-h-[350px] flex-col border-l border-border-field pl-fig-40 md:min-h-0 md:flex-1 md:pl-fig-24 lg:pl-fig-32"
          >
            <p
              aria-hidden="true"
              className="font-sans font-semibold text-[24px] leading-[32px] text-subtitle lg:text-h2"
            >
              {step.number}
            </p>

            {/* Fixed slot from lg so all three text blocks start on one line. */}
            <div className="mt-fig-24 md:h-[105px] lg:mt-fig-32 lg:h-[169px]">
              <ApproachMark name={step.mark} className={step.markClass} />
            </div>

            <div className="mt-fig-24 flex flex-col gap-fig-8 lg:mt-fig-116 lg:gap-fig-24">
              <h3 className="font-sans text-h3 text-text-primary lg:text-display-sm">
                {step.name}
              </h3>
              <p className="font-body text-body-lg text-text-default lg:text-subtitle-2">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  </section>
);

export default HowWeEngage;
