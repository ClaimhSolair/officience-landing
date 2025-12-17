import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Activity, Globe2, Wallet, Search } from 'lucide-react';

const reasons = [
  {
    category: 'Talents',
    text: 'We are digital-native doers, living online, and breathing new tools every day.',
    accentColor: 'bg-[#D1EAEF]', // Pastel Teal
    icon: <Lightbulb size={24} className="text-gray-900 md:size-[36px]" />
  },
  {
    category: 'Flexible',
    text: 'We deliver the agile way, support ‘follow the sun’, and focus on visible results.',
    accentColor: 'bg-[#FDE2E4]', // Pastel Pink
    icon: <Activity size={24} className="text-gray-900 md:size-[36px]" />
  },
  {
    category: 'International',
    text: 'We help businesses transform faster in dynamic markets with global track record.',
    accentColor: 'bg-[#FDF4A3]', // Pastel Yellow
    icon: (
      <div className="relative">
        <Globe2 size={24} className="text-gray-900 md:size-[36px]" />
        <Search size={10} className="absolute -bottom-1 -right-1 text-gray-900 bg-[#FDF4A3] rounded-full p-0.5 md:size-[14px]" />
      </div>
    )
  },
  {
    category: 'Affordable',
    text: 'We provide budget-friendly, value-driven pricing – ensuring impact for your investment.',
    accentColor: 'bg-[#E5D4FA]', // Pastel Purple
    icon: <Wallet size={24} className="text-gray-900 md:size-[36px]" />
  }
];

const WhyOfficience: React.FC = () => {
  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="why-us" className="w-full bg-primary py-12 md:py-24 my-6 md:my-10">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24 items-center">
            
            <div className="flex flex-col items-start gap-4 md:gap-10">
              <h2 className="text-4xl md:text-8xl font-bold leading-tight tracking-tight text-white">
                Why <br className="hidden md:block"/> Choose Us
              </h2>
              <p className="text-lg md:text-3xl font-body font-light text-blue-100 max-w-xl leading-relaxed">
                AI-first teams, accessible globally. We start in 24 hours!
              </p>
              
              <button 
                onClick={handleStart}
                className="mt-2 md:mt-6 bg-white text-gray-900 hover:bg-gray-50 px-8 md:px-12 py-3 md:py-6 rounded-full font-bold text-lg md:text-2xl flex items-center gap-3 md:gap-4 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Let’s Start!
                <ArrowRight size={20} className="md:size-[28px]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-8 w-full">
              {reasons.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col rounded-2xl md:rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-[3/4] md:aspect-square bg-white shadow-lg"
                >
                  {/* Top portion (Accent Color) */}
                  <div className={`${reason.accentColor} p-4 md:p-8 flex flex-col justify-end h-[42%] md:h-1/2 relative`}>
                    <div className="absolute top-3 right-3 md:top-6 md:right-6">
                      {reason.icon}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {reason.category}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Bottom portion (White) - Optimized font size for desktop readability (reduced 15% from lg to base) */}
                  <div className="p-4 md:p-8 flex flex-col h-[58%] md:h-1/2 bg-white">
                    <p className="text-gray-700 font-body text-sm md:text-base font-medium leading-relaxed">
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