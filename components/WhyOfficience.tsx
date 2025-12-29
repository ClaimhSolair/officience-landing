import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Activity, Globe2, Wallet, Search } from 'lucide-react';

const reasons = [
  {
    category: 'Talents',
    text: 'We are digital-native doers, living online, and breathing new tools every day.',
    accentColor: 'bg-[#D1EAEF]', // Pastel Teal
    icon: <Lightbulb size={18} className="text-gray-700 md:size-[28px]" />
  },
  {
    category: 'Flexible',
    text: "We deliver the agile way, support 'follow the sun', and focus on visible results.",
    accentColor: 'bg-[#FDE2E4]', // Pastel Pink
    icon: <Activity size={18} className="text-gray-700 md:size-[28px]" />
  },
  {
    category: 'International',
    text: 'We help businesses transform faster in dynamic markets with global track record.',
    accentColor: 'bg-[#FDF4A3]', // Pastel Yellow
    icon: (
      <div className="relative">
        <Globe2 size={18} className="text-gray-700 md:size-[28px]" />
        <Search size={8} className="absolute -bottom-0.5 -right-0.5 text-gray-700 md:size-[12px]" />
      </div>
    )
  },
  {
    category: 'Affordable',
    text: 'We provide budget-friendly, value-driven pricing – ensuring impact for your investment.',
    accentColor: 'bg-[#E5D4FA]', // Pastel Purple
    icon: <Wallet size={18} className="text-gray-700 md:size-[28px]" />
  }
];

const WhyOfficience: React.FC = () => {
  return (
    <section id="why-us" className="w-full bg-primary py-12 md:py-24 my-6 md:my-10">
      <div className="max-w-[1880px] mx-auto px-4 md:px-5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
            
            <div className="flex flex-col items-start gap-4 md:gap-12">
              <h2 
                className="font-bold leading-tight tracking-tight text-white"
                style={{ fontSize: 'clamp(36px, 7vw, 120px)' }}
              >
                Why <br className="hidden md:block"/> Choose Us
              </h2>
              <p 
                className="font-body font-light text-blue-100 max-w-2xl leading-relaxed"
                style={{ fontSize: 'clamp(18px, 2vw, 36px)' }}
              >
                AI-first teams, accessible globally. We start in 24 hours!
              </p>
              
              <a 
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2_Y6LOgZzxIKzfDosjBF0E-UDncHoOshsY5_C63VvY3qy7VDnylBb7rGgVUyLuXPLsWDzuhtSJ"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 md:mt-8 bg-white text-gray-900 hover:bg-gray-50 rounded-full font-bold flex items-center gap-4 transition-all transform hover:-translate-y-1 shadow-lg"
                style={{
                  paddingLeft: 'clamp(32px, 3vw, 48px)',
                  paddingRight: 'clamp(32px, 3vw, 48px)',
                  paddingTop: 'clamp(12px, 1.5vw, 24px)',
                  paddingBottom: 'clamp(12px, 1.5vw, 24px)',
                  fontSize: 'clamp(18px, 1.5vw, 28px)'
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
                  {/* Top portion (Accent Color) - Rectangle shape */}
                  <div className={`${reason.accentColor} p-4 md:p-6 flex flex-col justify-between min-h-[80px] md:min-h-[120px] relative`}>
                    {/* Icon at top-right, smaller and less intrusive */}
                    <div className="absolute top-3 right-3 md:top-5 md:right-5 opacity-70">
                      {reason.icon}
                    </div>
                    {/* Title at bottom-left */}
                    <div className="mt-auto">
                      <h3 
                        className="font-bold text-gray-900 leading-tight"
                        style={{ fontSize: 'clamp(20px, 1.8vw, 30px)' }}
                      >
                        {reason.category}
                      </h3>
                    </div>
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
        </motion.div>
      </div>
    </section>
  );
};

export default WhyOfficience;
