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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            
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
                Let's Start!
                <ArrowRight size={20} className="md:size-[28px]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
              {reasons.map((reason, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white shadow-lg"
                >
                  {/* Top portion (Accent Color) - Rectangle shape */}
                  <div className={`${reason.accentColor} p-4 md:p-5 flex flex-col justify-between min-h-[80px] md:min-h-[100px] relative`}>
                    {/* Icon at top-right, smaller and less intrusive */}
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-70">
                      {reason.icon}
                    </div>
                    {/* Title at bottom-left */}
                    <div className="mt-auto">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        {reason.category}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Bottom portion (White) - Description */}
                  <div className="p-4 md:p-5 flex flex-col bg-white">
                    <p className="text-gray-600 font-body text-xs md:text-sm leading-relaxed">
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
