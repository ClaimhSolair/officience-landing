import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const reasons = [
  {
    category: 'Talents',
    text: 'We are digital-native doers, living online, and breathing new tools every day.',
    accentColor: 'bg-[#D1EAEF]', // Pastel Teal
  },
  {
    category: 'Flexible',
    text: "We deliver the agile way, support 'follow the sun', and focus on visible results.",
    accentColor: 'bg-[#FDE2E4]', // Pastel Pink
  },
  {
    category: 'International',
    text: "We've got a track record helping businesses transform faster in dynamic markets.",
    accentColor: 'bg-[#FDF4A3]', // Pastel Yellow
  },
  {
    category: 'Affordable',
    text: 'We provide budget-friendly, value-driven pricing – ensuring your investment brings impact.',
    accentColor: 'bg-[#E5D4FA]', // Pastel Purple
  }
];

const WhyOfficience: React.FC = () => {
  return (
    <section id="why-us" className="w-full bg-primary py-12 md:py-24">
      <div className="max-w-[1880px] mx-auto px-4 md:px-5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Desktop Layout - 2 columns */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
            
            <div className="flex flex-col items-start gap-4 md:gap-12">
              {/* Title - 70px */}
              <h2 
                className="font-bold leading-tight tracking-tight text-white whitespace-nowrap"
                style={{ fontSize: 'clamp(26px, 5vw, 70px)' }}
              >
                Why Choose Us
              </h2>
              {/* Description - 24px */}
              <p 
                className="font-body font-light text-blue-100 max-w-2xl leading-relaxed"
                style={{ fontSize: 'clamp(14px, 1.5vw, 24px)' }}
              >
                Connect with our AI-first teams, accessible globally, and launch your project immediately – we start in 24 hours!
              </p>
              
              {/* CTA button - hover: bg #FFBFC7, text #1F49BF */}
              <a 
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2_Y6LOgZzxIKzfDosjBF0E-UDncHoOshsY5_C63VvY3qy7VDnylBb7rGgVUyLuXPLsWDzuhtSJ"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 md:mt-8 bg-white text-gray-900 rounded-full font-bold flex items-center gap-4 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{
                  paddingLeft: 'clamp(32px, 3vw, 48px)',
                  paddingRight: 'clamp(32px, 3vw, 48px)',
                  paddingTop: 'clamp(12px, 1.5vw, 24px)',
                  paddingBottom: 'clamp(12px, 1.5vw, 24px)',
                  fontSize: 'clamp(18px, 1.5vw, 28px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFBFC7';
                  e.currentTarget.style.color = '#1F49BF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#111827';
                }}
              >
                Let's Start!
                <ArrowRight size={28} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-5 w-full">
              {reasons.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white shadow-lg"
                >
                  {/* Top portion (Accent Color) - Title center aligned */}
                  <div className={`${reason.accentColor} p-4 md:p-6 flex flex-col justify-center items-center min-h-[80px] md:min-h-[120px]`}>
                    <h3 
                      className="font-bold text-gray-900 leading-tight text-center"
                      style={{ fontSize: 'clamp(20px, 1.8vw, 30px)' }}
                    >
                      {reason.category}
                    </h3>
                  </div>
                  
                  {/* Bottom portion (White) - Description */}
                  <div className="p-4 md:p-6 flex flex-col bg-white">
                    <p 
                      className="text-gray-600 font-body leading-relaxed"
                      style={{ fontSize: 'clamp(12px, 1vw, 18px)' }}
                    >
                      {reason.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout - centered, 1-column cards */}
          <div className="md:hidden flex flex-col items-center">
            {/* Title - 40px, center aligned */}
            <h2 
              className="font-bold leading-tight tracking-tight text-white text-center mb-4"
              style={{ fontSize: '40px' }}
            >
              Why Choose Us
            </h2>
            {/* Description - 20px, center aligned */}
            <p 
              className="font-body font-light text-blue-100 leading-relaxed text-center mb-8"
              style={{ fontSize: '20px' }}
            >
              Connect with our AI-first teams, accessible globally, and launch your project immediately – we start in 24 hours!
            </p>
            
            {/* Cards - 1 column, vertical scroll */}
            <div className="flex flex-col gap-4 w-full mb-8">
              {reasons.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg"
                >
                  {/* Top portion (Accent Color) - Title center aligned */}
                  <div className={`${reason.accentColor} p-5 flex flex-col justify-center items-center min-h-[80px]`}>
                    <h3 
                      className="font-bold text-gray-900 leading-tight text-center"
                      style={{ fontSize: '24px' }}
                    >
                      {reason.category}
                    </h3>
                  </div>
                  
                  {/* Bottom portion (White) - Description +15% font, center aligned */}
                  <div className="p-5 flex flex-col bg-white">
                    <p 
                      className="text-gray-600 font-body leading-relaxed text-center"
                      style={{ fontSize: '16px' }}
                    >
                      {reason.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button - center aligned */}
            <a 
              href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2_Y6LOgZzxIKzfDosjBF0E-UDncHoOshsY5_C63VvY3qy7VDnylBb7rGgVUyLuXPLsWDzuhtSJ"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 rounded-full font-bold flex items-center justify-center gap-3 transition-all shadow-lg px-8 py-4 text-lg"
            >
              Let's Start!
              <ArrowRight size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyOfficience;
