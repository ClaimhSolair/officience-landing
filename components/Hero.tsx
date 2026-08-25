import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ASSETS } from '../assets';
import Container from './ui/Container';
import Button from './ui/Button';
import { scrollToSection } from './navigation';

const HEADLINE_LEAD = 'Full-stack';
const HEADLINE_REST = 'data solutions to empower your business.';
const SUBTITLE =
  "We're architects of visual identities — Crafting unique brands that stand out from the noise.";

/**
 * Figma 3187:3985 (390) · 3396:3227 (1440) · 3144:2249 (1920).
 *
 * A blue full-bleed band. Desktop puts the headline and the CTA column on one
 * bottom-aligned row at opposite ends of the content width; mobile stacks them.
 *
 * The headline is deliberately two type styles: the first word is Display-xl
 * (86/95 bold) in salmon, the remainder Size/7xl (75/86 semibold) in white.
 * That mix is what produces the 353px block the artboard draws — a single size
 * cannot.
 *
 * Nothing here fades in. This headline is the largest text above the fold and
 * therefore the LCP element; animating it from opacity 0 postpones the page's
 * first meaningful paint by the length of the animation.
 *
 * The five floating 3D shapes are the one thing here Figma cannot address: they
 * render in the 1440 frame but carry no node id, no asset and no coordinates, so
 * SHAPE_PLACEMENT below is measured off that frame's render rather than read from
 * it. The 1920 frame draws no shapes at all, so widths above 1440 extrapolate the
 * 1440 composition. They are placed on the band rather than the content column
 * because the band is full-bleed, and only from xl up — below that the hero stacks
 * into one column and a shape would land on the headline.
 */

/**
 * Measured off the 1440 render (3396:3227): left/top as fractions of the band,
 * width in pixels.
 *
 * The positions are proportional but the widths are not, and that asymmetry is
 * deliberate. The band's height is pinned (742px, 875 at 3xl) while its width
 * tracks the viewport, so a width-relative size that is correct at 1440 overshoots
 * badly by 1920 — the asterisk reaches 187px against the 141px the artboard draws,
 * and the star grows until it clips through the bottom of the band. Pinning the
 * widths to their 1440 pixel values reproduces the artboard exactly at 1440 and
 * keeps the shapes at an honest size above it, which matters because the 1920
 * frame draws no shapes at all to check against.
 */
const SHAPE_PLACEMENT = [
  { key: 'leaf', src: ASSETS.hero.shapes.leaf, left: '19.1%', top: '1.5%', width: 101 },
  { key: 'asterisk', src: ASSETS.hero.shapes.asterisk, left: '58.6%', top: '9.2%', width: 141 },
  { key: 'ring', src: ASSETS.hero.shapes.ring, left: '48.0%', top: '50.7%', width: 138 },
  { key: 'star', src: ASSETS.hero.shapes.star, left: '23.2%', top: '74.9%', width: 141 },
  { key: 'ellipse', src: ASSETS.hero.shapes.ellipse, left: '79.3%', top: '77.3%', width: 124 },
] as const;
const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-bg-primary">
    {/* Decorative only: no alt text, out of the a11y tree, and never a click
        target. No loading="lazy" either — these are above the fold, where lazy
        loading only delays them. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      {SHAPE_PLACEMENT.map(({ key, src, left, top, width }) => (
        <img
          key={key}
          src={src}
          alt=""
          className="absolute max-w-none"
          style={{ left, top, width }}
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ))}
    </div>

    {/* Two levels on purpose: the outer box owns the band's height and centres
        its contents vertically, the inner row bottom-aligns the headline against
        the CTA column the way the artboard does. */}
    {/* The row lands at xl, not lg. The artboard's two columns are 755 + 448 =
        1203px wide; at 1024 there is only ~976px of content width, so they would
        shrink and squeeze the headline. Below 1280 they stack, at the desktop
        type sizes. */}
    <Container className="relative flex items-center py-fig-40 lg:min-h-[742px] lg:py-0 3xl:min-h-[875px]">
      <div className="flex w-full flex-col items-center gap-fig-24 xl:flex-row xl:items-end xl:justify-between xl:gap-fig-32">
        <h1 className="w-full font-sans text-white lg:w-[755px] 3xl:w-[1000px]">
          {/* The separating space lives inside a sized span. Left bare between
              the two spans it renders at the h1's inherited size and the words
              very nearly touch. */}
          <span className="text-h2 text-sec-200 lg:text-display-xl lg:font-bold">{HEADLINE_LEAD}</span>
          <span className="text-h2 lg:text-display-lg">{` ${HEADLINE_REST}`}</span>
        </h1>

        <div className="flex w-full flex-col items-start gap-fig-24 lg:w-[448px] lg:gap-fig-32 3xl:w-[500px]">
          <p className="font-body font-medium text-[14px] leading-[22px] text-white lg:text-subtitle-1 lg:font-normal">
            {SUBTITLE}
          </p>
          {/* Button-md at 390, Button-lg from 1440 up — the artboards step the
              label size as well as the icon gap. */}
          <Button
            variant="secondary"
            size="lg"
            radius="m"
            onDark
            onClick={() => scrollToSection('contact')}
            className="w-[336px] max-w-full self-center border-transparent shadow-fig-xs lg:w-full lg:self-auto lg:gap-fig-14 lg:text-btn-lg"
            icon={<ArrowUpRight className="h-[24px] w-[24px] shrink-0" strokeWidth={2} aria-hidden="true" />}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
