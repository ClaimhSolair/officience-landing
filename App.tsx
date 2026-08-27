import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuOverlay from './components/MenuOverlay';
import Survey from './components/Survey';
import SplashScreen from './components/SplashScreen';
import CookieConsent from './components/CookieConsent';
import ScrollManager from './components/ScrollManager';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './components/navigation';
import HomePage from './pages/HomePage';
import type { SurveyBranch } from './types';
import { MOTION_FORCED } from './lib/motion';

// Legal copy is long and rarely read — it leaves the home bundle.
const LegalPage = React.lazy(() => import('./pages/LegalPage'));

export interface LayoutContext {
  openSurvey: (branch?: SurveyBranch) => void;
  /** False only while the once-a-day splash is still covering the page. */
  splashDone: boolean;
}

/**
 * The shell every route renders inside: header, footer, and the overlays that
 * must survive navigation (survey, cookie banner, analytics).
 */
const Layout: React.FC = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveyBranch, setSurveyBranch] = useState<SurveyBranch>('work');
  const [, setSurveyData] = useState<Record<string, string> | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // A route change while the menu is open would leave it covering the new page.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // The splash only renders on the home route, so everywhere else there is
  // nothing to wait for.
  useEffect(() => {
    if (pathname !== ROUTES.home) setSplashDone(true);
  }, [pathname]);

  const openSurvey = (branch: SurveyBranch = 'work') => {
    setSurveyBranch(branch);
    setIsSurveyOpen(true);
  };
  const closeSurvey = () => setIsSurveyOpen(false);

  return (
    <div className="bg-background min-h-screen w-full box-border flex flex-col font-sans text-gray-900 selection:bg-yellow-400 selection:text-black">
      <ScrollManager />

      {/* Splash is a home-page welcome, not a site-wide interstitial. */}
      {pathname === ROUTES.home && <SplashScreen onDone={() => setSplashDone(true)} />}

      {/* Stacking context for the whole page; overlays below sit above it. */}
      <div ref={pageRef} className="flex-1 relative isolate flex flex-col min-h-screen">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background" />

        <Header onOpenMenu={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />

        {/* Per-page rhythm lives in the page, not here — see pages/HomePage.tsx. */}
        <main className="relative z-10 flex-grow flex flex-col">
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
              <Outlet context={{ openSurvey, splashDone } satisfies LayoutContext} />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>

      {/* Outside the page wrapper on purpose: the menu marks that wrapper inert
          while it is open, and would disable itself if it lived inside. */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} backgroundRef={pageRef} />

      {/* Same treatment as the menu: rendered outside the page wrapper it makes
          inert, so it cannot disable itself. */}
      <Survey
        isOpen={isSurveyOpen}
        onClose={closeSurvey}
        onComplete={setSurveyData}
        initialBranch={surveyBranch}
        backgroundRef={pageRef}
      />

      {/* Cookie consent banner (Google Consent Mode v2) */}
      <CookieConsent />

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

const App = () => (
  // Every framer-motion animation in the tree collapses for visitors who ask
  // their OS for reduced motion — except when motion is forced on (an explicit
  // ?motion=on, or a preview host); see MOTION_FORCED in lib/motion.
  <MotionConfig reducedMotion={MOTION_FORCED ? 'never' : 'user'}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.terms} element={<LegalPage doc="terms" />} />
        <Route path={ROUTES.privacy} element={<LegalPage doc="privacy" />} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Route>
    </Routes>
  </MotionConfig>
);

export default App;
