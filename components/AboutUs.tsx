import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Heart, Globe, Zap, Users, Star } from 'lucide-react';

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSurvey: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose, onOpenSurvey }) => {
  if (!isOpen) return null;

  const handleLetTalk = () => {
    onClose();
    // Small delay to allow the modal close animation to start/finish before opening the survey
    setTimeout(() => {
      onOpenSurvey();
    }, 300);
  };

  const causes = [
    { icon: <Heart className="text-off-red" />, title: "Creating Shared Value" },
    { icon: <Zap className="text-off-yellow" />, title: "Open Knowledge" },
    { icon: <Globe className="text-primary" />, title: "Sustainability" },
    { icon: <Globe className="text-blue-400" />, title: "Positive Globalization" },
    { icon: <Star className="text-off-pink" />, title: "Developing Vietnam" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
           <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Who We Are</h2>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
             <X size={24} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar">
          
          {/* Hero Section */}
          <div className="relative h-64 md:h-80 bg-primary overflow-hidden flex items-center justify-center text-center px-6">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Officience</h1>
              <p className="text-xl md:text-2xl text-white/90 font-light font-body">The full stack data company</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-16">
            
            {/* Intro & Map Concept */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Tailor-made solutions to support your growth</h3>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-lg text-gray-700">Global IT player born in Vietnam (2006)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-off-yellow flex-shrink-0" />
                        <span className="text-lg text-gray-700">Small teams, people magic <span className="text-off-yellow">♥</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-off-red flex-shrink-0" />
                        <span className="text-lg text-gray-700">Dedicated to our 5 Causes, we bring Vietnamese agility to international businesses with impact at heart.</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Locations Visualization */}
                  <div className="relative h-48 bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat"></div>
                    <div className="flex flex-wrap justify-center gap-3 relative z-10">
                      {['San Francisco', 'Paris', 'Ho Chi Minh', 'Singapore'].map((city) => (
                        <span key={city} className="flex items-center gap-1 bg-white shadow-sm border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                          <MapPin size={12} className="text-off-red" /> {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Causes */}
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                {causes.map((c, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 w-32">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                      {c.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase text-center leading-tight">{c.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Power Section */}
            <div>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-gray-900">Soft Power made in Vietnam</h3>
                <p className="text-secondary mt-2">Our culture is our strongest asset.</p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col justify-center items-center shadow-sm relative overflow-hidden">
                     <div className="relative z-10 text-center">
                        <div className="text-7xl font-bold text-gray-900 tracking-tighter mb-2">270</div>
                        <div className="text-xl font-medium text-gray-500 uppercase tracking-widest">Members</div>
                        <div className="mt-4 flex gap-2 justify-center">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                           <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                           <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center justify-center shadow-sm relative overflow-hidden">
                     <div className="flex items-center gap-10">
                        {/* Static Donut Chart */}
                        <div className="relative w-40 h-40">
                           <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                              <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                              <path 
                                className="text-primary" 
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3.8" 
                                strokeDasharray="66, 100"
                                strokeLinecap="round" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center flex-col text-primary">
                              <span className="text-4xl font-bold">2/3</span>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-3xl font-bold text-gray-900">Women</span>
                           <span className="text-gray-500 text-base">Empowering leadership</span>
                        </div>
                     </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* COSMIC Visualization */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
                   
                   <div className="relative w-full max-w-[320px] aspect-square mx-auto flex items-center justify-center select-none">
                      {/* Rings SVG */}
                      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
                          {/* Inner Guide Circle */}
                          <circle cx="200" cy="200" r="100" fill="none" stroke="#F3F4F6" strokeWidth="2" />
                          {/* Outer Guide Ring */}
                          <circle cx="200" cy="200" r="150" fill="none" stroke="#F3F4F6" strokeWidth="2" strokeDasharray="6 6" />
                          
                          {/* Decorative Arcs */}
                          {/* Top Right Green Arc */}
                          <path d="M 200 50 A 150 150 0 0 1 350 200" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                          {/* Bottom Left Purple Arc */}
                          <path d="M 200 350 A 150 150 0 0 1 50 200" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                      </svg>

                      {/* Center */}
                      <div className="z-10 bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50">
                          <span className="text-3xl font-bold text-gray-900">Cosmic</span>
                      </div>

                      {/* Nodes & Labels */}
                      
                      {/* Commitment - Top Center */}
                      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                           <span className="text-lg font-bold text-gray-700 bg-white/80 px-3 rounded-full">Commitment</span>
                      </div>

                      {/* Care - Right Top */}
                      <div className="absolute top-[30%] right-[5%] flex flex-col items-center gap-1">
                           <span className="text-lg font-bold text-gray-700 bg-white/80 px-3 rounded-full">Care</span>
                           <div className="w-2 h-2 rounded-full bg-green-300 ring-4 ring-white"></div>
                      </div>

                      {/* Innovation - Right Bottom */}
                      <div className="absolute bottom-[35%] right-[0%] flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-gray-900 ring-4 ring-white"></div>
                           <span className="text-lg font-bold text-gray-700 bg-white/80 px-3 rounded-full">Innovation</span>
                      </div>

                      {/* Merit - Bottom Center */}
                      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex flex-col-reverse items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-gray-400 ring-4 ring-white"></div>
                           <span className="text-lg font-bold text-gray-700 bg-white/80 px-3 rounded-full">Merit</span>
                      </div>

                      {/* Open & Sincere - Left */}
                      <div className="absolute top-1/2 left-[-5%] -translate-y-1/2 flex flex-col items-center gap-1">
                           <span className="text-lg font-bold text-gray-700 bg-white/80 px-3 rounded-full text-center leading-tight">Open &<br/>Sincere</span>
                           <div className="w-3 h-3 rounded-full bg-gray-900 ring-4 ring-white"></div>
                      </div>
                   </div>
                </div>

                {/* At Core Visualization (Scaled up 50%) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
                   
                   {/* 
                     Triangle Centering Logic:
                     Container w-full max-w-[450px] aspect-square (Significantly larger than before)
                     Top Vertex: 50%, 15%
                     Bottom Left Vertex: 20%, 75%
                     Bottom Right Vertex: 80%, 75%
                   */}
                   <div className="relative w-full max-w-[450px] aspect-square mx-auto flex items-center justify-center select-none">
                      
                      {/* Connecting Lines Layer with Gradients */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <defs>
                            <linearGradient id="grad-purpose-autonomy" x1="50%" y1="15%" x2="20%" y2="75%" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor="#4AAEB3" />
                              <stop offset="100%" stopColor="#FB8C70" />
                            </linearGradient>
                            <linearGradient id="grad-autonomy-mastery" x1="20%" y1="75%" x2="80%" y2="75%" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor="#FB8C70" />
                              <stop offset="100%" stopColor="#FACC5F" />
                            </linearGradient>
                            <linearGradient id="grad-mastery-purpose" x1="80%" y1="75%" x2="50%" y2="15%" gradientUnits="userSpaceOnUse">
                              <stop offset="0%" stopColor="#FACC5F" />
                              <stop offset="100%" stopColor="#4AAEB3" />
                            </linearGradient>
                          </defs>

                          {/* Purpose to Autonomy */}
                          <line x1="50%" y1="15%" x2="20%" y2="75%" stroke="url(#grad-purpose-autonomy)" strokeWidth="16" strokeLinecap="round" />
                          
                          {/* Autonomy to Mastery */}
                          <line x1="20%" y1="75%" x2="80%" y2="75%" stroke="url(#grad-autonomy-mastery)" strokeWidth="16" strokeLinecap="round" />
                          
                          {/* Mastery to Purpose */}
                          <line x1="80%" y1="75%" x2="50%" y2="15%" stroke="url(#grad-mastery-purpose)" strokeWidth="16" strokeLinecap="round" />
                      </svg>

                      {/* Center: Passion (No Background) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <span className="text-xl font-extrabold text-gray-900 tracking-tight">Passion</span>
                      </div>

                      {/* Top: Purpose (Increased size) */}
                      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#4AAEB3] flex items-center justify-center shadow-lg ring-4 ring-white z-20">
                          <span className="text-sm font-bold text-white">Purpose</span>
                      </div>

                      {/* Bottom Left: Autonomy (Increased size) */}
                      <div className="absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#FB8C70] flex items-center justify-center shadow-lg ring-4 ring-white z-20">
                          <span className="text-sm font-bold text-white">Autonomy</span>
                      </div>

                      {/* Bottom Right: Mastery (Increased size) */}
                      <div className="absolute top-[75%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#FACC5F] flex items-center justify-center shadow-lg ring-4 ring-white z-20">
                          <span className="text-sm font-bold text-white">Mastery</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-900 rounded-2xl p-10 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to experience our people magic?</h3>
              <button 
                onClick={handleLetTalk} 
                className="bg-primary hover:bg-white hover:text-primary text-white font-bold py-4 px-10 text-lg rounded-full transition-all transform hover:scale-105"
              >
                Let's talk
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;