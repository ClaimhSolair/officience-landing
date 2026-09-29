import React from 'react';
import { MOTION, SEC, STAGGER, useMinWidth, useMotionEnabled } from '../../lib/motion';
import Container from '../ui/Container';
import Marquee from '../ui/Marquee';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import type { Quote } from '../../content/services/types';

/**
 * "People Trust Us" on a service page — Software 3707:5502, and the quote card
 * master 3707:8921.
 *
 * On BG/Secondary: the badge and the 86px heading on the left, and a 545px
 * column of white quote cards on the right, 146px away. A card has the quote in
 * Body-xl, a rule, a 52px round avatar, "Name – Role" in Heading-H4 and the
 * company in Body-md grey.
 *
 * **Many quotes loop (user, 2026-09-29).** BI & Analytics draws five cards in a
 * 748px section, so only about two and a half show. With three or more quotes,
 * from lg with motion on, the column moves up without stop inside a box of that
 * height (`Marquee`, vertical), and pauses under the pointer and off screen.
 * With one or two quotes, below lg, or with motion off, the cards are a fixed
 * list.
 */

const GAP = 64;

const Card: React.FC<{ q: Quote; hidden?: boolean }> = ({ q, hidden }) => (
  <li
    className="flex flex-col gap-fig-16 rounded-fig-xs bg-surface p-fig-24 lg:gap-fig-20 lg:p-fig-40"
    aria-hidden={hidden || undefined}
  >
    <p className="font-body text-body-lg text-text-default lg:text-body-xl">{q.quote}</p>
    <hr className="border-0 border-t border-border-frame" />
    <div className="flex items-center gap-fig-12">
      <img
        src={q.avatar}
        alt=""
        width={52}
        height={52}
        className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="flex min-w-0 flex-col gap-fig-4">
        <p className="font-sans text-h4 text-text-default">{q.author}</p>
        {q.company && <p className="font-body text-body-md text-subtitle">{q.company}</p>}
      </div>
    </div>
  </li>
);

const Testimonials: React.FC<{ quotes: Quote[] }> = ({ quotes }) => {
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);
  const loop = quotes.length >= 3 && wide && motionOn && MOTION.serviceQuotes;

  return (
    <section id="testimonials" className="bg-bg-secondary py-fig-64 lg:py-fig-100">
      <Container className="flex flex-col gap-fig-40 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32">
        <Reveal as="div" stagger={STAGGER.base} className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <SectionBadge size="sm">Testimonial</SectionBadge>
          </RevealChild>
          <RevealChild as="span" y={28}>
            {/* 86px over a 74px line box, as the artboard draws it, from xl. At
                lg the 86px line and the 545px column need 1,217px of a 976px
                column, so the heading takes Display-sm there. */}
            <h2 className="font-sans text-h1 font-semibold text-text-default lg:whitespace-nowrap lg:text-display-sm lg:font-semibold xl:text-[86px] xl:leading-[74px] xl:tracking-[-0.03em]">
              People Trust Us
            </h2>
          </RevealChild>
        </Reveal>

        <div className="w-full lg:w-[545px] lg:shrink-0" role="region" aria-label="What our clients say">
          {loop ? (
            <Marquee
              items={quotes}
              itemKey={(q) => q.author}
              renderItem={(q, _i, hidden) => <Card q={q} hidden={hidden} />}
              label="What our clients say"
              direction="y"
              gap={GAP}
              /* The 748px section less its two 100px paddings. */
              className="h-[548px]"
            />
          ) : (
            <Reveal as="ul" y={28} className="flex flex-col gap-fig-24 lg:gap-fig-64">
              {quotes.map((q) => (
                <Card key={q.author} q={q} />
              ))}
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
