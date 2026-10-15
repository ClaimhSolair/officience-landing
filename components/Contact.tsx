import React from 'react';
import Reveal, { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import Flag, { type FlagCode } from './ui/Flags';
import { HomeColumn, HOME_H2, HOME_SUBTITLE } from './ui/HomeSection';
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
 * "Connect With Us", the card 4229:5008 in the blue band 4229:4962 of frame
 * 4229:4651 (1440). Adapter 27.
 *
 * A #F7F7F7 card on the blue, 1392 wide (the home column), px-40 py-64, 48
 * between the parts. The top row has the text column (675) and the white
 * panel with the two survey rows. The six offices follow in two rows of three.
 * From lg every value is the 1440 value times `--u` (see HomeSection.tsx).
 * Below lg the parts stack, with build-choice values.
 *
 * The two rows are the survey's entry points and their contract is unchanged:
 * same two branches, same handler.
 *
 * The 16/26 texts (the panel subtitle, the option texts and the addresses)
 * have a floor of 14/23 on the step scale (ruling 27h). The home card has no
 * eyebrow (2026-10-16). On the other pages the eyebrow is the frame's Eyebrow
 * Tag 4247:5020, 16/26 Medium on the same step (ruling 27i).
 */
interface ContactProps {
  onOpenSurvey: (branch: SurveyBranch) => void;
  /**
   * The six offices. The Services hub (Figma 3257:2582) draws the band without
   * them. Default: shown, as on the home page.
   */
  showOffices?: boolean;
  /**
   * The "Our Contact" eyebrow above the heading. The home frame removes it
   * (4229:5008, 2026-10-16). The Services hub and the case pages keep it
   * (ruling 27i). Default: shown. The home page sets it to false.
   */
  showEyebrow?: boolean;
  /** The line under the heading. The hub draws its own (3257:2599). */
  blurb?: React.ReactNode;
}

const HOME_BLURB = (
  <>
    Our global teams across strategic locations are ready to help you navigate your data &amp; tech
    challenges.
  </>
);

/**
 * Six offices, flat. The July build grouped the two Ho Chi Minh addresses under
 * a single "Hochiminh City, Vietnam" heading with bold sub-labels; both
 * artboards now draw six peers, so the grouping is gone.
 *
 * Copy is Figma's verbatim, including the missing commas in the first three
 * addresses and the underscored Vietnam labels — see the adapter backlog, both
 * read as slips rather than decisions and both are one edit to correct.
 *
 * `display` is the shown text when it differs from `address`, which also goes
 * to Google Maps. Japan keeps "1-chome" in one piece: the free wrap split it
 * as "1- / chome". With the word held together, the line breaks after
 * "Akasaka", as 3151:2444 draws it.
 */
const OFFICES: { city: string; flag: FlagCode; address: string; display?: React.ReactNode }[] = [
  { city: 'France', flag: 'fr', address: '47 Boulevard de Sébastopol 75001 Paris, France' },
  { city: 'USA', flag: 'us', address: '8 The Green, Suite #4511, Dover Delaware 19901, USA' },
  { city: 'Singapore', flag: 'sg', address: '9 Kallang Place, #04-08 Singapore 339154' },
  {
    city: 'Japan',
    flag: 'jp',
    address: 'Ark Mori Bldg. 7F, 12-32, Akasaka 1-chome, Minato-ku, Tokyo 107-6006',
    display: (
      <>
        Ark Mori Bldg. 7F, 12-32, Akasaka <span className="whitespace-nowrap">1-chome,</span> Minato-ku, Tokyo
        107-6006
      </>
    ),
  },
  { city: 'Vietnam_OffyPlex', flag: 'vn', address: '16A Le Hong Phong Street, Hoa Hung Ward, Ho Chi Minh City' },
  {
    city: 'Vietnam_CrunchBase',
    flag: 'vn',
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

/** The row's chevron: the frame's 20px Next Icon (4229:5034), x u from lg. */
const Chevron: React.FC = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className="h-[20px] w-[20px] shrink-0 lg:h-[calc(20*var(--u))] lg:w-[calc(20*var(--u))]"
  >
    <path
      d="M5.69167 3.26667C5.61279 3.18843 5.56842 3.08193 5.56842 2.97083C5.56842 2.85973 5.61279 2.75324 5.69167 2.675L6.575 1.79167C6.65061 1.7111 6.75618 1.6654 6.86667 1.6654C6.97716 1.6654 7.08272 1.7111 7.15833 1.79167L14.8167 9.45C14.9339 9.5671 14.9999 9.72596 15 9.89167V10.1083C14.9999 10.274 14.9339 10.4329 14.8167 10.55L7.15833 18.2083C7.08272 18.2889 6.97716 18.3346 6.86667 18.3346C6.75618 18.3346 6.65061 18.2889 6.575 18.2083L5.69167 17.325C5.61279 17.2468 5.56842 17.1403 5.56842 17.0292C5.56842 16.9181 5.61279 16.8116 5.69167 16.7333L12.425 10L5.69167 3.26667Z"
      fill="#0F1219"
    />
  </svg>
);

const Contact: React.FC<ContactProps> = ({
  onOpenSurvey,
  showOffices = true,
  showEyebrow = true,
  blurb = HOME_BLURB,
}) => (
  // The lower part of the blue band 4229:4962. On the home page Why Us is
  // directly above it, and pt-100 is the frame's 100 gap between the two. The
  // Services hub and the case pages show this band alone, and the same 100
  // gives the card space from the section above it.
  //
  // The footer follows (blue). The frame puts the footer 100 under the card.
  // Footer.tsx has a fixed 64 of top padding, so the band adds 100 x u - 64:
  // 7px at lg, 36px at 1440, 114px at 2560.
  <section id="contact" aria-labelledby="contact-heading" className="bg-bg-primary">
    <HomeColumn className="pb-[16px] pt-[48px] md:pt-[64px] lg:pb-[calc(100*var(--u)-64px)] lg:pt-[calc(100*var(--u))]">
      <Reveal
        as="div"
        y={40}
        enabled={MOTION.contact}
        amount={0.15}
        className="flex w-full flex-col gap-[32px] rounded-[4px] bg-bg-secondary px-[16px] py-[32px] md:gap-[40px] md:px-[32px] md:py-[48px] lg:gap-[calc(48*var(--u))] lg:rounded-[calc(4*var(--u))] lg:px-[calc(40*var(--u))] lg:py-[calc(64*var(--u))]"
      >
        {/* Row 4229:5010: the 675 text column, 80, and the panel (557 at 1440).
            From lg every value scales with --u, so the row fits at 1024 too. */}
        <div className="flex flex-col gap-[32px] md:gap-[40px] lg:flex-row lg:items-start lg:gap-[calc(80*var(--u))]">
          <div className="flex flex-col items-start gap-[12px] md:gap-[16px] lg:w-[calc(675*var(--u))] lg:shrink-0 lg:gap-[calc(16*var(--u))]">
            {/* The home frame (4229:5008, 2026-10-16) has no eyebrow. The
                headline starts at the card's top padding, level with the top of
                the white panel. The other pages keep the eyebrow (ruling 27i). */}
            {showEyebrow && <SectionBadge size="step">Our Contact</SectionBadge>}
            <div className="flex flex-col gap-[16px] md:gap-[24px] lg:gap-[calc(32*var(--u))]">
              <h2 id="contact-heading" className={`${HOME_H2} text-text-default lg:whitespace-nowrap`}>
                Connect With Us
              </h2>
              {/* The old 390 frame has no blurb, so a phone still hides it. From
                  md it shows (build choice). It is 524 wide at 1440. */}
              <p className={`${HOME_SUBTITLE} hidden text-subtitle md:block md:max-w-[524px] lg:max-w-[calc(524*var(--u))]`}>
                {blurb}
              </p>
            </div>
          </div>

          {/* Contact Form 4229:5025: white, radius 6, p-32, 40 between parts. */}
          <div className="flex w-full flex-col gap-[24px] rounded-[6px] bg-bg-default p-[20px] md:gap-[32px] md:p-[28px] lg:min-w-0 lg:flex-1 lg:gap-[calc(40*var(--u))] lg:rounded-[calc(6*var(--u))] lg:p-[calc(32*var(--u))]">
            <div className="flex flex-col gap-[4px] lg:gap-[calc(6*var(--u))]">
              <h3 className="font-sans font-semibold text-[22px] leading-[30px] text-text-default md:text-[26px] md:leading-[36px] lg:text-[length:calc(28*var(--u))] lg:leading-[calc(40*var(--u))]">
                What brings you here?
              </h3>
              <p className="font-body font-normal text-[14px] leading-[22px] text-subtitle md:text-[16px] md:leading-[26px] lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]">
                We&apos;ll tailor the next questions just for you.
              </p>
            </div>

            <Reveal
              as="div"
              stagger={STAGGER.base}
              enabled={MOTION.contact}
              className="flex flex-col gap-[16px] md:gap-[20px] lg:gap-[calc(24*var(--u))]"
            >
              {OPTIONS.map((opt) => (
                <RevealChild as="span" key={opt.branch} y={20} duration={SEC.revealFast} className="block w-full">
                  {/* Form Option Row: #F7F7F7, p-20, no border and no radius, as
                      drawn. The hover ring is inset and takes no space, so the
                      row keeps the drawn size. */}
                  <button
                    type="button"
                    onClick={() => onOpenSurvey(opt.branch)}
                    className="flex w-full items-center justify-between gap-[12px] bg-bg-secondary p-[16px] text-left ring-1 ring-inset ring-transparent transition-shadow hover:ring-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none md:p-[20px] lg:gap-[calc(12*var(--u))] lg:p-[calc(20*var(--u))]"
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-[4px] lg:gap-[calc(4*var(--u))]">
                      <span className="font-sans font-medium text-[18px] leading-[26px] text-text-primary md:text-[20px] md:leading-[28px] lg:text-[length:calc(20*var(--u))] lg:leading-[calc(28*var(--u))]">
                        {opt.title}
                      </span>
                      <span className="font-body font-normal text-[14px] leading-[22px] text-subtitle md:text-[16px] md:leading-[26px] lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]">
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

        {/* Offices 4229:5040: two rows of three, 40 between the rows. Each row is
            justify-between with a 120 minimum gap. The items are 339, 339 and
            394 wide (the frame draws the third item wider), so each gap is 120
            at 1440. One column on a phone and two at md (build choice). */}
        {showOffices && (
          <Reveal
            as="ul"
            stagger={STAGGER.tight}
            enabled={MOTION.contact}
            amount={0.2}
            className="grid gap-[20px] md:grid-cols-2 md:gap-x-[40px] md:gap-y-[32px] lg:grid-cols-[calc(339*var(--u))_calc(339*var(--u))_calc(394*var(--u))] lg:justify-between lg:gap-x-0 lg:gap-y-[calc(40*var(--u))]"
          >
            {OFFICES.map((office) => (
              <RevealChild as="li" key={office.city} y={20} duration={SEC.revealFast}>
                <a
                  href={mapsUrl(office.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:gap-[calc(8*var(--u))]"
                >
                  {/* The country flag takes the place of the drawn location pin
                      (adapter 26b; kept, although the new frame draws pins). The
                      box is the name line's height, so the flag centres on the
                      first line. The address underline on hover stays the cue
                      that the row opens Google Maps. */}
                  <span className="flex h-[26px] w-[24px] shrink-0 items-center md:h-[28px] lg:h-[calc(28*var(--u))] lg:w-[calc(24*var(--u))]">
                    <Flag code={office.flag} className="lg:h-[calc(16*var(--u))] lg:w-[calc(24*var(--u))]" />
                  </span>
                  {/* The text column is 307 wide at 1440 (315 for CrunchBase). */}
                  <div
                    className={`flex min-w-0 flex-1 flex-col gap-[4px] lg:gap-[calc(8*var(--u))] ${
                      office.city === 'Vietnam_CrunchBase'
                        ? 'lg:max-w-[calc(315*var(--u))]'
                        : 'lg:max-w-[calc(307*var(--u))]'
                    }`}
                  >
                    <p className="break-words font-body font-bold text-[18px] leading-[26px] text-text-default transition-colors group-hover:text-text-primary motion-reduce:transition-none md:text-[20px] md:leading-[28px] lg:text-[length:calc(20*var(--u))] lg:leading-[calc(28*var(--u))]">
                      {office.city}
                    </p>
                    <p className="font-body font-normal text-[14px] leading-[22px] text-subtitle md:text-[16px] md:leading-[26px] lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]">
                      <span className="bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px] motion-reduce:transition-none">
                        {office.display ?? office.address}
                      </span>
                      {/* The link name is the visible office name and address
                          plus this text (audit U-29). */}
                      <span className="sr-only"> (Google Maps, opens in a new tab)</span>
                    </p>
                  </div>
                </a>
              </RevealChild>
            ))}
          </Reveal>
        )}
      </Reveal>
    </HomeColumn>
  </section>
);

export default Contact;
