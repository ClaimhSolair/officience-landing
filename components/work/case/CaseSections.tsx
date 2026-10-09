import React from 'react';
import { srcSetOf } from '../../../assets';
import { SEC, STAGGER } from '../../../lib/motion';
import type { Picture, Quote, TeamMember } from '../../../content/services/types';
import type { WorkCase } from '../../../content/work/types';
import { TagChip } from '../../services/parts';
import { TeamCard } from '../../services/TeamGrid';
import { QuoteCard } from '../../services/Testimonials';
import Reveal, { RevealChild } from '../../ui/Reveal';

/**
 * The sections of a case study's main column — IOGA 3816:7969. Each section is
 * a Heading-H1 title in Primary and its content, 80px apart from xl.
 *
 * Every box is a share of the column, so the drawn proportions hold from 375
 * to 1910. Type keeps the drawn sizes from lg (ruling 20i).
 */

/** The 867px column at 1440, for `sizes`: the share of the window it takes. */
const COLUMN_SIZES = '(min-width: 1280px) 60vw, calc(100vw - 48px)';

const Title: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="font-sans text-h2 font-medium text-text-primary lg:text-h1">
    {children}
  </h2>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-body text-body-lg font-medium text-text-default">{children}</p>
);

const Figure: React.FC<{ image: Picture; rounded?: boolean }> = ({ image, rounded }) => {
  const widest = image.sources[image.sources.length - 1];
  return (
    <div
      data-aspect={`${image.w}/${image.h}`}
      className={`relative w-full overflow-hidden bg-gray-fig-100 ${rounded ? 'rounded-fig-m' : ''}`}
      style={{ aspectRatio: `${image.w} / ${image.h}` }}
    >
      <img
        src={widest.url}
        srcSet={srcSetOf(image.sources)}
        sizes={COLUMN_SIZES}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

/** Challenge — 3813:6081: the text, three chips, and the brochure picture 40px below. */
export const Challenge: React.FC<{ data: WorkCase['challenge'] }> = ({ data }) => (
  <section id="challenge" aria-labelledby="challenge-title">
    <Reveal as="div" stagger={STAGGER.base} className="flex flex-col gap-fig-32 lg:gap-fig-40">
      <RevealChild as="div" y={28} className="flex flex-col gap-fig-16 lg:gap-fig-20">
        <Title id="challenge-title">Challenge</Title>
        <Body>{data.text}</Body>
      </RevealChild>
      <RevealChild as="div" y={20} duration={SEC.revealFast}>
        <ul className="flex flex-wrap gap-fig-12" aria-label="Results">
          {data.chips.map((chip) => (
            <TagChip key={chip}>{chip}</TagChip>
          ))}
        </ul>
      </RevealChild>
      <RevealChild as="div" y={28}>
        <Figure image={data.image} rounded />
      </RevealChild>
    </Reveal>
  </section>
);

/** Our Solution — 3816:7968: three text and picture pairs, 64px apart. */
export const Solution: React.FC<{ steps: WorkCase['solution'] }> = ({ steps }) => (
  <section id="solution" aria-labelledby="solution-title" className="flex flex-col gap-fig-48 lg:gap-fig-64">
    {steps.map((step, i) => (
      <Reveal key={step.image.alt} as="div" stagger={STAGGER.base} className="flex flex-col gap-fig-24 lg:gap-fig-40">
        <RevealChild as="div" y={28} className="flex flex-col gap-fig-16 lg:gap-fig-20">
          {i === 0 && <Title id="solution-title">Our Solution</Title>}
          <Body>{step.text}</Body>
        </RevealChild>
        <RevealChild as="div" y={28}>
          <Figure image={step.image} />
        </RevealChild>
      </Reveal>
    ))}
  </section>
);

/**
 * Final Impact — 3816:8107: three Primary/50 cards, 24px apart. A card is as
 * tall as its copy (Figma draws no fixed height). Three cards share the row
 * from lg: the label "Knowledge Consumed" (238px, one line) needs a 238px
 * card. A card is 273px at lg (the drawn 867px column), 240px at 1280 and
 * 229px at 768, so the cards stack below lg.
 */
export const Impact: React.FC<{ items: WorkCase['impact'] }> = ({ items }) => (
  <section id="impact" aria-labelledby="impact-title" className="flex flex-col gap-fig-24">
    <Title id="impact-title">Final Impact</Title>
    <Reveal as="ul" stagger={STAGGER.base} className="grid grid-cols-1 gap-fig-24 lg:grid-cols-3">
      {items.map((item) => (
        <RevealChild
          as="li"
          key={item.label}
          y={28}
          className="flex flex-col items-center gap-fig-24 rounded-fig-xs bg-pri-50 p-[26px] text-center"
        >
          <div className="flex flex-col items-center gap-fig-4">
            <p className="font-sans text-h1 font-medium text-[#FDA948]">{item.value}</p>
            <p data-fit="1" className="whitespace-nowrap font-body text-body-xl font-bold text-text-primary">
              {item.label}
            </p>
          </div>
          <p className="font-body text-body-lg font-medium text-text-default">{item.text}</p>
        </RevealChild>
      ))}
    </Reveal>
  </section>
);

/**
 * Tech Stack — 3816:8433: three numbered groups on white, 4px apart, in a box
 * 759 of the 867px column wide. Each group has the title in Heading-H3 orange
 * and a row of logos at their drawn sizes, 48px apart.
 */
export const TechStack: React.FC<{ groups: WorkCase['stack'] }> = ({ groups }) => (
  <section id="tech-stack" aria-labelledby="tech-stack-title" className="flex flex-col gap-fig-20">
    <Title id="tech-stack-title">Tech Stack</Title>
    <ol className="flex w-full flex-col gap-fig-4 lg:max-w-[87.54%]">
      {groups.map((group, i) => (
        <li
          key={group.title}
          className="flex flex-col gap-fig-16 bg-white p-fig-24 lg:min-h-[var(--group-h)]"
          style={{ '--group-h': `${group.h}px` } as React.CSSProperties}
        >
          <h3 className="font-sans text-h3 text-[#FDA948]">
            {i + 1}. {group.title}
          </h3>
          <ul className="flex flex-wrap items-center gap-x-fig-48 gap-y-fig-24">
            {group.logos.map((l) => (
              <li key={l.alt} className="flex items-center">
                <img src={l.src} alt={l.alt} width={Math.round(l.w)} height={Math.round(l.h)} style={{ width: l.w, height: l.h }} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </section>
);

/** Meet Our Team — 3816:8466 and 3816:8634: six cards, two to a row (ruling 20c). */
export const Team: React.FC<{ people: TeamMember[] }> = ({ people }) => (
  <section id="our-team" aria-labelledby="our-team-title" className="flex flex-col gap-fig-24">
    <Title id="our-team-title">Meet Our Team</Title>
    <Reveal as="ul" stagger={STAGGER.loose} className="grid grid-cols-1 gap-fig-20 sm:grid-cols-2">
      {people.map((p) => (
        <TeamCard key={p.name} person={p} four={false} />
      ))}
    </Reveal>
  </section>
);

/** Customer Feedback — 3818:8723: the quote cards on BG/Secondary, 545 of the 867px column, 32px apart. */
export const Feedback: React.FC<{ quotes: Quote[] }> = ({ quotes }) => (
  <section id="feedback" aria-labelledby="feedback-title" className="flex flex-col gap-fig-24">
    <Title id="feedback-title">Customer Feedback</Title>
    <Reveal as="ul" y={28} className="flex w-full flex-col gap-fig-24 lg:max-w-[62.86%] lg:gap-fig-32">
      {quotes.map((q) => (
        <QuoteCard key={q.author} q={q} grey />
      ))}
    </Reveal>
  </section>
);
