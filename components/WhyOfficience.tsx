import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../assets';

type Reason = {
  category: string;
  text: string;
  pink: boolean;
  // desktop quadrant placement
  col: 'left' | 'right';
  row: 'top' | 'bottom';
};

const reasons: Reason[] = [
  {
    category: 'Talents',
    text: 'We are digital-native doers, living online, and breathing new tools every day.',
    pink: true,
    col: 'left',
    row: 'top',
  },
  {
    category: 'Flexible',
    text: 'We deliver the agile way, support ‘follow the sun’, and focus on visible results.',
    pink: false,
    col: 'right',
    row: 'top',
  },
  {
    category: 'International',
    text: 'We’ve got a track record helping businesses transform faster in dynamic markets.',
    pink: false,
    col: 'left',
    row: 'bottom',
  },
  {
    category: 'Affordable',
    text: 'We provide budget-friendly, value-driven pricing – ensuring your investment brings impact.',
    pink: true,
    col: 'right',
    row: 'bottom',
  },
];

const WhyOfficience: React.FC = () => {
  return (
    <section id="why-us" className="w-full bg-bg-primary">
      <div className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] py-[clamp(64px,8vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-[clamp(48px,6vw,80px)]"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-[20px] text-center">
            <h2 className="t-display-xl text-white">Why Choose Us</h2>
            <p className="t-subtitle text-white/85 max-w-[678px]">
              Connect with our AI-first teams, accessible globally, and launch your project immediately –{' '}
              <span className="font-sans font-semibold text-white">we start in 24 hours!</span>
            </p>
          </div>

          {/* Pinwheel — 4 quadrants hugging a center cross + icon (desktop).
              Figma "Why Us Items" block is 1208×575 (aspect ≈ 2.1:1); each text block is
              vertically centered within its quadrant and right/left-aligned toward the cross.
              aspect-ratio (not a vw height) keeps the block faithful at every container width. */}
          <div className="relative w-full max-w-[1208px] hidden lg:grid grid-cols-2 grid-rows-2 aspect-[1208/575] min-h-[480px]">
            {reasons.map((r) => {
              const alignH = r.col === 'left' ? 'items-end text-right' : 'items-start text-left';
              // Inner gap from the center cross/icon (Figma ≈ 36–48px on the inner edge).
              const padInner = r.col === 'left'
                ? 'pr-[clamp(20px,3vw,48px)]'
                : 'pl-[clamp(20px,3vw,48px)]';
              return (
                <div
                  key={r.category}
                  className={`flex flex-col justify-center gap-[10px] px-2 ${alignH} ${padInner}`}
                >
                  <h3 className="t-display-md" style={{ color: r.pink ? '#FFBFC7' : '#FFFFFF' }}>
                    {r.category}
                  </h3>
                  <p className="t-body-xl text-white max-w-[464px]">{r.text}</p>
                </div>
              );
            })}

            {/* Cross dividers (centered) */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/30 pointer-events-none" />
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-px w-[48%] bg-white/30 pointer-events-none" />

            {/* Center icon at the cross intersection */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-bg-primary p-3 rounded-full">
                <img
                  src={ASSETS.whyus.centerIcon}
                  alt=""
                  aria-hidden="true"
                  width={138}
                  height={138}
                  className="w-[clamp(96px,10vw,138px)] h-[clamp(96px,10vw,138px)]"
                />
              </div>
            </div>
          </div>

          {/* Mobile + tablet (<1024px): stacked list with the icon on top.
              The pinwheel only fits comfortably at lg+, so tablets use this layout. */}
          <div className="lg:hidden flex flex-col items-center gap-10 w-full">
            <img
              src={ASSETS.whyus.centerIcon}
              alt=""
              aria-hidden="true"
              width={120}
              height={120}
              className="w-[120px] h-[120px]"
            />
            {reasons.map((r) => (
              <div key={r.category} className="flex flex-col gap-2 text-center">
                <h3 className="t-display-md" style={{ color: r.pink ? '#FFBFC7' : '#FFFFFF' }}>
                  {r.category}
                </h3>
                <p className="t-body-xl text-white max-w-[464px]">{r.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyOfficience;
