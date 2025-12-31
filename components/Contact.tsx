import React, { useState } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ContactProps {
  surveyData?: Record<string, string> | null;
}

const offices = [
  {
    city: "Paris, France",
    address: "47 Boulevard de Sébastopol, 75001, Paris, France"
  },
  {
    city: "San Francisco, USA",
    address: "8 The Green, Suite #4511, Dover, Delaware 19901, USA"
  },
  {
    city: "Singapore",
    address: "9 Kallang Place, #04-08, Singapore 339154"
  },
  {
    city: "Hochiminh City, Vietnam",
    subOffices: [
      { name: "OffyPlex", address: "16A Le Hong Phong Street, Ward 12, District 10, HCMC" },
      { name: "CrunchBase", address: "262/18 Huynh Van Banh Street, Ward 11, Phu Nhuan District, HCMC" }
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

  return (
    <section id="contact" className="py-6 md:py-12 w-full" style={{ backgroundColor: '#1F49BF' }}>
      {/* Inner Card with #F7F7F7 background */}
      <div className="max-w-[1880px] mx-auto px-4 md:px-5">
        <div className="rounded-3xl md:rounded-[2.5rem] p-6 md:p-12" style={{ backgroundColor: '#F7F7F7' }}>
          <div className="mb-6 md:mb-12">
            <h2 
              className="font-bold mb-3 md:mb-4 text-gray-900 leading-tight"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
            >
              Let's Build Together
            </h2>
            <p 
              className="text-gray-600 font-body font-light"
              style={{ fontSize: 'clamp(16px, 1.5vw, 22px)' }}
            >
              Ready to scale? Drop us a note below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 items-start">
            
            <div className="flex flex-col gap-3 md:gap-4">
              {offices.map((office, idx) => (
                <div key={idx} className="flex gap-2 md:gap-3">
                  <MapPin size={18} className="text-off-red flex-shrink-0 mt-0.5 md:size-[20px]" fill="currentColor" fillOpacity={0.2} />
                  <div>
                    <h4 
                      className="font-bold text-gray-900 leading-tight"
                      style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}
                    >
                      {office.city}
                    </h4>
                    {office.address ? (
                      <p 
                        className="text-gray-600 font-body leading-tight"
                        style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}
                      >
                        {office.address}
                      </p>
                    ) : (
                      <div>
                        {office.subOffices?.map((sub, sIdx) => (
                          <p 
                            key={sIdx} 
                            className="text-gray-600 font-body leading-tight"
                            style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}
                          >
                            <span className="text-primary font-semibold underline">{sub.name}</span> - {sub.address}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[1.5rem] border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label 
                  className="block font-bold text-gray-900 mb-2"
                  style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}
                >
                  Full name
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name" 
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 outline-none transition-all duration-300 font-body placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                />
              </div>
              <div>
                <label 
                  className="block font-bold text-gray-900 mb-2"
                  style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}
                >
                  Work email
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email" 
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 outline-none transition-all duration-300 font-body placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                />
              </div>
              <div>
                <label 
                  className="block font-bold text-gray-900 mb-2"
                  style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}
                >
                  Company
                </label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company" 
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 outline-none transition-all duration-300 font-body placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                />
              </div>
              <div>
                <label 
                  className="block font-bold text-gray-900 mb-2"
                  style={{ fontSize: 'clamp(14px, 1.2vw, 18px)' }}
                >
                  Note/ Project context
                </label>
                <textarea 
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share a few lines about your"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 outline-none transition-all duration-300 font-body placeholder:text-gray-400 focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 pt-4">
                <div 
                  className="text-gray-500 font-body text-center md:text-left italic"
                  style={{ fontSize: 'clamp(12px, 1vw, 16px)' }}
                >
                  <p>We reply within one business day.</p>
                  <p>No aggressive sales.</p>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-gray-900 font-bold rounded-full transition-all border-2 border-gray-900 hover:bg-gray-900 hover:text-white flex justify-center items-center gap-2 w-full md:w-auto"
                  style={{
                    paddingLeft: 'clamp(24px, 2vw, 36px)',
                    paddingRight: 'clamp(24px, 2vw, 36px)',
                    paddingTop: 'clamp(12px, 1vw, 16px)',
                    paddingBottom: 'clamp(12px, 1vw, 16px)',
                    fontSize: 'clamp(14px, 1.2vw, 18px)'
                  }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Request a proposal"}
                </button>
              </div>
            </form>
          </div>
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
    </section>
  );
};

export default Contact;
