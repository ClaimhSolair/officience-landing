import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
 */
const Hero: React.FC = () => (
  <section className="bg-bg-primary">
    {/* Two levels on purpose: the outer box owns the band's height and centres
        its contents vertically, the inner row bottom-aligns the headline against
        the CTA column the way the artboard does. */}
    {/* The row lands at xl, not lg. The artboard's two columns are 755 + 448 =
        1203px wide; at 1024 there is only ~976px of content width, so they would
        shrink and squeeze the headline. Below 1280 they stack, at the desktop
        type sizes. */}
    <Container className="flex items-center py-fig-40 lg:min-h-[742px] lg:py-0 3xl:min-h-[875px]">
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
