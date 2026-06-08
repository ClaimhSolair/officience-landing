import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../assets';

const milestones = [
  { value: '20', label: 'Years milestone' },
  { value: '200+', label: 'Special Talents' },
  { value: '6', label: 'Global Offices' },
  { value: '500+', label: 'Projects Done' },
];

// Each icon group SVG is a 800×160 strip of 5 colored icons. Repeat it across the
// track and duplicate the whole track once so the -50% marquee loops seamlessly.
// Each icon group SVG is an 800×160 strip of 5 colored 160×160 tiles. Repeat it across the
// track and duplicate the whole track once so the -50% marquee loops seamlessly.
const MarqueeRow: React.FC<{ src: string; reverse?: boolean }> = ({ src, reverse }) => {
  const copies = Array.from({ length: 4 });
  const strip = (
    <div className="flex shrink-0">
      {copies.map((_, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          className="h-[clamp(88px,9.2vw,160px)] w-auto shrink-0"
        />
      ))}
    </div>
  );
  return (
    <div className="w-full overflow-hidden">
      <div className={`flex w-max marquee-track ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {strip}
        {strip}
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Content Area — Figma: gap-32 between title and subtitle, centered */}
      <div className="w-full max-w-content mx-auto flex flex-col items-center text-center px-[clamp(24px,7vw,100px)] pb-[clamp(48px,7vw,80px)]">

        {/* Title — Display-xl (Lexend Bold 86/95/-3%), primary blue, max 1182 */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="t-display-xl text-text-primary max-w-[1182px]"
        >
          Full-stack data solutions to empower your business.
        </motion.h1>

        {/* Subtitle — Subtitle (Montserrat 24/32), #5a5a5a, max 820, gap-32 from title */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="t-subtitle text-subtitle max-w-[820px] mt-[32px]"
        >
          We analyze, design, and code with AI — bringing Vietnamese agility to speed up your growth.
        </motion.p>

        {/* Milestones bar — gap-80; value Display-md #0f1219, label H4 Lexend Medium #4b4d53 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-[clamp(48px,6vw,80px)] grid grid-cols-2 gap-x-12 gap-y-8 md:flex md:items-start md:justify-center md:gap-[80px]"
        >
          {milestones.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center gap-[4px]">
              <span className="t-display-md text-text-default">{m.value}</span>
              <span className="t-h4 text-link">{m.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Icon marquee rows — two rows of 160px tiles, opposite directions, no row gap */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="w-full flex flex-col"
        aria-hidden="true"
      >
        <MarqueeRow src={ASSETS.hero.iconsRow1} />
        <MarqueeRow src={ASSETS.hero.iconsRow2} reverse />
      </motion.div>
    </section>
  );
};

export default Hero;
