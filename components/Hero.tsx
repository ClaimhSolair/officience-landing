import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden py-8 md:py-0">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/40 to-background/90 pointer-events-none" />
      
      {/* Image Layer */}
      <motion.div
         initial={{ opacity: 0, x: 50, y: -20 }}
         animate={{ opacity: 1, x: 0, y: 0 }}
         transition={{ delay: 0.4, duration: 1 }}
         className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 pointer-events-none flex items-center justify-end"
      >
        <img 
          src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Elements%201.png" 
          alt="Officience Creative Elements" 
          className="w-full h-auto max-h-[60vh] md:max-h-[85vh] object-contain object-center lg:object-right opacity-60 md:opacity-100 transform translate-y-20 md:translate-y-0"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full pt-4 md:pt-20">
        
        <div className="flex flex-col items-start text-left max-w-4xl lg:max-w-[70%]">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-6 text-gray-900 leading-[1.1] drop-shadow-sm"
          >
            Full-stack data solutions to empower your business.
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-700 text-xl md:text-3xl lg:text-4xl font-body font-light leading-relaxed mb-8 md:mb-12 drop-shadow-sm max-w-2xl"
          >
            We analyze, design, and code with AI — bringing Vietnamese agility to speed up your growth.
          </motion.h2>
          
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
          >
            <a 
              href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2_Y6LOgZzxIKzfDosjBF0E-UDncHoOshsY5_C63VvY3qy7VDnylBb7rGgVUyLuXPLsWDzuhtSJ"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 md:gap-4 bg-primary hover:bg-blue-800 text-white px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl"
            >
              Let's Start !
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;