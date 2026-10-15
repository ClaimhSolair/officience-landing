import React from 'react';
import Reveal, { RevealChild } from './Reveal';
import SectionBadge from './SectionBadge';
import { SEC, STAGGER } from '../../lib/motion';

/**
 * Shared parts of the home page of frame 4229:4651 (adapter 27).
 *
 * The frame is 1440 wide, with 24px gutters and a 1392px column. From lg, every
 * size is the 1440 value times `--u` (see index.html), so the layout keeps the
 * frame's proportions in steps: x0.711 at lg, x0.889 at xl, x1 from 1400,
 * x1.333 from fhd and x1.778 from 2560. Below lg the sections stack, with their
 * own fixed values.
 */

/**
 * The home column. It has no width cap, so at 2560 the column is the 1392px
 * column x1.778 (2475px). `Container` caps at 1792 and is for the other pages.
 */
export const HomeColumn: React.FC<{
  children: React.ReactNode;
  className?: string;
  innerRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}> = ({ children, className = '', innerRef, style }) => (
  <div
    ref={innerRef}
    style={style}
    className={`w-full px-fig-16 md:px-fig-24 lg:px-[calc(24*var(--u))] ${className}`}
  >
    {children}
  </div>
);

/** The 75/86 section headline (Size/7xl, Lexend SemiBold, -3%). */
export const HOME_H2 =
  'font-sans font-semibold tracking-[-0.03em] text-[36px] leading-[44px] md:text-[50px] md:leading-[58px] lg:text-[length:calc(75*var(--u))] lg:leading-[calc(86*var(--u))]';

/** The 24/36 subtitle (Montserrat Regular, Semantic/Text/Subtitle). */
export const HOME_SUBTITLE =
  'font-body font-normal text-[16px] leading-[26px] md:text-[20px] md:leading-[30px] lg:text-[length:calc(24*var(--u))] lg:leading-[calc(36*var(--u))]';

interface SectionHeaderProps {
  headline: React.ReactNode;
  subtitle?: React.ReactNode;
  /** A button under the subtitle, right-aligned from lg. */
  cta?: React.ReactNode;
  /** The pill above the headline. Figma shows it only on Contact. */
  eyebrow?: React.ReactNode;
  /** Dark = the brand-blue sections: white headline and subtitle. */
  theme?: 'light' | 'dark';
  /** The copy column: Regular 572, Wide 624 (the Figma component property). */
  copyWidth?: 'regular' | 'wide';
  /** Lets a section without reveals keep the header static. */
  reveal?: boolean;
  className?: string;
  headingId?: string;
}

/**
 * The Figma "Section Header" component (4247:5073): the headline on the left,
 * the copy column (subtitle and an optional CTA) on the right. The two start
 * level at the top. Below lg the three parts stack.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  headline,
  subtitle,
  cta,
  eyebrow,
  theme = 'light',
  copyWidth = 'regular',
  reveal = true,
  className = '',
  headingId,
}) => {
  const dark = theme === 'dark';
  const copyW = copyWidth === 'wide' ? 'lg:w-[calc(624*var(--u))]' : 'lg:w-[calc(572*var(--u))]';

  return (
    <Reveal
      as="div"
      stagger={STAGGER.base}
      enabled={reveal}
      className={`flex flex-col items-start gap-fig-16 lg:gap-[calc(16*var(--u))] ${className}`}
    >
      {eyebrow && (
        <RevealChild as="span" y={20} duration={SEC.revealFast}>
          <SectionBadge>{eyebrow}</SectionBadge>
        </RevealChild>
      )}
      <div className="flex w-full flex-col gap-fig-16 md:gap-fig-24 lg:flex-row lg:items-start lg:justify-between lg:gap-[calc(40*var(--u))]">
        <RevealChild as="span" y={28}>
          <h2
            id={headingId}
            className={`${HOME_H2} lg:whitespace-nowrap ${dark ? 'text-white' : 'text-text-default'}`}
          >
            {headline}
          </h2>
        </RevealChild>
        {(subtitle || cta) && (
          <RevealChild
            as="div"
            y={20}
            duration={SEC.revealFast}
            className={`flex flex-col items-start gap-fig-24 lg:shrink-0 lg:items-end lg:gap-[calc(32*var(--u))] ${copyW}`}
          >
            {subtitle && (
              <p className={`${HOME_SUBTITLE} w-full ${dark ? 'text-white' : 'text-subtitle'}`}>{subtitle}</p>
            )}
            {cta}
          </RevealChild>
        )}
      </div>
    </Reveal>
  );
};
