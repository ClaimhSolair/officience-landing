import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* Content Area */}
      <div className="flex flex-col items-center justify-center text-center px-4 md:px-6 pt-12 md:pt-20 pb-8 md:pb-12">
        
        {/* Title - Lexend SemiBold 64px, line-height 100%, letter-spacing -4% */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-sans text-[40px] md:text-[64px] font-semibold tracking-[-0.04em] mb-4 md:mb-6 text-gray-900 leading-[100%] max-w-4xl text-center"
        >
          Full-stack data solutions to empower your business.
        </motion.h1>

        {/* Description - 28px */}
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-700 text-lg md:text-[28px] font-body font-light leading-relaxed mb-8 md:mb-10 max-w-3xl"
        >
          We analyze, design, and code with AI — bringing Vietnamese agility to speed up your growth.
        </motion.p>
        
        {/* CTA Button - 216px x 63px */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a 
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2_Y6LOgZzxIKzfDosjBF0E-UDncHoOshsY5_C63VvY3qy7VDnylBb7rGgVUyLuXPLsWDzuhtSJ"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-blue-800 text-white font-bold rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl"
            style={{ 
              width: '216px', 
              height: '63px',
              fontSize: '18px'
            }}
          >
            Let's Start!
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Background Image - Bottom, Full Width, Height ~300px */}
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
            maxHeight: '300px',
            minHeight: '150px'
          }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
