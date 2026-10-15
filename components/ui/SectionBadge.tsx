import React from 'react';
import { ASSETS } from '../../assets';

/**
 * The eyebrow chip that opens each section — a pale blue pill with the
 * Officience mark and a label: `#ECF4FF`, 4px radius, 8px gap, 19px mark.
 *
 * Padding steps with the breakpoint: 12/4 at 390 (30px tall), 8/2 from lg
 * (32px tall). Every 390 section draws it at 12/4 — Services `3187:4349`,
 * Approach `3137:2433`, Proven Results, Testimonials, Why Us, Contact — except
 * About Us `3147:6973`, which is drawn at 8/2 and is the lone outlier. The
 * majority wins here, so the About Us chip renders 4px taller than its frame.
 *
 * The label steps from Montserrat Medium 14/22 on mobile to Regular 20/28 on
 * desktop.
 */
interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Render as the section's heading. The label is the section's name, so making
   * it the h2 keeps the document outline intact — otherwise a section whose only
   * other headings are card titles jumps straight from h1 to h3.
   */
  as?: 'span' | 'h2';
  /**
   * `sm` sets the label in Body-lg-medium (16/26) from lg. The service pages
   * (the Figma "Brochure" frames) draw it at that size.
   *
   * `step` is the Eyebrow Tag 4247:5020 of the home frame 4229:4651: 16/26
   * Medium, 8/2 padding, 8 gap and a 19px mark at 1440. From lg every value is
   * the 1440 value times `--u` (see HomeSection.tsx). The label has a floor of
   * 14/23 (ruling 27h). The Contact card uses it (ruling 27i).
   */
  size?: 'md' | 'sm' | 'step';
}

/** The chip padding and gap from lg, for each size. */
const CHIP_LG = {
  md: 'lg:px-fig-8 lg:py-fig-2',
  sm: 'lg:px-fig-8 lg:py-fig-2',
  step: 'lg:gap-[calc(8*var(--u))] lg:px-[calc(8*var(--u))] lg:py-[calc(2*var(--u))]',
};

/** The mark size from lg, for each size. */
const MARK_LG = {
  md: '',
  sm: '',
  step: 'lg:h-[calc(19*var(--u))] lg:w-[calc(19*var(--u))]',
};

/** The label type from lg, for each size. */
const LABEL_LG = {
  md: 'lg:text-body-xl lg:font-normal',
  sm: 'lg:text-body-lg lg:font-medium',
  step: 'lg:text-[length:max(14px,calc(16*var(--u)))] lg:leading-[max(23px,calc(26*var(--u)))]',
};

const SectionBadge: React.FC<SectionBadgeProps> = ({ children, className = '', as: Tag = 'span', size = 'md' }) => (
  <Tag
    className={`inline-flex shrink-0 items-center gap-fig-8 rounded-fig-xs bg-pri-50 px-fig-12 py-fig-4 ${CHIP_LG[size]} ${className}`}
  >
    <img
      src={ASSETS.icons.eyebrow}
      alt=""
      aria-hidden="true"
      width={19}
      height={19}
      className={`h-[19px] w-[19px] shrink-0 ${MARK_LG[size]}`}
      decoding="async"
      referrerPolicy="no-referrer"
    />
    <span
      className={`whitespace-nowrap font-body font-medium text-[14px] leading-[22px] text-text-default ${LABEL_LG[size]}`}
    >
      {children}
    </span>
  </Tag>
);

export default SectionBadge;
