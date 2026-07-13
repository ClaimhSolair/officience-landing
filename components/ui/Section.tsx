import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';

// Faithful container: 1720px content width + 100px gutters (clamp-anchored per guardrails).
export const Section: React.FC<SectionProps> = ({ id, className = '', children }) => {
  return (
    <section
      id={id}
      className={`w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] relative ${className}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Plain content-width wrapper (no motion) for sections that own their full-bleed background.
export const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] ${className}`}>
    {children}
  </div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; subtitle?: string }> = ({ children, subtitle }) => (
  <div className="mb-8 md:mb-16">
    <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 uppercase text-gray-900">
      {children}
    </h2>
    {subtitle && (
      <p className="text-secondary text-lg md:text-2xl font-light font-body max-w-3xl border-l-4 border-primary pl-4 md:pl-6">
        {subtitle}
      </p>
    )}
  </div>
);