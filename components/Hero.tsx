import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Content Area - 1880px container */}
      <div className="w-full max-w-[1880px] mx-auto flex flex-col items-center justify-center text-center px-5 pt-16 md:pt-24 pb-10 md:pb-16">
        
        {/* Title - Lexend SemiBold, rescaled for 2 lines max */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-sans font-semibold tracking-[-0.04em] text-gray-900 leading-[110%] text-center"
          style={{ fontSize: 'clamp(32px, 4vw, 64px)', maxWidth: '1200px' }}
        >
          Full-stack data solutions to empower your business.
        </motion.h1>

        {/* Description - rescaled for 2 lines max */}
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-700 font-body font-light leading-relaxed mt-6 md:mt-8"
          style={{ fontSize: 'clamp(16px, 1.8vw, 28px)', maxWidth: '900px' }}
        >
          We analyze, design, and code with AI — bringing Vietnamese agility to speed up your growth.
        </motion.p>
        
        {/* CTA Button - normal weight, not bold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 md:mt-14"
        >
          <a 
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2_Y6LOgZzxIKzfDosjBF0E-UDncHoOshsY5_C63VvY3qy7VDnylBb7rGgVUyLuXPLsWDzuhtSJ"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-4 bg-primary hover:bg-blue-800 text-white font-normal rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl"
            style={{ 
              width: 'clamp(200px, 14vw, 260px)', 
              height: 'clamp(56px, 4vw, 72px)',
              fontSize: 'clamp(16px, 1.3vw, 22px)'
            }}
          >
            Let's Start!
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Background Image - Full Width, scaled height for Full HD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="w-full"
      >
        <img 
          src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Element_header.png" 
          alt="Officience Creative Elements" 
          className="w-full h-auto object-cover object-center"
          style={{ 
            maxHeight: 'clamp(200px, 25vw, 400px)',
            minHeight: '150px'
          }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
