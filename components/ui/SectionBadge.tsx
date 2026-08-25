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
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ children, className = '', as: Tag = 'span' }) => (
  <Tag
    className={`inline-flex shrink-0 items-center gap-fig-8 rounded-fig-xs bg-pri-50 px-fig-12 py-fig-4 lg:px-fig-8 lg:py-fig-2 ${className}`}
  >
    <img
      src={ASSETS.icons.eyebrow}
      alt=""
      aria-hidden="true"
      width={19}
      height={19}
      className="h-[19px] w-[19px] shrink-0"
      decoding="async"
      referrerPolicy="no-referrer"
    />
    <span className="whitespace-nowrap font-body font-medium text-[14px] leading-[22px] text-text-default lg:text-body-xl lg:font-normal">
      {children}
    </span>
  </Tag>
);

export default SectionBadge;
