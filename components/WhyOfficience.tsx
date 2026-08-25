import React from 'react';
import Container from './ui/Container';
import SectionBadge from './ui/SectionBadge';

/**
 * Figma 3151:2667 (1920) and 3153:8671 (390).
 *
 * Four values in the quadrants of a crosshair, with the pinwheel sitting on the
 * crossing. The left column is right-aligned and the right column left-aligned,
 * so all four blocks read outward from the centre, and the accent colour runs
 * diagonally — Talents and Value-Driven in Secondary/200, the other two white.
 *
 * The section paints its own `Semantic/BG/Primary`, so it no longer depends on
 * the blue wrapper HomePage puts around the not-yet-rebuilt Contact.
 *
 * Both rules overhang the text — 45/50px at 1920, ~7px at 390 — which is why the
 * quadrant carries that overhang as its own padding: the vertical rule can then
 * be `inset-y-0` against it, and every remaining measurement falls on a spacing
 * token (120 above, 160 below at 1920; 24 and 32 at 390) rather than a pile of
 * arbitrary offsets.
 */
const VALUES = [
  {
    title: 'Talents',
    body: 'We are digital-native doers, living online, and breathing new tools every day.',
    accent: true,
    /* Column widths are Figma's per-cell text boxes. They matter: the copy is
       written to break in a particular place, and letting a cell fill its grid
       column instead would re-wrap every line. */
    width: 'max-w-[145px] lg:max-w-[420px]',
  },
  {
    title: 'Flexible',
    body: 'We deliver the agile way, support ‘follow the sun’, and focus on visible results.',
    accent: false,
    width: 'max-w-[144px] lg:max-w-[418px]',
  },
  {
    title: 'International',
    body: 'We’ve got a track record helping businesses transform faster in dynamic markets.',
    accent: false,
    width: 'max-w-[148px] lg:max-w-[451px]',
  },
  {
    title: 'Value-Driven',
    body: 'We pair premium technical execution with transparent pricing, ensuring your budget drives real impact, not overhead.',
    accent: true,
    width: 'max-w-[144px] lg:max-w-[516px]',
  },
];

/**
 * The mark on the crossing. Figma backs it with a rounded rectangle filled
 * `#1F49BF` — the section's own background, so it paints nothing — and that
 * shape is dropped here, the same no-op the Approach marks carried.
 */
const Pinwheel: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 135.556 135.712" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M135.496 68.1619C135.496 68.1619 137.474 35.6824 118.767 16.877C100.059 -1.92869 67.7479 0.0606626 67.7479 0.0606626C67.7479 0.0606626 65.7687 32.5401 84.4768 51.3457C103.185 70.1512 135.496 68.1619 135.496 68.1619Z"
      fill="#FFFFFF"
    />
    <path
      d="M0.0603462 68.1624C0.0603462 68.1624 32.3712 70.1516 51.0791 51.3461C69.7871 32.5405 67.8081 0.061176 67.8081 0.061176C67.8081 0.061176 35.4972 -1.92832 16.7892 16.8773C-1.91865 35.6828 0.0603462 68.1624 0.0603462 68.1624Z"
      fill="#FF9FAE"
    />
    <path
      d="M135.496 67.3941C135.496 67.3941 137.474 99.8735 118.767 118.679C100.059 137.485 67.7479 135.495 67.7479 135.495C67.7479 135.495 65.7687 103.016 84.4768 84.2102C103.185 65.4048 135.496 67.3941 135.496 67.3941Z"
      fill="#FF9FAE"
    />
    <path
      d="M0.0603534 67.3936C0.0603534 67.3936 32.3712 65.4044 51.0791 84.2098C69.7871 103.015 67.8081 135.495 67.8081 135.495C67.8081 135.495 35.4972 137.484 16.7892 118.679C-1.91864 99.8732 0.0603534 67.3936 0.0603534 67.3936Z"
      fill="#FFFFFF"
    />
  </svg>
);

/** Both rules are drawn in Semantic/BG/Secondary, not white. */
const RULE = 'bg-[#F7F7F7]';

const WhyOfficience: React.FC = () => (
  <section id="why-us" className="bg-bg-primary">
    <Container className="py-fig-32 lg:pb-fig-160 lg:pt-fig-100">
      {/* 1920 sets the blurb in a 572px column flush with the content column's
          right edge, dropped 18px against the badge. 390 stacks it underneath. */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32">
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <SectionBadge>Our Value</SectionBadge>
          <h2 className="font-sans text-h1 text-white lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
            Why Choose Us
          </h2>
        </div>
        <p className="mt-fig-24 font-body text-body-md text-white lg:mt-[18px] lg:w-[572px] lg:shrink-0 lg:text-subtitle-1">
          Connect with our AI-first teams, accessible globally, and launch your project immediately
          &ndash; we start in 24 hours!
        </p>
      </div>

      <div className="relative mt-fig-24 pb-[6px] pt-[7px] lg:mt-fig-120 lg:pb-[50px] lg:pt-[45px]">
        {/* The first row is held open so the horizontal rule lands where Figma
            draws it rather than riding up against the copy — `minmax` rather
            than a fixed track, so longer copy pushes the rule down instead of
            colliding with it. The middle track is the rule itself. */}
        <ul className="grid grid-cols-2 grid-rows-[minmax(83px,auto)_0px_auto] gap-x-[32px] gap-y-[21px] lg:grid-rows-[minmax(158px,auto)_0px_auto] lg:gap-x-[128px] lg:gap-y-[83px]">
          {VALUES.map((value, i) => {
            const left = i % 2 === 0;
            return (
              <li
                key={value.title}
                className={`flex flex-col gap-[3px] lg:gap-fig-8 ${value.width} ${
                  left ? 'justify-self-end text-right' : ''
                } ${i > 1 ? 'row-start-3' : ''}`}
              >
                <h3
                  className={`font-sans text-h4 lg:text-[64px] lg:leading-[58px] lg:tracking-[-0.03em] ${
                    value.accent ? 'text-sec-200' : 'text-white'
                  }`}
                >
                  {value.title}
                </h3>
                <p className="font-body text-[10px] font-normal leading-[16px] text-white lg:text-body-xl">
                  {value.body}
                </p>
              </li>
            );
          })}

          {/* Row 2 of the grid: the rule, with the mark centred on the crossing.
              Both are decorative, so the item is hidden from the outline. */}
          <li
            aria-hidden="true"
            className={`relative col-span-2 row-start-2 mx-auto h-px w-[266px] lg:w-[851px] ${RULE}`}
          >
            <Pinwheel className="absolute left-1/2 top-1/2 h-[43.21px] w-[43.21px] -translate-x-1/2 -translate-y-1/2 lg:h-[135.71px] lg:w-[135.56px]" />
          </li>
        </ul>

        <span aria-hidden="true" className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${RULE}`} />
      </div>
    </Container>
  </section>
);

export default WhyOfficience;
