import React, { useLayoutEffect, useRef, useState } from 'react';
import { MOTION, useMinWidth, useMotionEnabled } from '../../lib/motion';
import Container from '../ui/Container';
import Marquee from '../ui/Marquee';
import type { ToolLogo } from '../../content/services/types';

/**
 * The strip of tool and technology logos between "What We Do" and "Selected
 * Work" (Software 3707:6113: 96px apart, centred on one line, in their own
 * colours).
 *
 * Figma draws the longer strips wider than the page (2,933px for 17 logos), so
 * a strip that is wider than the column loops (user, 2026-09-29): `Marquee`,
 * 60px/s, with a pause under the pointer and off screen. A strip that fits
 * stays a fixed, centred row. The decision uses the set width from the drawn
 * sizes, so it needs no second copy of the set to measure.
 *
 * With motion off, a strip that does not fit is a row that the reader scrolls.
 *
 * Below lg the logos draw at 60% of their size with a 48px gap. That is this
 * build's own, as no page draws a 390 frame.
 */

const GAP_LG = 96;
const GAP_SM = 48;
const SCALE_SM = 0.6;

const Logo: React.FC<{ logo: ToolLogo; scale: number; hidden?: boolean }> = ({ logo, scale, hidden }) => (
  <li className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    <img
      src={logo.src}
      alt={hidden ? '' : logo.alt}
      width={Math.round(logo.w * scale)}
      height={Math.round(logo.h * scale)}
      style={{ width: logo.w * scale, height: logo.h * scale }}
      className="max-w-none"
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  </li>
);

const ToolStrip: React.FC<{ logos: ToolLogo[]; label: string }> = ({ logos, label }) => {
  const colRef = useRef<HTMLDivElement>(null);
  const wide = useMinWidth(1024);
  const motionOn = useMotionEnabled();
  const [colW, setColW] = useState<number | null>(null);

  const scale = wide ? 1 : SCALE_SM;
  const gap = wide ? GAP_LG : GAP_SM;
  const setW = logos.reduce((sum, l) => sum + l.w * scale, 0) + gap * (logos.length - 1);

  // The column width, measured again on every box change and resize.
  useLayoutEffect(() => {
    const col = colRef.current;
    if (!col) return;
    const measure = () => setColW(col.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(col);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const overflows = colW !== null && setW > colW;
  const loop = overflows && motionOn && MOTION.serviceTools;

  return (
    <section id="tools" aria-label={label} className="bg-surface">
      <Container>
        <div ref={colRef} className="w-full" />
      </Container>
      {loop ? (
        <Marquee
          items={logos}
          itemKey={(l) => l.src}
          renderItem={(l, _i, hidden) => <Logo logo={l} scale={scale} hidden={hidden} />}
          label={label}
          gap={gap}
          trackClassName="items-center"
        />
      ) : (
        <Container>
          <ul
            aria-label={label}
            className={`menu-scroll flex items-center overflow-x-auto ${overflows ? 'justify-start' : 'justify-center'}`}
            style={{ gap }}
          >
            {logos.map((l) => (
              <Logo key={l.src} logo={l} scale={scale} />
            ))}
          </ul>
        </Container>
      )}
    </section>
  );
};

export default ToolStrip;
