import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
import AboutUs from './components/AboutUs';
import SplashScreen from './components/SplashScreen';

function App() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveyData, setSurveyData] = useState<Record<string, string> | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const openSurvey = () => setIsSurveyOpen(true);
  const closeSurvey = () => setIsSurveyOpen(false);
  
  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const openAbout = () => setIsAboutOpen(true);
  const closeAbout = () => setIsAboutOpen(false);
  
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
          onOpenAbout={openAbout}
        />
        
        <main className="relative z-10 flex-grow flex flex-col gap-0">
          <Hero />
          <Capabilities />
          <ClientStories />
          <HowWeEngage onOpenSurvey={openSurvey} />
          
          {/* Blue background wrapper for bottom sections */}
          <div style={{ backgroundColor: '#1F49BF' }}>
            <WhyOfficience />
            <Contact surveyData={surveyData} />
            <Footer onOpenTerms={openTerms} onOpenAbout={openAbout} />
          </div>
        </main>
      </div>

      {/* Survey Modal */}
      <Survey 
        isOpen={isSurveyOpen} 
        onClose={closeSurvey} 
        onComplete={handleSurveyComplete} 
      />

      {/* Terms & Conditions Modal */}
      <TermsConditions
        isOpen={isTermsOpen}
        onClose={closeTerms}
      />

      {/* About Us Modal */}
      <AboutUs
        isOpen={isAboutOpen}
        onClose={closeAbout}
      />

      <Analytics beforeSend={(event) => {
        if (event.url && new URL(event.url, window.location.origin).pathname !== '/') {
          return null;
        }
        return event;
      }} />
      <SpeedInsights />
    </div>
  );
}

export default App;
