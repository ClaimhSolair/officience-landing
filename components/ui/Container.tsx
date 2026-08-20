import React from 'react';

/**
 * The content column, sized to hit all three artboards with one rule:
 *
 *   390px  → 16px gutters → 358px content
 *   1440px → 24px gutters → 1392px content
 *   1920px → content caps at 1792px, which centres to exactly 64px gutters
 *
 * Past 1920 the column stops growing and the margins take the slack. Section
 * backgrounds go on the parent so they stay full-bleed; only the content is
 * constrained here.
 */
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav';
}

const Container: React.FC<ContainerProps> = ({ children, className = '', as: Tag = 'div' }) => (
  <Tag className={`mx-auto w-full max-w-content-2 px-fig-16 lg:px-fig-24 ${className}`}>
    {children}
  </Tag>
);

export default Container;
