import React, { useState } from 'react';
import { Section } from './ui/Section';
import { MapPin, Loader2, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ContactProps {
  surveyData?: Record<string, string> | null;
}

const offices = [
  {
    city: "Paris, France",
    address: "47 Boulevard de Sébastopol, Paris"
  },
  {
    city: "San Francisco, USA",
    address: "8 The Green, Dover, Delaware"
  },
  {
    city: "Singapore",
    address: "9 Kallang Place, Singapore"
  },
  {
    city: "HCMC, Vietnam",
    subOffices: [
      { name: "OffyPlex", address: "District 10, HCMC" },
      { name: "CrunchBase", address: "Phu Nhuan District, HCMC" }
    ]
  }
];

const Contact: React.FC<ContactProps> = ({ surveyData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("_subject", "New Inquiry from Officience Website");
    data.append("_captcha", "false");
    data.append("_template", "table");
    data.append("_cc", "huycanh.duong@officience.com,steven.duyminhnguyen@officience.com,tructien.ho@officience.com,thanhlong.le@officience.com");
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });

    if (surveyData) {
      const formattedSurvey = Object.entries(surveyData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      data.append("survey_results", formattedSurvey);
    }

    try {
      await fetch("https://formsubmit.co/ajax/duykhang.le@officience.com", {
        method: "POST",
        body: data
      });
      setShowSuccess(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-2 md:py-3 text-base md:text-lg text-gray-900 outline-none transition-all duration-300 font-body placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10";

  return (
    <Section id="contact" className="py-12 md:py-20 bg-white rounded-3xl md:rounded-[3rem] my-4 md:my-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-16">
          <h2 className="text-4xl md:text-8xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">Let’s Build Together</h2>
          <p className="text-xl md:text-2xl text-secondary font-body font-light">
            Ready to scale? Drop us a note.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24">
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6">
            {offices.map((office, idx) => (
              <div key={idx} className="flex gap-3 md:gap-4">
                <MapPin size={24} className="text-off-red flex-shrink-0 mt-1 md:size-[28px]" fill="currentColor" fillOpacity={0.2} />
                <div className="space-y-0.5 md:space-y-1">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900">{office.city}</h4>
                  {office.address ? (
                    <p className="text-gray-600 font-body text-base md:text-xl leading-snug">
                      {office.address}
                    </p>
                  ) : (
                    <div className="space-y-1 md:space-y-2">
                      {office.subOffices?.map((sub, sIdx) => (
                        <p key={sIdx} className="text-gray-600 font-body text-base md:text-xl leading-snug">
                          <span className="text-primary font-bold">{sub.name}</span> - {sub.address}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
              <div>
                <label className="block text-lg md:text-xl font-bold text-gray-900 mb-2">Full name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name" 
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-lg md:text-xl font-bold text-gray-900 mb-2">Work email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email" 
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-lg md:text-xl font-bold text-gray-900 mb-2">Company</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company" 
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-lg md:text-xl font-bold text-gray-900 mb-2">Note</label>
                <textarea 
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Project context..."
                  className={inputClasses}
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 pt-4">
                <div className="text-gray-500 font-body text-xs md:text-base text-center md:text-left">
                  <p>Reply in one business day.</p>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white md:bg-white md:text-gray-900 font-bold px-8 py-3 md:py-4 rounded-full text-lg md:text-xl transition-all border border-primary md:border-gray-900 flex justify-center items-center gap-2 w-full md:min-w-[240px]"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Request proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSuccess(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 text-center"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                <Check size={32} className="md:size-[48px]" strokeWidth={3} />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Thank you!</h3>
              <p className="text-base md:text-xl text-gray-600 leading-relaxed">
                Talk soon, Officience
              </p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-lg"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Contact;