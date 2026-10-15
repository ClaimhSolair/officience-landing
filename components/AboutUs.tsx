import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ASSETS, srcSetOf } from '../assets';
import Button, { HOME_BTN_ICON } from './ui/Button';
import { HomeColumn, HOME_H2 } from './ui/HomeSection';
import Reveal, { RevealChild } from './ui/Reveal';
import { SEC, STAGGER } from '../lib/motion';
import { ROUTES } from './navigation';

/**
 * Figma 4229:4669, "Who we are" in frame 4229:4651 (adapter 27).
 *
 * The frame: the headline at the left and an 801px copy column at the right,
 * level at the top. The copy column has a 50/58 statement, then a 29px gap and
 * the "Meet our Team" button. 80px below the row, the team photo 4291:12606 is
 * a 1440x595 band. The section has 24px gutters, but the photo is 1440 wide,
 * so the photo goes out of the gutters to the full width of the screen.
 *
 * From lg, every value is the 1440 value times `--u` (adapter 27b). The photo
 * is an aspect box (1440/595) at all widths, so it scales in proportion and
 * the file (baked at that aspect) is never cropped.
 *
 * Below lg there is no frame. These values are build choices that keep the
 * proportions of the frame (the statement is 2/3 of the headline size):
 *
 *   step       statement   row gap   button gap   photo gap
 *   base       24/32       16        20           40
 *   md 768     32/40       24        24           56
 *
 * The section has no padding at the top or bottom. HomePage sets the gap
 * between the sections.
 */

/** The black part of the statement, then the grey part. */
const STATEMENT_LEAD = 'Soft Power made in Vietnam. Global IT player born in 2006, we’re 200';
const STATEMENT_REST = ' specialized talents shadowing your build and operations. Small teams, people magic.';

/** The photo shows at the full width of the screen. */
const PHOTO_W = 1440;
const PHOTO_H = 595;

const AboutUs: React.FC = () => (
  <section id="about" className="flex flex-col gap-[40px] md:gap-[56px] lg:gap-[calc(80*var(--u))]">
    <HomeColumn>
      <Reveal
        as="div"
        stagger={STAGGER.base}
        className="flex flex-col gap-[16px] md:gap-[24px] lg:flex-row lg:items-start lg:justify-between lg:gap-[calc(40*var(--u))]"
      >
        <RevealChild as="span" y={28}>
          <h2 className={`${HOME_H2} text-text-default lg:whitespace-nowrap`}>Who we are</h2>
        </RevealChild>
        <RevealChild
          as="div"
          y={20}
          duration={SEC.revealFast}
          className="flex flex-col items-start gap-[20px] md:gap-[24px] lg:w-[calc(801*var(--u))] lg:shrink-0 lg:gap-[calc(29*var(--u))]"
        >
          <p className="font-sans font-medium text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] lg:text-[length:calc(50*var(--u))] lg:leading-[calc(58*var(--u))]">
            <span className="text-text-default">{STATEMENT_LEAD}</span>
            <span className="text-gray-fig-400">{STATEMENT_REST}</span>
          </p>
          <Button
            to={`${ROUTES.about}#our-team`}
            size="home"
            icon={<ArrowRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
          >
            Meet our Team
          </Button>
        </RevealChild>
      </Reveal>
    </HomeColumn>

    {/* The full-width team photo. The file has the 1440:595 aspect of the box,
        so object-cover has no effect and CSS distorts nothing. */}
    <Reveal y={24}>
      <img
        src={ASSETS.home.team[1].url}
        srcSet={srcSetOf(ASSETS.home.team)}
        sizes="100vw"
        width={PHOTO_W}
        height={PHOTO_H}
        alt="The Officience team at the DIY Jam “Let’s Pitch & Chill” day"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="block aspect-[1440/595] h-auto w-full object-cover"
      />
    </Reveal>
  </section>
);

export default AboutUs;
