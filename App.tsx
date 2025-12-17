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

function App() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveyData, setSurveyData] = useState<Record<string, string> | null>(null);

  const openSurvey = () => setIsSurveyOpen(true);
  const closeSurvey = () => setIsSurveyOpen(false);
  
  const handleSurveyComplete = (data: Record<string, string>) => {
    setSurveyData(data);
  };

  return (
    <div className="bg-primary min-h-screen w-full p-3 md:p-6 box-border flex flex-col font-sans text-gray-900 selection:bg-yellow-400 selection:text-black">
      
      {/* Main Card Container */}
      <div className="flex-1 rounded-3xl md:rounded-[2.5rem] shadow-2xl relative isolate flex flex-col min-h-[calc(100vh-3rem)]">
        
        {/* Background Layer */}
        <div className="absolute inset-0 -z-10 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-background">
           {/* Blob animation removed */}
        </div>

        {/* Content */}
        <Header 
          onOpenSurvey={openSurvey} 
        />
        
        <main className="relative z-10 flex-grow flex flex-col gap-0 pb-8">
          <Hero />
          <Capabilities />
          <ClientStories />
          <HowWeEngage onOpenSurvey={openSurvey} />
          <WhyOfficience />
          <Contact surveyData={surveyData} />
        </main>

        <Footer />
      </div>

      {/* Survey Modal */}
      <Survey 
        isOpen={isSurveyOpen} 
        onClose={closeSurvey} 
        onComplete={handleSurveyComplete} 
      />
    </div>
  );
}

export default App;