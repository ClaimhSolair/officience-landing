import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ASSETS, srcSetOf } from '../assets';
import Button, { HOME_BTN_ICON } from './ui/Button';
import { HomeColumn, HOME_H2 } from './ui/HomeSection';
import Reveal, { RevealChild } from './ui/Reveal';
import { MOTION, SEC, STAGGER, useMotionEnabled, useScrub } from '../lib/motion';
import { ROUTES, routeLink } from './navigation';

/**
 * Figma 4229:4673, "About Us" in frame 4229:4651 (adapter 27).
 *
 * The frame: the "About Us" headline at the left and an 801px copy column at
 * the right, level at the top. The copy column has a 50/58 statement, then a
 * 29px gap and the "Discover our company" button. The button opens the About
 * Us page. 80px below the row, the team photo 4291:12606 is a 1440x595 band.
 * The section has 24px gutters, but the photo is 1440 wide, so the photo goes
 * out of the gutters to the full width of the screen.
 *
 * The statement has a scroll sweep (`MOTION.manifesto`). Each character starts
 * at 0.2 opacity. A frontier moves across the text when you scroll down, and
 * each character gets full opacity when the frontier goes past it. When you
 * scroll up, the frontier moves back. When motion is off, the statement shows
 * the two tones of the frame: the lead is dark and the rest is grey.
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

/** The About Us page, or its fallback URL while the page is not released. */
const ABOUT_LINK = routeLink(ROUTES.about);

/** The photo shows at the full width of the screen. */
const PHOTO_W = 1440;
const PHOTO_H = 595;

/**
 * Splits the text into one span for each character, for the scroll sweep.
 * Each word is an inline-block, so a line breaks only between two words.
 *
 * Each character span holds only its index (`--i`). The paragraph sets the
 * frontier (`--frontier`) one time in each frame. The CSS ramp
 * `.manifesto-char` in index.html compares the two values and sets the
 * opacity. Thus the sweep writes one style in each frame, not one style for
 * each character.
 */
const scrubbedWords = (text: string, startIndex: number, toneClass: string) => {
  const nodes: React.ReactNode[] = [];
  const words = text.split(' ');
  let index = startIndex;

  words.forEach((word, w) => {
    nodes.push(
      <span key={`w${startIndex}-${w}`} className={`inline-block ${toneClass}`}>
        {[...word].map((ch, c) => {
          const i = index;
          index += 1;
          return (
            <span key={c} className="manifesto-char" style={{ '--i': i } as React.CSSProperties}>
              {ch}
            </span>
          );
        })}
      </span>,
    );
    if (w < words.length - 1) {
      nodes.push(<React.Fragment key={`sp${startIndex}-${w}`}> </React.Fragment>);
      index += 1;
    }
  });

  return { nodes, next: index };
};

/** The number of character positions, with the space between the two parts. */
const STATEMENT_CHARS = STATEMENT_LEAD.length + 1 + STATEMENT_REST.trim().length;

const AboutUs: React.FC = () => {
  const statementRef = useRef<HTMLParagraphElement>(null);
  const sweeping = useMotionEnabled() && MOTION.manifesto;

  // The ref is on the paragraph. The RevealChild around it moves it with a
  // transform. useScroll measures the target with offsetTop and clientHeight,
  // and these values ignore a CSS transform. Thus the entrance travel does not
  // change the sweep range.
  // The frontier crosses the full text in half a viewport of scroll. The
  // sweep ends while the paragraph is fully on the screen.
  const { scrollYProgress: sweep } = useScroll({
    target: statementRef,
    offset: ['start 0.85', 'start 0.35'],
  });
  // The headroom (+4) must be equal to the divisor of the CSS ramp (4, in
  // index.html). If it is smaller, the last characters do not get full opacity.
  const frontier = useTransform(useScrub(sweep), [0, 1], [0, STATEMENT_CHARS + 4]);

  // With the sweep, the full statement goes to Text/Default (user ruling of
  // 2026-09-10: the sweep must not stop at the grey part). Without the sweep,
  // the rest stays grey, as the frame draws it.
  const lead = scrubbedWords(STATEMENT_LEAD, 0, 'text-text-default');
  const rest = scrubbedWords(
    STATEMENT_REST.trim(),
    lead.next + 1,
    sweeping ? 'text-text-default' : 'text-gray-fig-400',
  );

  return (
    <section id="about" aria-labelledby="about-heading" className="flex flex-col gap-[40px] md:gap-[56px] lg:gap-[calc(80*var(--u))]">
      <HomeColumn>
        <Reveal
          as="div"
          stagger={STAGGER.base}
          className="flex flex-col gap-[16px] md:gap-[24px] lg:flex-row lg:items-start lg:justify-between lg:gap-[calc(40*var(--u))]"
        >
          <RevealChild as="span" y={28}>
            <h2 id="about-heading" className={`${HOME_H2} text-text-default lg:whitespace-nowrap`}>
              About Us
            </h2>
          </RevealChild>
          <RevealChild
            as="div"
            y={20}
            duration={SEC.revealFast}
            className="flex flex-col items-start gap-[20px] md:gap-[24px] lg:w-[calc(801*var(--u))] lg:shrink-0 lg:gap-[calc(29*var(--u))]"
          >
            {/* Without the sweep, no `--frontier` is set, so the CSS ramp gives
                each character full opacity. A screen reader reads the sr-only
                copy. The character spans are aria-hidden, so a screen reader
                does not read the text one letter at a time. */}
            <motion.p
              ref={statementRef}
              className="font-sans font-medium text-[24px] leading-[32px] md:text-[32px] md:leading-[40px] lg:text-[length:calc(50*var(--u))] lg:leading-[calc(58*var(--u))]"
              style={sweeping ? ({ '--frontier': frontier } as React.CSSProperties) : undefined}
            >
              <span className="sr-only">{STATEMENT_LEAD + STATEMENT_REST}</span>
              <span aria-hidden="true">
                {lead.nodes} {rest.nodes}
              </span>
            </motion.p>
            {/* The About Us page, or its fallback while it is not released. */}
            {ABOUT_LINK && (
              <Button
                {...ABOUT_LINK}
                size="home"
                icon={<ArrowRight className={HOME_BTN_ICON} strokeWidth={2} aria-hidden="true" />}
              >
                Discover our company
              </Button>
            )}
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
};

export default AboutUs;
