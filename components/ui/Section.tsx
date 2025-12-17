import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';

export const Section: React.FC<SectionProps> = ({ id, className = '', children }) => {
  return (
    <section id={id} className={`py-8 md:py-20 px-4 md:px-16 max-w-7xl mx-auto relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};

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