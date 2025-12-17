import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, Paperclip, Loader2, AlertCircle } from 'lucide-react';

interface SurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: Record<string, string>) => void;
}

const Survey: React.FC<SurveyProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsCompleted(false);
      setFileName(null);
      setFile(null);
      setAnswers({});
      setIsSubmitting(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (error) setError(null); // Clear error on change
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      handleChange('attachment', selectedFile.name);
    }
  };

  const validateLastStep = () => {
    if (!answers['name'] || !answers['name'].trim()) {
      return "Please enter your name.";
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!answers['email'] || !answers['email'].trim() || !emailRegex.test(answers['email'])) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const submitSurvey = async () => {
    // Validation check for the final step
    const validationError = validateLastStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    // FormSubmit Configuration
    formData.append("_subject", "New Survey Submission from Officience Website");
    formData.append("_captcha", "false");
    formData.append("_template", "table");
    // Updated CC list
    formData.append("_cc", "huycanh.duong@officience.com,steven.duyminhnguyen@officience.com,tructien.ho@officience.com");

    // Append Answers
    Object.entries(answers).forEach(([key, value]) => {
      if (key === 'services' && Array.isArray(value)) {
        formData.append(key, value.join(', '));
      } else if (key !== 'attachment') {
        formData.append(key, String(value));
      }
    });

    // Append File if exists
    if (file) {
      formData.append("attachment", file);
    }

    try {
      // Use AJAX endpoint to prevent redirect
      await fetch("https://formsubmit.co/ajax/duykhang.le@officience.com", {
        method: "POST",
        body: formData
      });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
      setIsCompleted(true);
      onComplete(answers as Record<string, string>);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitSurvey();
    }
  };

  const steps = [
    // Step 1: Business Type
    {
      title: "Tell us about your business?",
      subtitle: "A great partnership starts with good understanding",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Independent', 'Agency', 'Startup', 'SME', 'Enterprise', 'Social venture'].map((opt) => (
            <label key={opt} className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center font-medium ${answers['businessType'] === opt ? 'border-off-yellow bg-yellow-50 text-black' : 'border-gray-100 hover:border-gray-200'}`}>
              <input 
                type="radio" 
                name="businessType" 
                value={opt} 
                className="hidden" 
                onChange={() => handleChange('businessType', opt)}
                checked={answers['businessType'] === opt}
              />
              {opt}
            </label>
          ))}
        </div>
      )
    },
    // Step 2: Problem
    {
      title: "What are you trying to solve today?",
      subtitle: "Your problem is our problem",
      content: (
        <div className="bg-white border-b-2 border-gray-200 focus-within:border-primary transition-colors pb-2">
          <label className="text-gray-500 text-lg">I want to: </label>
          <input 
            type="text" 
            className="w-full text-xl md:text-2xl outline-none font-bold text-gray-900 mt-2 placeholder:text-gray-300"
            placeholder="build a mobile app..."
            value={answers['problem'] || ''}
            onChange={(e) => handleChange('problem', e.target.value)}
            autoFocus
          />
        </div>
      )
    },
    // Step 3: Service Interest
    {
      title: "What service are you interested in?",
      subtitle: "We provide smart solutions to boost your work",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {['Data', 'IT', 'Design', 'AI/ML', 'BI', 'Other'].map((opt) => {
             const isSelected = (answers['services'] || []).includes(opt);
             return (
              <label key={opt} className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 hover:border-gray-200'}`}>
                <span className="font-bold">{opt}</span>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={isSelected}
                  onChange={() => {
                    const current = answers['services'] || [];
                    const updated = current.includes(opt) 
                      ? current.filter((i: string) => i !== opt)
                      : [...current, opt];
                    handleChange('services', updated);
                  }}
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
              </label>
             );
          })}
        </div>
      )
    },
    // Step 4: Expectations
    {
      title: "What are your expectations?",
      subtitle: "Our engager will prioritize your project to meet your targets.",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Timeline complete within:</h4>
            <div className="flex flex-wrap gap-2">
              {['Yesterday', '1 week', '1-3 months', 'next year'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleChange('timeline', opt)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${answers['timeline'] === opt ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Budget I have in mind:</h4>
             <div className="flex flex-wrap gap-2">
              {['< €1K', '€3-5K', '€10K', '€20K', '> €50K'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleChange('budget', opt)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${answers['budget'] === opt ? 'bg-black text-white border-black' : 'bg-white border-gray-200 hover:border-gray-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Step 5: Contact
    {
      title: "Contact me please",
      subtitle: "Let’s deliver great work together!",
      content: (
        <div className="space-y-4">
           {error && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm font-bold border border-red-100"
             >
               <AlertCircle size={16} />
               {error}
             </motion.div>
           )}
           <input 
              type="text" 
              placeholder="Name *" 
              className={`w-full p-3 bg-gray-50 rounded-lg border focus:outline-none transition-colors ${error && !answers['name'] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
              value={answers['name'] || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email *" 
              className={`w-full p-3 bg-gray-50 rounded-lg border focus:outline-none transition-colors ${error && !answers['email'] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
              value={answers['email'] || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Company" 
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                value={answers['company'] || ''}
                onChange={(e) => handleChange('company', e.target.value)}
              />
              <input 
                type="tel" 
                placeholder="Phone" 
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                value={answers['phone'] || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            
            <div className="mt-2">
              <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 hover:text-primary">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <Paperclip size={20} />
                <span className="text-sm font-medium truncate">{fileName || "Attach document (optional)"}</span>
              </label>
            </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div className="flex items-center gap-2">
              {!isCompleted && (
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-8 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-gray-200'}`} 
                    />
                  ))}
                </div>
              )}
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
             <X size={24} />
           </button>
        </div>

        {/* Body */}
        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
          {isCompleted ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Thank you!</h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
                My colleague Otty will set up a quick call to get your brief.
                <br /><br />
                We're excited to quickly start drafting a tailored solution for you.
                <br /><br />
                <span className="font-bold text-primary">Talk soon, Officience</span>
              </p>
              <button 
                onClick={onClose}
                className="mt-10 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-primary transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-500 mb-8 font-body">{steps[currentStep].subtitle}</p>
                
                <div className="flex-grow">
                  {steps[currentStep].content}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {!isCompleted && (
          <div className="p-6 border-t border-gray-100 flex justify-between bg-white z-10">
            <button 
              onClick={currentStep === 0 ? onClose : () => setCurrentStep(prev => prev - 1)}
              className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors"
              disabled={isSubmitting}
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>
            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className={`px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Survey;