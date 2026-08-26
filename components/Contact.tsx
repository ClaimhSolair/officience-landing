import React from 'react';
import Reveal, { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import { MOTION, SEC, STAGGER } from '../lib/motion';
import type { SurveyBranch } from '../types';

/**
 * Each office row opens its address in Google Maps. Requested by the team;
 * Figma draws no link here, so it is recorded in the adapter as a deliberate
 * behaviour divergence, the same class as the Cookie Settings entry.
 */
const mapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

/**
 * Figma 3151:2444 (1920) and 3153:8776 (390).
 *
 * A light card on the blue. 1920 sets the heading beside the form and runs the
 * offices underneath in three columns; 390 stacks all three and the offices
 * become a single column.
 *
 * The section paints its own blue, which retires the wrapper HomePage used to
 * put around it.
 *
 * The card does NOT use `ui/Container`: every other section sits in the 1792px
 * content column on 64px gutters, and this one is drawn on 74px gutters at
 * 1772px wide. The gutters are reproduced rather than snapped to the column,
 * since the 10px shows against the section above it.
 *
 * The two rows are the survey's entry points and their contract is unchanged —
 * same two branches, same handler.
 */
interface ContactProps {
  onOpenSurvey: (branch: SurveyBranch) => void;
}

/**
 * Six offices, flat. The July build grouped the two Ho Chi Minh addresses under
 * a single "Hochiminh City, Vietnam" heading with bold sub-labels; both
 * artboards now draw six peers, so the grouping is gone.
 *
 * Copy is Figma's verbatim, including the missing commas in the first three
 * addresses and the underscored Vietnam labels — see the adapter backlog, both
 * read as slips rather than decisions and both are one edit to correct.
 */
const OFFICES = [
  { city: 'France', address: '47 Boulevard de Sébastopol 75001 Paris, France' },
  { city: 'USA', address: '8 The Green, Suite #4511, Dover Delaware 19901, USA' },
  { city: 'Singapore', address: '9 Kallang Place, #04-08 Singapore 339154' },
  { city: 'Japan', address: 'Ark Mori Bldg. 7F, 12-32, Akasaka 1-chome, Minato-ku, Tokyo 107-6006' },
  { city: 'Vietnam_OffyPlex', address: '16A Le Hong Phong Street, Hoa Hung Ward, Ho Chi Minh City' },
  {
    city: 'Vietnam_CrunchBase',
    address: '262/18 Huynh Van Banh Street, Phu Nhuan Ward, Ho Chi Minh City',
  },
];

const OPTIONS: { branch: SurveyBranch; title: string; desc: string }[] = [
  {
    branch: 'work',
    title: 'Work with Officience',
    desc: "I'm looking for a digital partner - IT, Design, Data or BPO.",
  },
  {
    branch: 'category',
    title: 'Category inquiries',
    desc: 'Internship, co-working, partnership & more.',
  },
];

/**
 * Iconly Light-Outline/Location, drawn 16.5x19.5 inside a 24px box. Figma masks
 * it with a full-bounds white rect — a no-op, so the mask is dropped and the
 * artwork is simply offset into a 24x24 viewBox.
 */
const LocationPin: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className="h-[24px] w-[24px] shrink-0">
    <g transform="translate(4 2)" fill="#DD3C57" fillRule="evenodd" clipRule="evenodd">
      <path d="M8.2505 6.5C7.2855 6.5 6.5005 7.285 6.5005 8.251C6.5005 9.216 7.2855 10 8.2505 10C9.2155 10 10.0005 9.216 10.0005 8.251C10.0005 7.285 9.2155 6.5 8.2505 6.5M8.2505 11.5C6.4585 11.5 5.0005 10.043 5.0005 8.251C5.0005 6.458 6.4585 5 8.2505 5C10.0425 5 11.5005 6.458 11.5005 8.251C11.5005 10.043 10.0425 11.5 8.2505 11.5" />
      <path d="M8.2495 1.5C4.5275 1.5 1.4995 4.557 1.4995 8.313C1.4995 13.092 7.1235 17.748 8.2495 17.996C9.3755 17.747 14.9995 13.091 14.9995 8.313C14.9995 4.557 11.9715 1.5 8.2495 1.5V1.5ZM8.2495 19.5C6.4555 19.5 -0.0005 13.948 -0.0005 8.313C-0.0005 3.729 3.7005 0 8.2495 0C12.7985 0 16.4995 3.729 16.4995 8.313C16.4995 13.948 10.0435 19.5 8.2495 19.5V19.5Z" />
    </g>
  </svg>
);

/**
 * The row's chevron. Figma draws it at two optical weights — a light one inside
 * a 32px button at 390, a heavier bare glyph at 1920 — so both ship and swap at
 * the breakpoint rather than one being scaled into the other's place.
 */
const Chevron: React.FC = () => (
  <>
    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:hidden">
      <svg viewBox="0 0 7.5 13.3333" fill="none" aria-hidden="true" focusable="false" className="h-[13.33px] w-[7.5px]">
        <path
          d="M0.204916 13.1324C-0.043467 12.8889 -0.0660473 12.5079 0.137175 12.2394L0.204916 12.1625L5.81118 6.66667L0.204916 1.17086C-0.043467 0.927356 -0.0660473 0.546319 0.137175 0.277813L0.204916 0.200887C0.453299 -0.0426124 0.841978 -0.0647487 1.11587 0.134478L1.19434 0.200887L7.29508 6.18168C7.54347 6.42518 7.56605 6.80622 7.36282 7.07472L7.29508 7.15165L1.19434 13.1324C0.921117 13.4003 0.478137 13.4003 0.204916 13.1324Z"
          fill="#0F1219"
        />
      </svg>
    </span>
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="hidden h-[20px] w-[20px] shrink-0 lg:block"
    >
      <path
        d="M5.69167 3.26667C5.61279 3.18843 5.56842 3.08193 5.56842 2.97083C5.56842 2.85973 5.61279 2.75324 5.69167 2.675L6.575 1.79167C6.65061 1.7111 6.75618 1.6654 6.86667 1.6654C6.97716 1.6654 7.08272 1.7111 7.15833 1.79167L14.8167 9.45C14.9339 9.5671 14.9999 9.72596 15 9.89167V10.1083C14.9999 10.274 14.9339 10.4329 14.8167 10.55L7.15833 18.2083C7.08272 18.2889 6.97716 18.3346 6.86667 18.3346C6.75618 18.3346 6.65061 18.2889 6.575 18.2083L5.69167 17.325C5.61279 17.2468 5.56842 17.1403 5.56842 17.0292C5.56842 16.9181 5.61279 16.8116 5.69167 16.7333L12.425 10L5.69167 3.26667Z"
        fill="#0F1219"
      />
    </svg>
  </>
);

const Contact: React.FC<ContactProps> = ({ onOpenSurvey }) => (
  <section id="contact" className="bg-bg-primary">
    <div className="w-full px-fig-16 py-fig-16 lg:px-fig-24 lg:py-fig-120 3xl:px-[74px]">
      <Reveal
        as="div"
        y={40}
        enabled={MOTION.contact}
        amount={0.15}
        className="mx-auto flex w-full max-w-[1772px] flex-col gap-[14px] rounded-fig-xs bg-bg-secondary px-fig-16 py-fig-24 lg:gap-fig-64 lg:rounded-fig-l lg:p-fig-64"
      >
        <div className="flex flex-col gap-fig-24 lg:flex-row lg:items-start lg:gap-fig-24">
          <div className="flex flex-col items-start gap-fig-8 lg:w-[624px] lg:shrink-0 lg:gap-0">
            <SectionBadge>Our Contact</SectionBadge>
            {/* 1920 breaks the headline by hand after "Connect"; 390 keeps it on
                one line, so the break only exists from lg up. */}
            <h2 className="font-sans text-h1 text-text-default lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
              Connect <span className="lg:block">With Us</span>
            </h2>
            {/* The 390 frame drops the blurb entirely. */}
            <p className="hidden font-body text-subtitle lg:mt-fig-32 lg:block lg:pr-[100px] lg:text-subtitle-1">
              Our global teams across strategic locations are ready to help you navigate your data
              &amp; tech challenges.
            </p>
          </div>

          <div className="flex w-full flex-col gap-fig-20 rounded-fig-xs bg-bg-default p-fig-20 lg:min-w-0 lg:flex-1 lg:gap-fig-64 lg:rounded-[6px] lg:p-fig-40">
            <div className="flex flex-col gap-[4px] lg:gap-[6px]">
              <h3 className="font-sans text-h4 text-text-default lg:text-[28px] lg:font-semibold lg:leading-[40px]">
                What brings you here?
              </h3>
              <p className="font-body text-[12px] leading-[16px] text-subtitle lg:text-body-xl">
                We&apos;ll tailor the next questions just for you.
              </p>
            </div>

            <Reveal as="div" stagger={STAGGER.base} enabled={MOTION.contact} className="flex flex-col gap-fig-12 lg:gap-fig-32">
              {OPTIONS.map((opt) => (
                <RevealChild
                  as="span"
                  key={opt.branch}
                  y={20}
                  duration={SEC.revealFast}
                  className="block w-full"
                >
                <button
                  type="button"
                  onClick={() => onOpenSurvey(opt.branch)}
                  className="flex w-full items-center justify-between gap-fig-12 rounded-fig-xs border border-gray-fig-100 bg-bg-secondary p-fig-12 text-left transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none lg:p-fig-20"
                >
                  <span className="flex min-w-0 flex-col lg:gap-[4px]">
                    <span className="font-body font-bold text-[14px] leading-[22px] text-text-primary lg:font-sans lg:text-[24px] lg:font-semibold lg:leading-[32px]">
                      {opt.title}
                    </span>
                    <span className="font-body text-[10px] leading-[16px] text-subtitle lg:text-body-xl">
                      {opt.desc}
                    </span>
                  </span>
                  <Chevron />
                </button>
                </RevealChild>
              ))}
            </Reveal>
          </div>
        </div>

        {/* 390 pads this block by 16 and runs one column; 1920 drops the padding
            and lays the six out three-up on a 160px gutter. */}
        <Reveal
          as="ul"
          stagger={STAGGER.tight}
          enabled={MOTION.contact}
          amount={0.2}
          className="grid gap-fig-12 p-fig-16 lg:grid-cols-3 lg:gap-x-fig-160 lg:gap-y-fig-48 lg:p-0"
        >
          {OFFICES.map((office) => (
            <RevealChild as="li" key={office.city} y={20} duration={SEC.revealFast}>
              <a
                href={mapsUrl(office.address)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${office.city} office in Google Maps`}
                className="group flex items-start gap-fig-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LocationPin />
                <div className="flex min-w-0 flex-1 flex-col gap-[2px] lg:gap-fig-8 lg:max-w-[383px]">
                  <p className="font-body font-bold text-[14px] leading-[22px] text-text-default group-hover:text-text-primary transition-colors motion-reduce:transition-none lg:font-sans lg:text-[24px] lg:font-semibold lg:leading-[32px]">
                    {office.city}
                  </p>
                  <p className="font-body text-[12px] leading-[20px] text-subtitle lg:text-body-xl">
                    <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px] motion-reduce:transition-none">
                      {office.address}
                    </span>
                  </p>
                </div>
              </a>
            </RevealChild>
          ))}
        </Reveal>
      </Reveal>
    </div>
  </section>
);

export default Contact;
