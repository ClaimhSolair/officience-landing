import React from 'react';

/**
 * The content column, reproducing all three artboards:
 *
 *   390px  → 16px gutters → 358px content
 *   1440px → 24px gutters → 1392px content
 *   1920px → 64px gutters → 1792px content
 *
 * Past 1920 the column holds at 1792 and the margins take the slack.
 *
 * The gutter and the cap have to sit on separate elements. Putting both on one
 * element makes them compound — at 1920 a 1792px max-width already leaves 64px
 * either side, so padding on top of it would push the content to 88px.
 *
 * Section backgrounds belong on the parent, so they stay full-bleed; `className`
 * lands on the inner column, which is what the content actually lays out in.
 */
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav';
}

const Container: React.FC<ContainerProps> = ({ children, className = '', as: Tag = 'div' }) => (
  <Tag className="w-full px-fig-16 lg:px-fig-24 3xl:px-fig-64">
    <div className={`mx-auto w-full max-w-content-2 ${className}`}>{children}</div>
  </Tag>
);

export default Container;
