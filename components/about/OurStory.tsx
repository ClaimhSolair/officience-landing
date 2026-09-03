import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Odometer from '../ui/Odometer';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import { ABOUT_SECTION_IDS, scrollToId } from '../navigation';
import { MOTION, SEC, STAGGER } from '../../lib/motion';

/**
 * Our Story — Figma 3133:4432 (1440x766).
 *
 * Two blocks. The top row puts the eyebrow and the headline on the left gutter
 * (448 wide) and the blurb with its CTA flush right (530 wide); the artboard
 * leaves 414px between them, which `justify-between` reproduces exactly. The
 * milestone row below sits on its own 1200px column, inset 96px inside the
 * content column rather than on the page gutter.
 *
 * Rhythm from the artboard: 120 top, 80 between the blocks, 120 bottom.
 *
 * Below lg the file draws nothing, so the stack, the type steps and the
 * two-column milestone grid follow the home page's own mobile idiom.
 */

/** Figma hard-breaks the headline after "friends". */
const HEADLINE = ['Two friends', 'One vision.'];

const BLURB =
  'Founded in a Saigon coffee shop by two French-Vietnamese entrepreneurs who believed business could bridge cultures and empower people. Twenty years on, that belief still drives everything we do.';

/**
 * The four counters, worded as the artboard writes them.
 *
 * "the America" is drawn that way and ships verbatim; it reads as a dropped
 * "s". "Offies" is not a slip — it is the company's own word for its people,
 * and the team section uses it too.
 */
const MILESTONES = [
  { value: '6', label: 'Offices across Asia, Europe and the America' },
  { value: '200', label: 'Offies worldwide, united by shared values' },
  { value: '20', label: 'Years of delivering impact across borders' },
  { value: '500+', label: 'Projects delivered for clients worldwide' },
] as const;

const OurStory: React.FC = () => (
  <section id="our-story" className="bg-background py-fig-64 lg:py-fig-120">
    <Container className="flex flex-col gap-fig-56 lg:gap-fig-80">
      {/* The row starts at xl, not lg. The artboard's two columns are 448 and
          530, which need 978px before any gap, and a 1024 viewport leaves only
          976 inside the gutters — the blurb overflowed the screen by 10px. Below
          xl the two blocks stack. */}
      <Reveal className="flex flex-col gap-fig-32 xl:flex-row xl:justify-between xl:gap-fig-32">
        {/* Left: the eyebrow and the headline. 448 on the artboard. */}
        <RevealChild y={24} duration={SEC.revealFast} className="flex flex-col gap-fig-16 xl:w-[448px] xl:shrink-0">
          <SectionBadge as="h2" className="self-start">
            Our Story
          </SectionBadge>
          <p className="font-sans text-h1 text-text-default lg:text-display-lg">
            {HEADLINE.map((line, i) => (
              <React.Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        </RevealChild>

        {/* Right: the blurb and its CTA. 530 on the artboard, flush to the gutter. */}
        <RevealChild y={24} duration={SEC.revealFast} className="flex flex-col gap-fig-32 xl:w-[530px] xl:shrink-0">
          <p className="font-body text-body-lg text-subtitle lg:text-subtitle-1">{BLURB}</p>
          {/* The artboard draws the button 448 wide inside its 530 column, so it
              is neither hug-width nor full-width there.

              Figma gives this button no destination. Our Journey is the full
              story and sits directly below, so the click scrolls there — a
              sensible target rather than a dead click, and an inference to
              confirm with the team. */}
          <Button
            onClick={() => scrollToId(ABOUT_SECTION_IDS[1])}
            size="xl"
            radius="m"
            className="w-full shadow-fig-xs xl:w-[448px]"
            icon={<ArrowUpRight className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
          >
            Read Our Full Story
          </Button>
        </RevealChild>
      </Reveal>

      {/* Milestones — two columns below lg, four from lg. The artboard hugs each
          column to its own copy (169/176/177/184); equal columns are used
          instead, the same call as Our Approach.

          The 160px gutter waits for xl as well. It belongs to the 1200px
          column, which only exists once the content column passes 1200; at 1024
          it would leave each of the four columns 124px and wrap every label to
          five lines. */}
      <Reveal
        as="ul"
        stagger={STAGGER.loose}
        amount={0.4}
        className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-x-fig-32 gap-y-fig-40 lg:grid-cols-4 lg:gap-x-fig-64 xl:gap-x-[160px]"
      >
        {MILESTONES.map(({ value, label }) => (
          <RevealChild
            as="li"
            key={label}
            y={28}
            duration={SEC.revealFast}
            className="flex flex-col items-center gap-fig-8 text-center"
          >
            <span className="font-sans text-display-sm text-text-primary lg:text-display-lg">
              {MOTION.counters ? <Odometer value={value} /> : value}
            </span>
            <span className="font-body text-body-lg text-subtitle lg:text-body-xl">{label}</span>
          </RevealChild>
        ))}
      </Reveal>
    </Container>
  </section>
);

export default OurStory;
