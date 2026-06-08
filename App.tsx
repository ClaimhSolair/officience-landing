import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Survey from './components/Survey';
import HowWeEngage from './components/HowWeEngage';
import ClientStories from './components/ClientStories';
import Capabilities from './components/Capabilities';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhyOfficience from './components/WhyOfficience';
import TermsConditions from './components/TermsConditions';
import SplashScreen from './components/SplashScreen';
import type { SurveyBranch } from './components/Contact';

function App() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveyBranch, setSurveyBranch] = useState<SurveyBranch>('work');
  const [, setSurveyData] = useState<Record<string, string> | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openSurvey = (branch: SurveyBranch = 'work') => {
    setSurveyBranch(branch);
    setIsSurveyOpen(true);
  };
  const closeSurvey = () => setIsSurveyOpen(false);

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const handleSurveyComplete = (data: Record<string, string>) => {
    setSurveyData(data);
  };

  return (
    <div className="bg-background min-h-screen w-full box-border flex flex-col font-sans text-gray-900 selection:bg-yellow-400 selection:text-black">
      
      {/* Splash Screen */}
      <SplashScreen />
      
      {/* Main Card Container */}
      <div className="flex-1 relative isolate flex flex-col min-h-screen">
        
        {/* Background Layer */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
           {/* Blob animation removed */}
        </div>

        {/* Content */}
        <Header 
          onOpenSurvey={openSurvey} 
        />
        
        {/* Figma order: Hero → Services → Approach → Testimonials → Why Us → Contact → Footer.
            120px vertical rhythm between top-region sections (clamp-anchored). */}
        <main className="relative z-10 flex-grow flex flex-col gap-[clamp(56px,9vw,120px)] pt-[clamp(56px,9vw,120px)]">
          <Hero />
          <Capabilities />
          <HowWeEngage onOpenSurvey={openSurvey} />
          <ClientStories />

          {/* Blue background wrapper for bottom sections (Figma: Why Us frame contains Why Us + Contact + Footer) */}
          <div style={{ backgroundColor: '#1F49BF' }}>
            <WhyOfficience />
            <Contact onOpenSurvey={openSurvey} />
            <Footer onOpenTerms={openTerms} />
          </div>
        </main>
      </div>

      {/* Survey Modal */}
      <Survey
        isOpen={isSurveyOpen}
        onClose={closeSurvey}
        onComplete={handleSurveyComplete}
        initialBranch={surveyBranch}
      />

      {/* Terms & Conditions Modal */}
      <TermsConditions 
        isOpen={isTermsOpen} 
        onClose={closeTerms} 
      />
    </div>
  );
}

export default App;
