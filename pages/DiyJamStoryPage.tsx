import React from 'react';
import { ASSETS, srcSetOf } from '../assets';
import Container from '../components/ui/Container';
import Reveal, { RevealChild } from '../components/ui/Reveal';
import PhotoMarquee from '../components/ui/PhotoMarquee';
import { SEC, STAGGER } from '../lib/motion';
import { usePageView } from '../lib/pageMeta';

/**
 * The DIY Jam story — Figma 3830:8872, a 1440 artboard (2026-09-24). The About
 * Us page's "See the story" button opens it.
 *
 * The file draws no 390 frame and no 1920 frame for this page, so the mobile
 * treatment and the widths above 1440 are this build's own, in the home-page
 * idiom. The Header and the Footer come from the Layout.
 *
 * Layout, from the artboard:
 *  - A top block in the content column: two chips, the headline, and the top
 *    photo. The photo shows whole, at its own 3:2 (user, 2026-09-24): Figma
 *    stretches it 1.14x into a 1392x817 box.
 *  - Five text blocks in a centred 1117px column, 64px apart. Three carry a
 *    photo and two carry a marquee row, 40px below the copy. The marquee rows
 *    bleed to the screen edges.
 *  - 120px of space above the footer.
 * The artboard puts 55px, not 64, between the top block and the first text
 * block. It is the only gap that differs, so the build uses 64 (flagged).
 *
 * The Grand Finale poster has no play button and no grey dim: no video exists
 * yet (user, 2026-09-24), and the dim is there only to carry the button.
 */

const TEXT_COLUMN = 'mx-auto w-full max-w-[1117px]';

const H2 = 'font-sans text-h2 text-text-primary lg:text-display-sm';
const COPY = 'font-body text-body-lg text-text-default lg:text-subtitle-1';

/** A heading and its copy. The copy is one paragraph or any other nodes. */
const StoryText: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Reveal stagger={STAGGER.base} className="flex flex-col gap-fig-16 lg:gap-fig-24">
    <RevealChild as="div" y={24} duration={SEC.revealFast}>
      <h2 className={H2}>{title}</h2>
    </RevealChild>
    <RevealChild as="div" y={24}>
      {children}
    </RevealChild>
  </Reveal>
);

const PROJECTS: { name: string; text: string }[] = [
  { name: 'OffyOCR', text: ': Intelligent optical character recognition designed for seamless data extraction.' },
  { name: 'TransFormat', text: ': Smart automated tool engineered for effortless data formatting and transformation.' },
  { name: 'Projects Meteo', text: ': Real-time health monitoring and predictive analytics engine for project management.' },
  { name: 'Build Your Day', text: ': AI-powered productivity assistant to optimize daily schedules and workflows.' },
  { name: 'DevChain', text: ': Automated end-to-end connection for technical development pipelines.' },
  { name: 'OffyCompas', text: ': Strategic decision-making and business orientation tool powered by smart insights.' },
  // Figma sets no colon after this name. Shipped as drawn, and flagged.
  { name: 'O2B', text: ' Automated Branding Assistant: Next-gen solution streamlining branding operations for O2B.' },
];

const DiyJamStoryPage: React.FC = () => {
  usePageView('DIY Jam 2026 — Officience');
  const S = ASSETS.aboutPage.diyStory;

  return (
    <article className="bg-background pb-fig-64 lg:pb-fig-120">
      <Container className="pt-fig-32 lg:pt-[68px]">
        <Reveal stagger={STAGGER.base} className="flex flex-col gap-fig-12 lg:gap-fig-20">
          <RevealChild as="div" y={20} duration={SEC.revealFast} className="flex flex-wrap items-center gap-fig-12">
            {['Pitch&Chill', 'Ideate&Elevate'].map((chip) => (
              <span
                key={chip}
                className="rounded-fig-xs bg-pri-50 p-fig-8 font-sans text-btn-md text-text-primary lg:text-btn-lg"
              >
                {chip}
              </span>
            ))}
          </RevealChild>
          <RevealChild as="div" y={28}>
            <h1 className="font-sans text-h1 font-semibold text-text-primary lg:max-w-[1081px] lg:text-display-lg">
              DIY 2026: Innovation is built right here at Officience!
            </h1>
          </RevealChild>
        </Reveal>

        {/* The whole photo, at the file's own ratio, so `object-cover` has no
            effect. */}
        <Reveal y={24} className="mt-fig-32 aspect-[1024/683] w-full overflow-hidden rounded-fig-xs lg:mt-fig-64">
          <img
            src={S.top}
            alt="The DIY Jam participants outside the Can Tho venue, behind the “Let’s Pitch & Chill” banner."
            className="h-full w-full object-cover"
            decoding="async"
          />
        </Reveal>
      </Container>

      <div className="mt-fig-40 flex flex-col gap-fig-40 lg:mt-fig-64 lg:gap-fig-64">
        <Container>
          <div className={`${TEXT_COLUMN} flex flex-col gap-fig-24 lg:gap-fig-40`}>
            <StoryText title="Sparks Flying: The Spirit of DIY 2026">
              <p className={COPY}>
                This year’s DIY initiative took innovation to whole new heights as 7 brilliant teams stepped up
                to transform bold AI concepts into reality. Driven by curiosity and powered by cutting-edge
                technology, our participants set out to push boundaries, solve real-world challenges, and
                redefine what’s possible together.
              </p>
            </StoryText>
            {/* Figma's crop is baked into the file at the box ratio (1117:593).
                The 5px radius is as drawn. */}
            <Reveal y={24} className="aspect-[1117/593] w-full overflow-hidden rounded-[5px]">
              <img
                src={S.sparks[S.sparks.length - 1].url}
                srcSet={srcSetOf(S.sparks)}
                sizes="(min-width: 1165px) 1117px, calc(100vw - 32px)"
                alt="The DIY 2026 participants on stage, giving a thumbs-up under the stage lights."
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>
        </Container>

        <div className="flex flex-col gap-fig-24 lg:gap-fig-40">
          <Container>
            <div className={TEXT_COLUMN}>
              <StoryText title="Round 1: Energy & Brainstorming in Cần Thơ">
                <p className={COPY}>
                  Our journey kicked off in the vibrant city of Cần Thơ! Against the backdrop of the Delta’s rich
                  culture, the teams dove headfirst into intensive collaboration—refining their initial concepts,
                  testing early prototypes, and building serious momentum. It was a high-energy mix of sharp
                  strategic thinking, teamwork, and unstoppable creative drive.
                </p>
              </StoryText>
            </div>
          </Container>
          <PhotoMarquee tiles={S.round1} label="Photos from Round 1 in Cần Thơ" />
        </div>

        <Container>
          <div className={TEXT_COLUMN}>
            <StoryText title="Spotlight on Innovation: The 7 AI Projects">
              <p className={COPY}>
                Each team targeted a distinct operational area, applying AI and automation to streamline
                processes and elevate productivity across the board:
              </p>
              {/* The artboard leaves one empty line (36px) above the list. */}
              <ul className={`${COPY} mt-[26px] list-disc pl-[1.5em] lg:mt-[36px]`}>
                {PROJECTS.map((p) => (
                  <li key={p.name}>
                    <strong className="font-bold">{p.name}</strong>
                    {p.text}
                  </li>
                ))}
              </ul>
            </StoryText>
          </div>
        </Container>

        <Container>
          <div className={`${TEXT_COLUMN} flex flex-col gap-fig-24 lg:gap-fig-40`}>
            <StoryText title="The Grand Finale: Electric Energy at OffyPlex">
              <p className={COPY}>
                Bringing the excitement back home, the Final Stage exploded with energy right here at
                headquarters. The teams delivered impressive live demos, successfully navigating tough questions
                from our panel of judges. The electric atmosphere, live product testing, and cheering colleagues
                made it an unforgettable showcase of talent and dedication.
              </p>
            </StoryText>
            <Reveal y={24} className="aspect-[2234/1257] w-full overflow-hidden">
              <img
                src={S.finale[S.finale.length - 1].url}
                srcSet={srcSetOf(S.finale)}
                sizes="(min-width: 1165px) 1117px, calc(100vw - 32px)"
                alt="The Final Round poster: Otty the otter raises a fist beside “Let’s Ideate & Elevate — where creativity meets real-world action”."
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>
        </Container>

        <div className="flex flex-col gap-fig-24 lg:gap-fig-40">
          <Container>
            <div className={TEXT_COLUMN}>
              <StoryText title="Celebrating Excellence & Looking Ahead">
                <p className={COPY}>
                  While the trophies have been awarded, the DIY journey is far from over. These 7 projects
                  represent the future of our internal tech ecosystem, and we are thrilled to support their
                  transition from prototype to full integration. A huge congratulations to all our participants
                  for shaping the next chapter of our company's innovation!
                </p>
              </StoryText>
            </div>
          </Container>
          <PhotoMarquee tiles={S.celebrating} label="Photos from the award ceremony" />
        </div>
      </div>
    </article>
  );
};

export default DiyJamStoryPage;
